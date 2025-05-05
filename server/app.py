from flask import Flask, request, jsonify, Response
from flask_cors import CORS 
import os
import numpy as np
import tensorflow as tf
import joblib
from tensorflow.keras.models import load_model
from utils import bytes_to_image_array, extract_asm_features, extract_asm_file, extract_bytes_file, extract_bytes_asm_files
from scan_service import extract_metadata, get_scan_details,extract_metadata_ams_bytes, get_predicted_behaviour, map_prediction
from user_service import check_user_login, register_user
from model_service import get_threshold_confidence,update_confidence_score
from db import get_db, initialize_db
from db.models import Malware
from werkzeug.utils import secure_filename
import json
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)

# Init DB and create tables
db = get_db(app)
initialize_db(app)

# load models
cnn_model = load_model("models/cnn_model.h5", compile=False)
rf_model = joblib.load("models/rf_model.pkl")


UPLOAD_FOLDER = 'uploads'
TEMP_FOLDER = os.path.join(UPLOAD_FOLDER, 'temp')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)


# load data from env 
load_dotenv()

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    user = check_user_login(email, password)
    if(user['status']):
        access_token = create_access_token(identity=str(user['id']))
        return jsonify({"status":"success","user_id": user['id'], "token": access_token, "role": user['role'], "name":user['name']}), 200
    else:
        return jsonify({"status":"error","message": "Incorrect email or password"}), 401
    
@app.route('/register', methods=['POST'])
def register():
    user = register_user(request)
    if(user['status']):
        return jsonify({"status":"success","message": "user registered in system", "user_id": user['id'], "role": user['role'], "name":user['name']}), 200
    else:
        return jsonify({"status":"error","message": user['error_message']}), 401
    

@app.route('/admin/update-confidence', methods=['POST'])
# @jwt_required()
def update_confidence():
    data = request.get_json()
    if(update_confidence_score(data)):
        return jsonify({"status":"success","message": "threshold confidence updated"}), 200
    else:
        return jsonify({"status":"error","message":  "can not update confidence"}), 400
    

@app.route('/admin/confidence', methods=['GET'])
# @jwt_required()
def get_confidence():
        return jsonify({"status":"success","message": "malware threshold confidence","confidence":get_threshold_confidence()}), 200


@app.route('/predict-pe-test', methods=['POST'])
# @jwt_required()
def predict_pe_test():
    file = request.files.get("file")
    if not file:
        return jsonify({"status":"error","message":  "PE file is required."}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"status":"error","message": "Invalid file name."}), 400
    base_name, _ = os.path.splitext(filename)

    base_dir = os.path.abspath(os.path.dirname(__file__))

    pe_path = os.path.join(base_dir, UPLOAD_FOLDER, filename)
    asm_path = os.path.join(base_dir, TEMP_FOLDER, f"{base_name}.asm")
    bytes_path = os.path.join(base_dir, TEMP_FOLDER, f"{base_name}.bytes")


    try:
        # save uploaded PE file
        file.save(pe_path)

        # extract asm and bytes files
        extract_bytes_file(pe_path, bytes_path)
        extract_asm_file(pe_path, asm_path)

        # feature extraction 
        X_cnn = bytes_to_image_array(bytes_path)
        X_rf = extract_asm_features(asm_path)

        # prediction
        cnn_probs = cnn_model.predict(X_cnn)
        rf_probs = rf_model.predict_proba(X_rf)
        combined_probs = 0.5 * cnn_probs + 0.5 * rf_probs
        predicted_class = int(np.argmax(combined_probs, axis=1)[0]) + 1

        # response
        result = {
            "status":"ok",
            "message":"malware",
            "technical_details":extract_metadata(pe_path),
            "scan_details": get_scan_details(predicted_class),
            "malware_class_id": predicted_class,
        }


    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # clean up temp files
        os.remove(asm_path)
        os.remove(bytes_path)
        print("ok")

    return jsonify(result)

@app.route('/predict', methods=['POST'])
# @jwt_required()
def predict():
    asm_file = request.files.get("asm")
    bytes_file = request.files.get("bytes")

    if not asm_file or not bytes_file:
        return jsonify({"status":"error","message":  "Both ASM and BYTES files are required."}), 400

    asm_filename = secure_filename(asm_file.filename)
    bytes_filename = secure_filename(bytes_file.filename)
    if not asm_filename or not bytes_filename:
        return jsonify({"status":"error","message": "Invalid file name(s)."}), 400

    # bytes file as base name
    base_name, _ = os.path.splitext(bytes_filename)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    asm_path = os.path.join(base_dir, UPLOAD_FOLDER, f"{base_name}")
    bytes_path = os.path.join(base_dir, UPLOAD_FOLDER, f"{base_name}")

    try:
        # save uploaded files
        asm_file.save(asm_path)
        bytes_file.save(bytes_path)

        # feature extraction 
        X_cnn = bytes_to_image_array(bytes_path)
        X_rf = extract_asm_features(asm_path)

        # prediction
        cnn_probs = cnn_model.predict(X_cnn)
        rf_probs = rf_model.predict_proba(X_rf)
        combined_probs = 0.5 * cnn_probs + 0.5 * rf_probs
        predicted_class = int(np.argmax(combined_probs, axis=1)[0]) + 1


        behaviour_actions = get_predicted_behaviour(predicted_class,bytes_path);

        # response
        result = {
            "status":"ok",
            "message":"malware",
            "scan_details": get_scan_details(predicted_class),
            "predicted_behaviour" :  behaviour_actions['behaviours'],
            "recommended_action" : behaviour_actions['actions'],
            "technical_details": extract_metadata_ams_bytes(bytes_path,asm_path)
        }

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temp files
        if os.path.exists(asm_path):
            os.remove(asm_path)
        if os.path.exists(bytes_path):
            os.remove(bytes_path)
        print("ok")

    response_data = json.dumps(result, sort_keys=False)  # preserve insertion order
    return Response(response_data, mimetype='application/json')


@app.route('/predict-pe', methods=['POST'])
# @jwt_required()
def predict_pe():

    file = request.files.get("file")

    print("FILES:", request.files)

    if not file:
        return jsonify({"status":"error","message": "PE file is required."}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"status":"error","message": "Invalid file name."}), 400
    
   
    base_name, _ = os.path.splitext(filename)
    base_dir = os.path.abspath(os.path.dirname(__file__))
    pe_path = os.path.join(base_dir, UPLOAD_FOLDER, filename)
    temp_path = os.path.join(base_dir, TEMP_FOLDER)


    try:
        # save uploaded file
        file.save(pe_path)
        asm_path, bytes_path = extract_bytes_asm_files(pe_path,temp_path)

        if not asm_path:
            return jsonify({"status":"error","message": "File not processed or supported."}), 400

        # feature extraction
        X_cnn = bytes_to_image_array(bytes_path)
        X_rf = extract_asm_features(asm_path)

        # prediction
        cnn_probs = cnn_model.predict(X_cnn)
        rf_probs = rf_model.predict_proba(X_rf)
        combined_probs = 0.5 * cnn_probs + 0.5 * rf_probs
        predicted_class = int(np.argmax(combined_probs, axis=1)[0]) + 1
        confidence_score = np.max(combined_probs) * 100

        is_file_benign, threshold = map_prediction(int(confidence_score), predicted_class)

        print(is_file_benign)
        print(threshold)

        # benign prediction
        if(is_file_benign):
            # response
            result = {
                "status":"ok",
                "message":"benign",
                "confidence": int(confidence_score),
                "threshold_confidence": threshold,
                "technical_details": extract_metadata(pe_path), 
            }

        else:

            behaviour_actions = get_predicted_behaviour(predicted_class,bytes_path);
    
            # response
            result = {
                "status":"ok",
                "message":"malware",
                "confidence": int(confidence_score),
                "threshold_confidence": threshold,
                "scan_details": get_scan_details(predicted_class),
                "predicted_behaviour" :  behaviour_actions['behaviours'],
                "recommended_action" : behaviour_actions['actions'],
                "technical_details": extract_metadata(pe_path)                
            }

    except Exception as e:
        return jsonify({"status":"error", "message": str(e)}), 500
    finally:
        if(asm_path):
            # clean up temp files
            if os.path.exists(asm_path):
                os.remove(asm_path)
            if os.path.exists(bytes_path):
                os.remove(bytes_path)
            print("ok")

    # manual serialization
    response_data = json.dumps(result, sort_keys=False)  # preserve insertion order
    return Response(response_data, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)

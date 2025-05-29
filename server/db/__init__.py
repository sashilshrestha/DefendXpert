import random
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from datetime import datetime
import json
import os
from dotenv import load_dotenv
from db.models import db, MalwareDetails, Malware, MalwareConfidence, User, MalwareFeedback
from db.constants import MALWARE_DETAILS, MALWARE_CLASSES, MALWARE_DESCRIPTIONS, MALWARE_THREAT_LEVELS, MALWARE_CONFIDENCE_SCORE,APPLICATION_USERS,FEEDBACK

# load data from env 
load_dotenv()

def get_db(app=None):
    if app:
        _configure_db(app)
    return db


def _configure_db(app):
    db_name = os.getenv('DB_NAME', 'malware.db')
    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, db_name)

    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

def initialize_db(app):
    with app.app_context():
        inspector = inspect(db.engine)

        if 'malware_details' not in inspector.get_table_names():
            print("Creating 'malware_details' table")
            db.create_all()

            for key, value in MALWARE_DETAILS.items():
                behaviour_json = json.dumps(value['behaviour'])
                action_json = json.dumps(value['recommended_action'])

                entry = MalwareDetails(
                    id=key,
                    behaviour=behaviour_json,
                    action=action_json
                )
                db.session.add(entry)
            db.session.commit()

        if 'malware' not in inspector.get_table_names():
            print("Creating 'malware' table")
            db.create_all()

            for malware_id, malware_class in MALWARE_CLASSES.items():
                existing = Malware.query.filter_by(malware_class=malware_class).first()
                if not existing:
                    description = MALWARE_DESCRIPTIONS.get(malware_id, "")
                    threat_level = MALWARE_THREAT_LEVELS.get(malware_id, "low")
                    confidence = MALWARE_CONFIDENCE_SCORE.get(malware_id, 80)
                    new_malware = Malware(
                        id=malware_id,
                        malware_class=malware_class,
                        description=description,
                        threat_level=threat_level,
                        confidence=confidence
                    )
                    db.session.add(new_malware)
            db.session.commit()

        if 'malware_confidence' not in inspector.get_table_names():
            print("Creating 'malware_confidence' table")
            db.create_all()

            for key, value in MALWARE_CONFIDENCE_SCORE.items():
                
                entry = MalwareConfidence(
                    id=key,
                    confidence=value,
                )
                db.session.add(entry)
            db.session.commit()

        if 'users' not in inspector.get_table_names():
            print("Creating 'users' table")
            db.create_all()

            for key, value in APPLICATION_USERS.items():
                
                entry = User(
                    # id=key,
                    first_name=value['first_name'],
                    last_name=value['last_name'],
                    email=value['email'],
                    password_hash=value['password_hash'],
                    role=value['role']
                )
                db.session.add(entry)
            db.session.commit()
               
        if 'malware_feedback' not in inspector.get_table_names():
            print("Creating 'malware_feedback' table")
            db.create_all()
            # for key, value in FEEDBACK.items():
                
            #     entry = MalwareFeedback(
            #         # id=key,
            #         user_id=value['user_id'],
            #         malware_id=value['malware_id'],
            #         confidence=value['confidence'],
            #         is_prediction_helpful=value['is_prediction_helpful'],
            #         threshold_at_prediction=value['threshold_at_prediction']
            #     )
            #     db.session.add(entry)
            # db.session.commit()


            user_id = 4
            malware_thresholds = {
                                1: [80, 85],
                                2: [81, 70],
                                3: [82, 75],
                                4: [85, 79],
                                5: [70, 77],
                                6: [75, 80],
                                7: [79, 81],
                                8: [77, 82],
                                9: [80, 79]
                            }

            malware_ids = range(1, 10)  # 2, 3, ..., 9
            thresholds_list = [80, 81, 82, 85, 70, 75, 79, 77]  # Include 80 and other thresholds
            FEEDBACK_DATA = generate_feedback_data(user_id, malware_thresholds, entries_per_threshold=20)
            
             # Insert your existing FEEDBACK data (if any)
            for key, value in FEEDBACK.items():  # FEEDBACK is your original data
                entry = MalwareFeedback(
                    user_id=value['user_id'],
                    malware_id=value['malware_id'],
                    confidence=value['confidence'],
                    is_prediction_helpful=value['is_prediction_helpful'],
                    threshold_at_prediction=value['threshold_at_prediction']
                )
                db.session.add(entry)
            # Insert the new generated data for malware_ids 2–9
            for entry in FEEDBACK_DATA:
                feedback = MalwareFeedback(
                    user_id=entry["user_id"],
                    malware_id=entry["malware_id"],
                    confidence=entry["confidence"],
                    is_prediction_helpful=entry["is_prediction_helpful"],
                    threshold_at_prediction=entry["threshold_at_prediction"]
                )
                db.session.add(feedback)
            db.session.commit()
            print("Inserted all feedback data")

        else:
            print("Tables already exist.")


def generate_feedback_data(user_id, malware_thresholds, entries_per_threshold=20):
    feedbacks = []
    for malware_id, thresholds in malware_thresholds.items():
        for threshold in thresholds:
            for _ in range(entries_per_threshold):
                confidence = random.randint(70, 95)
                is_helpful = random.choice([True, False])
                feedbacks.append({
                    "user_id": user_id,
                    "malware_id": malware_id,
                    "confidence": confidence,
                    "is_prediction_helpful": is_helpful,
                    "threshold_at_prediction": threshold
                })
    return feedbacks
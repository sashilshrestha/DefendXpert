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
            for key, value in FEEDBACK.items():
                
                entry = MalwareFeedback(
                    # id=key,
                    user_id=value['user_id'],
                    malware_id=value['malware_id'],
                    confidence=value['confidence'],
                    is_prediction_helpful=value['is_prediction_helpful'],
                    threshold_at_prediction=value['threshold_at_prediction']
                )
                db.session.add(entry)
            db.session.commit()

        else:
            print("Tables already exist.")
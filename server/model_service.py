import numpy as np
import pandas as pd
from PIL import Image
from collections import Counter
import subprocess
import os
from dotenv import load_dotenv
import hashlib
import pefile
from db.models import db, User, Malware,MalwareFeedback, MalwareConfidence
import json
from db import get_db
from werkzeug.security import check_password_hash
from collections import defaultdict

# load data from env 
load_dotenv()


def get_threshold_confidence():
    all_malware = Malware.get_all()

    result = []
    for item in all_malware:
        result.append({
            "id": item.id,
            "malware_class": item.malware_class,
            "description": item.description,
            "threat_level": item.threat_level,
            "confidence": item.confidence
        })
    return result 


def update_confidence_score(score_data):
    for record_id, confidence_value in score_data.items():

        record_id_int = int(record_id)
        record = Malware.query.get(record_id_int)
        
        if record:
            record.confidence = confidence_value
        else:
            return False
    
    # Commit all changes at once
    db.session.commit()
    return True

def user_feedback(user_id, request):
    data = request.get_json()
    malware_id = data.get('malware_id')
    confidence = data.get('confidence')
    threshold_at_prediction = data.get('threshold_at_prediction')
    is_prediction_helpful= data.get('is_prediction_helpful')
    
    feedback_data = MalwareFeedback(
        user_id=user_id,
        malware_id=malware_id,
        confidence=confidence,
        is_prediction_helpful=is_prediction_helpful,
        threshold_at_prediction=threshold_at_prediction,
    )
    
    db.session.add(feedback_data)
    db.session.commit()


def get_saved_feedbacks():
    try:
        feedbacks = MalwareFeedback.get_all()
        
        result = []
        for feedback in feedbacks:
            user_id = feedback.user_id
            user = User.query.filter_by(id=user_id).first()
            malware = Malware.query.filter_by(id=feedback.malware_id).first()

            if not user or not malware:
                print(f"Skipping feedback ID {feedback.id} - user or malware not found.")
                continue

            result.append({
                "id": feedback.id,
                "user_id": user_id,
                "user_full_name": f"{user.first_name} {user.last_name}",
                "malware_class": malware.malware_class,
                "threat_level": malware.threat_level,
                "is_prediction_helpful": feedback.is_prediction_helpful,
                "threshold_at_prediction": feedback.threshold_at_prediction,
                "confidence": feedback.confidence
            })

        return result 
    except Exception as e:
        return []

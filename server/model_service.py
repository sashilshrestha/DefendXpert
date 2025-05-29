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
    
def recommended_threshold():
    output = {}

    for malware_id in range(1, 10):
        result = {}  # moved inside the loop

        thresholds, is_last_threshold_selected = MalwareFeedback.get_last_two_thresholds(malware_id)
        print(f"for malware_id {malware_id} thresholds are {thresholds}, is the latest threshold selected? {is_last_threshold_selected} ")

        if is_last_threshold_selected:
            result["note"] = "Based on latest feedbacks"
        else:
            result["note"] = "Wait for latest recommendation until sufficient user feedbacks for new threshold is obtained"

        # Skip if not enough thresholds
        if len(thresholds) < 2 or thresholds[0] is None or thresholds[1] is None:
            result["message"] = "Not enough valid thresholds to compare."
            result["recommendation"] = "Cannot recommend update."
            output[malware_id] = result
            continue

        first_threshold_score = get_feedback_score(thresholds[0], malware_id)
        second_threshold_score = get_feedback_score(thresholds[1], malware_id)

        if first_threshold_score > second_threshold_score:
            result["message"] = f"Threshold {thresholds[0]}% is doing better than {thresholds[1]}%."
            result["recommendation"] = f"Update threshold away from {thresholds[1]}% and closer to {thresholds[0]}%"
        else:
            result["message"] = f"Threshold {thresholds[1]}% is doing better than {thresholds[0]}%."
            result["recommendation"] = f"Update threshold away from {thresholds[0]}% and closer to {thresholds[1]}%"

        output[malware_id] = result

    return output


def get_feedback_score(threshold_confidence, malware_id):

    # get all rows with threshold_confidence and malware_id from MalwareFeedback
    # get sum of confidence * 1 if is_prediction_helpful and confidence * -1 if not is_prediction_helpful
    # divide the above result by total number of rows
    # return the value

    if threshold_confidence is None:
        return 0  # or handle as you wish

    # Get all rows with this threshold and malware_id
    rows = MalwareFeedback.query.filter_by(
        malware_id=malware_id,
        threshold_at_prediction=threshold_confidence
    ).all()

    if not rows:
        return 0

    score = 0
    for row in rows:
        # confidence * 1 if helpful, else * -1
        score += row.confidence * (1 if row.is_prediction_helpful else -1)

    # Average score
    return score / len(rows)


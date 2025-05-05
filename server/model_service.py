import numpy as np
import pandas as pd
from PIL import Image
from collections import Counter
import subprocess
import os
from dotenv import load_dotenv
import hashlib
import pefile
from db.models import db, User, Malware
import json
from db import get_db
from werkzeug.security import check_password_hash

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

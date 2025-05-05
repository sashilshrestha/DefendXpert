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
from werkzeug.security import check_password_hash, generate_password_hash

# load data from env 
load_dotenv()



def check_user_login(email, password):
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return {
            "status": True,
            "id": user.id,
            "name": user.first_name,
            "role": user.role
        }
    else:
        return {
            "status": False
        }


def register_user(request):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    re_password = data.get('re_password')
    role = "user"
    

    if not all([first_name, last_name, email, password, re_password]):
        return {"status": False, "error_message": "Missing required fields"}

    if User.query.filter_by(email=email).first():
        return {"status": False, "error_message": "Email already registered"}

    if (password!=re_password):
        return {"status": False, "error_message": "Passowrds don't match"}

    new_user = User(first_name=first_name, last_name=last_name, email=email, role=role, 
                    password_hash=generate_password_hash(password))

    db.session.add(new_user)
    db.session.commit()
    return {
        "status": True,
        "id": new_user.id,
        "role": new_user.role,
        "name": f"{new_user.first_name} {new_user.last_name}"
    }


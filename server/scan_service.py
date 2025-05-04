import numpy as np
import pandas as pd
from PIL import Image
from collections import Counter
import subprocess
import os
from dotenv import load_dotenv
import hashlib
import pefile
from db.models import Malware, MalwareDetails
import random
import json

# load data from env 
load_dotenv()

def extract_metadata(pe_path):
    file_name = os.path.basename(pe_path)
    
    # file size in KB
    file_size_bytes = os.path.getsize(pe_path)
    file_size = (file_size_bytes / 1024)
    
    # file extension/type
    file_type = os.path.splitext(pe_path)[1][1:].lower()
    
    # SHA-256 hash
    sha_hash = hashlib.sha256()
    with open(pe_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha_hash.update(chunk)
    sha_hash_hex = sha_hash.hexdigest()
    
    # engine version
    try:
        pe = pefile.PE(pe_path)
        version_info = None
        if hasattr(pe, 'VS_FIXEDFILEINFO'):
            # try to get version from VS_FIXEDFILEINFO
            version_info = pe.VS_FIXEDFILEINFO[0]
            major = version_info.FileVersionMS >> 16
            minor = version_info.FileVersionMS & 0xFFFF
            build = version_info.FileVersionLS >> 16
            patch = version_info.FileVersionLS & 0xFFFF
            engine_version = f"v{major}.{minor}.{build}"
        else:
            engine_version = "Unknown"
    except Exception:
        engine_version = "Unknown"
    
    return {
        "file_name": file_name,
        "file_size": f"{file_size:.2f} KB",
        "file_type": file_type,
        "sha_hash": sha_hash_hex,
        "engine_version": engine_version
    }

# helper function
def file_info(path):
    file_name = os.path.basename(path)
    file_size = os.path.getsize(path) / (1024 * 1024)  # MB
    sha256_hash = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256_hash.update(chunk)
    sha_hash = sha256_hash.hexdigest()
    return file_name, file_size, sha_hash
    

def extract_metadata_ams_bytes(bytes_path, asm_path):

    asm_file_name, asm_file_size, asm_sha_hash = file_info(asm_path)
    bytes_file_name, bytes_file_size, bytes_sha_hash = file_info(bytes_path)

    return {
        "asm_file_name": asm_file_name,
        "asm_file_size": f"{asm_file_size:.2f} MB",
        "asm_sha_hash": asm_sha_hash,

        "bytes_file_name": bytes_file_name,
        "bytes_file_size": f"{bytes_file_size:.2f} MB",
        "bytes_sha_hash": bytes_sha_hash,
    }


def get_scan_details(malware_class_id):
    malware = Malware.query.get(malware_class_id)
    
    return {
        "malware_class_id": malware_class_id,
        "malware_class": malware.malware_class,
        "malware_description": malware.description,
        "threat_level":malware.threat_level
    }

def get_predicted_behaviour(malware_class_id, path):
    file_name = os.path.basename(path)
    malware_details = MalwareDetails.query.get(malware_class_id)
    behaviour = json.loads(malware_details.behaviour)
    actions = json.loads(malware_details.action)
    
    indices = generate_indices(file_name)
    
    filtered_behaviour = [behaviour[i] for i in indices if 0 <= i < len(behaviour)]
    filtered_actions = [actions[i] for i in indices if 0 <= i < len(actions)]
    
    return {
        "behaviours": filtered_behaviour,
        "actions": filtered_actions
    }

    
def generate_indices(input):
    random.seed(input)
    numbers = [random.randint(1, 15) for _ in range(5)]
    return numbers

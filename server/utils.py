import numpy as np
import pandas as pd
from PIL import Image
from collections import Counter
import subprocess
import os
from dotenv import load_dotenv
import hashlib
import pefile
import zipfile

# load data from env 
load_dotenv()

def bytes_to_image_array(bytes_path, size=(64, 64)):
    with open(bytes_path, 'r') as f:
        content = []
        for line in f:
            parts = line.strip().split()[1:]
            content.extend([int(b, 16) if b != '??' else 0 for b in parts])
    array = np.array(content, dtype=np.uint8)
    padded_length = size[0] * size[1]
    if len(array) < padded_length:
        array = np.pad(array, (0, padded_length - len(array)))
    else:
        array = array[:padded_length]
    image = array.reshape(size)
    image = np.expand_dims(image, axis=(0, -1))  # shape (1, 64, 64, 1)
    return image / 255.0

def extract_asm_features(asm_path):
    opcodes = ['mov', 'push', 'call', 'jmp', 'cmp', 'add', 'sub', 'lea', 'xor', 'test']
    sections = ['.text', '.data', '.rdata', '.idata']

    opcode_counts = Counter()
    section_flags = dict.fromkeys(sections, 0)

    with open(asm_path, 'r', errors='ignore') as f:
        for line in f:
            tokens = line.lower().split()
            for token in tokens:
                if token in opcodes:
                    opcode_counts[token] += 1
            for sec in sections:
                if sec in line:
                    section_flags[sec] = 1

    features = [opcode_counts.get(op, 0) for op in opcodes]
    features += [section_flags[sec] for sec in sections]

    column_names = opcodes + [f"section_{sec}" for sec in sections]
    return pd.DataFrame([features], columns=column_names)

def extract_asm_file(pe_path, asm_path):
    objdump_dir = os.getenv('DISASSEMBLER_PATH')
    print(objdump_dir)
    print(pe_path)
    print(asm_path)
    objdump_path = objdump_dir + 'objdump.exe'

    with open(asm_path, 'w') as asm_file:
        subprocess.run([objdump_path, '-d', pe_path], stdout=asm_file, stderr=subprocess.PIPE, check=True)


def extract_bytes_file(pe_path, bytes_path):
    with open(pe_path, 'rb') as f:
        data = f.read()
    with open(bytes_path, 'w') as out:
        for i in range(0, len(data), 16):
            address = format(i, '08X')
            chunk = data[i:i+16]
            hex_bytes = ' '.join(f'{b:02X}' for b in chunk)
            out.write(f"{address} {hex_bytes}\n")


def extract_bytes_asm_files(pe_path, temp_path):
    asm_path = ""
    bytes_path = ""

    try:
        with zipfile.ZipFile(pe_path, 'r') as zip_ref:

            # should be exactly two
            zip_ref.extractall(temp_path)

            # if files are inside folders, move them to temp_path root
            for file in zip_ref.namelist():
                extracted_path = os.path.join(temp_path, file)
                if os.path.dirname(file):  # file inside subfolder
                    dest_path = os.path.join(temp_path, os.path.basename(file))
                    os.rename(extracted_path, dest_path)

                    # remove the now empty directory
                    extracted_dir = os.path.join(temp_path, os.path.dirname(file))
                    try:
                        os.removedirs(extracted_dir)
                    except OSError:
                        pass
                    extracted_path = dest_path

                if extracted_path.endswith('.asm'):
                    asm_path = extracted_path
                elif extracted_path.endswith('.bytes'):
                    bytes_path = extracted_path

    except Exception as e:
        asm_path = ""
        bytes_path = ""

    return asm_path, bytes_path
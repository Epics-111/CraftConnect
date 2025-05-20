import os
import hashlib
import base64
from Crypto.Cipher import AES

ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY");
if ENCRYPTION_KEY:
    ENCRYPTION_KEY = bytes.fromhex(ENCRYPTION_KEY)

def encrypt(text):
    iv = os.urandom(16)
    cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)
    pad_length = 16 - (len(text.encode('utf-8')) % 16)
    padded_text = text + chr(pad_length) * pad_length
    encrypted = cipher.encrypt(padded_text.encode('utf-8'))
    return iv.hex() + ":" + encrypted.hex()

def decrypt(enc_text):
    iv_hex, encrypted_hex = enc_text.split(":")
    iv = bytes.fromhex(iv_hex)
    encrypted = bytes.fromhex(encrypted_hex)
    cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)
    padded_text = cipher.decrypt(encrypted)
    pad_length = padded_text[-1]
    return padded_text[: -pad_length].decode('utf-8')

def hash_email(email):
    return hashlib.sha256(email.encode('utf-8')).hexdigest()
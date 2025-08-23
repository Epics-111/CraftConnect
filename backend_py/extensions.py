from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Extension instances (do NOT bind to app here)
mongo = PyMongo()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)

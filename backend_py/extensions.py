from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

jwt = JWTManager()
mongo = PyMongo()
# limiter = Limiter(key_func=get_remote_address)

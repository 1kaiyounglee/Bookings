from flask import Flask, jsonify
import sys
import os
from flask_jwt_extended import JWTManager

sys.path.append(os.path.dirname(os.path.abspath(__file__)))  # fix pathing issues
from flask_cors import CORS

from api.api_db import api_db
from api.api_auth import auth_bp  # Import auth routes

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'secret_key'  # Change this to a strong secret key
jwt = JWTManager(app)

# Register blueprints for database and authentication
app.register_blueprint(api_db, url_prefix="/api/database")
app.register_blueprint(auth_bp, url_prefix="/api/auth")  # Register auth blueprint

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__))) #fix pathing issues
from flask import Flask
from flask_cors import CORS

from api.api_db import api_db

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Register the database-related routes
app.register_blueprint(api_db, url_prefix="/api/database")

if __name__ == "__main__":
    app.run(debug=True)

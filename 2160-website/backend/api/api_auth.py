from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from helper_modules import db_helper as db  # Assuming db_helper manages DB interactions

auth_bp = Blueprint('auth', __name__)

# Login route to create a JWT token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate the user's credentials (replace with real DB validation)
    query = f"SELECT * FROM Users WHERE email = '{email}' AND password = '{password}'"
    user = db.fetch_data(query)

    if user is not None and not user.empty:
        access_token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Email of Password is Incorrect"}), 401

# Protected route example that requires a valid JWT token
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from helper_modules import db_helper as db  # Assuming db_helper manages DB interactions

auth_bp = Blueprint('auth', __name__)

# Login route to create a JWT token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email').strip().lower()
    password = data.get('password').strip()

    # Use parameterized query to prevent SQL injection
    query = "SELECT * FROM Users WHERE email = :email AND password = :password"
    params = {"email": email, "password": password}

    user = db.fetch_data(query, params)

    if user is not None and not user.empty:
        access_token = create_access_token(identity=email, expires_delta=timedelta(days=30))
        return jsonify(access_token=access_token), 200
    else:
        print(user, email, password)
        return jsonify({"msg": f"Email or Password is Incorrect{user, email, password}"}), 401


# Protected route example that requires a valid JWT token
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

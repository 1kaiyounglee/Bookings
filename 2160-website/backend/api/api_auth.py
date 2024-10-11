from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from helper_modules import db_helper as db  # Assuming db_helper manages DB interactions
import bcrypt  # Import bcrypt for password checking

auth_bp = Blueprint('auth', __name__)

# Login route to create a JWT token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email').strip().lower()
    password = data.get('password').strip()

    # Use parameterized query to prevent SQL injection
    query = "SELECT * FROM Users WHERE email = :email"
    params = {"email": email}
    user = db.fetch_data(query, params)

    if user is not None and not user.empty:
        # Retrieve the hashed password from the user record
        stored_hashed_password = user['password'].iloc[0]  # Assuming DataFrame with a 'password' column
        
        # Check if the provided password matches the hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
            # Generate JWT token upon successful login
            access_token = create_access_token(identity=email, expires_delta=timedelta(days=30))
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "Invalid email or password."}), 401
    else:
        return jsonify({"msg": "Invalid email or password."}), 401


# Protected route example that requires a valid JWT token
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from plaid import Client 
import os
import database  # Import database.py



# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set secret key for JWT authentication
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'fallback_secret')

# Initialize Flask extensions
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

#Plaid blueprint
from plaid_service import plaid_bp
app.register_blueprint(plaid_bp, url_prefix='/api/plaid')

# Authentication Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json

    # Check if user exists
    if database.load().get(data['username']):
        return jsonify({"error": "User already exists"}), 400

    # Ensure required fields exist
    required_fields = ['username', 'password', 'first_name', 'last_name', 'birthday', 'budget']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Validate budget
    try:
        budget = float(data['budget'])
        if budget < 0:
            return jsonify({"error": "Budget must be a positive number"}), 400
    except ValueError:
        return jsonify({"error": "Budget must be a valid number"}), 400

    # Hash password before storing
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Store user in database.yaml
    response = database.init(
        username=data['username'],
        password=hashed_password,
        ln=data['last_name'],
        fn=data['first_name'],
        birthday=data['birthday'],
        budget=budget
    )

    return response  # Returns success or error message from `database.py`

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    users = database.load()  # Load all users

    user = users.get(data['username'])
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=data['username'])
    return jsonify({"access_token": access_token}), 200

# Dashboard Routes
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    username = get_jwt_identity()
    user_data = database.getData(username, "checking")  # Get user's checking data
    if not user_data:
        return jsonify({'error': 'No budget data found'}), 404
    return user_data  # Returns checking account details

@app.route('/api/dashboard/preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    data = request.json
    username = get_jwt_identity()
    
    if database.update(username, "budget", data.get("budget", 0)):
        return jsonify({'message': 'Preferences updated successfully'}), 200
    return jsonify({'error': 'Invalid budget value'}), 400

# Transaction Routes
@app.route('/api/account/add', methods=['POST'])
@jwt_required()
def add_funds():
    data = request.json
    username = get_jwt_identity()

    if "field" not in data or "amount" not in data:
        return jsonify({"error": "Missing field or amount"}), 400

    try:
        amount = float(data["amount"])
        if amount < 0:
            return jsonify({"error": "Amount must be positive"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    if database.add(username, data["field"], amount):
        return jsonify({"message": f"Added {amount} to {data['field']}"}), 200
    return jsonify({"error": "Operation failed"}), 400

@app.route('/api/account/consume', methods=['POST'])
@jwt_required()
def consume_funds():
    data = request.json
    username = get_jwt_identity()

    if "amount" not in data:
        return jsonify({"error": "Missing amount"}), 400

    try:
        amount = float(data["amount"])
        if amount < 0:
            return jsonify({"error": "Amount must be positive"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    if database.consume(username, amount):
        return jsonify({"message": f"Consumed {amount} from savings"}), 200
    return jsonify({"error": "Not enough funds"}), 400

# Run Flask Server
if __name__ == "__main__":
    app.run(debug=True)

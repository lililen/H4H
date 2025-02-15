from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

# initialize flask app
app = Flask(__name__)
CORS(app)  # enable cross-origin requests

# set secret key for jwt authentication
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'fallback_secret')

# initialize flask extensions
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# in-memory user database
class User:
    users = {}

    @classmethod
    def create(cls, username, password, first_name, last_name, birthday, savings_routing, checking_routing, budget=0):
        cls.users[username] = {
            'password': password,  # store hashed password
            'first_name': first_name,
            'last_name': last_name,
            'birthday': birthday,
            'savings_routing': savings_routing,
            'checking_routing': checking_routing,
            'budget': budget
        }

    @classmethod
    def get(cls, username):
        return cls.users.get(username)

    @classmethod
    def get_budget(cls, username):
        return {"budget": cls.users.get(username, {}).get('budget', None)}

    @classmethod
    def update_budget(cls, username, new_budget):
        try:
            budget_value = float(new_budget)
            if username in cls.users:
                cls.users[username]['budget'] = budget_value
                return True
        except ValueError:
            return False
        return False

# authentication routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json

    if User.get(data['username']):
        return jsonify({"error": "user already exists"}), 400

    required_fields = ['username', 'password', 'first_name', 'last_name', 'birthday', 'savings_routing', 'checking_routing', 'budget']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"missing field: {field}"}), 400

    try:
        budget = float(data['budget'])
        if budget < 0:
            return jsonify({"error": "budget must be a positive number"}), 400
    except ValueError:
        return jsonify({"error": "budget must be a valid number"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    User.create(
        username=data['username'],
        password=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name'],
        birthday=data['birthday'],
        savings_routing=data['savings_routing'],
        checking_routing=data['checking_routing'],
        budget=budget
    )
    return jsonify({"message": "user created successfully"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.get(data['username'])

    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"error": "invalid credentials"}), 401

    access_token = create_access_token(identity=data['username'])
    return jsonify({"access_token": access_token}), 200

# dashboard routes
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    username = get_jwt_identity()
    user_data = User.get_budget(username)
    if not user_data:
        return jsonify({'error': 'no budget data found'}), 404
    return jsonify(user_data), 200

@app.route('/api/dashboard/preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    data = request.json
    username = get_jwt_identity()
    
    if User.update_budget(username, data.get("budget", 0)):
        return jsonify({'message': 'preferences updated successfully'}), 200
    return jsonify({'error': 'invalid budget value'}), 400

# run the server
if __name__ == "__main__":
    app.run(debug=True)

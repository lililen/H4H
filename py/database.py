import yaml, os
from threading import Lock
from flask import jsonify

DB = "database.yaml"

dblock = Lock()
TRUE = jsonify({"message": "succeeded"}), 200
FALSE = jsonify({"Error": "unable to operate"}), 400

# Load entire database
def load():
    if os.path.exists(DB):  # Check if file exists
        with open(DB, "r") as file:
            try:
                return yaml.safe_load(file) or {}  # Return data or empty dict
            except yaml.YAMLError:
                return {}
    return {}

# Save data to YAML file
def save(data):
    with dblock:  # Lock to ensure thread safety
        with open(DB, "w") as file:
            yaml.dump(data, file)

# Initialize a new user
def init(username, password, ln, fn, birthday, budget):
    data = load()

    if username in data:
        return jsonify({"Error": "Username already exists"}), 400
#
    data[username] = {
        "password": password,
        "last_name": ln,
        "first_name": fn,
        "birthday": birthday,
        "checking": {
            "total": 0,
            "saving": 0,
            "budget": budget,
            "shopping": 0,
            "entertainment": 0,
            "food": 0
        }
    }

    save(data)
    return TRUE

# Add amount to a field in the user's checking account
def add(username, field, number):
    data = load()
    
    if username in data and field in data[username]["checking"]:
        data[username]["checking"][field] += number
        save(data)
        return TRUE
    return FALSE

# Update (overwrite) a specific field value
def update(username, field, number):
    data = load()
    
    if username in data and field in data[username]["checking"]:
        data[username]["checking"][field] = number
        save(data)
        return TRUE
    return FALSE

# Consume funds from saving
def consume(username, number):
    data = load()

    if username in data:
        if data[username]["checking"]["saving"] <= 0:
            return FALSE
        
        data[username]["checking"]["saving"] -= number
        save(data)
        return TRUE
    return FALSE

# Retrieve a specific user field
def getData(username, data_field):
    data = load()
    
    if username in data and data_field in data[username]:
        return jsonify({data_field: data[username][data_field]}), 200
    return FALSE

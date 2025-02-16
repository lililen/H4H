# plaid_service.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from plaid import Client 
import os
import database 

# Create the bp
plaid_bp = Blueprint("plaid", __name__)

# Ini. Plaid client #####API KEY NEEDED DONT HAVE
plaid_client = Client(
    client_id=os.environ.get('PLAID_CLIENT_ID'),
    secret=os.environ.get('PLAID_SECRET'),
    environment='sandbox'
)

@plaid_bp.route("/create_link_token", methods=["POST"])
@jwt_required()
def create_link_token():
    # Get the user's email (stored in the JWT)
    user_email = get_jwt_identity()
    try:
        response = plaid_client.LinkToken.create({
            "user": {"client_user_id": user_email},
            "client_name": "Your App Name",
            "products": ["transactions"],
            "country_codes": ["US"],
            "language": "en"
        })
        link_token = response.get("link_token")
        print("Created link token:", link_token)
        return jsonify({"link_token": link_token}), 200
    except Exception as e:
        print("Error in create_link_token:", e)
        return jsonify({"error": str(e)}), 400

@plaid_bp.route("/exchange_token", methods=["POST"])
@jwt_required()
def exchange_token():
    data = request.json
    public_token = data.get("public_token")
    if not public_token:
        return jsonify({"error": "Missing public_token"}), 400
    try:
        response = plaid_client.Item.public_token.exchange(public_token)
        access_token = response.get("access_token")
        # Store the access token in the user's record
        user_data = database.load()
        user_email = get_jwt_identity()
        if user_email in user_data:
            user_data[user_email]["plaid_access_token"] = access_token
            database.save(user_data)
        return jsonify({"message": "Token exchanged successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@plaid_bp.route("/webhook", methods=["POST"])
def plaid_webhook():
    data = request.json
    if data.get("webhook_type") == "TRANSACTIONS" and data.get("webhook_code") == "DEFAULT_UPDATE":
        # Process webhook
        print("Received webhook for transactions:", data)
    return jsonify({"message": "Webhook received"}), 200

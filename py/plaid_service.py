from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from plaid import Client 
import os
import database  # Import database.py


#Inti Plaid client 

plaid_Client = Client(
    client_id=os.environ.get('PLAID_CLIENT_ID'),
    secret= os.environ.get('PLAID_SECRET'),
    enviroment='sandbox'
)
@app.route('/api/plaid/create_link_token', methods=['POST'])
@jwt_required()

def creat_link_token():
    username = plaid_jwt_idenity()
    try:
        response = plaid_client.LinkToken.create({
            'user': {'client_user_id': username},
            'client_name': 'Your App Name',
            'products': ['transactions'],
            'country_codes': ['US'],
            'language': 'en'
        })
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@app.route('/api/plaid/exchange_token', methods=['POST'])
@jwt_required()
#
def exchange_token():
        data = request.json
        public_token = data.get('public_token')
        if not public_token:
            return jsonify({'error': 'Missing public_token'}), 400
        try:
           
            response = plaid_client.Item.public_token.exchange(public_token)
            access_token = response['access_token']
            
            # store the access token in the user's record
            user_data = database.load()
            username = get_jwt_identity()
            if username in user_data:
                user_data[username]['plaid_access_token'] = access_token
                database.save(user_data)
            
            return jsonify({'message': 'Token exchanged successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
@app.route('/api/plaid/webhook', methods=['POST'])
def plaid_webhook():
    data= request.json
    if data.get('webhook_type') == 'TRANSACTIONS' and data.get('webhook_code')=='DEFAULT_UPDATE':
        pass
    return jsonify({'message':'Webhook recieved'}), 200

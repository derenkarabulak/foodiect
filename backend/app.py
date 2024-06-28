from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})  # Enable CORS for specific origin

# Load the model and scaler
model = joblib.load('xgboost_model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([[data['Gender'], data['Age'], data['Height'], data['Weight'], data['Duration'], data['Heart_Rate'], data['Body_Temp']]])
    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)
    # Convert the prediction to float
    return jsonify({'calories': float(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)

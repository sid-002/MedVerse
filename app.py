from flask import Flask, request, jsonify, send_file
from transformers import MarianMTModel, MarianTokenizer
from flask_cors import CORS
from gtts import gTTS
import os
import uuid
import base64
import cv2
import numpy as np
import mediapipe as mp
import pickle

app = Flask(__name__)
CORS(app)

# --- Translation model setup ---

model_name = "Helsinki-NLP/opus-mt-en-es"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)


def translate(text):
    inputs = tokenizer([text], return_tensors="pt", truncation=True)
    translated = model.generate(**inputs)
    return tokenizer.decode(translated[0], skip_special_tokens=True)


def text_to_speech(text, lang='es'):
    tts = gTTS(text=text, lang=lang)
    filename = f"audio_{uuid.uuid4()}.mp3"
    static_dir = "static"
    os.makedirs(static_dir, exist_ok=True)
    filepath = os.path.join(static_dir, filename)
    tts.save(filepath)
    return filepath, filename


@app.route('/translate', methods=['POST'])
def translate_api():
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    translated_text = translate(text)
    audio_path, audio_filename = text_to_speech(translated_text, lang='es')

    return jsonify({
        'translated_text': translated_text,
        'audio_url': f'/static/{audio_filename}'
    })


@app.route('/static/<filename>')
def serve_audio(filename):
    static_dir = "static"
    return send_file(os.path.join(static_dir, filename))


# --- Sign Language Interpretation Setup ---

# Load your trained sign language model (adjust path if needed)
MODEL_PATH = './models/model.p'  # Make sure your model is here
try:
    model_dict = pickle.load(open(MODEL_PATH, 'rb'))
    sign_model = model_dict['model']
except Exception as e:
    sign_model = None
    print(f"Error loading sign language model: {e}")

# Map predicted class integers to labels - adjust according to your classes
labels_dict = {
    0: 'Headache',
    1: 'Chest pain',
    2: 'Vomiting',
    # Add all your model's class mappings here
}

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)


def decode_base64_image(base64_str):
    # Remove header if exists
    if ',' in base64_str:
        base64_str = base64_str.split(',')[1]
    img_data = base64.b64decode(base64_str)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img


@app.route('/sign_interpret', methods=['POST'])
def sign_interpret():
    if sign_model is None:
        return jsonify({'error': 'Sign language model not loaded'}), 500

    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        img = decode_base64_image(data['image'])
    except Exception as e:
        return jsonify({'error': f'Failed to decode image: {str(e)}'}), 400

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if not results.multi_hand_landmarks:
        return jsonify({'error': 'No hand detected'}), 200

    # Use first detected hand for prediction
    hand_landmarks = results.multi_hand_landmarks[0]

    x_coords = [lm.x for lm in hand_landmarks.landmark]
    y_coords = [lm.y for lm in hand_landmarks.landmark]

    data_aux = []
    for i in range(len(hand_landmarks.landmark)):
        x = hand_landmarks.landmark[i].x
        y = hand_landmarks.landmark[i].y
        data_aux.append(x - min(x_coords))
        data_aux.append(y - min(y_coords))

    try:
        prediction = sign_model.predict([np.asarray(data_aux)])
        predicted_label = labels_dict.get(int(prediction[0]), "Unknown")
        return jsonify({'predicted_label': predicted_label})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)





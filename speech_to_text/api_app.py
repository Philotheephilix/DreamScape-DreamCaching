from flask import Flask, request, jsonify
from transformers import pipeline
import tempfile
import os
from middleware import jsonValidation
from controller.ollama import query_ollama
from controller.veniceImage import generate_image

app = Flask(__name__)

pipe = pipeline("automatic-speech-recognition", model="fractalego/personal-speech-to-text-model")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    allowed_extensions = {'wav', 'mp3', 'm4a'}
    if '.' not in file.filename or file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({"error": "Invalid file format. Supported formats: WAV, MP3, M4A"}), 400
        
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
            
        result = pipe(tmp_path)
        transcription = result['text']
        os.unlink(tmp_path)
        
        ollama_response = query_ollama(transcription)["response"]
        validated_response = jsonValidation.extract_and_validate_json(ollama_response)
        print("Done")
        validated_response_list=list(validated_response)
        image_locations=[]
        for scene in validated_response_list:
            print(scene["backgroundDescription"])
            image_locations.append(generate_image(scene["backgroundDescription"]))

        if "error" in ollama_response:
            return jsonify({
                "status": "error",
                "message": ollama_response["error"]
            }), 500
        
        return jsonify({
            "status": "success",
            "transcription": transcription,
            "image_locations": image_locations,
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error processing file: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
from flask import Flask, request, jsonify
import requests
from transformers import pipeline
import tempfile
import os
import time
import asyncio
from middleware import jsonValidation
from controller.ollama import query_ollama
from controller.veniceImage import generate_image
from controller.veniceChat import venice_chat
from flask_cors import CORS
from controller.spotify import main as SpotifyPlaylistCreator

app = Flask(__name__)
CORS(app)
pipe = pipeline("automatic-speech-recognition", model="fractalego/personal-speech-to-text-model")
async def generate_image_async(description: str, scene_number: int, story_elements: list) -> str:
    """
    Asynchronous wrapper for generate_image function.
    """
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, generate_image, description, scene_number, story_elements)

async def process_scenes(validated_response_list: list) -> tuple[str, list]:
    """
    Process all scenes asynchronously while maintaining order.
    """
    full_description = ''
    tasks = []
    
    for scene in validated_response_list:
        full_description += scene["backgroundDescription"] + "\n"
        print(scene["backgroundDescription"])
        print("per image done")
        
        task = generate_image_async(
            scene["backgroundDescription"],
            scene["sceneNumber"],
            list(scene["story"])
        )
        tasks.append(task)
    
    image_locations = await asyncio.gather(*tasks)
    print("all image done")
    return full_description, image_locations

@app.route('/create-playlist', methods=['POST'])
def create_playlist():
    data = request.get_json()
    
    if not data or 'mood' not in data :
        return jsonify({"error": "Missing required fields: mood and language"}), 400
    
    mood = data['mood']
    language = 'en'
    playlistLink=SpotifyPlaylistCreator(mood,language)
    print(playlistLink)
    return jsonify({
        "status": "success",
        "mood": mood,
        "language": language,
        'playlistLink':playlistLink
})

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
        print("transcription done")
        print(transcription)
        os.unlink(tmp_path)
        
        ollama_response = query_ollama(transcription)["response"]
        validated_response = jsonValidation.extract_and_validate_json(ollama_response)
        print("Done")
        print("ollama done")

        validated_response_list=list(validated_response)
        image_locations=[]
        full_description=''
        for scene in validated_response_list:
            full_description= full_description+ scene["backgroundDescription"]+" \n"
            print(scene["backgroundDescription"])
            print("per image done")

            image_locations.append(generate_image(scene["backgroundDescription"],scene["sceneNumber"],scene["story"]))
        print("all image done")
        
        cover_location=generate_image(full_description,381,"")
        print("cover image done")

        coverData=venice_chat("Give a json with title,short_description of story, continuing this story line :"+full_description,"Return only a single JSON with objects containing the keys 'title', 'short_description'. Do not output any additional text or explanations, only the JSON.")
        coverData=jsonValidation.extract_and_validate_json_version2(coverData)
        print(coverData)
        print("cover data done")

        metadata={
            'ipfsArray':image_locations,
            'coverImage':cover_location,
            'timeStamp':str(time.time()),
            'coverData':coverData,
            'fullDescription':full_description
        }
        url = 'http://localhost:5000/upload-json'

        # Send the metadata as JSON in the request body
        response = requests.post(url, json={'metadata': metadata})
        print(metadata)
        if "error" in ollama_response:
            return jsonify({
                "status": "error",
                "message": ollama_response["error"]
            }), 500
        
        return jsonify({
            "status": "success",
            "hash":response.json()
        })
        
    except Exception as e:
        print(e)
        return jsonify({
            "status": "error",
            "message": f"Error processing file: {str(e)}"
        }), 500
@app.route('/analysis', methods=['POST'])
def dreamDataAnalysis():
    if not request.is_json:
        return jsonify({"error": "Invalid input, expected JSON"}), 400
        
    data = request.get_json()
    if isinstance(data, dict):
        data = str(data)
    elif isinstance(data, str):
        pass
    else:
        return jsonify({"error": "Invalid data format"}), 400
    print(data)
    analysis_result = venice_chat("Give a json with DREAM PATTERNS, EMOTIONAL STATE, SLEEP QUALITY, MOOD ANALYSIS, Weekly Summary,MOOD by words not less than 10 words. Also analyse the dreams he had this week and analyse based on it and the dreams he had and the MOOD value should be simple like happy, sad, angry"+data,"Return only a JSON array with objects containing the keys 'DREAM_PATTERNS', 'EMOTIONAL_STATE', 'SLEEP_QUALITY','MOOD_ANALYSIS','MOOD' and 'Weekly_Summary'. Do not output any additional text or explanations, only the JSON array.")
    print(analysis_result)
    analysis_result = jsonValidation.extract_and_validate_json_version2(analysis_result)
    if isinstance(analysis_result, list) and len(analysis_result) > 0:
        analysis_result = analysis_result[0]
    return jsonify({"status": "success", "data": analysis_result}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
import re
import json

def extract_and_validate_json(response):
    """
    Middleware function to extract JSON from a response string, remove newlines,
    and validate the JSON.
    
    Args:
        response (str): The raw response string containing JSON and other text.
    
    Returns:
        dict or list: The extracted and validated JSON object or array.
        None: If no valid JSON is found or if the JSON is invalid.
    """
    try:
        # Use regex to extract JSON from the response
        json_pattern = r"```json\s*([\s\S]*?)\s*```"
        match = re.search(json_pattern, response)
        if not match:
            # If no ```json``` block is found, try to find standalone JSON
            json_pattern = r"\[.*\]|\{.*\}"
            match = re.search(json_pattern, response, re.DOTALL)
            if not match:
                return None
        
        # Extract the JSON string
        json_str = match.group(1) if match.group(1) else match.group(0)
        
        # Remove newlines and extra spaces
        json_str = json_str.replace("\n", "").strip()
        
        # Parse and validate the JSON
        json_data = json.loads(json_str)
        return json_data
    except json.JSONDecodeError:
        # Handle invalid JSON
        return None
    except Exception as e:
        # Handle other exceptions
        print(f"Error: {e}")
        return None


def extract_and_validate_json_version2(response):
    try:
        print("Raw response:", response)  # Debugging Step 1

        # Ensure response is a string
        if not isinstance(response, str):
            print("Error: Response is not a string")
            return None

        # Regex pattern to extract JSON content (list or object)
        json_pattern = r"(\{.*?\}|\[.*?\])"
        match = re.search(json_pattern, response, re.DOTALL)

        if not match:
            print("No JSON match found")
            return None
        
        json_str = match.group(0).strip()
        print("Extracted JSON string:", json_str)  # Debugging Step 2

        # Parse and validate JSON
        json_data = json.loads(json_str)
        print("Parsed JSON:", json_data)  # Debugging Step 3

        return json_data

    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


# Example test



# Example usage
# response = """
# <think>
# Some random text here.
# </think>

# ```json
# [
#   {
#     "sceneNumber": 1,
#     "backgroundDescription": "The bustling city of Austin, Texas, was alive with the energy of its vibrant culture.",
#     "story": "Nigar had heard tales of America from her uncle's travels, but nothing prepared her for the sheer diversity and warmth she encountered."
#   },
#   {
#     "sceneNumber": 2,
#     "backgroundDescription": "The two friends met at a cozy café near the Texas State Capitol.",
#     "story": "Nigar, always curious, asked BSKY about his life in Austin."
#   }
# ]
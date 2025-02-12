import streamlit as st
from transformers import pipeline
import soundfile as sf
import tempfile

# Load the ASR model from Hugging Face
@st.cache_resource
def load_model():
    # Use Hugging Face's pipeline with your desired model
    return pipeline("automatic-speech-recognition", model="fractalego/personal-speech-to-text-model")

# Initialize the model pipeline
pipe = load_model()

# Streamlit UI
st.title("Speech-to-Text Transcription App")
st.write("Upload an audio file, and the AI model will transcribe it.")

# Upload audio file
uploaded_file = st.file_uploader("Choose an audio file", type=["wav", "mp3", "m4a"])

if uploaded_file is not None:
    st.audio(uploaded_file, format='audio/wav')
    
    # Save uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(uploaded_file.read())
        temp_file_path = temp_file.name
    
    # Read the audio file and transcribe
    with st.spinner("Transcribing... Please wait..."):
        transcription = pipe(temp_file_path)
    
    # Display the transcription result
    st.subheader("Transcription")
    st.write(transcription['text'])

else:
    st.info("Please upload an audio file to start transcription.")

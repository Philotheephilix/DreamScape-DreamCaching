import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,
                                               client_secret=CLIENT_SECRET,
                                               redirect_uri=REDIRECT_URI,
                                               scope='playlist-modify-public'))

def search_tracks(mood, language):
    query = f'mood:{mood} language:{language}'
    results = sp.search(q=query, type='track', limit=50)
    tracks = results['tracks']['items']
    track_uris = [track['uri'] for track in tracks]
    return track_uris

def create_playlist(mood, language, track_uris):
    user_id = sp.me()['id']
    playlist_name = f'{mood.capitalize()} {language.upper()} Songs'
    playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True)
    sp.playlist_add_items(playlist_id=playlist['id'], items=track_uris)
    return playlist['external_urls']['spotify']

def main(MOOD,LANGUAGE):
    track_uris = search_tracks(MOOD, LANGUAGE)
    if track_uris:
        playlist_link = create_playlist(MOOD, LANGUAGE, track_uris)
        return playlist_link
    else:
        return "ERROR CANNOT CREATE PLAYLIST"
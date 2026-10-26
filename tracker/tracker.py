
import time
import threading

import win32gui
import win32process
import psutil

from flask import Flask, jsonify
from flask_cors import CORS


# =========================
# FLASK
# =========================

app = Flask(__name__)

CORS(app)


# =========================
# CURRENT STATUS
# =========================

current_status = {
    "app": "Waiting...",
    "title": "",
    "artist": "",
    "spotify": False
}


# =========================
# GET ACTIVE APPLICATION
# =========================

def get_active_application():

    hwnd = win32gui.GetForegroundWindow()

    if not hwnd:
        return "Unknown"

    try:

        _, pid = win32process.GetWindowThreadProcessId(hwnd)

        process = psutil.Process(pid)

        return process.name()

    except Exception:

        return "Unknown"


# =========================
# GET SPOTIFY WINDOW
# =========================

def get_spotify_window():

    result = {
        "title": "",
        "artist": ""
    }

    def enum_windows(hwnd, _):

        try:

            if not win32gui.IsWindowVisible(hwnd):
                return

            window_title = win32gui.GetWindowText(hwnd)

            if not window_title:
                return

            _, pid = win32process.GetWindowThreadProcessId(hwnd)

            process = psutil.Process(pid)

            process_name = process.name().lower()

            if "spotify" not in process_name:
                return

            result["title"] = window_title

        except Exception:

            pass

    win32gui.EnumWindows(enum_windows, None)

    return result


# =========================
# UPDATE STATUS
# =========================

def update_status():

    global current_status

    # =========================
    # GET ACTIVE APPLICATION
    # =========================

    active_app = get_active_application()

    # =========================
    # RESET STATUS
    # =========================

    current_status = {
        "app": active_app,
        "title": "",
        "artist": "",
        "spotify": False
    }

    # =========================
    # GET SPOTIFY WINDOW
    # =========================

    spotify_window = get_spotify_window()

    spotify_title = spotify_window["title"].strip()

    # =========================
    # SPOTIFY MUSIC
    # =========================

    if spotify_title:

        current_status["spotify"] = True

        # =========================
        # SPLIT ARTIST - TITLE
        # =========================

        if " - " in spotify_title:

            artist, title = spotify_title.split(
                " - ",
                1
            )

            current_status["artist"] = artist.strip()

            current_status["title"] = title.strip()

        else:

            current_status["title"] = spotify_title

    # =========================
    # SPOTIFY ACTIVE
    # =========================

    if "spotify" in active_app.lower():

        current_status["app"] = "Spotify"

        current_status["spotify"] = True


# =========================
# BACKGROUND TRACKER
# =========================

def tracker_loop():

    while True:

        update_status()

        print(
            f"App: {current_status['app']}"
            f" | Title: {current_status['title']}"
            f" | Artist: {current_status['artist']}"
        )

        time.sleep(5)


# =========================
# API
# =========================

@app.route("/api/status")
def status():

    return jsonify(current_status)


# =========================
# START SERVER
# =========================

def start_server():

    app.run(
        host="0.0.0.0",
        port=3001,
        debug=False,
        use_reloader=False
    )


# =========================
# MAIN
# =========================

if __name__ == "__main__":

    server_thread = threading.Thread(
        target=start_server,
        daemon=True
    )

    server_thread.start()

    tracker_loop()

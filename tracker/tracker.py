
import os
import time
import threading
import requests

import win32gui
import win32process
import psutil

from flask import Flask, jsonify
from flask_cors import CORS

from dotenv import load_dotenv


# =========================
# LOAD ENVIRONMENT
# =========================

load_dotenv()

TRACKER_SECRET = os.getenv(
    "TRACKER_SECRET"
)

PUBLIC_API = (
    "https://chikaru2512.vercel.app/api/status"
)


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
# APPLICATION NAMES
# =========================

APP_NAMES = {

    # Browsers
    "chrome.exe": "Google Chrome",
    "msedge.exe": "Microsoft Edge",
    "firefox.exe": "Firefox",
    "opera.exe": "Opera",
    "brave.exe": "Brave",

    # Communication
    "discord.exe": "Discord",
    "teams.exe": "Microsoft Teams",
    "slack.exe": "Slack",

    # Music
    "spotify.exe": "Spotify",

    # Development
    "code.exe": "Visual Studio Code",
    "devenv.exe": "Visual Studio",
    "idea64.exe": "IntelliJ IDEA",
    "pycharm64.exe": "PyCharm",
    "netbeansG4.exe": "Net Beans",

    # Minecraft
    "minecraft.exe": "Minecraft",
    "javaw.exe": "Minecraft",
    "java.exe": "Minecraft",

    # Games
    "genshinimpact.exe": "Genshin Impact",
    "genshinimpact_launcher.exe": "Genshin Impact",

    "eldenring.exe": "Elden Ring",
    "eldenring.exe": "Elden Ring",

    "valorant.exe": "VALORANT",
    "leagueclient.exe": "League of Legends",
    "league of legends.exe": "League of Legends",

    "cs2.exe": "Counter-Strike 2",
    "csgo.exe": "Counter-Strike 2",

    "steam.exe": "Steam",

    # Windows
    "explorer.exe": "Windows Explorer",
    "notepad.exe": "Notepad",
    "cmd.exe": "Command Prompt",
    "powershell.exe": "PowerShell",
    "windowsterminal.exe": "Windows Terminal"
}


# =========================
# GET APPLICATION NAME
# =========================

def get_application_name(process_name):

    if not process_name:
        return "Unknown"

    process_name = process_name.lower()

    return APP_NAMES.get(
        process_name,
        process_name
    )


# =========================
# GET ACTIVE APPLICATION
# =========================

def get_active_application():

    hwnd = win32gui.GetForegroundWindow()

    if not hwnd:
        return "Unknown"

    try:

        _, pid = win32process.GetWindowThreadProcessId(
            hwnd
        )

        process = psutil.Process(pid)

        process_name = process.name()

        return get_application_name(
            process_name
        )

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

            window_title = (
                win32gui.GetWindowText(hwnd)
            )

            if not window_title:
                return

            _, pid = (
                win32process.GetWindowThreadProcessId(
                    hwnd
                )
            )

            process = psutil.Process(pid)

            process_name = (
                process.name().lower()
            )

            if "spotify" not in process_name:
                return

            result["title"] = window_title

        except Exception:

            pass

    win32gui.EnumWindows(
        enum_windows,
        None
    )

    return result


# =========================
# UPDATE STATUS
# =========================

def update_status():

    global current_status

    # =========================
    # GET ACTIVE APPLICATION
    # =========================

    active_app = (
        get_active_application()
    )

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

    spotify_window = (
        get_spotify_window()
    )

    spotify_title = (
        spotify_window["title"].strip()
    )

    # =========================
    # SPOTIFY MUSIC
    # =========================

    if spotify_title:

        current_status["spotify"] = True

        # =========================
        # SPLIT ARTIST - TITLE
        # =========================

        if " - " in spotify_title:

            artist, title = (
                spotify_title.split(
                    " - ",
                    1
                )
            )

            current_status["artist"] = (
                artist.strip()
            )

            current_status["title"] = (
                title.strip()
            )

        else:

            current_status["title"] = (
                spotify_title
            )

    # =========================
    # SPOTIFY ACTIVE
    # =========================

    if "spotify" in active_app.lower():

        current_status["app"] = "Spotify"

        current_status["spotify"] = True


# =========================
# SEND STATUS TO VERCEL
# =========================

def send_status():

    if not TRACKER_SECRET:

        print(
            "ERROR: TRACKER_SECRET is missing."
        )

        return

    try:

        response = requests.post(
            PUBLIC_API,
            json=current_status,
            headers={
                "X-Tracker-Token":
                    TRACKER_SECRET
            },
            timeout=5
        )

        if response.ok:

            print(
                "Activity sent successfully."
            )

        else:

            print(
                "Vercel API error:",
                response.status_code,
                response.text
            )

    except Exception as error:

        print(
            "Cannot send activity:",
            error
        )


# =========================
# BACKGROUND TRACKER
# =========================

def tracker_loop():

    while True:

        update_status()

        send_status()

        print(
            f"App: {current_status['app']}"
            f" | Title: {current_status['title']}"
            f" | Artist: {current_status['artist']}"
        )

        time.sleep(5)


# =========================
# LOCAL API
# =========================

@app.route("/api/status")
def status():

    return jsonify(
        current_status
    )


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

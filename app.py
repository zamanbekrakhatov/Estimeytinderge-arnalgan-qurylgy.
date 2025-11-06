#!/usr/bin/env python3
"""
Дыбыс Көмекшісі - Flask веб-сервер
Голосовой Помощник - Flask web server

Бұл қарапайым Flask сервері HTML файлын қызмет көрсетеді.
This is a simple Flask server that serves the HTML file.

Орнату (Installation):
    pip install flask

Іске қосу (Run):
    python app.py

Браузерде ашыңыз (Open in browser):
    http://localhost:5000
"""

from flask import Flask, send_file, jsonify
import os

app = Flask(__name__)

# HTML файлының жолы (Path to HTML file)
HTML_FILE = 'index.html'

@app.route('/')
def index():
    """
    Негізгі бет - HTML файлын қайтарады
    Main page - returns the HTML file
    """
    if os.path.exists(HTML_FILE):
        return send_file(HTML_FILE)
    else:
        return jsonify({
            'error': 'index.html файлы табылмады / file not found',
            'message': 'index.html файлын осы скриптпен бір қалтада орналастырыңыз / Place index.html in the same folder as this script'
        }), 404

@app.route('/health')
def health():
    """
    Денсаулық тексеруі - сервер жұмыс істеп тұрғанын тексереді
    Health check - verifies that the server is running
    """
    return jsonify({
        'status': 'ok',
        'message': 'Сервер жұмыс істеп тұр / Server is running'
    })

@app.errorhandler(404)
def not_found(error):
    """
    404 қателер үшін өңдеуші
    Handler for 404 errors
    """
    return jsonify({
        'error': 'Бет табылмады / Page not found',
        'code': 404
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """
    500 қателер үшін өңдеуші
    Handler for 500 errors
    """
    return jsonify({
        'error': 'Сервер қатесі / Internal server error',
        'code': 500
    }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🎤 Дыбыс Көмекшісі / Голосовой Помощник")
    print("=" * 60)
    print("\nСервер іске қосылуда... / Starting server...")
    print("Браузерде ашыңыз / Open in browser: http://localhost:5000")
    print("Тоқтату үшін Ctrl+C басыңыз / Press Ctrl+C to stop\n")
    print("=" * 60)
    
    # Flask серверін іске қосу (Start Flask server)
    # debug=True - жаңартулар автоматты түрде қолданылады
    # debug=True - changes are automatically applied
    app.run(
        host='0.0.0.0',  # Барлық желілік интерфейстерде тыңдау / Listen on all network interfaces
        port=5000,        # Порт нөмірі / Port number
        debug=True        # Өңдеу режимі / Debug mode
    )

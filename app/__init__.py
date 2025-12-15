# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS


def create_app():
    """
    Application factory for the Flask backend.
    """
    app = Flask(__name__)

    # Allow frontend to access API routes
    # Defaults to '*' for local development
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
    CORS(app, resources={r"/api/*": {"origins": frontend_origin}})

    # Register API routes
    from .routes import api_bp
    app.register_blueprint(api_bp)

    return app

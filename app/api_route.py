# app/routes.py
from flask import Blueprint, jsonify

from .jira_client import JiraClient
from .config import JiraConfig

api_bp = Blueprint("api", __name__)

# Load config once (cleaner + more efficient)
config = JiraConfig.from_env()

# Jira client (can run against demo data or real Jira depending on env)
jira = JiraClient(
    base_url=config.base_url,
    email=config.email,
    api_token=config.api_token,
    default_project_key=config.default_project_key or "DEMO",
)


@api_bp.get("/summary")
def get_summary():
    """
    Returns high-level metrics for the engineering dashboard.
    """
    summary = jira.get_dashboard_summary()
    return jsonify(summary.as_dict())

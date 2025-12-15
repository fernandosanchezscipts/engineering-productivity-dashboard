# app/routes.py
from flask import Blueprint, jsonify

from .config import JiraConfig
from .jira_client import JiraClient

# All API routes live under /api/*
api_bp = Blueprint("api", __name__, url_prefix="/api")

# ----------------------------
# Demo issues (safe for GitHub)
# ----------------------------
MOCK_ISSUES = [
    {
        "key": "DEMO-1",
        "summary": "Implement login flow",
        "status": "In Progress",
        "assignee": "Fernando Sanchez",
        "cycle_time_days": 4,
    },
    {
        "key": "DEMO-2",
        "summary": "Create engineering productivity dashboard",
        "status": "In Progress",
        "assignee": "Fernando Sanchez",
        "cycle_time_days": 6,
    },
    {
        "key": "DEMO-3",
        "summary": "Add unit tests for API layer",
        "status": "Code Review",
        "assignee": "Marisol Sanchez",
        "cycle_time_days": 3,
    },
    {
        "key": "DEMO-4",
        "summary": "Refactor legacy reporting job",
        "status": "To Do",
        "assignee": "Jose Gomez",
        "cycle_time_days": 0,
    },
    {
        "key": "DEMO-5",
        "summary": "Improve deployment pipeline",
        "status": "In Progress",
        "assignee": "Jim Morales",
        "cycle_time_days": 5,
    },
    {
        "key": "DEMO-6",
        "summary": "Fix flaky integration tests",
        "status": "Code Review",
        "assignee": "Fernando Sanchez",
        "cycle_time_days": 2,
    },
    {
        "key": "DEMO-7",
        "summary": "Optimize database queries for reporting",
        "status": "To Do",
        "assignee": "Marisol Sanchez",
        "cycle_time_days": 0,
    },
]

# ----------------------------
# Jira client (demo-ready)
# ----------------------------
_cfg = JiraConfig.from_env()

jira = JiraClient(
    base_url=_cfg.base_url,
    email=_cfg.email,
    api_token=_cfg.api_token,
    default_project_key=_cfg.default_project_key or "DEMO",
)


@api_bp.get("/summary")
def get_summary():
    """
    Returns aggregated dashboard metrics.
    GET /api/summary
    """
    dashboard_summary = jira.get_dashboard_summary()
    return jsonify(dashboard_summary.as_dict())


@api_bp.get("/issues")
def get_issues():
    """
    Returns a list of active issues (demo data).
    GET /api/issues
    """
    return jsonify(MOCK_ISSUES)

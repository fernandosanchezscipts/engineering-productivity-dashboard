# app/config.py
import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class JiraConfig:
    """
    Configuration for connecting to Jira.

    Defaults are intentionally safe so the app can run
    in demo mode without real credentials.
    """
    base_url: str
    email: str
    api_token: str
    default_project_key: Optional[str] = None

    @classmethod
    def from_env(cls) -> "JiraConfig":
        return cls(
            base_url=os.getenv("JIRA_BASE_URL", "https://example.atlassian.net"),
            email=os.getenv("JIRA_EMAIL", "demo@example.com"),
            api_token=os.getenv("JIRA_API_TOKEN", "fake-token"),
            default_project_key=os.getenv("JIRA_PROJECT_KEY", "DEMO"),
        )
    
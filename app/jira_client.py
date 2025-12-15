# app/jira_client.py
"""
Lightweight Jira client used by the Engineering Productivity Dashboard.

This implementation intentionally uses demo data so the application
can run without real Jira credentials. The class is structured so
real Jira REST API calls can be added later with minimal changes.
"""

from typing import Dict, List
from .models import DashboardSummary


class JiraClient:
    """
    Minimal Jira abstraction exposing only the data
    required by the dashboard.
    """

    def __init__(
        self,
        base_url: str,
        email: str,
        api_token: str,
        default_project_key: str,
    ) -> None:
        self.base_url = base_url
        self.email = email
        self.api_token = api_token
        self.default_project_key = default_project_key

    def get_dashboard_summary(self) -> DashboardSummary:
        """
        Build and return a DashboardSummary from demo issue data.
        """

        # --- Demo issue dataset ---
        issues: List[dict] = [
            {"key": "DEMO-1", "status": "In Progress", "cycle_time_days": 4},
            {"key": "DEMO-2", "status": "In Progress", "cycle_time_days": 6},
            {"key": "DEMO-3", "status": "Code Review", "cycle_time_days": 3},
            {"key": "DEMO-4", "status": "To Do", "cycle_time_days": 0},
            {"key": "DEMO-5", "status": "In Progress", "cycle_time_days": 5},
            {"key": "DEMO-6", "status": "Code Review", "cycle_time_days": 2},
            {"key": "DEMO-7", "status": "To Do", "cycle_time_days": 0},
        ]

        # --- Status counts ---
        status_counts: Dict[str, int] = {}
        for issue in issues:
            status = issue["status"]
            status_counts[status] = status_counts.get(status, 0) + 1

        # --- Aggregate metrics ---
        total_issues = len(issues)

        cycle_times = [issue["cycle_time_days"] for issue in issues]
        avg_cycle_time = round(sum(cycle_times) / len(cycle_times), 2)

        # Demo throughput: number of issues marked Done in last 7 days
        throughput_last_7_days = status_counts.get("Done", 0)

        return DashboardSummary(
            project=self.default_project_key or "DEMO",
            total_issues=total_issues,
            status_counts=status_counts,
            throughput_last_7_days=throughput_last_7_days,
            avg_cycle_time_days=avg_cycle_time,
        )
    
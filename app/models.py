# app/models.py
"""
Data models used by the dashboard API.
"""

from dataclasses import dataclass
from typing import Dict, List, Any


@dataclass
class DashboardSummary:
    """
    Aggregated metrics displayed on the engineering dashboard.
    """
    project: str
    total_issues: int
    status_counts: Dict[str, int]
    throughput_last_7_days: int
    avg_cycle_time_days: float

    def as_metric_cards(self) -> List[Dict[str, Any]]:
        """
        Return a UI-friendly list of metric cards.
        """
        return [
            {
                "title": "Total issues",
                "value": self.total_issues,
                "hint": f"Project: {self.project}",
            },
            {
                "title": "Throughput (last 7 days)",
                "value": self.throughput_last_7_days,
                "hint": "Issues moved to Done",
            },
            {
                "title": "Avg cycle time",
                "value": f"{self.avg_cycle_time_days:.1f} days",
                "hint": "From start to Done",
            },
        ]

    def as_dict(self) -> Dict[str, Any]:
        """
        Raw dictionary used for JSON API responses.
        """
        return {
            "project": self.project,
            "total_issues": self.total_issues,
            "status_counts": self.status_counts,
            "throughput_last_7_days": self.throughput_last_7_days,
            "avg_cycle_time_days": self.avg_cycle_time_days,
        }
    
# engineering-productivity-dashboard
Full-stack engineering productivity dashboard built with React and Flask, simulating internal delivery metrics and Jira style workflows.
=======
# 📈 Engineering Productivity Dashboard: A Full-Stack Showcase

This project is a high-fidelity simulation of an internal tool used to track delivery health and workflow status for an engineering team. It provides a real-world snapshot, like the one showing a **2.9 day Average Cycle Time** and **7 Total Issues**.

I built this dashboard to demonstrate proficiency in:
* **Full-Stack Development:** Seamless integration between a dedicated API and a modern UI.
* **Data-to-Insight:** Translating raw workflow data into key metrics (like THROUGHPUT and AVG CYCLE TIME).
* **Production-Ready Design:** Implementing a clean, maintainable architecture without relying on external keys.

---

## 🛠️ The Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React** | For building a component-based, high-performance UI. |
| | **Tailwind CSS** | To quickly build the dark-mode, clean aesthetic shown in the screenshot. |
| | **Chart.js** | Used for creating the dynamic **Issue Status Breakdown** chart. |
| **Backend** | **Python (Flask)** | A reliable, simple choice for standing up the data API. |
| | **Flask-CORS** | Essential for secure communication between the local client and API. |

---

## ✨ Features & What You See

* **Key Delivery Metrics:** Live reporting on **Total Issues (7)**, **Throughput**, and **Average Cycle Time (2.9 days)**.
* **Visual Workflow Analysis:** The donut chart breaks down the status into **Code Review (2)**, **In Progress (3)**, and **To Do (2)**.
* **Interactive Issues Table:** A sortable and filterable table that lists tickets, including their **Key**, **Status**, **Assignee**, and **Cycle Time**.

---

## 🔒 Built for Stability: Demo Mode (Default)

The dashboard is designed to run locally and securely using internal, mocked data payloads.

* **Now:** It runs safely using its internal "DEMO" project data (as seen in the top right corner of the dashboard).
* **Later (Easy Integration):** The API is structured to allow for a simple swap-out of the mock data source for real REST API calls (e.g., Jira, ClickUp, or GitHub Issues) when actual keys are available.
* **Security:** No API keys or secrets are required to run this project.

---

## ⚙️ Run Locally

### 1. Backend Setup (Python/Flask)

1.  **Initialize Virtual Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
2.  **Install Dependencies:**
    ```bash
    pip install flask flask-cors
    ```
3.  **Start the API:**
    ```bash
    python3 run.py
    ```
    *The API will be available at: `http://127.0.0.1:5000`*

### 2. Frontend Setup (React)

1.  **Navigate to Directory:**
    ```bash
    cd frontend
    ```
2.  **Install Node Dependencies:**
    ```bash
    npm install
    ```
3.  **Launch the Dashboard:**
    ```bash
    npm start
    ```
    *The UI opens in your browser, typically at: `http://localhost:3000`*

---

## 👤 Author

* Fernando Sanchez
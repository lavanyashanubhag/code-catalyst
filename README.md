# CODE CATALYST 🚀

**AI-Assisted Code Review Tool**

CODE CATALYST is a code review project designed to analyze Python code, identify potential bugs and risks, and suggest improvements to help developers write cleaner and more reliable code.

## ✨ Features

- **Automated Code Analysis:** Analyzes submitted Python code for potential issues.
- **Bug Detection:** Identifies problems such as division by zero.
- **Severity Classification:** Displays findings with severity levels.
- **Code Improvement Suggestions:** Provides explanations and recommendations for detected issues.
- **Interactive Frontend:** A React-based interface for submitting code and viewing review results.
- **Backend API:** A FastAPI backend processes code review requests and returns findings.
- **Database Integration:** Supports saving review results and findings when the database is configured correctly.

## 🛠️ Technologies Used

- React
- Vite
- Python
- FastAPI
- JavaScript
- HTML and CSS

## ▶️ Running the Project

### 1. Start the Backend

Open a terminal in the `backend` directory, activate your Python virtual environment, install the required dependencies, and run:

```bash
python -m uvicorn main:app --reload --port 8000
```

The backend API documentation is available at:

`http://127.0.0.1:8000/docs`

### 2. Start the Frontend

Open another terminal in the `frontend` directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🎯 Project Goal

The goal of CODE CATALYST is to make code review more accessible by helping developers identify potential issues, understand why they matter, and discover ways to improve their code.

## 👩‍💻 Developed For

A hackathon project focused on practical AI-assisted software development and code quality.# code-catalyst

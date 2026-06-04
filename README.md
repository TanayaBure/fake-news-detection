# SentinelAI: Explainable Fake News Detection System

SentinelAI is a high-fidelity, explainable artificial intelligence (XAI) dashboard designed to detect, analyze, and justify the credibility of news articles. 

It provides model classifications using multiple machine learning algorithms (Logistic Regression, Naive Bayes, Random Forest, SVM) alongside token-level explanations powered by **LIME (Local Interpretable Model-agnostic Explanations)**.

---

## 🌟 Key Features

### 1. Multi-Model Prediction Verdicts
- Computes predictions across **Logistic Regression**, **Multinomial Naive Bayes**, **Random Forest**, and **Linear Support Vector Machines (SVM)**.
- Compiles individual confidence percentages and comparative model metrics.

### 2. XAI Token Highlights (LIME)
- Visualizes token importance weights on the input text in real-time.
- **Red highlights** identify words pushing the model towards a **FAKE** classification.
- **Green highlights** identify words validating a **REAL** classification.
- Hovering over a token displays a detailed tool tip with LIME scores.

### 3. What-If Counterfactual Sandbox
- **Test alternative word choices:** Click any highlighted keyword in the UI to open the What-If Sandbox.
- Replace keywords with synonyms (suggested dynamically based on context) and rerun analysis instantly to see how the model's confidence rating shifts.

### 4. URL Scraping & Automatic Analysis
- Input news article links directly using the **URL Import** tab.
- Fetches article body text using standard web parsers and populates the workspace automatically.

### 5. Source & Domain Trust Checker
- Runs checks on parsed URL domains against known high-trust and low-trust datasets.
- Computes a **Clickbait Index** (heuristic analysis of title capitalization, punctuation, and catchphrases) and a **Sensationalism Index** (measuring emotive word density).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 + Vanilla CSS custom variables (Glassmorphism design language)
- **Icons:** Lucide React
- **Effects:** Canvas Confetti

### Backend
- **Framework:** FastAPI (Python 3.x)
- **ASGI Server:** Uvicorn
- **ML & NLP Libraries:** Scikit-Learn, LIME, NLTK, Pandas, NumPy

---

## 🚀 Getting Started

### 1. Prerequisites & Installation
Ensure you have Python 3.8+ and Node.js installed.

Clone the repository and install Python dependencies:
```bash
pip install -r requirements.txt
```

### 2. Start the Backend API
Run the FastAPI server from the root directory:
```bash
python server.py
```
*Note: On its first launch, the server will process `train.csv` and auto-train models which are saved locally as `multi_fake_news_models.pkl` to speed up future startups.*

### 3. Start the React Frontend
In a new terminal window, install npm packages and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📊 Streamlit Alternative (Standalone Dashboard)
If you prefer a single-process Python app, you can launch the Streamlit dashboard:
```bash
streamlit run app.py
```
Open **`http://localhost:8501`** in your browser.

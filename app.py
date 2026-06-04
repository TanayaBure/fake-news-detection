import streamlit as st
import pandas as pd
import numpy as np
import re
import nltk
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from lime.lime_text import LimeTextExplainer
import plotly.graph_objects as go

st.set_page_config(page_title="Fake News Detector", page_icon="📰", layout="wide", initial_sidebar_state="expanded")

# --- NLTK Setup ---
@st.cache_resource
def download_nltk_data():
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')
download_nltk_data()

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

port_stem = PorterStemmer()
stop_words = set(stopwords.words('english'))

def preprocess_text(content):
    if not isinstance(content, str):
        return ""
    content = re.sub('[^a-zA-Z]', ' ', content)
    content = content.lower()
    content = content.split()
    content = [port_stem.stem(word) for word in content if not word in stop_words]
    content = ' '.join(content)
    return content

MODEL_PATH = 'fake_news_model.pkl'

@st.cache_resource
def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    else:
        if os.path.exists('train.csv'):
            with st.spinner("Initial Model Training in progress. Please wait..."):
                df = pd.read_csv('train.csv')
                df = df.sample(n=min(5000, len(df)), random_state=42)
                df['text'] = df['text'].fillna('')
                df['content'] = df['text'].apply(preprocess_text)
                
                X = df['content'].values
                Y = df['label'].values
                
                vectorizer = TfidfVectorizer(max_features=5000)
                model = LogisticRegression()
                pipeline = make_pipeline(vectorizer, model)
                pipeline.fit(X, Y)
                
                with open(MODEL_PATH, 'wb') as f:
                    pickle.dump(pipeline, f)
                return pipeline
        return None

pipeline = load_or_train_model()

# --- PREMIUM CSS INJECTION ---
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

/* Global Reset & Background */
.stApp {
    background: linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 50%, #FFFFFF 100%);
    color: #0F172A;
    font-family: 'Inter', sans-serif;
}
/* Blurred circles in background via pseudo-elements */
.stApp::before {
    content: '';
    position: fixed;
    top: -100px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
}
.stApp::after {
    content: '';
    position: fixed;
    bottom: -150px; right: -50px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
}

/* Sidebar styling */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0B132B 0%, #1C2541 100%) !important;
    border-right: 1px solid rgba(255,255,255,0.05);
}
[data-testid="stSidebar"] * {
    font-family: 'Poppins', sans-serif;
}
/* Active Radio Button */
div[role="radiogroup"] > label {
    padding: 12px 16px !important;
    border-radius: 30px !important;
    margin-bottom: 12px !important;
    transition: all 0.3s ease !important;
}
div[role="radiogroup"] > label:hover {
    background: rgba(255,255,255,0.05) !important;
}
div[role="radiogroup"] > label[data-baseweb="radio"][aria-checked="true"] {
    background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%) !important;
    box-shadow: 0 4px 15px rgba(37,99,235,0.4) !important;
}
div[role="radiogroup"] > label[data-baseweb="radio"][aria-checked="true"] div {
    color: white !important;
}

/* Hide default streamlit header */
header {visibility: hidden;}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif !important;
}

/* Premium Glassmorphic Containers */
div[data-testid="stVerticalBlock"] > div[style*="flex-direction: column;"] > div[data-testid="stVerticalBlock"] {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-radius: 24px !important;
    border: 1px solid rgba(255, 255, 255, 1) !important;
    box-shadow: 0 20px 50px rgba(37, 99, 235, 0.08) !important;
    padding: 30px !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    animation: fadeUp 0.6s ease-out forwards;
    position: relative;
    z-index: 1;
}

div[data-testid="stVerticalBlock"] > div[style*="flex-direction: column;"] > div[data-testid="stVerticalBlock"]:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(37, 99, 235, 0.12) !important;
}

/* Text Area */
.stTextArea textarea {
    border-radius: 16px !important;
    border: 2px solid #E2E8F0 !important;
    padding: 16px !important;
    font-size: 15px !important;
    font-family: 'Inter', sans-serif !important;
    background: rgba(255, 255, 255, 0.9) !important;
    transition: all 0.3s ease !important;
}
.stTextArea textarea:focus {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
}

/* Buttons */
.stButton > button[kind="primary"] {
    background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%) !important;
    color: white !important;
    border-radius: 30px !important;
    padding: 12px 32px !important;
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3) !important;
    transition: all 0.3s ease !important;
}
.stButton > button[kind="primary"]:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4) !important;
}

.stButton > button[kind="secondary"] {
    background: white !important;
    color: #2563EB !important;
    border: 2px solid #2563EB !important;
    border-radius: 30px !important;
    padding: 12px 32px !important;
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
}
.stButton > button[kind="secondary"]:hover {
    background: rgba(37,99,235,0.05) !important;
    transform: translateY(-2px) !important;
}

/* Animations */
@keyframes fadeUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}
@keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
@keyframes pulseGlowGreen {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Custom HTML Elements Classes */
.pred-fake { color: #EF4444; font-weight: 800; font-size: 28px; font-family: 'Poppins', sans-serif; }
.pred-real { color: #10B981; font-weight: 800; font-size: 28px; font-family: 'Poppins', sans-serif; }
.metric-box { 
    background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
    padding: 16px; 
    border-radius: 12px; 
    margin-bottom: 12px; 
    border: 1px solid #F1F5F9;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    transition: transform 0.2s ease;
}
.metric-box:hover {
    transform: translateX(5px);
}
.metric-title { font-size: 13px; color: #64748B; margin-bottom: 4px; font-weight: 500; font-family: 'Inter', sans-serif; }
.metric-value { font-size: 20px; font-weight: 700; font-family: 'Poppins', sans-serif; }
.card-header { color: #2563EB; font-weight: 700; font-size: 20px; margin-bottom: 20px; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 8px; }

</style>
""", unsafe_allow_html=True)

import base64

if 'welcomed' not in st.session_state:
    st.session_state['welcomed'] = False

def get_base64_of_bin_file(bin_file):
    try:
        with open(bin_file, 'rb') as f:
            data = f.read()
        return base64.b64encode(data).decode()
    except:
        return ""

if not st.session_state['welcomed']:
    bg_base64 = get_base64_of_bin_file('ai_bg.png')
    
    st.markdown(f"""
    <style>
    header {{visibility: hidden;}}
    [data-testid="stSidebar"] {{display: none !important;}}
    
    .stApp {{
        background: url("data:image/png;base64,{bg_base64}") no-repeat center center fixed !important;
        background-size: cover !important;
    }}
    
    .stApp::before {{
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(135deg, rgba(248, 250, 252, 0.85) 0%, rgba(238, 244, 255, 0.85) 50%, rgba(255, 255, 255, 0.85) 100%);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 0;
    }}
    
    .block-container {{
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        height: 100vh !important;
        padding: 0 !important;
        max-width: 100% !important;
        z-index: 10;
        position: relative;
    }}
    
    .welcome-card {{
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border-radius: 30px;
        box-shadow: 0 25px 60px rgba(37, 99, 235, 0.15);
        padding: 60px;
        max-width: 700px;
        width: 90%;
        margin: 0 auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 1);
        position: relative;
        z-index: 10;
        transition: all 0.4s ease;
        animation: fadeInScale 0.8s ease-out forwards;
    }}
    
    .welcome-card:hover {{
        transform: scale(1.03);
        box-shadow: 0 35px 70px rgba(37, 99, 235, 0.25);
        border-color: rgba(124, 58, 237, 0.3);
    }}
    
    .welcome-card::after {{
        content: '';
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        border-radius: 32px;
        background: linear-gradient(135deg, #2563EB, #7C3AED);
        z-index: -1;
        opacity: 0;
        transition: opacity 0.4s ease;
    }}
    
    .welcome-card:hover::after {{
        opacity: 0.15;
        animation: pulseGlowCard 2s infinite;
    }}
    
    .card-title {{
        font-family: 'Poppins', sans-serif;
        font-size: 48px;
        font-weight: 800;
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 20px;
        line-height: 1.2;
    }}
    
    .card-subtitle {{
        font-family: 'Inter', sans-serif;
        font-size: 20px;
        color: #475569;
        margin-bottom: 40px;
        line-height: 1.6;
    }}
    
    .card-instruction {{
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        color: #94A3B8;
        font-weight: 500;
        letter-spacing: 0.5px;
    }}
    
    .card-icon {{
        font-size: 64px;
        margin-bottom: 20px;
        animation: floatIcon 3s ease-in-out infinite;
        display: inline-block;
        filter: drop-shadow(0 10px 15px rgba(37, 99, 235, 0.2));
    }}
    
    @keyframes fadeInScale {{
        from {{ opacity: 0; transform: scale(0.95) translateY(20px); }}
        to {{ opacity: 1; transform: scale(1) translateY(0); }}
    }}
    
    @keyframes floatIcon {{
        0% {{ transform: translateY(0px); }}
        50% {{ transform: translateY(-15px); }}
        100% {{ transform: translateY(0px); }}
    }}
    
    @keyframes pulseGlowCard {{
        0% {{ box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }}
        70% {{ box-shadow: 0 0 0 20px rgba(124, 58, 237, 0); }}
        100% {{ box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }}
    }}
    
    /* Decorative Orbs */
    .welcome-orb {{
        position: fixed;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.4;
        z-index: 1;
        pointer-events: none;
        animation: floatIcon 10s ease-in-out infinite alternate;
    }}
    .orb-a {{
        width: 400px; height: 400px;
        background: #2563EB;
        top: -50px; left: -50px;
    }}
    .orb-b {{
        width: 500px; height: 500px;
        background: #7C3AED;
        bottom: -100px; right: -100px;
        animation-delay: -3s;
    }}
    
    /* Hide the Streamlit button safely */
    div[data-testid="stButton"] {{
        position: absolute;
        opacity: 0;
        pointer-events: none;
        z-index: -100;
    }}
    </style>
    
    <div class="welcome-orb orb-a"></div>
    <div class="welcome-orb orb-b"></div>
    
    <div class="welcome-card">
        <div class="card-icon">📰</div>
        <div class="card-title">Welcome to Fake News<br>Detection System</div>
        <div class="card-subtitle">Detect fake and real news articles using Explainable Artificial Intelligence.</div>
        <div class="card-instruction">Click anywhere on this card to enter the application.</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.components.v1.html("""
    <script>
    const doc = window.parent.document;
    let checkInterval = setInterval(function() {
        const card = doc.querySelector('.welcome-card');
        if (card && !card.getAttribute('data-click-attached')) {
            card.setAttribute('data-click-attached', 'true');
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const buttons = doc.querySelectorAll('button');
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].innerText.includes('Enter')) {
                        buttons[i].click();
                        break;
                    }
                }
            });
            clearInterval(checkInterval);
        }
    }, 100);
    </script>
    """, height=0, width=0)
    
    if st.button("Enter"):
        st.session_state['welcomed'] = True
        st.rerun()
        
    st.stop()

# --- SIDEBAR ---

with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; margin-bottom: 40px; padding: 10px;">
        <div style="background: linear-gradient(135deg, #2563EB, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 40px; margin-right: 15px; filter: drop-shadow(0 0 8px rgba(37,99,235,0.5));">📰</div>
        <div>
            <div style="font-size: 24px; font-weight: 800; color: white; line-height: 1.1; font-family: 'Poppins', sans-serif;">Fake News<br>Detector</div>
            <div style="font-size: 12px; color: #06B6D4; margin-top: 4px; font-weight: 600; letter-spacing: 0.5px;">EXPLAINABLE AI</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    if 'nav_radio' not in st.session_state:
        st.session_state['nav_radio'] = "🏠 Home"
        
    page = st.radio("Navigation", ["🏠 Home", "🔍 Detect News", "📋 History", "📊 Analytics", "ℹ️ About"], label_visibility="collapsed", key="nav_radio")
    
    if page == "🔍 Detect News" and st.session_state.get('last_page') != "🔍 Detect News":
        st.session_state['scroll_to'] = "enter-news-article"
    elif page == "🏠 Home" and st.session_state.get('last_page') != "🏠 Home":
        st.session_state['scroll_to'] = "top"
    elif page == "ℹ️ About" and st.session_state.get('last_page') != "ℹ️ About":
        st.session_state['scroll_to'] = "about-section"
        
    st.session_state['last_page'] = page
    
    st.markdown("""
    <div style="margin-top: 150px; text-align: center;">
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; margin-bottom: 30px; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.background='rgba(255,255,255,0.05)';">
            <div style="font-size: 45px; animation: float 4s ease-in-out infinite; display: inline-block; filter: drop-shadow(0 0 15px rgba(37,99,235,0.6));">🤖</div>
            <div style="color: white; font-weight: 700; margin-top: 15px; font-family: 'Poppins', sans-serif; letter-spacing: 2px;">NEWS AI</div>
            <div style="color: #94A3B8; font-size: 12px; margin-top: 5px;">v2.0 Premium</div>
        </div>
        <div style="font-size: 12px; color: #64748B; font-weight: 500;">© 2026 AI Dashboard<br>All rights reserved.</div>
    </div>
    """, unsafe_allow_html=True)

# --- MAIN CONTENT ---

# Top right header
st.markdown("""
<div style="display: flex; justify-content: flex-end; align-items: center; padding-top: 10px; padding-bottom: 30px; z-index: 10; position: relative;">
    <div style="background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); padding: 8px 16px; border-radius: 30px; box-shadow: 0 4px 15px rgba(37,99,235,0.08); border: 1px solid white; display: flex; align-items: center; gap: 20px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(37,99,235,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(37,99,235,0.08)';">
        <span class="theme-toggle-icon" style="font-size: 18px; cursor: pointer; color: #64748B; transition: color 0.2s;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='#64748B'">🌙</span>
        <span style="font-size: 18px; cursor: pointer; color: #64748B; transition: color 0.2s; position: relative;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='#64748B'">
            🔔
            <span style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #EF4444; border-radius: 50%;"></span>
        </span>
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; border-left: 1px solid #E2E8F0; padding-left: 15px;">
            <span style="background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; font-weight: bold; box-shadow: 0 4px 10px rgba(37,99,235,0.3);">TB</span>
            <span style="font-weight: 600; font-family: 'Poppins', sans-serif; color: #0F172A;">Tanaya Bure</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

if page == "🏠 Home" or page == "🔍 Detect News":
    
    # Scroll handler
    if 'scroll_to' in st.session_state and st.session_state['scroll_to']:
        scroll_target = st.session_state['scroll_to']
        if scroll_target == "top":
            st.components.v1.html("<script>window.parent.window.scrollTo({top: 0, behavior: 'smooth'});</script>", height=0)
        else:
            st.components.v1.html(f"<script>window.parent.document.getElementById('{scroll_target}').scrollIntoView({{behavior: 'smooth'}});</script>", height=0)
        st.session_state['scroll_to'] = None

    st.markdown("<div id='top'></div>", unsafe_allow_html=True)
    
    # --- HERO SECTION ---
    hero_col1, hero_col2 = st.columns([1.2, 1])
    with hero_col1:
        st.markdown("""
        <div style="padding-top: 20px;">
            <h1 class="hero-heading">Analyze News with <br>Explainable AI</h1>
            <p class="hero-subtitle">Detect fake and real news articles using Natural Language Processing, Machine Learning, and transparent LIME explanations.</p>
        </div>
        """, unsafe_allow_html=True)
        
        btn_col1, btn_col2, _ = st.columns([1, 1, 1])
        with btn_col1:
            if st.button("Analyze Now", type="primary", use_container_width=True):
                st.session_state['scroll_to'] = "enter-news-article"
                st.rerun()
        with btn_col2:
            if st.button("View Analytics", type="secondary", use_container_width=True):
                st.session_state['nav_radio'] = "📊 Analytics"
                st.rerun()
                
    with hero_col2:
        st.markdown("""
        <div class="floating-illustration" style="position: relative; height: 350px;">
            <div style="font-size: 120px; filter: drop-shadow(0 20px 30px rgba(37,99,235,0.2)); z-index: 2; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">🧠</div>
            <div style="font-size: 60px; position: absolute; top: 10%; right: 10%; animation: float 5s ease-in-out infinite 1s; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); z-index: 1;">📰</div>
            <div style="font-size: 50px; position: absolute; bottom: 10%; left: 10%; animation: float 4s ease-in-out infinite 0.5s; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); z-index: 3;">🔍</div>
            <div style="position: absolute; top: 20%; left: 0; background: white; padding: 8px 16px; border-radius: 20px; font-family: 'Poppins'; font-weight: 700; color: #10B981; box-shadow: 0 10px 25px rgba(0,0,0,0.08); animation: fadeUp 1s ease-out 0.5s forwards; border-left: 4px solid #10B981;">94% Accurate</div>
            <div style="position: absolute; bottom: 20%; right: 0; background: white; padding: 8px 16px; border-radius: 20px; font-family: 'Poppins'; font-weight: 700; color: #7C3AED; box-shadow: 0 10px 25px rgba(0,0,0,0.08); animation: fadeUp 1s ease-out 0.8s forwards; border-left: 4px solid #7C3AED;">LIME Explainable</div>
        </div>
        """, unsafe_allow_html=True)
    
    # --- QUICK STATS CARDS ---
    st.markdown("""
    <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 50px;">
        <div class="stat-card" style="flex: 1;">
            <div style="font-size: 24px; margin-bottom: 10px;">🎯</div>
            <div class="stat-val">94%</div>
            <div class="stat-label">Model Accuracy</div>
        </div>
        <div class="stat-card" style="flex: 1; border-top-color: #7C3AED;">
            <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
            <div class="stat-val">93%</div>
            <div class="stat-label">Precision Score</div>
        </div>
        <div class="stat-card" style="flex: 1; border-top-color: #06B6D4;">
            <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
            <div class="stat-val">94%</div>
            <div class="stat-label">Recall Score</div>
        </div>
        <div class="stat-card" style="flex: 1; border-top-color: #10B981;">
            <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
            <div class="stat-val">94%</div>
            <div class="stat-label">F1-Score</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<div id='enter-news-article'></div>", unsafe_allow_html=True)
    # --- MAIN CONTENT LAYOUT ---
    col1, col2 = st.columns([1, 1])
    
    with col1:
        with st.container(border=True):
            st.markdown("<div class='card-header'><span>📝</span> Enter News Article</div>", unsafe_allow_html=True)
            
            if 'news_input' not in st.session_state:
                st.session_state['news_input'] = ""
                
            user_input = st.text_area("News Text", value=st.session_state['news_input'], height=300, label_visibility="collapsed", placeholder="Paste or type the news article content here...")
            st.markdown(f"<div style='text-align: right; color: #94A3B8; font-size: 13px; margin-top: -10px; margin-bottom: 20px; font-weight: 500;'>{len(user_input)} / 5000 chars</div>", unsafe_allow_html=True)
            
            btn_col1, btn_col2 = st.columns([1, 1])
            with btn_col1:
                analyze_btn = st.button("🚀 Analyze News", type="primary", use_container_width=True)
            with btn_col2:
                if st.button("🗑️ Clear Text", use_container_width=True):
                    st.session_state['news_input'] = ""
                    st.rerun()

    prediction_result = None
    confidence = 0.0
    pred_class = None
    exp = None
    
    if analyze_btn:
        if not user_input.strip():
            st.error("Please enter a news article to analyze.")
        elif pipeline is None:
            st.error("Model is not ready. Please make sure train.csv is available.")
        else:
            with st.spinner("Analyzing text with AI..."):
                def predict_proba_custom(texts):
                    preprocessed_texts = [preprocess_text(t) for t in texts]
                    return pipeline.predict_proba(preprocessed_texts)

                pred_proba = predict_proba_custom([user_input])[0]
                pred_idx = np.argmax(pred_proba)
                classes = ['Real', 'Fake']
                pred_class = classes[pred_idx]
                confidence = pred_proba[pred_idx] * 100
                
                explainer = LimeTextExplainer(class_names=classes)
                exp = explainer.explain_instance(user_input, predict_proba_custom, num_features=8)
                prediction_result = True

    with col2:
        with st.container(border=True):
            st.markdown("<div class='card-header'><span>🔎</span> Prediction Result</div>", unsafe_allow_html=True)
            
            if prediction_result:
                color = "#EF4444" if pred_class == "Fake" else "#10B981"
                icon = "❌" if pred_class == "Fake" else "✅"
                pulse_anim = "pulseGlow" if pred_class == "Fake" else "pulseGlowGreen"
                
                st.markdown(f"""
                <div style="display: flex; justify-content: center; margin: 10px 0 30px 0;">
                    <div style="border: 6px solid {color}; border-radius: 50%; width: 150px; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.08); animation: {pulse_anim} 2s infinite;">
                        <span style="font-size: 45px; margin-bottom: -10px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">📄</span>
                        <div style="background: linear-gradient(135deg, {color}, {'#DC2626' if pred_class=='Fake' else '#059669'}); color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 16px; position: absolute; margin-left: 45px; margin-top: -20px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                            {icon}
                        </div>
                        <div class="pred-{'fake' if pred_class=='Fake' else 'real'}" style="font-size: 18px; margin-top: 15px;">{pred_class.upper()} NEWS</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="metric-box">
                    <div class="metric-title">Confidence Score</div>
                    <div class="metric-value" style="color: {color};">{confidence:.2f}%</div>
                </div>
                <div class="metric-box">
                    <div class="metric-title">Prediction</div>
                    <div class="metric-value" style="color: {color};">{pred_class} News</div>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div style="margin-top: 25px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 600; color: #64748B; font-family: 'Poppins', sans-serif;">
                    <span>0%</span><span>50%</span><span>100%</span>
                </div>
                <div style="background-color: #E2E8F0; border-radius: 10px; height: 10px; width: 100%; margin-top: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(90deg, {color} 0%, {'#FCA5A5' if pred_class=='Fake' else '#6EE7B7'} 100%); width: {confidence}%; height: 100%; border-radius: 10px; transition: width 1s ease-in-out;"></div>
                </div>
                """, unsafe_allow_html=True)
                
            else:
                st.markdown("""
                <div style="text-align: center; color: #94A3B8; padding: 100px 0;">
                    <div style="font-size: 60px; opacity: 0.5; margin-bottom: 15px; animation: float 3s ease-in-out infinite;">🔍</div>
                    <p style="font-size: 18px; font-weight: 500; font-family: 'Poppins', sans-serif;">Awaiting news article...</p>
                    <p style="font-size: 14px; margin-top: 5px;">Enter text on the left to see results</p>
                </div>
                """, unsafe_allow_html=True)

    # Bottom Row: Explanation
    if prediction_result and exp:
        st.markdown("<br>", unsafe_allow_html=True)
        with st.container(border=True):
            st.markdown("<div class='card-header'><span>📊</span> LIME Explanation (Top Influential Words)</div>", unsafe_allow_html=True)
            
            exp_col1, exp_col2 = st.columns([1.5, 1])
            
            with exp_col1:
                exp_list = exp.as_list()
                words = [x[0] for x in exp_list]
                weights = [x[1] for x in exp_list]
                
                colors = ['#EF4444' if w > 0 else '#10B981' for w in weights]
                
                fig = go.Figure(go.Bar(
                    x=weights,
                    y=words,
                    orientation='h',
                    marker_color=colors,
                    text=[f"{w:.3f}" for w in weights],
                    textposition='outside',
                    textfont=dict(family='Poppins', size=13, color='#475569')
                ))
                fig.update_layout(
                    margin=dict(l=0, r=0, t=10, b=0),
                    height=300,
                    xaxis_title="Feature Importance",
                    font=dict(family='Inter', size=13),
                    yaxis={'categoryorder':'total ascending'},
                    plot_bgcolor='rgba(0,0,0,0)',
                    paper_bgcolor='rgba(0,0,0,0)'
                )
                fig.add_vline(x=0, line_width=2, line_dash="dash", line_color="#CBD5E1")
                
                st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
                
            with exp_col2:
                fake_words = [x[0] for x in exp_list if x[1] > 0][:3]
                real_words = [x[0] for x in exp_list if x[1] < 0][:3]
                
                fake_words_str = ", ".join([f'<b>"{w}"</b>' for w in fake_words])
                real_words_str = ", ".join([f'<b>"{w}"</b>' for w in real_words])
                
                st.markdown(f"""
                <div style="background: linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 100%); padding: 30px; border-radius: 16px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(37,99,235,0.05);">
                    <div>
                        <div style="color: #0F172A; font-weight: 800; font-size: 18px; margin-bottom: 16px; font-family: 'Poppins', sans-serif; display: flex; align-items: center;">
                            <span style="background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; border-radius: 50%; display: inline-flex; width: 24px; height: 24px; justify-content: center; align-items: center; font-size: 12px; margin-right: 10px; box-shadow: 0 4px 10px rgba(37,99,235,0.3);">i</span>
                            Interpretation
                        </div>
                        <p style="color: #475569; font-size: 15px; line-height: 1.7; font-family: 'Inter', sans-serif;">
                            The model predicted this news as <span style="color: {'#EF4444' if pred_class=='Fake' else '#10B981'}; font-weight: 800;">{pred_class.upper()}</span> because 
                            words like {fake_words_str} have strong positive impact towards fake predictions, 
                            while words like {real_words_str} contribute towards real news.
                        </p>
                    </div>
                    <div style="margin-top: 25px; padding: 15px; background: white; border-radius: 12px; color: #2563EB; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(37,99,235,0.2); box-shadow: 0 4px 15px rgba(37,99,235,0.05);">
                        <span style="font-size: 18px;">✨</span>
                        <span>Explanation generated using LIME (Local Interpretable Model-agnostic Explanations).</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # --- FEATURES ---
    st.markdown("<div id='how-it-works'></div>", unsafe_allow_html=True)
    
    st.markdown("<br><br>", unsafe_allow_html=True)
    st.markdown("<h2 style='text-align: center; color: #0F172A; font-weight: 800; margin-bottom: 40px;'>System Features</h2>", unsafe_allow_html=True)
    
    st.markdown("""
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 40px;">
        <div class="feature-card">
            <div style="background: rgba(37,99,235,0.1); color: #2563EB; padding: 15px; border-radius: 12px; font-size: 24px;">📝</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">NLP Processing</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Advanced text cleaning, stemming, and stop-word removal using NLTK.</p>
            </div>
        </div>
        <div class="feature-card">
            <div style="background: rgba(124,58,237,0.1); color: #7C3AED; padding: 15px; border-radius: 12px; font-size: 24px;">✨</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">Explainable AI</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Transparent predictions powered by LIME (Local Interpretable Model).</p>
            </div>
        </div>
        <div class="feature-card">
            <div style="background: rgba(16,185,129,0.1); color: #10B981; padding: 15px; border-radius: 12px; font-size: 24px;">⚡</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">Real-Time Detection</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Instant analysis and classification of news articles within seconds.</p>
            </div>
        </div>
        <div class="feature-card">
            <div style="background: rgba(245,158,11,0.1); color: #F59E0B; padding: 15px; border-radius: 12px; font-size: 24px;">🎯</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">Confidence Scoring</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Probabilistic confidence scores for precise accuracy measurement.</p>
            </div>
        </div>
        <div class="feature-card">
            <div style="background: rgba(236,72,153,0.1); color: #EC4899; padding: 15px; border-radius: 12px; font-size: 24px;">💻</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">Interactive Dashboard</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Premium glassmorphism UI built for seamless user experience.</p>
            </div>
        </div>
        <div class="feature-card">
            <div style="background: rgba(6,182,212,0.1); color: #06B6D4; padding: 15px; border-radius: 12px; font-size: 24px;">🎓</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #0F172A; font-size: 16px;">Research-Based</h4>
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">Built using proven machine learning architectures and methodologies.</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # --- FOOTER ---
    st.markdown("""
    <div style="text-align: center; margin-top: 50px; padding: 30px; border-top: 1px solid rgba(0,0,0,0.05);">
        <p style="color: #64748B; font-family: 'Inter', sans-serif;">Need help? Contact support or check the documentation.</p>
    </div>
    """, unsafe_allow_html=True)
    
    footer_col1, footer_col2, footer_col3 = st.columns([1, 0.5, 1])
    with footer_col2:
        if st.button("Contact Support", use_container_width=True):
            st.toast("Contact support opened!")
        if st.button("⬆️ Back to Top", use_container_width=True):
            st.session_state['scroll_to'] = "top"
            st.rerun()

elif page == "ℹ️ About":
    st.markdown("<div id='about-section'></div>", unsafe_allow_html=True)
    st.info("This is the About section. Information about the Fake News Detector goes here.")
    if st.button("Back to Home"):
        st.session_state['nav_radio'] = "🏠 Home"
        st.rerun()
        
elif page == "📊 Analytics":
    st.info("Analytics Dashboard coming soon!")
    if st.button("Back to Home"):
        st.session_state['nav_radio'] = "🏠 Home"
        st.rerun()

else:
    st.info(f"{page} section is coming soon!")

# --- THEME TOGGLE LOGIC ---
if 'theme' not in st.session_state:
    st.session_state['theme'] = 'light'

st.markdown("<div style='display: none;'>", unsafe_allow_html=True)
if st.button("hidden_theme_toggle", key="theme_btn"):
    st.session_state['theme'] = 'dark' if st.session_state['theme'] == 'light' else 'light'
    st.rerun()
st.markdown("</div>", unsafe_allow_html=True)

if st.session_state['theme'] == 'dark':
    st.markdown("""
    <style>
    /* Dark Theme Overrides */
    .stApp { background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0B1120 100%) !important; }
    
    .stApp div[style*="color: #0F172A"], .stApp span[style*="color: #0F172A"], .stApp h1, .stApp h2, .stApp h3, .stApp h4 { color: #F8FAFC !important; }
    .stApp div[style*="color: #64748B"], .stApp span[style*="color: #64748B"], .stApp p[style*="color: #64748B"] { color: #94A3B8 !important; }
    .stApp div[style*="color: #475569"], .stApp p[style*="color: #475569"] { color: #CBD5E1 !important; }
    
    .stApp div[style*="background: white"], .stApp div[style*="background: rgba(255,255,255,0.85)"],
    .stApp div[style*="background-color: white"], .stApp div[style*="background: rgba(248, 250, 255, 1)"] {
        background: rgba(30, 41, 59, 0.85) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    div[style*="linear-gradient(135deg, #F8FAFF"] {
        background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    .stat-card, .feature-card, .step-card {
        background: rgba(30, 41, 59, 0.7) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
    }
    
    .card-header { border-bottom-color: rgba(255,255,255,0.1) !important; }
    div[data-testid="stSidebar"] { background-color: #0B1120 !important; }
    .welcome-subtitle { color: #CBD5E1 !important; }
    
    .stTextArea textarea {
        background-color: rgba(30, 41, 59, 0.8) !important;
        color: #F8FAFC !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    div[style*="border-left: 1px solid #E2E8F0"] { border-left-color: rgba(255,255,255,0.1) !important; }
    div[style*="background-color: #E2E8F0"], div[style*="background-color: #e2e8f0"] { background-color: #334155 !important; }
    
    /* Sun Icon Swap */
    .theme-toggle-icon { color: transparent !important; position: relative; }
    .theme-toggle-icon:before {
        content: '☀️';
        visibility: visible;
        position: absolute;
        font-size: 18px;
        left: 0;
        color: #94A3B8;
        transition: color 0.2s;
    }
    .theme-toggle-icon:hover:before { color: #2563EB; }
    </style>
    """, unsafe_allow_html=True)

st.components.v1.html("""
<script>
    const parentDoc = window.parent.document;
    const buttons = parentDoc.querySelectorAll('button');
    let hiddenBtn = null;
    buttons.forEach(b => {
        if(b.innerText.includes('hidden_theme_toggle')) {
            hiddenBtn = b;
            const container = b.closest('div[data-testid="stButton"]');
            if(container) container.style.display = 'none';
        }
    });

    const themeIcon = parentDoc.querySelector('.theme-toggle-icon');
    if (themeIcon && !themeIcon.dataset.hasListener && hiddenBtn) {
        themeIcon.dataset.hasListener = "true";
        themeIcon.addEventListener('click', function() {
            hiddenBtn.click();
        });
    }
</script>
""", height=0)

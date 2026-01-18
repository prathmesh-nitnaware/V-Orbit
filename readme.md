# 🚀 V-Orbit: The AI-Native Engineering Ecosystem

**The Gold Standard for Students of VIT.**
V-Orbit is a deep-tech platform that bridges the gap between academic learning and industry readiness. Unlike standard wrappers, V-Orbit is a fully integrated ecosystem powered by **Computer Vision, NLP, Hybrid RAG (Retrieval-Augmented Generation), and Google Cloud**.

---

## 🌟 Key Features (The "Deep Tech" Upgrade)

### 1. 🎥 Mock-V (AI Proctoring & NLP Analysis)
* **Computer Vision Proctoring:** Uses `face-api.js` (TensorFlow.js) to perform real-time face detection. It flags suspicious behavior (looking away, multiple faces, or no face detected) directly in the browser.
* **Speech NLP Analytics:** Analyzes your spoken answers to detect **Filler Words** ("um", "uh") and **Sentiment** (Confidence Level).
* **Adaptive Interview Flow:**
    * **Skill Check:** Extracts skills from your uploaded Resume PDF.
    * **Project Deep-Dive:** Asks technical questions about your specific projects.
    * **Live Feedback:** Provides a detailed performance review and hiring decision.

### 2. 🤖 Insight-VIT (Hybrid RAG Chatbot)
* **Cloud-Native RAG:** Connects directly to a **Google Cloud Storage Bucket** to stream and index syllabus PDFs dynamically.
* **Hybrid Intelligence:**
    * **Syllabus Mode:** Uses **Google Gemini Embeddings (`text-embedding-004`)** to strictly answer from uploaded documents.
    * **General Tutor Mode:** Falls back to Large Language Models (LLM) for general concept explanations if the syllabus is silent.
* **Multimodal:** Automatically fetches relevant **YouTube Video Tutorials** alongside text answers.

### 3. 📊 Resume Scorer (Holographic Visualization)
* **Skill Hologram:** Instead of a boring score, V-Orbit generates a **Radar Chart (Spider Graph)** visualizing your fit across 5 dimensions: *Coding, System Design, Experience, Education, and Soft Skills*.
* **ATS Optimization:** Highlights missing keywords and provides actionable fixes to beat the Applicant Tracking System.

### 4. 📈 Live Dashboard 2.0
* **Confidence Trend Graph:** A live-updating graph that tracks your calculated "Confidence Score" (derived from NLP sentiment & filler counts) over time.
* **Activity Feed:** Syncs directly with the MongoDB backend to show recent interview history with sentiment icons.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **AI Vision:** `face-api.js` (TensorFlow.js wrapper)
* **Visualization:** `recharts` (Radar Charts & Area Graphs)
* **Styling:** Bootstrap 5, Custom CSS Animations
* **State Management:** React Hooks & Context API

### **Backend**
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB (Mongoose)
* **Cloud Storage:** **Google Cloud Storage (GCS)** for scalable document handling.
* **NLP:** `sentiment` library for text analysis.
* **PDF Processing:** `pdf-parse`

### **🤖 Google Technologies Used**
| Technology | Purpose in V-Orbit |
| :--- | :--- |
| **Google Cloud Storage** | Stores and streams syllabus PDFs for the RAG system (Serverless & Scalable). |
| **Google Gemini API** | Generates high-dimensional **Text Embeddings (`text-embedding-004`)** for semantic search. |
| **YouTube Data API v3** | Fetches curated video tutorials related to academic queries. |
| **Firebase Auth** | Handles secure user management and Google Sign-In. |
| **Google TTS** | Powers the voice of the AI Interviewer. |

---

## 🚀 Installation & Setup

### **Prerequisites**
* Node.js (v18+)
* MongoDB (Atlas or Local)
* **Google Cloud Service Account JSON** (with Storage Admin access)

### **Step 1: Backend Setup**
1.  Navigate to the backend:
    ```bash
    cd backend
    npm install
    ```
2.  Create a `.env` file in `backend/`:
    ```ini
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    
    # AI Keys
    GROQ_API_KEY=your_groq_key
    GEMINI_API_KEY=your_gemini_key
    YOUTUBE_API_KEY=your_youtube_key
    
    # Google Cloud Storage (RAG)
    INSIGHT_BUCKET_NAME=your_gcs_bucket_name
    GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
    ```
3.  **Important:** Place your Google Service Account JSON file inside the `backend/` folder.
4.  Start the server:
    ```bash
    node index.js
    ```
    *(Check logs for: "☁️ Connecting to GCS Bucket...")*

### **Step 2: Frontend Setup**
1.  Navigate to frontend:
    ```bash
    cd frontend
    npm install
    ```
2.  **Download AI Models:**
    * Download the `weights` folder from [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights).
    * Place them in `frontend/public/models`.
3.  Start the app:
    ```bash
    npm run dev
    ```

---

## 📖 Usage Guide

1.  **AI Proctoring:** Go to "Mock-V". Allow camera access. Watch the system verify your face (Green Box) before letting you start.
2.  **Insight-VIT:** Go to the Chat. Select a subject (e.g., "AI"). Ask a question. See it fetch answers from your Cloud Bucket + a YouTube video.
3.  **Resume Scorer:** Upload a Resume & JD. Watch the **Skill Hologram** appear.

---

## 🔮 Future Roadmap
* ✅ **Completed:** Hybrid RAG, Computer Vision Proctoring, NLP Analytics.
* 🔜 **Next:**
    * Voice-to-Text (STT) for verbal interview answers.
    * Gamified Leaderboard.
    * Multi-user collaboration.

---

### 👨‍💻 Developed by **Prathmesh Nitnaware**
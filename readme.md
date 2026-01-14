# 🚀 V-Orbit: The Gold Standard for Engineers

![V-Orbit Banner](https://via.placeholder.com/1000x300/002147/D4AF37?text=V-Orbit+AI+Platform)

> **Empowering the next generation of engineers with Hybrid AI, Real-time Analytics, and Personalized Career Acceleration.**

**V-Orbit** is a comprehensive full-stack platform designed to bridge the gap between academic learning and industry requirements. By leveraging cutting-edge AI models (Gemini & Llama 3), it provides students with instant syllabus answers, realistic mock interviews, and ATS-grade resume optimization.

---

## 🌟 Key Features

### 1. 🤖 Insight-VIT (Academic Oracle)
* **RAG-Powered Chatbot:** "Talk" to your university syllabus and PDF notes. The AI understands context and answers specific academic queries.
* **Hybrid Intelligence:** Uses **Google Gemini** for vector embeddings (search) and **Groq (Llama 3)** for answer generation.
* **Smart Recommendations:** Automatically fetches relevant **YouTube Video Tutorials** alongside text answers for a multimodal learning experience.

### 2. 🎥 Mock-V (AI Interviewer)
* **Adaptive Interview Flow:** The AI acts as a human interviewer, dynamically adjusting questions based on your responses:
    1.  **Skill Check:** Extracts skills from your uploaded Resume PDF.
    2.  **Project Deep-Dive:** Asks technical questions about your specific projects.
    3.  **DSA & System Design:** Challenges you with algorithmic problems.
* **Text-to-Speech (TTS):** The interviewer speaks to you using realistic audio synthesis.
* **Live Feedback:** Provides a detailed performance review and hiring decision (Hire/No Hire) instantly.

### 3. 📄 Resume Scorer (ATS Optimizer)
* **AI Analysis:** Parses your PDF resume and compares it against a target Job Description (JD).
* **Scoring Engine:** Generates a compatibility score (0-100%).
* **Actionable Insights:** Highlights missing keywords and suggests specific improvements to beat the ATS.

### 4. 📊 Live Dashboard
* **Real-Time Analytics:** Tracks your interview performance trends over time.
* **Interactive Visuals:** Features a "Sci-Fi" style scanning graph and radar charts for skill analysis.
* **Activity Feed:** Syncs directly with the MongoDB backend to show recent interview history.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** Bootstrap 5, Custom CSS Animations
* **State Management:** React Hooks & Context API
* **HTTP Client:** Axios
* **Routing:** React Router DOM

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose) - Local & Cloud (Atlas) compatible
* **File Handling:** Multer, PDF-Parse

### **🤖 Google Technologies Used**
V-Orbit heavily relies on the Google Cloud ecosystem for its core AI capabilities:

| Technology | Purpose in V-Orbit |
| :--- | :--- |
| **Google Gemini API** | Used in `Insight-VIT` to generate high-dimensional **Text Embeddings**, allowing the system to semantically search through hundreds of PDF pages instantly. |
| **YouTube Data API v3** | Fetches curated video tutorials related to the student's academic queries in real-time. |
| **Firebase Authentication** | Handles secure user management, providing seamless **Google Sign-In** and session handling. |
| **Google Text-to-Speech** | Powers the voice of the AI Interviewer in `Mock-V`, making the simulation immersive. |

### **Additional AI & Tools**
* **Groq Cloud (Llama 3.3 70B):** The "Brain" behind the reasoning, code analysis, and complex conversation logic.
* **React Markdown:** Renders rich text responses from the AI.

---

## 🚀 Installation & Setup

Follow these steps to run V-Orbit locally.

### **Prerequisites**
* Node.js (v18 or higher)
* MongoDB (Installed locally or an Atlas URI)
* API Keys for: Groq, Google Gemini, YouTube, Firebase.

### **Step 1: Backend Setup**

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory:
    ```ini
    PORT=3000
    # Use your Local MongoDB or Atlas Connection String
    MONGODB_URI=mongodb://127.0.0.1:27017/v-orbit
    
    # AI Keys
    GROQ_API_KEY=gsk_your_groq_key_here
    GEMINI_API_KEY=your_google_gemini_key
    YOUTUBE_API_KEY=your_youtube_data_api_key
    ```
4.  **Important:** Create a folder named `documents` inside `backend/` and paste your syllabus PDFs there.
5.  Start the server:
    ```bash
    node index.js
    ```
    *(Verify you see: "MongoDB Connected" & "Insight-VIT documents loaded")*

### **Step 2: Frontend Setup**

1.  Open a new terminal and navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    ```ini
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
4.  Start the React app:
    ```bash
    npm run dev
    ```

---

## 📖 Usage Guide

1.  **Authentication:**
    * Open `http://localhost:5173`.
    * Click **"Sign in with Google"** (if configured) or **"Continue as Guest"** for instant access.
2.  **Upload Documents:**
    * Ensure your PDFs are in the `backend/documents` folder before starting the backend.
3.  **Start a Mock Interview:**
    * Navigate to **Mock-V**.
    * Upload your Resume (PDF).
    * Select difficulty and click Start. The AI will read your resume and begin the session.
4.  **Ask Insight-VIT:**
    * Go to **Insight-VIT**.
    * Type a query like *"Explain Module 3 of AI"*.
    * Watch as it retrieves the answer from your PDF and suggests a YouTube video.

---

## 🔮 Future Roadmap
* [ ] Adding Role based Sample Interview and Role Based Technical Interview
* [ ] Add Voice-to-Text (STT) for user answers in Mock Interview.
* [ ] Multi-user document uploads via the frontend.
* [ ] Gamified leaderboard for resume scores.

---

### 👨‍💻 Developed by **Prathmesh Nitnaware**

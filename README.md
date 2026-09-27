# AI Quiz Master

A full-stack MERN application that generates custom multiple-choice quizzes using the Google Gemini AI API. 

## Features
- User authentication (Signup/Login) with JWT
- Generate custom quizzes on any topic
- Select difficulty (Easy, Medium, Hard) and number of questions
- Take quizzes and get instant feedback and scoring
- View quiz history and detailed results
- Fully responsive modern UI

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Tailwind CSS, Axios, Context API
- **Backend**: Node.js, Express, MongoDB/Mongoose
- **AI**: Google Gemini 2.0 Flash API

## Prerequisites
- Node.js (v16+)
- MongoDB connection string (e.g., MongoDB Atlas)
- Google Gemini API Key

### How to get a free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account.
3. Click on "Get API Key" in the left navigation.
4. Click "Create API Key" and copy the generated key.

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
# or node server.js
```

### 2. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (optional, defaults to `http://localhost:5000/api`):
```
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

## Usage
1. Open `http://localhost:5173` in your browser.
2. Sign up for an account.
3. Go to the dashboard, enter a topic (e.g., "JavaScript Basics"), select difficulty, and click "Generate Quiz".
4. The AI will generate a quiz. Take it and view your results!

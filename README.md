# 🚀 InvestAI - AI-Powered Startup Investment Platform

An AI-powered platform connecting startups and investors with comprehensive analysis, meeting scheduling, and intelligent matching.

## ✨ Key Features

### 🤖 **9 Specialized AI Agents**
- **Fact Check Analysis** - Verify claims with web search
- **Business Model Analysis** - Revenue streams and economics
- **Market Size Analysis** - Market opportunity assessment
- **Product Information Analysis** - Product insights and differentiation
- **Competition Analysis** - Competitor discovery and landscape
- **Founders Research** - Team and founder analysis
- **Risk Assessment** - Investment risk evaluation
- **Document Analysis** - Pitch deck and document processing

### 📅 **Meeting Scheduler**
- **3-Step Process** - Choose time slots, add message, review
- **Smart Notifications** - Accept/reject meeting requests
- **Dashboard Integration** - Manage all meetings in one place
- **No Back-and-forth** - Fast, simple scheduling

### 🏢 **Dual User Experience**
- **Startup Dashboard** - Submit data, run analysis, manage meetings
- **Investor Dashboard** - Discover startups, view analysis, schedule meetings
- **RAG Chatbot** - Dynamic Q&A for startup details

## 🏗️ Project Structure

```
├── 📁 backend/                    # FastAPI backend
│   ├── api/routers/              # API endpoints
│   │   ├── analysis.py           # AI analysis endpoints
│   │   ├── meetings.py           # Meeting scheduling
│   │   ├── profiles.py           # User profiles
│   │   └── chatbot.py            # RAG chatbot
│   ├── prompts/                  # AI prompts
│   ├── utils/                    # Utilities
│   ├── main.py                   # FastAPI server
│   └── requirements.txt          # Dependencies
├── 📁 frontend/                  # React frontend
│   ├── src/components/           # React components
│   ├── src/services/             # API services
│   └── src/providers/            # Firebase config
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Google AI API Key**
- **Firebase Project**

### 1. Clone & Setup
```bash
git clone <repository-url>
cd Genai_exchange_hackathon
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your-api-key" > .env

# Start server
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 API Endpoints

### Analysis
- `POST /api/analysis/fact-check` - Fact checking
- `POST /api/analysis/business-model` - Business model analysis
- `POST /api/analysis/investment-recommendation` - Investment advice

### Meetings
- `POST /api/meetings/request` - Create meeting request
- `GET /api/meetings/user/{user_id}` - Get user meetings
- `PUT /api/meetings/{meeting_id}` - Update meeting status

### Chatbot
- `POST /api/chatbot/chat` - RAG chatbot Q&A
- `GET /api/chatbot/suggested-questions` - Get suggested questions

## 🛠️ Technologies

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced AI analysis
- **Google ADK** - Agent development kit
- **Firebase** - Real-time database

### Frontend
- **React 18** - Modern frontend framework
- **Tailwind CSS** - Utility-first styling
- **Firebase** - Authentication & storage
- **Axios** - HTTP client

## 📖 Usage

### For Startups
1. **Submit Data** - Upload pitch deck and company info
2. **Run Analysis** - Get AI-powered insights from 9 specialized agents
3. **Manage Meetings** - Schedule meetings with investors
4. **View Results** - Access comprehensive analysis reports

### For Investors
1. **Discover Startups** - Browse and filter startup profiles
2. **Request Meetings** - Schedule meetings with startups
3. **View Analysis** - Access detailed AI analysis reports
4. **Chat with AI** - Ask questions about startups

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
GOOGLE_API_KEY=your-google-api-key
```

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Update `frontend/src/providers/firebase.js`

## 🚀 Deployment

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm run build
# Serve build/ directory
```

## 📊 Performance

- **Optimized Components** - React.memo, useCallback, useMemo
- **Lazy Loading** - Components loaded on demand
- **Efficient API Calls** - Retry logic and error handling
- **Small Bundle Size** - Removed unused code and components

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

Educational and development purposes. Comply with Google's API terms of service.

---

**Built with ❤️ using Google Gemini AI, Firebase and React**

*InvestAI - Transforming startup investment through AI-powered insights*

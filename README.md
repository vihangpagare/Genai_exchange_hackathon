# 🚀 AI-Powered Startup Investment Analysis Platform

A comprehensive AI-powered platform for analyzing startup documents, emails, and call transcripts using Google's Gemini AI with advanced business model analysis, market intelligence, risk assessment, and fact-checking capabilities.

## ✨ Features

### 📄 **Document Analysis**
- Upload and analyze PDF documents, pitch decks (PPTX/PPT)
- Per-page multimodal analysis with visual content extraction
- Comprehensive data extraction from charts, graphs, and tables
- Financial metrics validation and unit economics analysis

### 📧 **Email Communication Analysis**
- Analyze email threads between founders and investors
- Extract key metrics, updates, and communication patterns
- Track transparency indicators and follow-up items
- Identify business developments and challenges

### 📞 **Call Transcript Analysis**
- Process meeting notes and call transcripts
- Extract financial information and business discussions
- Analyze Q&A patterns and investor concerns
- Track commitments and next steps

### 🔍 **AI Fact-Checking**
- **Data Normalization**: Convert text numbers to precise values
- **Web Search Verification**: Validate claims with real-time web data
- **Internal Consistency Checks**: Cross-reference data within documents
- **Mathematical Verification**: Validate calculations and ratios
- **Confidence Scoring**: Provide reliability assessments

### 💼 **Business Model Analysis**
- **Revenue Stream Identification**: Analyze all revenue sources and models
- **Pricing Strategy Analysis**: Evaluate pricing tiers, customer segmentation, and value proposition
- **Monetization Pipeline**: Map customer acquisition to revenue realization
- **Economics Assessment**: Comprehensive business model evaluation

### 📊 **Market Intelligence Analysis**
- **Competitor Discovery**: Identify and analyze top competitors
- **Traction Assessment**: Evaluate user growth, revenue performance, and market validation
- **Market Opportunity**: Analyze market size, trends, and sentiment
- **Product Differentiation**: Assess competitive advantages and defensibility

### ⚠️ **Risk Assessment Analysis**
- **Market Risk**: Market size, timing, and competitive threats
- **Execution Risk**: Founder background, team capabilities, and governance
- **Financial Risk**: Funding market conditions and economic factors
- **Regulatory Risk**: Legal compliance and regulatory roadblocks

### 🎯 **Comprehensive Analysis**
- **Complete Evaluation**: Combine all analysis types for comprehensive investment insights
- **Customizable Options**: Choose which analysis types to include
- **Integrated Results**: Unified view of all analysis components

## 🏗️ Project Structure

```
├── 📁 backend/                 # Python backend services
│   ├── backend.py              # FastAPI main server
│   ├── document_ingestor.py    # Core document analysis logic
│   ├── factcheck_agent.py      # AI fact-checking agent with web search
│   ├── business_model_agent.py # Business model analysis agent
│   ├── market_intelligence.py  # Market intelligence analysis agent
│   ├── risk_assesment.py       # Risk assessment analysis agent
│   ├── main.py                 # Fact-checking agent runner
│   ├── prompts.py              # AI prompts for different document types
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # Backend documentation
├── 📁 frontend/                # React frontend application
│   ├── public/
│   │   └── index.html          # Main HTML file
│   ├── providers/
│   │   └── firebase.ts         # Firebase configuration
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AnalysisResults.js    # Results display
│   │   │   ├── FactCheckInput.js     # Fact-checking interface
│   │   │   ├── FileUpload.js         # Drag-and-drop upload
│   │   │   ├── TextInput.js          # Text input for emails/calls
│   │   │   └── ThemeToggle.js        # Theme switcher
│   │   ├── contexts/
│   │   │   └── ThemeContext.js       # Theme management
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── App.js                    # Main application
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── package.json                  # Frontend dependencies
│   └── README.md                     # Frontend documentation
├── .gitignore                 # Git ignore rules
├── env.example               # Environment variables template
├── package.json              # Monorepo configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Google AI API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Genai_exchange_hackathon
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure API Key
1. Get your Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the API key in `backend/document_ingestor.py`:
   ```python
   os.environ["GOOGLE_API_KEY"] = "your-actual-google-api-key"
   ```

#### Start Backend Server
```bash
cd backend
python backend.py
```
The API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Node.js Dependencies
```bash
cd frontend
npm install
```

#### Start React Development Server
```bash
cd frontend
npm start
```
The frontend will be available at `http://localhost:3000`

### 4. Development with Both Services

#### Option 1: Run Both Services Separately
```bash
# Terminal 1: Start backend
cd backend && python backend.py

# Terminal 2: Start frontend
cd frontend && npm start
```

#### Option 2: Use Monorepo Scripts (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both services concurrently
npm run dev
```

## 📖 Usage Guide

### 📄 Document Analysis
1. **Navigate** to the "Document Analysis" tab
2. **Upload** a PDF, PPTX, or PPT file by:
   - Dragging and dropping the file onto the upload area
   - Clicking anywhere on the upload area to browse files
3. **Wait** for AI analysis to complete (may take several minutes for large documents)
4. **Review** the comprehensive analysis results including:
   - Overall document summary
   - Page-by-page analysis
   - Financial data extraction
   - Team information
   - Market analysis

### 📧 Email Analysis
1. **Navigate** to the "Email Analysis" tab
2. **Paste** email content in the text area
3. **Click** "Analyze Email"
4. **Review** extracted insights including:
   - Communication metadata
   - Business updates and developments
   - Financial status and funding information
   - Challenges and concerns disclosed

### 📞 Call Analysis
1. **Navigate** to the "Call Analysis" tab
2. **Paste** call transcript in the text area
3. **Click** "Analyze Call"
4. **Review** analysis results including:
   - Call context and participants
   - Business information discussed
   - Financial information disclosed
   - Team and execution information
   - Questions and answers analysis

### 🔍 Fact-Checking
1. **Navigate** to the "Fact Check" tab
2. **Select** analysis type (General, Document, Email, or Call)
3. **Paste** content to verify
4. **Click** "Fact-Check Content"
5. **Review** comprehensive verification including:
   - Data normalization table
   - Internal consistency checks
   - Web search verification results
   - Mathematical verification
   - Confidence assessments

## 🔧 API Endpoints

### Core Analysis Endpoints
- `GET /health` - Health check
- `POST /analyze/document` - Upload and analyze documents
- `POST /analyze/email` - Analyze email text
- `POST /analyze/call` - Analyze call transcript

### Advanced Analysis Endpoints
- `POST /analyze/business-model` - Business model analysis
- `POST /analyze/market-intelligence` - Market intelligence analysis
- `POST /analyze/risk-assessment` - Risk assessment analysis
- `POST /analyze/comprehensive` - Comprehensive analysis combining all types

### Fact-Checking Endpoints
- `POST /analyze/factcheck` - Fact-check content with web search

### Request/Response Examples

#### Document Analysis
```bash
curl -X POST "http://localhost:8000/analyze/document" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

#### Fact-Checking
```bash
curl -X POST "http://localhost:8000/analyze/factcheck" \
  -H "Content-Type: application/json" \
  -d '{"content": "Our startup has $2M ARR", "analysis_type": "document"}'
```

## 🛠️ Technologies Used

### Backend Stack
- **FastAPI**: Modern Python web framework with automatic API documentation
- **Google Gemini AI**: Advanced AI model for document understanding
- **Google ADK**: Agent Development Kit for fact-checking with web search
- **PyMuPDF**: High-performance PDF processing
- **python-pptx**: PowerPoint document processing
- **LangChain**: AI framework integration and prompt management

### Frontend Stack
- **React 18**: Modern frontend framework with hooks
- **React Dropzone**: Drag-and-drop file upload component
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Glass morphism effects and animations

## ⚙️ Configuration

### Environment Variables
Create a `.env` file based on `env.example`:

```env
# Google AI API Key
GOOGLE_API_KEY=your-google-api-key-here

# Backend API URL (for frontend)
REACT_APP_API_URL=http://localhost:8000
```

### File Limits
- **Maximum file size**: 10MB
- **Supported formats**: PDF, PPTX, PPT
- **Processing timeout**: 5 minutes for large documents

### API Rate Limits
- **Google Gemini API**: Subject to Google's rate limits
- **Web search**: Limited to 10 searches per fact-check session
- **Concurrent requests**: Backend handles multiple requests efficiently

## 🎨 UI/UX Features

### Modern Design
- **Glass morphism effects** with backdrop blur
- **Gradient backgrounds** and smooth animations
- **Responsive design** for all screen sizes
- **Dark/light theme** support
- **Floating animations** and hover effects

### User Experience
- **Drag-and-drop** file upload with visual feedback
- **Click-anywhere** file selection
- **Real-time** character counting
- **Loading states** with animated spinners
- **Error handling** with user-friendly messages
- **Tabbed interface** for different analysis types

## 🔧 Development

### Running in Development Mode
```bash
# Option 1: Use monorepo scripts (recommended)
npm run dev

# Option 2: Run services separately
# Terminal 1: Start backend
cd backend && python backend.py

# Terminal 2: Start frontend
cd frontend && npm start
```

Both servers will run with hot reload for development.

### Building for Production
```bash
# Build React app
npm run build

# The built files will be in the 'frontend/build' directory
# Serve with any static file server
```

### Code Structure
- **Components**: Modular React components with clear separation of concerns
- **Services**: API service layer with error handling
- **Styling**: Utility-first CSS with custom animations
- **State Management**: React hooks for local state management

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
1. **"No response from server" error:**
   - Ensure backend is running on port 8000
   - Check Google API key is properly set
   - Verify all Python dependencies are installed

2. **Analysis takes too long:**
   - Large documents may take several minutes
   - Check Google API quota limits
   - Monitor backend logs for errors

3. **File upload fails:**
   - Check file size (must be under 10MB)
   - Ensure file format is supported (PDF, PPTX, PPT)
   - Verify file is not corrupted

#### Frontend Issues
1. **Build errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

2. **API connection issues:**
   - Ensure backend is running
   - Check CORS configuration
   - Verify API URL in environment variables

### Debug Mode
Enable debug logging by setting environment variables:
```bash
export DEBUG=true
export LOG_LEVEL=debug
```

## 📊 Performance

### Optimization Features
- **Lazy loading** of components
- **Image optimization** for document previews
- **Efficient API calls** with proper error handling
- **Memory management** for large document processing
- **Caching** of analysis results

### Scalability
- **Horizontal scaling** support for backend
- **Database integration** ready (currently in-memory)
- **CDN support** for static assets
- **Load balancing** compatible

## 🔒 Security

### Data Protection
- **No data persistence** - all analysis is in-memory
- **API key protection** - stored in environment variables
- **Input validation** - all user inputs are validated
- **File type verification** - only allowed file types accepted

### Best Practices
- **HTTPS support** for production deployments
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Error sanitization** to prevent information leakage

## 📈 Roadmap

### Planned Features
- [ ] **Database integration** for result persistence
- [ ] **User authentication** and session management
- [ ] **Batch processing** for multiple documents
- [ ] **Export functionality** for analysis results
- [ ] **Advanced visualizations** for financial data
- [ ] **Integration APIs** for third-party tools
- [ ] **Mobile app** development
- [ ] **Real-time collaboration** features

### Performance Improvements
- [ ] **Caching layer** for repeated analyses
- [ ] **Background processing** for large documents
- [ ] **Progressive loading** for better UX
- [ ] **Compression** for file uploads

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **CSS**: Follow Tailwind CSS conventions
- **Commits**: Use conventional commit messages

## 📄 License

This project is for educational and development purposes. Please ensure you comply with Google's API terms of service when using the Gemini AI features.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions

### Contact
For questions or support, please create an issue in the GitHub repository.

---

**Built with ❤️ using Google Gemini AI and modern web technologies**

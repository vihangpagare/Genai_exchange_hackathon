# Backend - Startup Document Analyzer

This directory contains the Python backend services for the Startup Document Analyzer application.

## 🏗️ Structure

```
backend/
├── backend.py              # FastAPI main server
├── document_ingestor.py    # Core document analysis logic
├── factcheck_agent.py      # AI fact-checking agent with web search
├── main.py                 # Fact-checking agent runner
├── prompts.py              # AI prompts for different document types
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Google AI API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key:**
   - Get your Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the API key in `document_ingestor.py`:
     ```python
     os.environ["GOOGLE_API_KEY"] = "your-actual-google-api-key"
     ```

3. **Start the server:**
   ```bash
   python backend.py
   ```
   The API will be available at `http://localhost:8000`

## 📡 API Endpoints

### Core Analysis Endpoints
- `GET /health` - Health check
- `POST /analyze/document` - Upload and analyze documents
- `POST /analyze/email` - Analyze email text
- `POST /analyze/call` - Analyze call transcript

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

- **FastAPI**: Modern Python web framework with automatic API documentation
- **Google Gemini AI**: Advanced AI model for document understanding
- **Google ADK**: Agent Development Kit for fact-checking with web search
- **PyMuPDF**: High-performance PDF processing
- **python-pptx**: PowerPoint document processing
- **LangChain**: AI framework integration and prompt management

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Google AI API Key
GOOGLE_API_KEY=your-google-api-key-here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

### File Limits
- **Maximum file size**: 10MB
- **Supported formats**: PDF, PPTX, PPT
- **Processing timeout**: 5 minutes for large documents

### API Rate Limits
- **Google Gemini API**: Subject to Google's rate limits
- **Web search**: Limited to 10 searches per fact-check session
- **Concurrent requests**: Backend handles multiple requests efficiently

## 🔧 Development

### Running in Development Mode
```bash
# Start the backend server
python backend.py

# The server will run with hot reload for development
```

### API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Testing the Fact-Check Agent
```bash
# Run the standalone fact-check agent
python main.py
```

## 🐛 Troubleshooting

### Common Issues

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

### Debug Mode
Enable debug logging by setting environment variables:
```bash
export DEBUG=true
export LOG_LEVEL=debug
```

## 📊 Performance

### Optimization Features
- **Efficient API calls** with proper error handling
- **Memory management** for large document processing
- **Caching** of analysis results (in-memory)
- **Async processing** for better concurrency

### Scalability
- **Horizontal scaling** support
- **Database integration** ready (currently in-memory)
- **Load balancing** compatible
- **Container deployment** ready

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
- [ ] **Advanced caching** with Redis
- [ ] **Background job processing** with Celery
- [ ] **API rate limiting** and throttling
- [ ] **Comprehensive logging** and monitoring

### Performance Improvements
- [ ] **Caching layer** for repeated analyses
- [ ] **Background processing** for large documents
- [ ] **Database optimization** for faster queries
- [ ] **CDN integration** for static assets

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **Type hints**: Use type annotations
- **Documentation**: Add docstrings for functions
- **Testing**: Write unit tests for new features

## 📄 License

This project is for educational and development purposes. Please ensure you comply with Google's API terms of service when using the Gemini AI features.

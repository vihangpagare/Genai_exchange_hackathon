# Startup Document Analyzer

A comprehensive AI-powered tool for analyzing startup documents, emails, and call transcripts using Google's Gemini AI.

## Features

- **Document Analysis**: Upload and analyze PDF documents, pitch decks (PPTX/PPT)
- **Email Analysis**: Analyze email communications between founders and investors
- **Call Analysis**: Process call transcripts and meeting notes
- **AI-Powered Insights**: Uses Google Gemini AI for comprehensive document understanding
- **Modern UI**: Clean, responsive React frontend with drag-and-drop file upload

## Project Structure

```
├── document_ingestor.py    # Core document analysis logic
├── prompts.py             # AI prompts for different document types
├── backend.py             # FastAPI backend server
├── requirements.txt       # Python dependencies
├── package.json          # React frontend dependencies
├── src/                  # React frontend source code
│   ├── App.js           # Main application component
│   ├── components/      # React components
│   └── services/        # API service layer
└── public/              # Static assets
```

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Google API Key:**
   - Get your Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the API key in `document_ingestor.py`:
     ```python
     os.environ["GOOGLE_API_KEY"] = "your-actual-google-api-key"
     ```

3. **Start the backend server:**
   ```bash
   python backend.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Usage

### Document Analysis
1. Go to the "Document Analysis" tab
2. Drag and drop a PDF, PPTX, or PPT file
3. Wait for AI analysis to complete
4. Review the comprehensive analysis results

### Email Analysis
1. Go to the "Email Analysis" tab
2. Paste email content in the text area
3. Click "Analyze Email"
4. Review the extracted insights

### Call Analysis
1. Go to the "Call Analysis" tab
2. Paste call transcript in the text area
3. Click "Analyze Call"
4. Review the analysis results

## API Endpoints

- `GET /health` - Health check
- `POST /analyze/document` - Upload and analyze documents
- `POST /analyze/email` - Analyze email text
- `POST /analyze/call` - Analyze call transcript

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **Google Gemini AI**: AI model for document analysis
- **PyMuPDF**: PDF processing
- **python-pptx**: PowerPoint processing
- **LangChain**: AI framework integration

### Frontend
- **React**: Frontend framework
- **React Dropzone**: File upload component
- **Lucide React**: Icon library
- **Axios**: HTTP client
- **Tailwind CSS**: Styling (via CDN)

## Configuration

### Environment Variables
- `GOOGLE_API_KEY`: Your Google AI API key
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

### File Limits
- Maximum file size: 10MB
- Supported formats: PDF, PPTX, PPT

## Development

### Running in Development Mode
1. Start the backend: `python backend.py`
2. Start the frontend: `npm start`
3. Both servers will run with hot reload

### Building for Production
```bash
# Build React app
npm run build

# The built files will be in the 'build' directory
```

## Troubleshooting

### Common Issues

1. **"No response from server" error:**
   - Ensure the backend is running on port 8000
   - Check that the Google API key is properly set

2. **File upload fails:**
   - Check file size (must be under 10MB)
   - Ensure file format is supported (PDF, PPTX, PPT)

3. **Analysis takes too long:**
   - Large documents may take several minutes
   - Check your Google API quota limits

### API Key Setup
Make sure to replace `"your-google-api-key"` in `document_ingestor.py` with your actual Google API key from Google AI Studio.

## License

This project is for educational and development purposes.

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Search, Briefcase, Mail, Phone, Sparkles, CheckCircle, FileText, Zap } from 'lucide-react';

const FactCheckInput = ({ onFactCheck }) => {
  const [content, setContent] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Predefined templates for quick start
  const templates = {
    general: [
      {
        title: "Financial Claims",
        content: "Our startup has achieved $2M ARR with 40% month-over-month growth and a customer acquisition cost of $150.",
        description: "Verify financial metrics and growth claims"
      },
      {
        title: "Market Data",
        content: "The total addressable market for our product is $50B, and we're targeting 1% market share within 2 years.",
        description: "Check market size and penetration claims"
      },
      {
        title: "Team Credentials",
        content: "Our CTO previously led engineering at Google and has 15 years of experience in AI/ML.",
        description: "Validate team member backgrounds"
      }
    ],
    document: [
      {
        title: "Revenue Projections",
        content: "We project $10M revenue by year 3 with 60% gross margins and 25% net profit margins.",
        description: "Verify financial projections and assumptions"
      },
      {
        title: "Competitive Analysis",
        content: "We have 3 direct competitors with combined market share of 15%, leaving 85% untapped opportunity.",
        description: "Check competitive landscape claims"
      }
    ],
    email: [
      {
        title: "Investor Update",
        content: "We've closed our Series A round of $5M at a $20M pre-money valuation with participation from top-tier VCs.",
        description: "Verify funding and valuation claims"
      },
      {
        title: "Product Metrics",
        content: "Our app has 100K active users with 85% retention rate and 4.8/5 app store rating.",
        description: "Check product performance metrics"
      }
    ],
    call: [
      {
        title: "Partnership Claims",
        content: "We've signed partnerships with 5 Fortune 500 companies worth $2M in potential revenue.",
        description: "Verify partnership and revenue claims"
      },
      {
        title: "Technical Achievements",
        content: "Our AI model achieves 95% accuracy, 10x faster than competitors, and processes 1M requests daily.",
        description: "Check technical performance claims"
      }
    ]
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Auto-save to localStorage
  useEffect(() => {
    const storageKey = `factcheck_draft_${analysisType}`;
    const savedContent = localStorage.getItem(storageKey);
    if (savedContent && !content) {
      setContent(savedContent);
    }
  }, [analysisType, content]);

  useEffect(() => {
    if (content) {
      const storageKey = `factcheck_draft_${analysisType}`;
      localStorage.setItem(storageKey, content);
    }
  }, [content, analysisType]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!content.trim()) {
      newErrors.content = 'Content is required for fact-checking';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    } else if (content.trim().length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onFactCheck(content.trim(), analysisType);
      // Clear draft after successful submission
      const storageKey = `factcheck_draft_${analysisType}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Fact-check submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setErrors({});
    const storageKey = `factcheck_draft_${analysisType}`;
    localStorage.removeItem(storageKey);
  };

  const insertTemplate = (template) => {
    setContent(template.content);
    setErrors({});
  };

  const analysisTypes = [
    { id: 'general', label: 'General Content', icon: Sparkles, description: 'Any type of content' },
    { id: 'document', label: 'Document Analysis', icon: Briefcase, description: 'Pitch decks, business plans' },
    { id: 'email', label: 'Email Communication', icon: Mail, description: 'Email threads and updates' },
    { id: 'call', label: 'Call Transcript', icon: Phone, description: 'Meeting notes and calls' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Analysis Type Selection */}
      <div>
        <label className="flex items-center gap-3 text-lg md:text-xl font-semibold text-gray-800 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-600" aria-hidden="true" />
          </div>
          Analysis Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setAnalysisType(type.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  analysisType === type.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25 hover:shadow-md'
                }`}
                aria-pressed={analysisType === type.id}
                aria-label={`Select ${type.label} analysis type`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors duration-200 ${
                    analysisType === type.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{type.label}</div>
                    <div className="text-base text-gray-600">{type.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Templates */}
      {templates[analysisType] && templates[analysisType].length > 0 && (
        <div>
          <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            Quick Templates
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates[analysisType].map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertTemplate(template)}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Use template: ${template.title}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{template.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Input */}
      <div>
        <label htmlFor="factcheck-input" className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <Search className="w-5 h-5 text-emerald-600" />
          Content to Fact-Check
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="factcheck-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste any content you want to fact-check... This could be claims from a pitch deck, financial projections, market data, team credentials, or any other information that needs verification."
            rows={12}
            className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all duration-300 text-gray-700 placeholder-gray-400 ${
              errors.content ? 'border-red-500' : 'border-gray-200'
            }`}
            aria-label="Content to fact-check"
            aria-describedby="content-help content-error"
            aria-invalid={errors.content ? 'true' : 'false'}
          />
          {content.length > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                <span>{content.length}/5000 characters</span>
              </div>
            </div>
          )}
        </div>
        {errors.content && (
          <div id="content-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {errors.content}
          </div>
        )}
        <div id="content-help" className="text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            AI will verify claims with web search and data validation
          </span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>AI will verify claims with web search and data validation</span>
          </div>
          {content.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Clear all content"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="btn btn-primary flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Submit content for fact-checking"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Fact-Checking...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" aria-hidden="true" />
              Fact-Check Content
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={handleClear}
          disabled={!content.trim() || isSubmitting}
          className="btn btn-secondary px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Clear all content"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default FactCheckInput;
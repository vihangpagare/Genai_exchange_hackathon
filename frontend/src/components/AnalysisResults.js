import React from 'react';
import { FileText, Users, DollarSign, TrendingUp, Target, AlertTriangle, Sparkles, Brain, Zap, Briefcase, Mail, Phone, Shield } from 'lucide-react';

const AnalysisResults = ({ results }) => {
  const formatAnalysisContent = (content) => {
    if (typeof content !== 'string') return content;
    
    // Split content into sections based on ** markers
    const sections = content.split(/(\*\*[^**]+\*\*)/g);
    
    return sections.map((section, index) => {
      if (section.startsWith('**') && section.endsWith('**')) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2 text-lg">
            {section.slice(2, -2)}
          </h4>
        );
      }
      return (
        <p key={index} className="text-gray-700 mb-2 whitespace-pre-wrap leading-relaxed">
          {section}
        </p>
      );
    });
  };

  const renderDocumentResults = () => {
    if (!results.overall_summary && !results.page_analyses) {
      return (
        <div className="text-gray-600">
          <p>Analysis completed successfully.</p>
          {results.analysis && (
            <div className="mt-4">
              {formatAnalysisContent(results.analysis)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Document Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3 text-blue-700 mb-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm md:text-base">Document Type</span>
            </div>
            <p className="text-blue-900 text-lg md:text-xl font-medium">{results.document_type || 'PDF Document'}</p>
          </div>
          
          {results.total_pages && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center gap-3 text-green-700 mb-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm md:text-base">Total Pages</span>
              </div>
              <p className="text-green-900 text-lg md:text-xl font-medium">{results.total_pages}</p>
            </div>
          )}
          
          {results.successful_analyses && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-3 text-purple-700 mb-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm md:text-base">Pages Analyzed</span>
              </div>
              <p className="text-purple-900 text-lg md:text-xl font-medium">{results.successful_analyses}</p>
            </div>
          )}
        </div>

        {/* Overall Summary */}
        {results.overall_summary && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              Overall Document Summary
              <Sparkles className="w-5 h-5 text-purple-500 ml-auto" />
            </h3>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {formatAnalysisContent(results.overall_summary)}
            </div>
          </div>
        )}

        {/* Page-by-Page Analysis */}
        {results.page_analyses && results.page_analyses.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Page-by-Page Analysis
            </h3>
            <div className="space-y-4">
              {results.page_analyses.map((page, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      Page {page.page_number}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      page.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  
                  {page.analysis && (
                    <div className="prose max-w-none text-sm">
                      {formatAnalysisContent(page.analysis)}
                    </div>
                  )}
                  
                  {page.status === 'failed' && (
                    <div className="flex items-center gap-2 text-red-600 mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Analysis failed for this page</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmailResults = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3 text-purple-700">
          <div className="p-2 bg-purple-200 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-lg">Email Analysis</span>
            <p className="text-purple-600 text-sm">Communication analysis completed</p>
          </div>
        </div>
      </div>
      
      {results.analysis && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            Analysis Results
            <Sparkles className="w-5 h-5 text-pink-500 ml-auto" />
          </h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {formatAnalysisContent(results.analysis)}
          </div>
        </div>
      )}
    </div>
  );

  const renderCallResults = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200">
        <div className="flex items-center gap-3 text-indigo-700">
          <div className="p-2 bg-indigo-200 rounded-lg">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-lg">Call Analysis</span>
            <p className="text-indigo-600 text-sm">Transcript analysis completed</p>
          </div>
        </div>
      </div>
      
      {results.analysis && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            Analysis Results
            <Sparkles className="w-5 h-5 text-blue-500 ml-auto" />
          </h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {formatAnalysisContent(results.analysis)}
          </div>
        </div>
      )}
    </div>
  );

  const renderFactCheckResults = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
        <div className="flex items-center gap-3 text-emerald-700">
          <div className="p-2 bg-emerald-200 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-lg">Fact-Check Analysis</span>
            <p className="text-emerald-600 text-sm">Verification completed with web search</p>
          </div>
        </div>
      </div>
      
      {results.analysis && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Fact-Check Results
            <Search className="w-5 h-5 text-teal-500 ml-auto" />
          </h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {formatAnalysisContent(results.analysis)}
          </div>
        </div>
      )}
    </div>
  );

  const getResultsContent = () => {
    if (results.document_type === 'email') {
      return renderEmailResults();
    } else if (results.document_type === 'call_transcript') {
      return renderCallResults();
    } else if (results.document_type && results.document_type.startsWith('factcheck_')) {
      return renderFactCheckResults();
    } else {
      return renderDocumentResults();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">Analysis Results</h2>
        {getResultsContent()}
      </div>
    </div>
  );
};

export default AnalysisResults;
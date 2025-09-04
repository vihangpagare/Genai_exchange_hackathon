import React, { useState } from 'react';
import { Send, Sparkles, FileText } from 'lucide-react';

const TextInput = ({ onAnalyze, placeholder, buttonText }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="text-input" className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          Content to Analyze
        </label>
        <div className="relative">
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 text-gray-700 placeholder-gray-400"
          />
          {text.length > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                <span>{text.length} characters</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI will analyze your content</span>
          </div>
          {text.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn btn-primary flex items-center gap-3 px-8 py-4 text-lg font-semibold"
        >
          <Send className="w-5 h-5" />
          {buttonText}
        </button>
        
        <button
          type="button"
          onClick={handleClear}
          disabled={!text.trim()}
          className="btn btn-secondary px-6 py-4"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default TextInput;

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const StartupChatbot = ({ startupId, startupData, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && startupId) {
      loadSuggestedQuestions();
      // Add welcome message
      if (messages.length === 0) {
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: `Hello! I'm your AI assistant for ${startupId ? 'this startup' : 'startup analysis'}. I can answer questions about the business model, market opportunity, team, risks, and more based on the available data. What would you like to know?`,
          timestamp: new Date()
        }]);
      }
    }
  }, [isOpen, startupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestedQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/chatbot/suggested-questions/${startupId}`);
      const data = await response.json();
      if (data.success) {
        setSuggestedQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error loading suggested questions:', error);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startup_id: startupId,
          question: message.trim(),
          startup_data: startupData
        })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.success ? data.response : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        contextUsed: data.context_used
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered a network error. Please check your connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
    setShowSuggestions(false);
  };

  const clearChat = () => {
    setMessages([]);
    loadSuggestedQuestions();
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <p className="text-sm text-purple-100">Startup Analysis Expert</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            title="Suggested Questions"
          >
            <Lightbulb className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggested Questions Dropdown */}
      {showSuggestions && suggestedQuestions.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 max-h-32 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">Suggested Questions:</p>
          <div className="space-y-1">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full text-left text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.contextUsed && (
                    <div className="mt-2 text-xs opacity-75">
                      <p>Data sources: {Object.keys(message.contextUsed).filter(key => message.contextUsed[key]).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this startup..."
              className="w-full resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* Clear Chat Button */}
        <div className="mt-2 flex justify-end">
          <button
            onClick={clearChat}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupChatbot;
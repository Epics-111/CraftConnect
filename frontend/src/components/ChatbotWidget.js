import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaChevronUp, FaChevronDown, FaPaperPlane, FaInfoCircle, FaSearch, FaCalendarCheck, FaHistory, FaUser } from "react-icons/fa";
import "./ChatbotWidget.css";
import { apiRequest } from "../api"; // Import the API utility

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, isOpen, isMinimized]);

  // Capabilities data
  const capabilities = [
    { icon: <FaSearch />, text: "Find services by type", example: "Find plumber" },
    { icon: <FaSearch />, text: "Search nearby services", example: "Services near me" },
    { icon: <FaCalendarCheck />, text: "Help with bookings", example: "How to book?" },
    { icon: <FaHistory />, text: "Check booking history", example: "My bookings" },
    { icon: <FaUser />, text: "Profile assistance", example: "Update profile" },
    { icon: <FaInfoCircle />, text: "Service details", example: "Tell me about..." }
  ];

  // Quick suggestion buttons
  const quickSuggestions = [
    "Find plumber",
    "Services near me", 
    "My bookings",
    "How to book?"
  ];

  // Insert suggestion into input
  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setShowCapabilities(false);
  };

  // Format bot response text
  const formatBotResponse = (text) => {
    if (!text) return "";
    
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      // Split by single newlines for lines within paragraphs
      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className="response-paragraph">
          {lines.map((line, lIndex) => {
            if (!line.trim()) return null;
            
            // Check for different formatting patterns
            if (line.includes('**') && line.includes('**')) {
              // Bold text formatting
              return (
                <div key={lIndex} className="response-line bold-line">
                  {formatInlineText(line)}
                </div>
              );
            } else if (line.match(/^\d+\./)) {
              // Numbered list items
              return (
                <div key={lIndex} className="response-line list-item numbered">
                  {formatInlineText(line)}
                </div>
              );
            } else if (line.startsWith('•') || line.startsWith('-')) {
              // Bullet points
              return (
                <div key={lIndex} className="response-line list-item bulleted">
                  {formatInlineText(line)}
                </div>
              );
            } else if (line.includes('🎉') || line.includes('✅')) {
              // Success messages
              return (
                <div key={lIndex} className="response-line success-line">
                  {formatInlineText(line)}
                </div>
              );
            } else if (line.includes('💰') || line.includes('₹')) {
              // Price information
              return (
                <div key={lIndex} className="response-line price-line">
                  {formatInlineText(line)}
                </div>
              );
            } else if (line.includes('📧') || line.includes('📍') || line.includes('🔧')) {
              // Service details
              return (
                <div key={lIndex} className="response-line service-detail">
                  {formatInlineText(line)}
                </div>
              );
            } else {
              // Regular text
              return (
                <div key={lIndex} className="response-line">
                  {formatInlineText(line)}
                </div>
              );
            }
          })}
        </div>
      );
    });
  };

  // Format inline text (handle bold, emojis, etc.)
  const formatInlineText = (text) => {
    // Handle bold text **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="bold-text">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setShowCapabilities(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setShowCapabilities(false);
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    // Add user message to conversation
    const userMessage = message.trim();
    const newMessage = { sender: "user", text: userMessage };
    setConversation(prev => [...prev, newMessage]);
    
    // Clear input field
    setMessage("");
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Call the chatbot API endpoint using the apiRequest utility
      const response = await apiRequest("/api/agent/chat", "POST", { message: userMessage });
      
      // Add bot response to conversation
      setConversation(prev => [...prev, { 
        sender: "bot", 
        text: response.reply,
        formatted: true // Flag to indicate this needs formatting
      }]);
    } catch (error) {
      console.error("Error in chatbot:", error);
      setConversation(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble right now. Please try again later.",
        formatted: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbot-widget">
      {!isOpen ? (
        <div className="chat-toggle-button" onClick={toggleChat}>
          <FaRobot />
          <span>Chat with us</span>
        </div>
      ) : (
        <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
          <div className="chat-header">
            <div className="chat-title">
              <FaRobot className="robot-icon" />
              <span>CraftConnect Assistant</span>
            </div>
            <div className="chat-controls">
              <FaInfoCircle 
                onClick={() => setShowCapabilities(!showCapabilities)} 
                className={`control-icon info-icon ${showCapabilities ? 'active' : ''}`}
                title="Show capabilities"
              />
              {isMinimized ? (
                <FaChevronUp onClick={toggleMinimize} className="control-icon" />
              ) : (
                <FaChevronDown onClick={toggleMinimize} className="control-icon" />
              )}
              <FaTimes onClick={toggleChat} className="control-icon" />
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Capabilities Panel - Collapsible */}
              {showCapabilities && (
                <div className="capabilities-panel">
                  <div className="capabilities-header">
                    <span>I can help you with:</span>
                  </div>
                  <div className="capabilities-grid">
                    {capabilities.map((cap, index) => (
                      <div 
                        key={index} 
                        className="capability-item"
                        onClick={() => handleSuggestionClick(cap.example)}
                        title={`Try: "${cap.example}"`}
                      >
                        <span className="capability-icon">{cap.icon}</span>
                        <span className="capability-text">{cap.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="quick-suggestions">
                    <span className="suggestions-label">Quick actions:</span>
                    <div className="suggestion-chips">
                      {quickSuggestions.map((suggestion, index) => (
                        <button 
                          key={index}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="chat-messages">
                {conversation.length === 0 && !showCapabilities && (
                  <div className="bot-message welcome-message">
                    <div className="response-paragraph">
                      <div className="response-line">
                        Hello! 👋 How can I help you find the right service today?
                      </div>
                      <div className="response-line welcome-hint">
                        <FaInfoCircle className="hint-icon" />
                        Click the info icon above to see what I can do!
                      </div>
                    </div>
                  </div>
                )}
                
                {conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    {msg.sender === "bot" && msg.formatted ? 
                      formatBotResponse(msg.text) : 
                      <div className="response-paragraph">
                        <div className="response-line">{msg.text}</div>
                      </div>
                    }
                  </div>
                ))}
                
                {isLoading && (
                  <div className="message bot-message loading-message">
                    <div className="response-paragraph">
                      <div className="response-line">
                        <span className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button 
                  className="send-button" 
                  onClick={handleSend}
                  disabled={isLoading || message.trim() === ""}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaChevronUp, FaChevronDown, FaPaperPlane } from "react-icons/fa";
import "./ChatbotWidget.css";
import { apiRequest } from "../api"; // Import the API utility

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
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
        text: response.reply 
      }]);
    } catch (error) {
      console.error("Error in chatbot:", error);
      setConversation(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble right now. Please try again later." 
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
              <div className="chat-messages">
                {conversation.length === 0 && (
                  <div className="bot-message welcome-message">
                    <p>Hello! How can I help you find the right service today?</p>
                  </div>
                )}
                
                {conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    {msg.text}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="message bot-message loading-message">
                    <p>Thinking...</p>
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
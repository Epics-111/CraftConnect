// src/components/Chatbot.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";
import { FaRobot, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to conversation immediately for responsive UI
    setConversation(prev => [...prev, { user: message, bot: "..." }]);
    
    try {
      const endpoint = "/api/agent/chat";
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      const data = await response.json();
      
      // Update the last message with the actual bot response
      setConversation(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { user: message, bot: data.reply } : msg
        )
      );
    } catch (error) {
      console.error("Chatbot error:", error);
      // Update with error message
      setConversation(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { user: message, bot: "Sorry, I couldn't process your request right now." } : msg
        )
      );
    }
    
    setMessage("");
  };

  const toggleChatbot = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="chatbot-toggle" onClick={toggleChatbot}>
          <FaRobot className="chatbot-icon" />
          <span>Chat with us</span>
        </div>
      )}
      
      {isOpen && (
        <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
          <div className="chatbot-header">
            <div className="d-flex align-items-center">
              <FaRobot className="me-2" />
              <h5 className="mb-0">CraftConnect Assistant</h5>
            </div>
            <div className="chatbot-controls">
              {isMinimized ? (
                <FaChevronUp onClick={toggleMinimize} className="chatbot-control-icon me-2" />
              ) : (
                <FaChevronDown onClick={toggleMinimize} className="chatbot-control-icon me-2" />
              )}
              <FaTimes onClick={toggleChatbot} className="chatbot-control-icon" />
            </div>
          </div>
          
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {conversation.length === 0 && (
                <div className="bot-message welcome-message">
                  <p>Hi there! How can I help you with CraftConnect services today?</p>
                </div>
              )}
              
              {conversation.map((msg, index) => (
                <div key={index} className="message-group">
                  <div className="user-message">{msg.user}</div>
                  <div className="bot-message">{msg.bot}</div>
                </div>
              ))}
            </div>
            
            <div className="chatbot-input">
              <input
                type="text"
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

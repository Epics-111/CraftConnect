import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaChevronUp, FaChevronDown, FaPaperPlane } from "react-icons/fa";
import "./ChatbotWidget.css";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
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
    const newMessage = { sender: "user", text: message };
    setConversation([...conversation, newMessage]);
    
    // Clear input field
    setMessage("");

    try {
      // Simulate bot response (replace with actual API call)
      setTimeout(() => {
        const botResponses = [
          "I can help you find the right service provider for your needs.",
          "Would you like to explore our popular services?",
          "You can check our verified professionals with great ratings.",
          "Is there a specific service you're looking for today?",
          "Feel free to browse through our categories or search directly."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setConversation(prev => [...prev, { sender: "bot", text: randomResponse }]);
      }, 1000);
      
      // In a real implementation, you would call your API:
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatbot`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message }),
      // });
      // const data = await response.json();
      // setConversation(prev => [...prev, { sender: "bot", text: data.reply }]);
      
    } catch (error) {
      console.error("Error in chatbot:", error);
      setConversation(prev => [...prev, { sender: "bot", text: "Sorry, I'm having trouble right now. Please try again later." }]);
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
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={handleSend}>
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
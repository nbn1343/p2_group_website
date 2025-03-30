import { useState, useRef, useEffect } from "react";

function ChatModal({ onClose, activeChatId }) {
  // State for messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      chatId: "pastor-mike",
      sender: "Pastor Mike",
      content: "Looking forward to seeing you Sunday!",
      timestamp: "2:00 PM",
      isUser: false
    },
    {
      id: 2,
      chatId: "youth-group",
      sender: "Youth Group",
      content: "Don't forget to bring snacks tomorrow",
      timestamp: "5:30 PM",
      isUser: false
    }
  ]);
  
  // State for current input value
  const [messageInput, setMessageInput] = useState("");
  
  // State for active chat
  const [activeChat, setActiveChat] = useState("pastor-mike");
  
  // Auto-scroll messages
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (activeChatId) {
      setActiveChat(activeChatId);
    }
    scrollToBottom();
  }, [messages, activeChatId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Filter messages for the active chat
  const activeChatMessages = messages.filter(
    (message) => message.chatId === activeChat
  );
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Add new user message
    const newUserMessage = {
      id: messages.length + 1,
      chatId: activeChat,
      sender: "You",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    
    setMessages([...messages, newUserMessage]);
    setMessageInput("");
    
    // Add mock response after a short delay
    setTimeout(() => {
      const mockResponses = {
        "pastor-mike": "Great! I wanted to discuss the new volunteer program with you as well.",
        "youth-group": "Thanks for the reminder! Can you bring some juice too?"
      };
      
      const newResponseMessage = {
        id: messages.length + 2,
        chatId: activeChat,
        sender: activeChat === "pastor-mike" ? "Pastor Mike" : "Youth Group",
        content: mockResponses[activeChat] || "Thanks for your message!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, newResponseMessage]);
    }, 1000);
  };
  
  // Set active chat
  const changeActiveChat = (chatId) => {
    setActiveChat(chatId);
  };
  
  return (
    <div className="chat-modal">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>Messages</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="chat-conversations">
            <div 
              className={`chat-conversation ${activeChat === "pastor-mike" ? "active" : ""}`} 
              onClick={() => changeActiveChat("pastor-mike")}
            >
              <div className="chat-avatar">P</div>
              <div className="chat-preview">
                <h4>Pastor Mike</h4>
                <p>
                  {messages
                    .filter(m => m.chatId === "pastor-mike")
                    .slice(-1)[0]?.content || ""}
                </p>
              </div>
              <div className="chat-time">
                {messages
                  .filter(m => m.chatId === "pastor-mike")
                  .slice(-1)[0]?.timestamp || ""}
              </div>
            </div>
            <div 
              className={`chat-conversation ${activeChat === "youth-group" ? "active" : ""}`} 
              onClick={() => changeActiveChat("youth-group")}
            >
              <div className="chat-avatar">Y</div>
              <div className="chat-preview">
                <h4>Youth Group</h4>
                <p>
                  {messages
                    .filter(m => m.chatId === "youth-group")
                    .slice(-1)[0]?.content || ""}
                </p>
              </div>
              <div className="chat-time">
                {messages
                  .filter(m => m.chatId === "youth-group")
                  .slice(-1)[0]?.timestamp || ""}
              </div>
            </div>
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-main-header">
            <h3>{activeChat === "pastor-mike" ? "Pastor Mike" : "Youth Group"}</h3>
          </div>
          <div className="chat-messages">
            {activeChatMessages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isUser ? "message-user" : "message-other"}`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
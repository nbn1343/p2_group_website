import { useState, useRef, useEffect } from "react";

function ChatModal({ onClose, activeChatId, activeChatGroup, groups, onChangeChat }) {
  // State for messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      chatId: "Youth Ministry",
      sender: "Youth Ministry",
      content: "Welcome to the Youth Ministry chat!",
      timestamp: "2:00 PM",
      isUser: false
    },
    {
      id: 2,
      chatId: "Worship Team",
      sender: "Worship Team",
      content: "Welcome to the Worship Team chat!",
      timestamp: "2:00 PM",
      isUser: false
    },
    {
      id: 3,
      chatId: "Bible Study",
      sender: "Bible Study",
      content: "Don't forget to read Ephesians 2 for our next meeting.",
      timestamp: "5:30 PM",
      isUser: false
    },
    {
      id: 4,
      chatId: "Outreach Committee",
      sender: "Outreach Committee",
      content: "Planning meeting tomorrow at 6 PM.",
      timestamp: "11:45 AM",
      isUser: false
    }
  ]);
  
  // State for current input value
  const [messageInput, setMessageInput] = useState("");
  
  // Auto-scroll messages
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);
  
  // Filter messages for the active chat
  const activeChatMessages = messages.filter(
    (message) => message.chatId === activeChatId
  );
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;
    const newUserMessage = {
      id: messages.length + 1,
      chatId: activeChatId,
      sender: "You",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    setMessages([...messages, newUserMessage]);
    setMessageInput("");
    setTimeout(() => {
      const mockResponses = {
        "Youth Ministry": "Got it! We'll see you at the next meeting.",
        "Worship Team": "Thanks for your message! See you at rehearsal.",
        "Bible Study": "Great insight! Let's discuss that more next time.",
        "Outreach Committee": "Thanks for volunteering! We appreciate your help."
      };
      const newResponseMessage = {
        id: messages.length + 2,
        chatId: activeChatId,
        sender: activeChatId,
        content: mockResponses[activeChatId] || "Thanks for your message!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      setMessages(prevMessages => [...prevMessages, newResponseMessage]);
    }, 1000);
  };

  // Helper for group color
  const getGroupColor = (groupName) => {
    const group = groups.find(g => g.name === groupName);
    return group ? group.color : "#ccc";
  };

  return (
    <div
      className="chat-modal"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "500px",
        maxWidth: "100vw",
        height: "100vh",
        background: "#212b36",
        zIndex: 1000,
        boxShadow: "-2px 0 24px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        className="chat-container"
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          width: "100%"
        }}
      >
        {/* Sidebar */}
        <div
          className="chat-sidebar"
          style={{
            width: "300px",
            backgroundColor: "#1a2530",
            borderRight: "1px solid #2d3a43",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            className="chat-header"
            style={{
              padding: "15px",
              borderBottom: "1px solid #2d3a43",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h3 style={{ margin: 0, color: "#FFD166", fontSize: 18 }}>Messages</h3>
            <button
              className="close-button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
          <div className="chat-conversations" style={{ flex: 1 }}>
            {groups.map(group => (
              <div
                key={group.id}
                className={`chat-conversation ${activeChatId === group.name ? "active" : ""}`}
                onClick={() => onChangeChat(group)}
                style={{
                  padding: "12px 15px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  borderLeft: activeChatId === group.name ? `4px solid ${group.color}` : "4px solid transparent",
                  backgroundColor: activeChatId === group.name ? "#2d3a43" : "transparent"
                }}
              >
                <div
                  className="chat-avatar"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: group.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    color: "#1a2530",
                    fontWeight: "bold"
                  }}
                >
                  {group.name.charAt(0)}
                </div>
                <div className="chat-preview" style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: "0 0 4px 0", color: group.color, fontSize: 15 }}>{group.name}</h4>
                  <p style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#aaa",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "110px"
                  }}>
                    {messages
                      .filter(m => m.chatId === group.name)
                      .slice(-1)[0]?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main chat area */}
        <div
          className="chat-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#212b36"
          }}
        >
          {activeChatGroup ? (
            <>
              <div
                className="chat-main-header"
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #2d3a43",
                  backgroundColor: "#1a2530",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div
                  className="group-icon"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: activeChatGroup.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1a2530",
                    fontWeight: "bold"
                  }}
                >
                  {activeChatGroup.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: activeChatGroup.color }}>{activeChatGroup.name}</h3>
                  <span style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    {activeChatGroup.members} members • {activeChatGroup.meetingTime}, {activeChatGroup.location}
                  </span>
                </div>
              </div>

              <div
                className="chat-messages"
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {activeChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.isUser ? "message-user" : "message-other"}`}
                    style={{
                      alignSelf: message.isUser ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      marginBottom: "10px"
                    }}
                  >
                    <div
                      className="message-content"
                      style={{
                        backgroundColor: message.isUser ? "#3a4650" : activeChatGroup.color + "20",
                        borderLeft: message.isUser ? "none" : `3px solid ${activeChatGroup.color}`,
                        padding: "10px 15px",
                        borderRadius: "8px",
                        color: message.isUser ? "white" : "#fff"
                      }}
                    >
                      <p style={{ margin: 0 }}>{message.content}</p>
                      <span
                        className="message-time"
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          textAlign: "right",
                          marginTop: "5px",
                          color: message.isUser ? activeChatGroup.color : "#aaa"
                        }}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="chat-input-container"
                onSubmit={handleSendMessage}
                style={{
                  padding: "15px",
                  borderTop: "1px solid #2d3a43",
                  display: "flex",
                  backgroundColor: "#1a2530"
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="chat-input"
                  style={{
                    flexGrow: 1,
                    padding: "10px 15px",
                    backgroundColor: "#2d3a43",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    marginRight: "10px"
                  }}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  style={{
                    backgroundColor: activeChatGroup.color,
                    color: "#1a2530",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#aaa"
              }}
            >
              Select a group to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;

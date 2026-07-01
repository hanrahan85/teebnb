import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'host' | 'guest';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  hostName: string;
  propertyName: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar: string;
}

const Inbox = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      hostName: 'Marcus D.',
      propertyName: 'The Fairway House',
      lastMessage: 'Looking forward to your stay!',
      lastMessageTime: '2 hours ago',
      avatar: 'MD',
    },
    {
      id: '2',
      hostName: 'Sarah K.',
      propertyName: 'Old Course Loft',
      lastMessage: 'Check-in is at 3pm',
      lastMessageTime: '1 day ago',
      avatar: 'SK',
    },
  ];

  const conversationMessages: Record<string, Message[]> = {
    '1': [
      { id: '1', sender: 'host', text: 'Hi! Thanks for booking The Fairway House', timestamp: '10:00 AM' },
      { id: '2', sender: 'guest', text: 'Thanks! We\'re excited to stay there', timestamp: '10:15 AM' },
      { id: '3', sender: 'host', text: 'Looking forward to your stay!', timestamp: '10:20 AM' },
    ],
    '2': [
      { id: '1', sender: 'host', text: 'Hello! Just confirming your booking at Old Course Loft', timestamp: 'Yesterday' },
      { id: '2', sender: 'guest', text: 'Yes, confirmed! When is check-in?', timestamp: 'Yesterday' },
      { id: '3', sender: 'host', text: 'Check-in is at 3pm', timestamp: 'Yesterday' },
    ],
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const messages = conversationMessages[selectedConversationId] || [];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #EDEBE1',
      }}>
        <span style={{display:'grid',placeItems:'center',width:'36px',height:'36px',borderRadius:'50%',background:'#0B1F17',boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)',marginBottom:'16px'}}>
          <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:700,fontSize:'16px',color:'#C8A24B',lineHeight:1}}>T</span>
        </span>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: '24px',
          color: '#0B1F17',
          margin: 0,
        }}>
          Inbox
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Left Panel - Conversation List */}
        <div style={{
          background: '#FFFFFF',
          borderRight: '1px solid #EDEBE1',
          overflowY: 'auto',
        }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              style={{
                width: '100%',
                padding: '16px',
                background: selectedConversationId === conversation.id ? '#F0FDF4' : '#FFFFFF',
                border: 'none',
                borderLeft: selectedConversationId === conversation.id ? '4px solid #C7F04A' : '4px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                borderBottom: '1px solid #EDEBE1',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#0B1F17',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}>
                    {conversation.avatar}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    color: '#0B1F17',
                    margin: '0 0 4px 0',
                  }}>
                    {conversation.hostName}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#5C6B62',
                    margin: '0 0 4px 0',
                  }}>
                    {conversation.propertyName}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#A1A9A8',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {conversation.lastMessage}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#D1D5DB',
                    margin: '4px 0 0 0',
                  }}>
                    {conversation.lastMessageTime}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Panel - Messages */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#F6F5EF',
        }}>
          {/* Messages Header */}
          {selectedConversation && (
            <div style={{
              padding: '16px 24px',
              background: '#FFFFFF',
              borderBottom: '1px solid #EDEBE1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{
                  fontSize: '16px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  margin: 0,
                }}>
                  {selectedConversation.propertyName}
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#5C6B62',
                  margin: '4px 0 0 0',
                }}>
                  with {selectedConversation.hostName}
                </p>
              </div>
              <a
                href={`/property/1`}
                style={{
                  fontSize: '13px',
                  color: '#15794C',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                View listing
              </a>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'host' ? 'flex-start' : 'flex-end',
                  marginBottom: '8px',
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  background: message.sender === 'host' ? '#FFFFFF' : '#C7F04A',
                  color: message.sender === 'host' ? '#0B1F17' : '#0B1F17',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Banner */}
          <div style={{
            padding: '12px 24px',
            background: '#DBEAFE',
            borderTop: '1px solid #EDEBE1',
            fontSize: '13px',
            color: '#0C4A6E',
            fontFamily: "'Hanken Grotesk', sans-serif",
            textAlign: 'center',
          }}>
            Messaging is coming soon. Contact hosts directly via email for now.
          </div>

          {/* Message Input */}
          <div style={{
            padding: '16px 24px',
            background: '#FFFFFF',
            borderTop: '1px solid #EDEBE1',
            display: 'flex',
            gap: '12px',
          }}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              disabled
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #EDEBE1',
                borderRadius: '8px',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '14px',
                opacity: 0.5,
              }}
            />
            <button
              disabled
              style={{
                padding: '12px 16px',
                background: '#D1D5DB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;

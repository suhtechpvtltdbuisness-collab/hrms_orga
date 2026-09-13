import React from 'react';
import ChatWorkspace from '../../../features/messages/ChatWorkspace';

export default function EmployeeMessages() {
  return <div className="mx-auto max-w-6xl">
    <ChatWorkspace title="Messages" subtitle="Chat with your manager, HR and your project team." />
  </div>;
}

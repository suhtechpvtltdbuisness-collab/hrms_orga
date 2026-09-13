import React from 'react';
import ChatWorkspace from '../../../features/messages/ChatWorkspace';

export default function Messages() {
  return <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
    <ChatWorkspace title="Messages" subtitle="Direct and group conversations with everyone in your organization." />
  </div>;
}

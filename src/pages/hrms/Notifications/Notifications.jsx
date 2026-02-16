
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'New', 'Unread'];

  const notifications = [
    {
      id: 1,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
    {
      id: 2,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
    {
      id: 3,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
    {
      id: 4,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
    {
      id: 5,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
      {
      id: 6,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
     {
      id: 7,
      title: 'New Team Member Assigned',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting',
      type: 'assignment',
    },
  ];

  return (
      <div className="bg-white mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <div className="px-6 pt-6 shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px] text-[#7D1EDB] mb-6 font-normal">
          <img src="/images/arrow_left_alt.svg" alt="Back" className="w-[12px] h-[8px] cursor-pointer" onClick={() => navigate('/hrms')} />
          <span className="cursor-pointer hover:text-purple-700" onClick={() => navigate('/hrms')}>Dashboard</span>
          <ChevronRight size={16} className="text-[#667085]" />
          <span className="text-[#667085]">Notifications</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Poppins", sans-serif' }}>Notifications</h1>
          <button className="bg-[#7D1EDB] text-white px-6 h-[42px] rounded-full text-[18px] font-semibold hover:bg-[#6c1ac0] transition-colors flex items-center justify-center">
            Mark All As Read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 text-[18px] font-medium transition-colors relative ${
                activeTab === tab ? 'text-[#1E1E1E]' : 'text-[#757575]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1E1E1E]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between cursor-pointer hover:bg-[#fbfafc] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-18 h-16 bg-[#EDEDED] rounded-[4px] flex items-center justify-center shrink-0">
                   <img src="/images/user.svg" alt="User" className="w-4 h-4" onError={(e) => {e.target.style.display='none'}} />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E]  mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-[14px] text-[#757575] font-normal leading-tight">
                    {notification.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button className="px-4 h-[42px] bg-[#7D1EDB] text-white text-[18px] font-semibold rounded-full hover:bg-[#6c1ac0] transition-colors min-w-[100px] flex items-center justify-center">
                  View
                </button>
                <button className="px-5 h-[42px] border border-[#7D1EDB] text-[#7D1EDB] text-[18px] font-semibold rounded-full hover:bg-purple-50 transition-colors min-w-[100px] flex items-center justify-center">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

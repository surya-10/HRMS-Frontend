import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";

import {
  Home,
  Users,
  UserMinus,
  Ticket,
  Clock,
  UserCircle,
  CalendarDays,
  MessageSquare,
  Phone,
  Info,
  Menu,
  X
} from "lucide-react";
import { useLocation } from 'react-router-dom';

const HRMSDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  let location = useLocation();
  console.log(location.state)

  // Sample data (same as before)
  const stats = {
    totalEmployees: 156,
    activeEmployees: 142,
    onLeaveEmployees: 14,
    totalTickets: 23
  };

  const meetings = [
    { title: "Team Standup", time: "10:00 AM", attendees: 8 },
    { title: "Project Review", time: "02:00 PM", attendees: 5 },
    { title: "HR Policy Meeting", time: "04:30 PM", attendees: 4 }
  ];

  const absentEmployees = [
    { name: "John Doe", reason: "Sick Leave" },
    { name: "Sarah Wilson", reason: "Vacation" },
    { name: "Mike Johnson", reason: "Personal Leave" }
  ];

  const employees = [
    { name: "Emma Thompson", role: "Frontend Developer", email: "emma.t@company.com" },
    { name: "James Wilson", role: "UI/UX Designer", email: "james.w@company.com" },
    { name: "Lisa Anderson", role: "Project Manager", email: "lisa.a@company.com" },
    { name: "Robert Chen", role: "Backend Developer", email: "robert.c@company.com" },
    { name: "Maria Garcia", role: "HR Manager", email: "maria.g@company.com" }
  ];

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: UserCircle, label: 'Profile' },
    { icon: CalendarDays, label: 'Leave Request' },
    { icon: Clock, label: 'Meetings' },
    { icon: MessageSquare, label: 'Message' },
    { icon: Phone, label: 'Contact Us' },
    { icon: Info, label: 'About' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md min-w-screen"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={` 
      w-[30%]
        fixed lg:static inset-y-0 left-0 z-40
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-gray-200 p-4
      `}>
        <div className="flex items-center justify-center h-14 border-b mb-4">
          <h1 className="text-xl font-bold text-gray-800">HRMS Dashboard</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      
    </div>
  );
};

export default HRMSDashboard;
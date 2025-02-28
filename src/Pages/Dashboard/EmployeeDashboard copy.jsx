import React, { useState } from 'react';
import { Card, CardContent } from "../../Components/ui/card";
import Calendar from 'react-calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Clock } from 'lucide-react';

const EmployeeDashboard1 = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data for working hours chart
  const workingHoursData = [
    { name: 'Mon', work: 8, break: 1 },
    { name: 'Tue', work: 7.5, break: 1.5 },
    { name: 'Wed', work: 8, break: 1 },
    { name: 'Thu', work: 7, break: 2 },
    { name: 'Fri', work: 8, break: 1 },
  ];

  // Sample meetings data
  const meetings = [
    { title: 'Team Standup', time: '10:00 AM', date: '2024-12-24' },
    { title: 'Project Review', time: '02:00 PM', date: '2024-12-24' },
    { title: 'Client Meeting', time: '04:00 PM', date: '2024-12-25' },
  ];

  // Sample recent activities
  const recentActivities = [
    {
      title: 'CRM Notification',
      time: '10 Mins Ago',
      description: '3 days left to update customer profiles with the new CRM tools',
      source: 'MediaTek'
    },
    {
      title: 'System Update',
      time: '04 Mins Ago',
      description: 'Successfully integrated new HRM features into the system',
      source: 'MediaTek'
    },
    {
      title: 'Team Update',
      time: '30 Mins Ago',
      description: 'Team collaboration improved with new HRM tools',
      source: 'MediaTek'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Tickets Card */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Tickets</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resolved Tickets Card */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Tickets Resolved</p>
                <h3 className="text-2xl font-bold">18</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clock In/Out Card */}
        <Card className="bg-white col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Working Time</p>
                <h3 className="text-2xl font-bold">07:45:32</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsClockedIn(!isClockedIn)}
                  className={`px-4 py-2 rounded-lg ${
                    isClockedIn
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Calendar Section */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Meetings Section */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Today's Meetings</h3>
            <div className="space-y-4">
              {meetings.map((meeting, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-gray-500">{meeting.time}</p>
                  </div>
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours Chart */}
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
          <div className="h-64">
            <BarChart
              width={800}
              height={250}
              data={workingHoursData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="work" fill="#3B82F6" name="Work" />
              <Bar dataKey="break" fill="#EF4444" name="Break" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Card */}
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Attendance Overview</h3>
            <div className="flex gap-2">
              <select
                className="border rounded-md p-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                className="border rounded-md p-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Total Leaves</p>
              <p className="text-xl font-bold">24</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Leave Taken</p>
              <p className="text-xl font-bold">12</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Pending Approval</p>
              <p className="text-xl font-bold">2</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Working Days</p>
              <p className="text-xl font-bold">18</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Loss of Pay</p>
              <p className="text-xl font-bold">0</p>
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Apply Leave
          </button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-gray-600 mt-1">{activity.description}</p>
                <p className="text-sm text-gray-500 mt-1">Source: {activity.source}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard1;
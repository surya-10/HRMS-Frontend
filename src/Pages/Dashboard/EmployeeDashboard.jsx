import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../../Components/ui/card";
import Calendar from 'react-calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Clock, CheckCircle, Calendar as CalendarIcon, Bell, UserRound, UserRoundMinus, ShieldHalf, UserCheck, PanelsTopLeft, User, UserPlus } from 'lucide-react';
import EmployeeRoles from '../AdminPages/EmployeeRoles';
import { Link, useNavigate } from 'react-router-dom';
import AttendenceRocord from '../AdminPages/PieChart';
import CheckInHistory from '../AdminPages/components/checkin History/CheckInHistory';
import WeeklyWorkingHours from '../AdminPages/WeeklyWorkingHours';
import EmployeeByDepartment from './EmployeeByDepartment';
import LeaveRecords from '../AdminPages/LeaveRecords';
import { useContext } from 'react';
import { AuthContext } from '../../Router';
import axios from 'axios';
import ChatBot from '../../Components/chatbot';
import AdminAgent from '../../Components/Admin chatbot';
import AllEmployees from '../AdminPages/AllEmployees';


const EmployeeDashboard = () => {
  const userName = JSON.parse(localStorage.getItem("data"));
  const [activeCount, setActiveCount] = useState(0);
  const [todayLeaves, setTodayLEaves] = useState(0);
  const userId = localStorage.getItem("userId")

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendence, setAttendence] = useState([])
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const workingHoursData = [
    { name: 'Mon', work: 8, break: 1 },
    { name: 'Tue', work: 7.5, break: 1.5 },
    { name: 'Wed', work: 8, break: 1 },
    { name: 'Thu', work: 7, break: 2 },
    { name: 'Fri', work: 8, break: 1 },
  ];

  useEffect(() => {
    if (userName.role.role_value == "admin") {
      const employees = userName.user.filter((data) => !data.is_deleted).length;
      console.log(employees)
      setTodayLEaves(userName.leaveCounts)
      setActiveCount(employees)
    }

  }, [userName])

 

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
    <div className="p-2 bg-[#EEECFF] min-h-screen">
       <div className='h-[300px] top-[50%] fixed right-2 bottom-[80px] z-[1000]'>
                <AdminAgent />
            </div>
      <p className='py-2 text-gray-800 text-xl font-[600]'>Dashboard</p>
      <div className='bg-white rounded-lg h-[100px] my-4 flex justify-start gap-2 ps-2 items-center'>
        <p className='p-7 bg-[#a2a8d3] rounded-full'>
          <User className='text-[30px] w-full ' />
        </p>
        <p className='font-semibold text-2xl'>Welcome back, {userName.username} !</p>
      </div>
      {/* <div className="flex flex-row flex-wrap gap-4 grow">
        <div className="bg-white rounded-xl w-72 flex flex-grow ps-4">
          <div className="h-28 flex items-center justify-center">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-4'>
                <div className='p-5 bg-[#F0EFFF] rounded-full'>
                  <UserRound className='text-[#6C5FFC]' />
                </div>
                <div>
                  <p className="text-gray-500 font-[600]">Total Employees</p>
                  <h3 className="text-2xl font-[500] ">{userName.user.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="bg-white rounded-xl w-72 flex flex-grow ps-4" >
          <div className="h-28 flex items-center justify-center">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-4'>
                <div className='p-5 bg-[#F0EFFF] rounded-full '>
                  <UserCheck className='text-[#6C5FFC]' />
                </div>
                <div>
                  <p className="text-gray-500 font-[600]">Full time Employees</p>
                  <h3 className="text-2xl font-[500] ">{activeCount}</h3>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="bg-white rounded-xl w-72 flex flex-grow ps-4" >
          <div className="h-28 flex items-center justify-center">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-4'>
                <div className='p-5 bg-[#F0EFFF] rounded-full '>
                  <UserPlus className='text-[#6C5FFC]' />
                </div>
                <div>
                  <p className="text-gray-500 font-[600]">Part-time Employees</p>
                  <h3 className="text-2xl font-[500] ">{}</h3>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="bg-white rounded-xl w-72 flex flex-grow ps-4">
          <div className="h-28 flex items-center justify-center">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-4'>
                <div className='p-5 bg-[#F0EFFF] rounded-full'>
                  <UserRoundMinus className='text-[#6C5FFC]' />
                </div>
                <div>
                  <p className="text-gray-500 font-[600]">Total Leave</p>
                  <h3 className="text-2xl font-[500] ">{todayLeaves}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div>
        <div className='w-full mt-4'>
          <div className='flex flex-row gap-5 flex-wrap '>
            <div className='flex w-full gap-1 flex-wrap justify-between'>
              {/* <EmployeeByDepartment />
              <CheckInHistory /> */}
              <AllEmployees/>
            </div>
            <div className="flex  xl:flex-row w-full gap-4 flex-wrap lg:flex-col justify-evenly flex-col">
              <div className="flex-1 max-w-[47%] min-w-[350px] mt-5">
                <AttendenceRocord />
              </div>
              <div className="flex-1 lg:w-[100%] h-[300px] mt-5">
                <WeeklyWorkingHours />
              </div>
            </div>
            <div className='w-full mt-[-40px] flex flex-wrap gap-5 mt-[10px]'>
              {/* <LeaveRecords /> */}
              {/* <EmployeeRoles /> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
      </div> */}

      {/* <Card className="bg-white mb-6">
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
      </Card> */}
      {/* <Card className="bg-white mb-6">
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
          {/* <div className="grid grid-cols-5 gap-4 mb-4">
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
      </Card> */}
      {/* <Card className="bg-white">
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
      </Card> */}
    </div>
  );
};

export default EmployeeDashboard;
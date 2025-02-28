import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const years = [2024];

const AttendenceHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [filterOption, setFilterOption] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');
    const managerId = localStorage.getItem('userId');
    const [allAttendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [clockInData, setClockInData] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    // console.log("allAttendanceData", allAttendanceData)
    const designationColors = {
        Manager: { bg: 'bg-blue-200', text: 'text-blue-700' },
        Developer: { bg: 'bg-green-200', text: 'text-green-700' },
        HR: { bg: 'bg-yellow-200', text: 'text-yellow-700' },
        // Add more roles as needed
    };
    const [leaveRecords, setLeaveRecords] = useState([])


    useEffect(()=>{
        const leaveRecords = localStorage.getItem("leaveRecords");
        if(leaveRecords){
            
        }
    }, []);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3002/api/routes/attendence/get-all-checkin/${managerId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                console.log(response.data.data)
                const result = await getAllTodaysRecords(response.data.data)
                if (response.data && response.data.data) {
                    setAttendanceData(response.data.data);
                    const extractedEmployees = response.data.data.map((item) => ({
                        id: item.user_id,
                        name: item.userName,
                    }));
                    setEmployees([{ id: 'all', name: 'All Employees' }, ...extractedEmployees]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAttendanceData();
    }, [managerId]);

    const handleEmployeeChange = (employeeName) => {
        setSelectedEmployee(employeeName);
        setIsDropdownOpen(false);
    };

    const getAllTodaysRecords = (data) => {
        let userWithData = [];

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].attendance.length; j++) {
                const storedDate = new Date(data[i].attendance[j].date);
                const today = new Date();
                const storedDateString = storedDate.toISOString().split("T")[0];
                const todayString = today.toISOString().split("T")[0];

                if (storedDateString === todayString) {
                    let obj = {};

                    if (data[i].attendance[j].logHistory.length === 2) {
                        obj.startTime = data[i].attendance[j].logHistory[0].startTime;
                        obj.endTime = data[i].attendance[j].logHistory[1].endTime;
                        obj.status = "Completed";
                    } else if (data[i].attendance[j].logHistory.length === 1) {
                        obj.startTime = data[i].attendance[j].logHistory[0].startTime;
                        obj.endTime = "";
                        obj.status = "OnGoing";
                    }

                    obj.userId = data[i]._id;
                    obj.userName = data[i].userName;

                    userWithData.push(obj);
                }
                else{

                }
            }
        }

        console.log(userWithData);
    };


    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterOption(value);
        if (value === 'custom') {
            setTempStartDate(startDate || '');
            setTempEndDate(endDate || '');
            setShowCustomRange(true);
        } else {
            resetCustomRange();
        }
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        const hasResults = employees.some(emp =>
            emp.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setNoResults(searchValue && !hasResults);
    };

    useEffect(() => {
        let filtered = [...clockInData];

        if (selectedEmployee) {
            filtered = filtered.filter(item => item.name === selectedEmployee);
        }

        const today = new Date();
        const todayStr = today.toLocaleDateString();

        switch (filterOption) {
            case 'daily':
                filtered = filtered.filter(item => item.date === todayStr);
                break;
            case 'weekly':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
                break;
            case 'monthly':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                filtered = filtered.filter(item => new Date(item.date) >= monthAgo);
                break;
            case 'custom':
                if (startDate) {
                    filtered = filtered.filter(item => new Date(item.date) >= new Date(startDate));
                }
                if (endDate) {
                    filtered = filtered.filter(item => new Date(item.date) <= new Date(endDate));
                }
                break;
            default:
                break;
        }

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredData(filtered);
    }, [selectedEmployee, filterOption, startDate, endDate, clockInData]);

    const filterAttendanceData = () => {
        let filtered = [...allAttendanceData];

        if (selectedEmployee && selectedEmployee !== 'All Employees') {
            filtered = filtered.filter(employee => employee.userName === selectedEmployee);
        }

        filtered = filtered.map(employee => {
            const filteredAttendance = employee.attendance.filter(record => {
                const recordDate = new Date(record.date);

                if (filterType === 'monthly') {
                    const currentDate = new Date();
                    return recordDate.getMonth() === currentDate.getMonth() &&
                        recordDate.getFullYear() === currentDate.getFullYear();
                }

                if (filterType === 'custom' && dateRange.startDate && dateRange.endDate) {
                    const start = new Date(dateRange.startDate);
                    const end = new Date(dateRange.endDate);
                    return recordDate >= start && recordDate <= end;
                }

                return true;
            });

            return {
                ...employee,
                attendance: filteredAttendance
            };
        });

        return filtered;
    };

    const filteredAttendanceData = filterAttendanceData();

    return (
        <div className="min-h-screen bg-gray-50 p-4 rounded">
            <ToastContainer />
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Clock In History</h2>
                <p className="text-gray-600">Track employee attendance and working hours</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <div>
                        <p className='text-lg'>Attendance records</p>
                        <p className="text-fuchsia-800 text-sm">View all employees' attendance records</p>
                    </div>
                </div>
                <div className='flex gap-2'>

                    <div className="relative w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center gap-2">Select Employee</span>
                        </label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <span className={selectedEmployee ? 'text-gray-900' : 'text-gray-500'}>
                                {selectedEmployee || 'All Employees'}
                            </span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                {employees.map(employee => (
                                    <div
                                        key={employee.id}
                                        onClick={() => handleEmployeeChange(employee.name)}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {employee.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter Type
                            </label>
                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Records</option>
                                <option value="monthly">Current Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {filterType === 'custom' && (
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded-lg px-4 py-2"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            startDate: e.target.value
                                        }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded-lg px-4 py-2"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            endDate: e.target.value
                                        }))}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Clock In
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Clock Out
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAttendanceData.map((employee) => (
                                employee.attendance.map((record, index) => (
                                    <tr key={`${employee._id}-${index}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {employee.userName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(record.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {record.logHistory[0]?.startTime || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {record.logHistory[1]?.endTime || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.logHistory.length === 2
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {record.logHistory.length === 2 ? 'Completed' : 'In Progress'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
           
        </div>
    );
};

export default AttendenceHistory;


{/* <div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10  min-h-screen">
    {filteredAttendanceData.map((employee, ind) =>
        employee.attendance.map((record, index) => {
            return (
                <div
                    key={index}
                    className="relative w-[380px] rounded-2xl overflow-hidden shadow-xl bg-white p-6 border border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                   
                    <div className=" inset-0 bg-gradient-to-r from-blue-50 to-gray-100 opacity-20"></div>

                 
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-gray-800">{employee.userName}</p>
                        <select className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-400">
                            <option>Today</option>
                            <option>Last 7 days</option>
                        </select>
                    </div>

                   
                    <div className="flex justify-center my-4">
                        <div className="relative">
                            <img
                                src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg"
                                className="w-28 h-28 rounded-full border-4 border-white shadow-md transition-transform duration-300 hover:scale-110"
                                alt="Employee"
                            />
                            <span
                                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ${record.status === "Present" ? "bg-green-500" : "bg-red-500"
                                    }`}
                            ></span>
                        </div>
                    </div>

                 
                    <div className=" space-y-2">
                        <p className="text-gray-500 text-sm">
                            <span className="font-medium">📅 Date:</span> {record.date}
                        </p>
                        <p className="text-gray-500 text-sm">
                            <span className="font-medium">⏳ Hours:</span> {record.hours} hrs
                        </p>
                    </div>

                  
                    <div className="flex justify-center mt-4">
                        <span
                            className={`px-5 py-2 text-sm font-semibold rounded-full shadow-md ${record.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {record.status === "Present" ? "✔ Present" : "❌ Absent"}
                        </span>
                    </div>
                </div>
            );
        })
    )}
</div>

</div> */}
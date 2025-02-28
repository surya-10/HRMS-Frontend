import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import LoadingAnimation from '../../../../Components/Layout/animations/LoadingAnimation';
import DotsLoader from '../../../../Components/Layout/animations/dotAnimations';
import { Clock9 } from 'lucide-react';
import { colorPairs } from '../../../ManagerPages/ManagerHome';
// import 'react-toastify/dist/ReactToastify.css';

const AttendenceRecords = () => {
    const generateDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toLocaleDateString();
    };
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);

    // Add these new state variables
    const [filterType, setFilterType] = useState('all'); // 'all', 'monthly', 'custom'
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios(`http://localhost:3002/api/routes/attendence/get-loginHistory/${userId}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    }
                });
                console.log(response)
                if (response.data.message == "Login history not found") {
                    setShow(true)
                }
                const filterReccords = await getRecords(response.data.data);
                setAttendanceData(filterReccords);
                setShow(true);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                //     // toast.error('Error fetching attendance data. Please try again later.', {
                //         position: "top-right",
                //         autoClose: 5000,
                //     });
                // }
            }
        }
        fetchAttendanceData()
    }, [userId]);

    const getRecords = (data) => {
        console.log(data);
        const records = [];
        for (let i = 0; i < data.length; i++) {
            const record = {
                date: data[i].date,
                startTime: null,
                endTime: null,
            };
            for (let j = 0; j < data[i].logHistory.length; j++) {
                if (data[i].logHistory[j].type == "checkIn") {
                    record.startTime = data[i].logHistory[j].startTime;
                }
                else {
                    record.endTime = data[i].logHistory[j].endTime;
                }
            }
            let colors = { color: colorPairs[i % colorPairs.length].color, bgColor: colorPairs[i % colorPairs.length].bgColor };
            record.colors = colors;
            records.push(record);
        }
        return records;
    };

    const [filterOption, setFilterOption] = useState('daily');
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [employeeClockData] = useState([
        {
            date: generateDate(0),
            startTime: '9:00 AM',
            endTime: '8:30 PM', // 10.5 hours with breaks
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(1),
            startTime: '8:30 AM',
            endTime: '8:00 PM', // 10.5 hours with breaks
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(2),
            startTime: '9:00 AM',
            endTime: '8:30 PM', // 10.5 hours with breaks
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:30 PM', end: '2:30 PM', type: 'Lunch Break' },
                { start: '4:15 PM', end: '4:30 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(3),
            startTime: '9:30 AM',
            endTime: '6:00 PM', // Less than 10 hours - keeping one for demonstration
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(4),
            startTime: '8:45 AM',
            endTime: '8:15 PM', // 10.5 hours with breaks
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(5),
            startTime: '9:00 AM',
            endTime: '5:30 PM', // Less than 10 hours - keeping one for demonstration
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '3:30 PM', end: '3:45 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(6),
            startTime: '8:30 AM',
            endTime: '8:00 PM',
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(7),
            startTime: '8:30 AM',
            endTime: '7:00 PM',
            status: 'Present',
            breaks: [
                { start: '10:45 AM', end: '11:00 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(8),
            startTime: '9:00 AM',
            endTime: '7:30 PM',
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(9),
            startTime: '9:15 AM',
            endTime: '7:45 PM',
            status: 'Present',
            breaks: [
                { start: '11:15 AM', end: '11:30 AM', type: 'Tea Break' },
                { start: '1:30 PM', end: '2:30 PM', type: 'Lunch Break' },
                { start: '4:15 PM', end: '4:30 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(10),
            startTime: '9:00 AM',
            endTime: '7:30 PM',
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(11),
            startTime: '8:45 AM',
            endTime: '5:15 PM', // Less than 10 hours
            status: 'Present',
            breaks: [
                { start: '10:45 AM', end: '11:00 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '3:45 PM', end: '4:00 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(14),
            startTime: '9:00 AM',
            endTime: '7:30 PM',
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        },
        {
            date: generateDate(15),
            startTime: '9:00 AM',
            endTime: '7:30 PM',
            status: 'Present',
            breaks: [
                { start: '11:00 AM', end: '11:15 AM', type: 'Tea Break' },
                { start: '1:00 PM', end: '2:00 PM', type: 'Lunch Break' },
                { start: '4:00 PM', end: '4:15 PM', type: 'Tea Break' }
            ]
        }
    ]);

    // Sample productivity data (0-100%)
    const productivityData = {
        daily: 85,
        weekly: 90,
        monthly: 88
    };

    // Add new state for sort order
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterOption(value);
        if (value === 'custom') {
            setTempStartDate(dateRange.startDate || '');
            setTempEndDate(dateRange.endDate || '');
            setShowCustomRange(true);
        } else {
            resetCustomRange();
        }
    };

    const resetCustomRange = () => {
        setTempStartDate('');
        setTempEndDate('');
        setDateRange({
            startDate: '',
            endDate: ''
        });
    };

    const handleApplyCustomRange = () => {
        setDateRange({
            startDate: tempStartDate,
            endDate: tempEndDate
        });
        setShowCustomRange(false);
        toast.success('Date range applied successfully!', {
            position: "top-right",
            autoClose: 2000,
        });
    };

    // Calculate total work hours
    const calculateWorkHours = (startTime, endTime, breaks) => {
        const start = new Date(`2024/01/01 ${startTime}`);
        const end = new Date(`2024/01/01 ${endTime}`);
        let totalHours = (end - start) / (1000 * 60 * 60);

        // Subtract break times
        if (breaks && breaks.length > 0) {
            const breakMinutes = breaks.reduce((total, breakItem) => {
                const breakStart = new Date(`2024/01/01 ${breakItem.start}`);
                const breakEnd = new Date(`2024/01/01 ${breakItem.end}`);
                return total + (breakEnd - breakStart) / (1000 * 60);
            }, 0);
            totalHours -= breakMinutes / 60;
        }

        return totalHours.toFixed(2);
    };

    // Add a function to calculate total break time
    const calculateBreakTime = (breaks) => {
        if (!breaks || breaks.length === 0) return '0 min';

        const totalMinutes = breaks.reduce((total, breakItem) => {
            const start = new Date(`2024/01/01 ${breakItem.start}`);
            const end = new Date(`2024/01/01 ${breakItem.end}`);
            return total + (end - start) / (1000 * 60); // Convert to minutes
        }, 0);

        if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
        }

        return `${totalMinutes}min`;
    };

    // Add sort handler function
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Modify the useEffect to include sort order
    useEffect(() => {
        let filtered = employeeClockData;
        const today = new Date();

        switch (filterOption) {
            case 'daily':
                // Show all days without filtering
                filtered = employeeClockData;
                break;
            case 'weekly':
                const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
                break;
            case 'monthly':
                const monthAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(item => new Date(item.date) >= monthAgo);
                break;
            case 'custom':
                if (dateRange.startDate) {
                    filtered = filtered.filter(item => new Date(item.date) >= new Date(dateRange.startDate));
                }
                if (dateRange.endDate) {
                    filtered = filtered.filter(item => new Date(item.date) <= new Date(dateRange.endDate));
                } else if (dateRange.startDate) {
                    filtered = filtered.filter(item => new Date(item.date) <= today);
                }
                break;
            default:
                break;
        }
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        setFilteredData(filtered);
    }, [filterOption, dateRange, employeeClockData, sortOrder]);

    function calculateTotalHours(startTime, endTime) {
        if (!startTime || !endTime) return "-";
        const start = new Date(`1970-01-01T${convertTo24HourFormat(startTime)}`);
        const end = new Date(`1970-01-01T${convertTo24HourFormat(endTime)}`);
        const diff = (end - start) / (1000 * 60);
        if (diff < 0) return "-";
        const hours = Math.floor(diff / 60);
        const minutes = Math.floor(diff % 60);
        return `${hours}H  ${minutes}M`;
    }
    function convertTo24HourFormat(time) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filterAttendanceRecords = () => {
        if (!attendanceData) return [];

        let filtered = [...attendanceData];

        // Apply date filters
        filtered = filtered.filter(record => {
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

            return true; // Show all records if no filter is applied
        });

        return filtered;
    };

    const filteredRecords = filterAttendanceRecords();

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {show ? (
                <div className='bg-white rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200 rounded-t-lg">
                        <div className='flex gap-2 flex-col'>
                            <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
                            <p className='text-fuchsia-800 text-[14px] font-medium'>
                                Records found: {filteredRecords.length}
                            </p>
                        </div>

                        {/* Add filter controls */}
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

                    {/* Update the table to use filteredRecords instead of attendanceData */}
                    {filteredRecords.length > 0 ?
                        <div className="bg-white rounded-lg overflow-hidden p-4">
                            <div className="overflow-x-auto rounded">
                                <table className="w-full border-2">
                                    <thead>
                                        <tr className="text-white bg-violet-400 py-4">
                                            <th className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Check In
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Check Out
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Total Hours
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">

                                        {filteredRecords.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1  text-blue-500 rounded-lg text-sm font-medium">
                                                        {formatDate(item.date)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${item.startTime ? 'bg-indigo-400' : 'bg-gray-300'}`}></span>
                                                        <span className={`text-sm font-medium ${item.startTime ? 'text-indigo-700' : 'text-gray-400'}`}>
                                                            {item.startTime ? formatTime(item.startTime) : "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${item.endTime ? 'bg-red-400' : 'bg-gray-300'}`}></span>
                                                        <span className={`text-sm font-medium ${item.endTime ? 'text-red-600' : 'text-gray-400'}`}>
                                                            {item.endTime ? formatTime(item.endTime) : "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className='flex items-center gap-2'>
                                                        <Clock9
                                                            className={`${item.startTime && item.endTime ? 'text-emerald-500' : 'text-gray-400'}`}
                                                            size={16}
                                                        />
                                                        <span className={`text-sm font-medium ${item.startTime && item.endTime
                                                            ? 'text-emerald-600'
                                                            : 'text-gray-400'
                                                            }`}>
                                                            {calculateTotalHours(item.startTime, item.endTime)}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <div className='flex justify-center items-center py-10'>
                            <p>no records found</p>
                        </div>
                    }
                </div>
            ) : (
                <div className="flex justify-center items-center h-[80vh]">
                    <DotsLoader />
                </div>
            )}
        </div>
    );
};

export default AttendenceRecords;
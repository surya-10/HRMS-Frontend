import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { colorPairs } from "../../../ManagerPages/ManagerHome";
import DotsLoader from "../../../../Components/Layout/animations/dotAnimations";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AttendenceAndLeaveChart = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Get current month name
    const getCurrentMonth = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return monthNames[new Date().getMonth()];
    };

    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [chartData, setChartData] = useState([]);
    const [showPieChart, setShowPieChart] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [workingDays, setWorkingDays] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(0);
    const [approvedLeaves, setApprovedLeaves] = useState(0);
    const [eachMonthData, setEachMonthData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [monthlyHolidays, setMonthlyHolidays] = useState([]);
    const [months, setMonths] = useState([
        { name: "January", value: 1, totalWorkingDays: 26 },
        { name: "February", value: 2, totalWorkingDays: 22 },
        { name: "March", value: 3, totalWorkingDays: 26 },
        { name: "April", value: 4, totalWorkingDays: 25 },
        { name: "May", value: 5, totalWorkingDays: 26 },
        { name: "June", value: 6, totalWorkingDays: 26 },
        { name: "July", value: 7, totalWorkingDays: 26 },
        { name: "August", value: 8, totalWorkingDays: 25 },
        { name: "September", value: 9, totalWorkingDays: 25 },
        { name: "October", value: 10, totalWorkingDays: 24 },
        { name: "November", value: 11, totalWorkingDays: 25 },
        { name: "December", value: 12, totalWorkingDays: 25 }
    ]);

    // Function to fetch holidays for a specific month
    const fetchMonthHolidays = async (month, year) => {
        try {
            const monthStr = month.toString().padStart(2, '0');
            const monthYear = `${monthStr}-${year}`;
            const response = await axios.get(
                `http://localhost:3002/api/routes/holiday/get-all-holidays`
            );
            if (response.data.success) {
                setMonthlyHolidays(response.data.holidays);
                return response.data.holidays;
            }
            return [];
        } catch (error) {
            console.error('Error fetching holidays:', error);
            return [];
        }
    };

    const calculateWorkingDays = (year, month, endDay, holidays) => {
        let workingDays = 0;
        const today = new Date();
        // If it's current month and year, use today's date as the last day
        const lastDay = (month === today.getMonth() + 1 && year === today.getFullYear()) 
            ? today.getDate() 
            : endDay || new Date(year, month, 0).getDate();
        
        // Filter holidays for the current month
        const monthHolidays = holidays.filter(holiday => {
            const [day, holidayMonth, holidayYear] = holiday.date.split('-').map(Number);
            return holidayMonth === month;
        });

        // Convert holiday dates to a Set for O(1) lookup
        const holidayDates = new Set(monthHolidays.map(h => {
            const [day] = h.date.split('-');
            return parseInt(day);
        }));
        
        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(year, month - 1, day);
            // Skip Sundays and holidays
            if (date.getDay() !== 0 && !holidayDates.has(day)) {
                workingDays++;
            }
        }
        return workingDays;
    };

    // Fetch attendance and leave data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch attendance data
                const attendanceResponse = await axios.get(
                    `http://localhost:3002/api/routes/attendence/get-loginHistory/${userId}`,
                    {
                        headers: { authorization: `Bearer ${token}` }
                    }
                );

                if (!attendanceResponse.data.ok) {
                    setLoading(false);
                    return;
                }

                // Set available months up to current month
                const currentMonth = new Date().getMonth() + 1; // 1-based month
                const availableMonths = months.slice(0, currentMonth);
                setSelectedMonths(availableMonths);

                const filterRecords = await getRecords(attendanceResponse.data.data);
                setAttendanceData(filterRecords);

                // Get current month's data
                const currentMonthNumber = months.find(m => m.name === selectedMonth)?.value || currentMonth;

                // Fetch monthly leave data
                const currentYear = new Date().getFullYear();
                const leaveResponse = await axios.get(
                    `http://localhost:3002/api/routes/time-off/monthly-leaves/${userId}/${currentMonthNumber}/${currentYear}`,
                    {
                        headers: { authorization: `Bearer ${token}` }
                    }
                );

                if (leaveResponse.data) {
                    const monthlyLeaveData = leaveResponse.data;
                    const totalApprovedLeaves = (monthlyLeaveData.total_leave_taken || 0) +
                        ((monthlyLeaveData.half_days_taken || 0) * 0.5);
                    setApprovedLeaves(totalApprovedLeaves);
                }

                // Update monthly data display
                await updateMonthlyData(currentMonthNumber, filterRecords);
                setShowPieChart(true);

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching attendance data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, token, selectedMonth]);

    const getRecords = (data) => {
        const records = [];
        for (let i = 0; i < data.length; i++) {
            const record = {
                date: data[i].date,
                startTime: null,
                endTime: null,
            };
            for (let j = 0; j < data[i].logHistory.length; j++) {
                if (data[i].logHistory[j].type === "checkIn") {
                    record.startTime = data[i].logHistory[j].startTime;
                } else {
                    record.endTime = data[i].logHistory[j].endTime;
                }
            }
            record.colors = {
                color: colorPairs[i % colorPairs.length].color,
                bgColor: colorPairs[i % colorPairs.length].bgColor
            };
            records.push(record);
        }
        return records;
    };

    const updateMonthlyData = async (monthNumber, attendanceRecords) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;

        // Fetch holidays for the month
        const holidays = await fetchMonthHolidays(monthNumber, currentYear);

        // Filter records up to current date only
        const monthFilter = attendanceRecords.filter((item) => {
            const date = new Date(item.date);
            const itemMonth = date.getMonth() + 1;
            const itemDay = date.getDate();
            
            // For current month, only include records up to today
            if (monthNumber === currentMonth) {
                return itemMonth === monthNumber && itemDay <= currentDay;
            }
            // For past months, include all records up to the last day of that month
            else if (monthNumber < currentMonth) {
                return itemMonth === monthNumber;
            }
            return false;
        });

        // Calculate working days excluding Sundays and holidays
        let totalWorkingDays = calculateWorkingDays(
            currentYear,
            monthNumber,
            monthNumber === currentMonth ? currentDay : null,
            holidays
        );

        setWorkingDays(totalWorkingDays);
        setEachMonthData(monthFilter);

        // Calculate total leaves (absences)
        const daysPresent = monthFilter.length;
        const totalAbsences = Math.max(0, totalWorkingDays - daysPresent - approvedLeaves);
        setTotalLeaves(totalAbsences);
    };

    const handleMonthChange = async (e) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);

        const monthNumber = months.find(m => m.name === newMonth)?.value;
        if (!monthNumber) return;

        try {
            const currentYear = new Date().getFullYear();
            const leaveResponse = await axios.get(
                `http://localhost:3002/api/routes/time-off/monthly-leaves/${userId}/${monthNumber}/${currentYear}`,
                {
                    headers: { authorization: `Bearer ${token}` }
                }
            );

            if (leaveResponse.data) {
                const monthlyLeaveData = leaveResponse.data;
                const totalApprovedLeaves = (monthlyLeaveData.total_leave_taken || 0) +
                    ((monthlyLeaveData.half_days_taken || 0) * 0.5);
                setApprovedLeaves(totalApprovedLeaves);
            }
            await updateMonthlyData(monthNumber, attendanceData);
        } catch (error) {
            console.error('Error fetching leave data:', error);
            toast.error('Error updating leave data');
        }
    };

    const calculateAttendancePercentage = () => {
        if (workingDays === 0) return 0;

        const daysPresent = eachMonthData.length;
        const totalPresentDays = daysPresent + approvedLeaves;
        const percentage = (totalPresentDays / workingDays) * 100;
        return Math.min(100, Math.round(percentage));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border-blue-500 p-3 flex flex-col grow min-h-[430px]  relative">
            {loading ? (
                <div className="grow w-[380px] h-[430px] flex justify-center items-center">
                    <DotsLoader />
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium">Attendance Overview</h2>
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            {selectedMonths.map(month => (
                                <option key={month.value} value={month.name}>{month.name}</option>
                            ))}
                        </select>
                    </div>
                    {showPieChart && (
                        <div className="">
                            {eachMonthData.length === 0 ? (
                                <p className="text-center text-gray-500">No attendance records found for {selectedMonth}.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { 
                                                    name: "Present Days", 
                                                    value: eachMonthData.length,
                                                    color: COLORS[0]
                                                },
                                                { 
                                                    name: "Approved Leaves", 
                                                    value: approvedLeaves,
                                                    color: COLORS[1]
                                                },
                                                { 
                                                    name: "Absences", 
                                                    value: Math.max(0, totalLeaves),
                                                    color: COLORS[2]
                                                }
                                            ]}
                                            cx="35%"
                                            cy="40%"
                                            innerRadius={0}
                                            outerRadius={90}
                                            dataKey="value"
                                        >
                                            {COLORS.map((color, idx) => (
                                                <Cell key={`cell-${idx}`} fill={color} />
                                            ))}
                                        </Pie>
                                        <Tooltip wrapperStyle={{ fontSize: "12px", textAlign: "center" }} />
                                        <Legend wrapperStyle={{ fontSize: "12px", textAlign: "center" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}
                    {eachMonthData.length > 0 && (
                        <div className="space-y-3 mt-2">
                            <div className="flex gap-5">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                    <span className="text-gray-700 text-sm">
                                        Total Working Days: 
                                        <span className="font-medium ms-2">{workingDays}</span> 
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                    <span className="text-gray-700 text-sm">
                                        Days Worked: 
                                        <span className="font-medium ms-2">{eachMonthData.length}</span> 
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                    <span className="text-gray-700 text-sm">
                                        Approved Leaves: 
                                        <span className="font-medium ms-2">{approvedLeaves}</span> 
                                    </span>
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                    <span className="text-gray-700 text-sm">
                                        Absences: 
                                        <span className="font-medium ms-2">{Math.max(0, totalLeaves)}</span>
                                    </span>
                                </div> */}
                            </div>
                            <div className="flex items-center space-x-2 absolute top-16 right-4">
                                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                <span className="text-gray-700 text-md">
                                    <span className="font-bold">{calculateAttendancePercentage()}%</span> Attendance
                                    {calculateAttendancePercentage() >= 100 && (
                                        <span className="ml-1 text-green-600">(Perfect)</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendenceAndLeaveChart;
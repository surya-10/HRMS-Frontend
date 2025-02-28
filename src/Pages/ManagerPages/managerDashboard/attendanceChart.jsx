import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const years = [2025];

// Government Holidays
const indianHolidays = {
    January: ['2025-01-26'], // Republic Day
    March: ['2025-03-17'], // Holi
    August: ['2025-08-15'], // Independence Day
    October: ['2025-10-02'], // Gandhi Jayanti
    November: ['2025-11-01', '2025-11-14'], // Diwali, Children's Day
};

// Function to calculate total working days
const getTotalWorkingDays = (year, monthName) => {
    const monthIndex = months.indexOf(monthName);
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;
    const lastDay = isCurrentMonth ? today.getDate() : totalDays;

    let workingDays = 0;
    let saturdays = 0;

    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, monthIndex, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (dayOfWeek === 6) saturdays++; // Count Saturdays

        // Exclude Sundays & government holidays
        if (dayOfWeek !== 0 && !indianHolidays[monthName]?.includes(formattedDate)) {
            workingDays++;
        }
    }

    // Deduct 1 CL and 1 Saturday off
    workingDays -= 1; // 1 CL
    if (saturdays > 0) workingDays -= 1; // 1 Saturday off

    return workingDays;
};

const AttendancePieChart = () => {
    const managerId = localStorage.getItem('userId');
    const [allAttendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(2025);
    const [labels, setLabels] = useState([]);
    const [attendanceData, setAttendanceDataForChart] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);

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
                console.log("Fetched Attendance Data:", response.data);
                if(!response.data.data){
                    setAttendanceData([]);
                    return;
                }
                setAttendanceData(response.data.data);
                setLabels(response.data.data.map(item => item.userName));

                // Get all months up to current month
                const currentDate = new Date();
                const currentMonthIndex = currentDate.getMonth();
                const availableMonthsList = months.slice(0, currentMonthIndex + 1);
                setAvailableMonths(availableMonthsList);

                // Set current month as default selected month
                setSelectedMonth(months[currentMonthIndex]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAttendanceData();
    }, [managerId]);

    useEffect(() => {
        if (allAttendanceData.length > 0) {
            const totalWorkingDays = getTotalWorkingDays(selectedYear, selectedMonth);

            const dataForChart = allAttendanceData.map((data) => {
                if (Array.isArray(data.attendance)) {
                    const userAttendance = data.attendance.filter(attendanceDay => {
                        const day = new Date(attendanceDay.date);
                        return day.getMonth() === months.indexOf(selectedMonth);
                    });

                    return ((userAttendance.length / totalWorkingDays) * 100).toFixed(2);
                }
                return 0;
            });

            setAttendanceDataForChart(dataForChart);
        }
    }, [allAttendanceData, selectedMonth, selectedYear]);

    const data = {
        labels: labels.map((label, index) => `${label} (${attendanceData[index]}%)`),
        datasets: [
            {
                label: 'Attendance',
                data: attendanceData,
                backgroundColor: ['#5680E9', '#84CEEB', '#5AB9EA', '#C1C8E4', '#8860D0'],
                borderColor: '#ffffff',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 9,
                    padding: 15,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.label}: ${value}%`;
                    },
                },
            },
        },
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className='p-2 rounded-lg shadow-2xl'>
            <div className='flex flex-row border-b-2 mb-4 items-center justify-between'>
                <div className="border-black flex flex-col p-4 mb-4">
                    <span className="font-[500] text-lg">Attendance</span>
                </div>
                <div className="flex space-x-4">
                    <select
                        className="bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] p-3"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    >
                        {availableMonths.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>

                    <select
                        className="bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] p-3"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ width: '400px', margin: '0 auto' }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default AttendancePieChart;

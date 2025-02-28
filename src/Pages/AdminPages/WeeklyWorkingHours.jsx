import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ComposedChart
} from "recharts";
import moment from 'moment';

const WeeklyWorkingHours = () => {
    const userID = localStorage.getItem("userId");
    const [data, setData] = useState([]);
    const [averageHours, setAverageHours] = useState(0);
    const [show, setShow] = useState(window.innerWidth > 800);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [employeesWithData, setEmployeesWithData] = useState(0);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3002/api/routes/attendence/get-all-checkin-admin/${userID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const records = response.data.data;
                setTotalEmployees(records.length);
                let dailyData = {};
                let employeesWithRecords = 0;

                // Get last 6 days
                const last6Days = [...Array(6)].map((_, i) => {
                    return moment().subtract(i, 'days').format('YYYY-MM-DD');
                }).reverse();

                // Initialize dailyData with all 6 days
                last6Days.forEach(date => {
                    dailyData[date] = { totalHours: 0, employeeCount: 0 };
                });

                // Loop through each employee's records
                records.forEach(employeeRecord => {
                    let hasData = false;
                    
                    employeeRecord.attendance.forEach(attendance => {
                        const date = moment(attendance.date).format("YYYY-MM-DD");
                        
                        // Only process last 6 days
                        if (last6Days.includes(date)) {
                            let checkIn = null;
                            let checkOut = null;

                            attendance.logHistory.forEach(log => {
                                if (log.type === "checkIn") checkIn = log.startTime;
                                if (log.type === "checkOut") checkOut = log.endTime;
                            });

                            if (checkIn && checkOut) {
                                hasData = true;
                                let checkInTime = moment(checkIn, "h:mm A");
                                let checkOutTime = moment(checkOut, "h:mm A");
                                let hoursWorked = checkOutTime.diff(checkInTime, "hours", true);
                                hoursWorked = Math.min(hoursWorked, 10); // Max 10h per day

                                if (!dailyData[date]) {
                                    dailyData[date] = { totalHours: 0, employeeCount: 0 };
                                }
                                dailyData[date].totalHours += hoursWorked;
                                dailyData[date].employeeCount += 1;
                            }
                        }
                    });

                    if (hasData) employeesWithRecords++;
                });

                setEmployeesWithData(employeesWithRecords);

                // Convert data into array format for chart
                const processedData = last6Days.map(date => {
                    const dayData = dailyData[date] || { totalHours: 0, employeeCount: 0 };
                    return {
                        day: moment(date).format("dddd"),
                        hours: dayData.employeeCount > 0 
                            ? (dayData.totalHours / dayData.employeeCount).toFixed(2)
                            : "0",
                        employeeCount: dayData.employeeCount
                    };
                });

                setData(processedData);

                // Calculate Overall Average
                const totalHours = processedData.reduce((sum, item) => sum + parseFloat(item.hours), 0);
                const avgHours = processedData.length > 0 ? (totalHours / processedData.length).toFixed(2) : 0;
                setAverageHours(avgHours);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAttendanceData();
    }, [userID]);

    useEffect(() => {
        const handleResize = () => {
            setShow(window.innerWidth > 800);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`${show ? "w-full h-[450px] mt-[20px]" : `w-[100%] h-[450px] ml-[-20px]`}`}>
            <div className='text-gray-800 text-lg font-bold text-left ms-12 space-y-2'>
                <p>Last 6 Days Average Working Hours: <span className="text-purple-600">{averageHours}h</span></p>
                <p className="text-sm text-gray-600">
                    Data available for {employeesWithData} out of {totalEmployees} employees
                </p>
            </div>
            <ResponsiveContainer width="100%" height={show ? 350 : 300}>
                <ComposedChart data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D946Ea" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6643b5" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="day" 
                        fontSize={13} 
                        fontWeight={600}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        fontSize={13} 
                        fontWeight={600}
                        label={{ 
                            value: 'Average Hours', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -5
                        }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'white', color: 'crimson' }}
                        itemStyle={{ color: 'purple' }}
                        cursor={{ fill: 'rgba(10, 0, 0, 0)' }}
                        formatter={(value, name, props) => [
                            `${value}h (${props.payload.employeeCount} employees)`,
                            'Average Hours'
                        ]}
                    />
                    <Bar dataKey="hours" fill="url(#barGradient)" barSize={show ? 30 : 20} />
                    <Line
                        type="linear"
                        dataKey="hours"
                        stroke="blue"
                        dot={{
                            r: 4,
                            fill: "#6643b5",
                            strokeWidth: 0,
                            stroke: "purple"
                        }}
                        activeDot={{
                            r: 5,
                            fill: "#6643b5",
                            stroke: "#FFFFFF",
                            strokeWidth: 1
                        }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyWorkingHours;


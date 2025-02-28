import axios from 'axios';
import { Clock5, UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DotsLoader from '../../../../Components/Layout/animations/dotAnimations';

const CheckInHistory = () => {
    const userId = localStorage.getItem("userId");
    const [attendence, setAttendence] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                console.log(userId);
                const response = await axios.get(
                    `http://localhost:3002/api/routes/attendence/get-all-checkin-admin/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                // console.log(response.data.data);
                localStorage.setItem("employeesAttendence", JSON.stringify(response.data.data))
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayDate = yesterday.toISOString().split('T')[0];

                const extractedData = response.data.data
                    .flatMap(user =>
                        user.attendance
                            .map(att => ({
                                name: user.userName,
                                startTime: att.logHistory[0]?.startTime,
                                endTime: att.logHistory[1]?.endTime,
                                date: att.date.split("T")[0],
                                totalHours: calculateTotalHours(att.logHistory[0]?.startTime, att.logHistory[1]?.endTime),
                            }))
                            .filter(data => data.date === yesterdayDate)
                    );

                // console.log(extractedData);
                
                if(extractedData.length>4){
                    setAttendence(extractedData.slice(0, 4));
                }
                else{
                    setAttendence(extractedData);
                }
                setLoading(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAttendanceData();
    }, [userId]);

    const calculateTotalHours = (startTime, endTime) => {
        if (!startTime || !endTime) {
            return 0;
        }

        const convertTo24HourFormat = (time) => {
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);

            if (modifier === 'PM' && hours !== 12) {
                hours += 12;
            } else if (modifier === 'AM' && hours === 12) {
                hours = 0;
            }
            return { hours, minutes };
        };

        const { hours: startHours, minutes: startMinutes } = convertTo24HourFormat(startTime);
        const { hours: endHours, minutes: endMinutes } = convertTo24HourFormat(endTime);
        const startDate = new Date(2025, 0, 1, startHours, startMinutes);
        const endDate = new Date(2025, 0, 1, endHours, endMinutes);

        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        const diffInMilliseconds = endDate - startDate;
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        return diffInHours;
    };

    return (
        <div className='lg:w-[49%] md:w-full w-full'>
            <div className='flex justify-between items-center w-full h-[50px] rounded-t-xl pe-4'>
                <p className='text-gray-800 text-lg font-[600]'>Attendance records</p>
                <p className="cursor-pointer hover:underline text-[blue] text-[14px]">View all</p>
            </div>
            <div className='shadow-lg rounded-lg border-2 bg-white'>
                <div className='flex justify-between items-center w-full text-white rounded-t shadow-xl px-4 font-[500] bg-[#a75265] border-b-2 border-[#E5E7EB] py-6'>
                    <p>Name</p>
                    <p>Check-In/Out</p>
                </div>
                {loading ? 
                <div className='flex flex-col flex-wrap px-4 bg-white rounded-xl'>
                    {attendence.map((employee, index) => (
                        <div key={index}>
                            <div className="bg-white flex justify-between items-center pt-2 mb-3">
                                <div className='flex items-center gap-2'>
                                    <div className='p-3 bg-[#dbadad] rounded-full w-12'>
                                        <UserRound className='text-[#EF4444]' />
                                    </div>
                                    <div>
                                        <p className='self-start'>{employee.name}</p>
                                        <p className='text-xs'>{employee.date}</p> {/* Display the date here */}
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <p className={`text-sm text-gray-500 mt-[4px]`}>
                                        <Clock5 />
                                    </p>
                                    <p className='text-xs bg-green-500 text-white px-2 py-1 rounded'>
                                        -{employee.totalHours.toFixed(2)} hrs {/* Display the calculated total hours */}
                                    </p>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
                :
                <div className='w-full flex justify-center items-center h-[280px]'>
                    <DotsLoader/>
                </div>
                }
            </div>
        </div>
    );
};

export default CheckInHistory;

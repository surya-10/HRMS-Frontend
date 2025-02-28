import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import DotsLoader from '../../Components/Layout/animations/dotAnimations';

const data = [
    { name: 'Present', value: 50 },
    { name: 'Leave', value: 30 },
    { name: 'Permission', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FF8042', '#FFBB28'];

const AttendanceRecord = () => {
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 700) {
                setShow(true);
            } else {
                setShow(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const userId = localStorage.getItem("userId");
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                console.log(userId);
                const response = await axios.get(
                    `http://localhost:3002/api/routes/attendence/get-all-data/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                console.log(response.data);
                let empCount = response.data.allUsers.length;
                let leaveToday = response.data.allLeaves.length;
                let allDates = response.data.allDates.length;
                setCount(empCount)
                for(let i=0; i<data.length; i++){
                    if(data[i].name=="Present"){
                        data[i].value=empCount
                    }
                    else if(data[i].name=="Leave"){
                        data[i].value=allDates
                    }
                    else if(data[i].name=="Permission"){
                        data[i].value=0
                    }
                }
                setLoading(false)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAttendanceData();
    }, [userId]);

    return (
        <div className=''>
            <div className='mt-4'>
                <p className='text-gray-800 text-lg font-bold mb-4 '>Attendence overview</p>
                <p className='text-fuchsia-800 mb-4'>Total employees: {count}</p>
                <select>
                    <option>Today</option>

                </select>
            </div>
            {!loading ?
                <div>
                    <PieChart
                        width={true ? 600 : 400}
                        height={350}
                        margin={{ top: 30, right: 80, left: 0, bottom: 0 }}


                    >

                        <Pie
                            data={data}
                            cx={show ? 270 : 190}
                            cy={250}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={show ? 160 : 130}
                            outerRadius={show ? 220 : 190}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey="value"
                            height={400}
                            radius={[10, 10, 10, 10]}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        {show ? (
                            <Legend
                                layout="vertical"
                                verticalAlign="top"
                                align="right"
                            />
                        ) : (
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="start"
                            />
                        )}
                    </PieChart>
                </div>
                :
                <div className='flex justify-center items-center h-[250px]'>
                    <DotsLoader/>
                </div>
                }
        </div>
    );
};

export default AttendanceRecord;


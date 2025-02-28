import React, { useEffect, useState } from 'react';
import { colorPairs } from '../../../ManagerPages/ManagerHome';
import axios from 'axios';
import { Clock5, Hourglass, Sparkles, Zap } from 'lucide-react';

const ShowemployeeStats = () => {
    const [totalWorkTime, setTotalWorkTime] = useState('00:00:00');
    const [totalBreakTime, setTotalBreakTime] = useState(0);
    const [allRecords, setallRecords] = useState([]);
    const [averageHours, setAverageHours] = useState("");
    const [loading, setLoading] = useState(false);
    const [breakTaken, setBreakTaken] = useState(0);
    const [Productivity, setProductivity] = useState("100%");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [viewBreak, setViewBreak] = useState(false)
    const [isOverBreak, setIsOverBreak] = useState(false);
    const [breakPercentageDifference, setBreakPercentageDifference] = useState("0");
    const [formattedBreakTime, setFormattedBreakTime] = useState("0H 0M");
    const [weeklyAvgHours, setWeeklyAvgHours] = useState("0H 0M");
    const [dataCount, setDataCount] = useState(0);
    const [weeklyHours, setWeeklyHours] = useState({})
    const [calculateProductivity, setCalculateProdutivity] = useState(false);
    // const 



    useEffect(() => {
        const fetchData = async () => {
            const attendanceRecords = localStorage.getItem("attendenceRecords");
            if (attendanceRecords) {
                const parsedRecords = JSON.parse(attendanceRecords);
                setallRecords(parsedRecords.slice(-2, -1));
                const lastDayRecords = parsedRecords.slice(-2, -1)
                const res = await getRecords(lastDayRecords);
                const allRecords = await getRecords(parsedRecords);
                if (allRecords.length > 6) {
                    const data = allRecords.slice(-6, -1);
                    setDataCount(data.length);
                    const weeklyHours = calculateAverageTimeWeek(data.map((val) => val.hours));
                    setWeeklyAvgHours(weeklyHours);
                    setWeeklyHours(calculateChangePercent("10H", weeklyHours))
                }
                else if (allRecords.length <= 6) {
                    const data = allRecords.slice(0, (allRecords.length - 1));
                    setDataCount(data.length)
                    const weeklyHours = calculateAverageTimeWeek(data.map((data) => data.hours));
                    setWeeklyAvgHours(weeklyHours);
                    setWeeklyHours(calculateChangePercent("10H", weeklyHours))
                }
                const avgHours = calculateAverageTime(res.map((data) => data.hours));
                setAverageHours(avgHours);
                setLoading(true);
                setCalculateProdutivity(true)
            }
            else {
                setAverageHours("0H 0M")
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const getAllBreaks = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/api/routes/break-details/get-all-breaks/${userId}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    }
                });
                const result = calculateBreakTime(response.data.breaks.breaks);
                setTotalBreakTime(result.percent);
                setIsOverBreak(result.isOver);
                setBreakPercentageDifference(result.percentageDifference);
                setFormattedBreakTime(result.formattedTime);
                setViewBreak(true);
            } catch (error) {
                console.log(error);
            }
        };
        getAllBreaks();
    }, []);

    function getTimeDifference(limitTime, takenTime) {
        function timeToMinutes(time) {
            let [hours, minutes] = time.split("H").map(s => s.trim());
            minutes = minutes.replace("M", "").trim();
            return (parseInt(hours) * 60) + parseInt(minutes);
        }

        let limitMinutes = timeToMinutes(limitTime);
        let takenMinutes = timeToMinutes(takenTime);
        // takenMinutes = 90

        let diffMinutes = Math.abs(takenMinutes - limitMinutes);
        if (diffMinutes <= 90) {
            setProductivity("100");
            return
        }
        let hours = Math.floor(diffMinutes / 60);
        let minutes = diffMinutes % 60;
        let time = `${hours}H ${minutes}M`;
        let totalWorkTime = timeToMinutes(averageHours);
        let breakWorkDiff = totalWorkTime - diffMinutes;
        let hrs = Math.floor(breakWorkDiff / 60);
        let mts = breakWorkDiff % 60;
        let commonHours = timeToMinutes("10H 0M");
        if (breakWorkDiff >= commonHours) {
            setProductivity("100")
            console.log("Returned")
            return;
        }
        else {
            let productivity = (breakWorkDiff / commonHours) * 100;
            productivity = Math.max(0, Math.min(100, productivity));
            console.log(productivity)
            setProductivity(productivity.toFixed(2))
        }

    }

    useEffect(() => {
        if (calculateProductivity) {
            getTimeDifference("1H 30M", formattedBreakTime);
        }
    }, [calculateProductivity, formattedBreakTime])


    function calculateBreakTime(breaks) {
        let totalMilliseconds = 0;

        breaks.forEach(breakItem => {
            if (breakItem.startTime && breakItem.endTime) {
                totalMilliseconds += (breakItem.endTime - breakItem.startTime);
            }
        });

        const totalHours = totalMilliseconds / (1000 * 60 * 60);
        const limitHours = 1.50;

        const percentOfLimit = (totalHours / limitHours) * 100;
        const isOver = totalHours > limitHours;
        // console.log(isOver)

        const percentageDifference = isOver
            ? ((totalHours - limitHours) / limitHours * 100).toFixed(1)
            : ((limitHours - totalHours) / limitHours * 100).toFixed(1);

        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const formattedTime = `${hours}H ${minutes}M`;

        return {
            percent: percentOfLimit > 100 ? 100 : percentOfLimit,
            isOver: isOver,
            percentageDifference: percentageDifference,
            formattedTime: formattedTime
        };
    }


    function calculateAverageTimeWeek(timeArray) {
        let totalMinutes = 0;
        let count = 0;

        timeArray.forEach(time => {
            if (time !== "-") {
                let [hours, minutes] = time.split('H').map(s => s.trim());
                console.log(hours)
                minutes = minutes.replace('M', '').trim();
                console.log(minutes)
                totalMinutes += (parseInt(hours) * 60) + parseInt(minutes);
                count++;
            }
        });

        if (count === 0) return "0H 0M";

        let avgMinutes = Math.round(totalMinutes / count);
        let avgHours = Math.floor(avgMinutes / 60);
        let remainingMinutes = avgMinutes % 60;


        return `${avgHours}H ${remainingMinutes}M`;
    }

    function calculateAverageTime(timeArray) {
        let totalMinutes = 0;
        let count = 0;

        timeArray.forEach(time => {
            if (time !== "-") {
                let [hours, minutes] = time.split('H').map(s => s.trim());
                minutes = minutes.replace('M', '').trim();
                totalMinutes += (parseInt(hours) * 60) + parseInt(minutes);
                count++;
            }
        });

        if (count === 0) return "0H 0M";

        let avgMinutes = Math.round(totalMinutes / count);
        let avgHours = Math.floor(avgMinutes / 60);
        let remainingMinutes = avgMinutes % 60;

        return `${avgHours}H ${remainingMinutes}M`;
    }

    const getRecords = async (data) => {
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

            const totalHours = calculateTotalHours(record.startTime, record.endTime);
            // console.log(totalHours);

            record.hours = totalHours;
            records.push(record);
        }
        // console.log(records)
        return records;
    };

    function calculateTotalHours(startTime, endTime) {
        if (!startTime || !endTime) return "-";

        const start = new Date(`1970-01-01T${convertTo24HourFormat(startTime)}`);
        const end = new Date(`1970-01-01T${convertTo24HourFormat(endTime)}`);
        const diff = (end - start) / (1000 * 60);

        if (diff < 0) return "-";

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        return `${hours}H ${minutes}M`;
    }

    function convertTo24HourFormat(time) {
        if (!time) return null;
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const calculateChangePercent = (total, worked) => {
        if (!total || !worked) return { percent: 0, isOver: false, difference: "0" };

        const timeToMinutes = (time) => {
            let [hours, minutes] = time.split("H").map(s => s.trim());
            minutes = minutes.replace("M", "").trim();
            return (parseInt(hours) * 60) + (parseInt(minutes) || 0);
        };

        const totalMinutes = timeToMinutes(total);
        const workedMinutes = timeToMinutes(worked);

        if (isNaN(totalMinutes) || isNaN(workedMinutes) || totalMinutes === 0) {
            return { percent: 0, isOver: false, difference: "0" };
        }

        const percentage = (workedMinutes / totalMinutes) * 100;
        const difference = Math.abs(100 - percentage).toFixed(1);
        const isOver = percentage > 100;

        return {
            percent: percentage.toFixed(1),
            difference,
            isOver
        };
    };

    function calculatePercentLess(total, worked) {
        if (!total || !worked) return "0%";

        const timeToMinutes = (time) => {
            let [hours, minutes] = time.split("H").map(s => s.trim());
            minutes = minutes.replace("M", "").trim();
            return (parseInt(hours) * 60) + (parseInt(minutes) || 0);
        };
        const totalMinutes = timeToMinutes(total);
        const workedMinutes = timeToMinutes(worked);
        if (isNaN(totalMinutes) || isNaN(workedMinutes) || totalMinutes === 0) return "0%";
        const percentage = ((workedMinutes / totalMinutes) * 100).toFixed(1);
        // console.log(percentage)
        return `${percentage}%`;
    };
    const productivityStats = calculateChangePercent("10H", averageHours);



    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 "> stats</h3>
                <div className='flex flex-row flex-wrap gap-4 grow'>
                    <div className='flex gap-2 flex-grow'>
                        <div className=" relative overflow-hidden flex-grow w-[380px] h-[170px] bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="absolute  right-[-100px] rotate-45 opacity-20">
                                <WavyTriangle color='powderblue' />
                                {/* <svg width="89" height="100" viewBox="0 0 89 100" fill="red" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.53" d="M82.8596 59.631L-12.9166 136L-13 12.6654C-13.0104 3.47325 -3.64861 -3.98345 7.88165 -3.99176L32.5372 -4.00006L82.8491 36.032C91.0433 42.5337 91.0537 53.1126 82.8596 59.631Z" fill="#ecfe00" fill-opacity="0.3" />
                                </svg> */}
                            </div>
                            <div className="absolute  right-[-60px] rotate-45 opacity-20 top-[-10px]">
                                <WavyTriangle color='powderblue' />
                                {/* <svg width="89" height="100" viewBox="0 0 89 100" fill="red" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.53" d="M82.8596 59.631L-12.9166 136L-13 12.6654C-13.0104 3.47325 -3.64861 -3.98345 7.88165 -3.99176L32.5372 -4.00006L82.8491 36.032C91.0433 42.5337 91.0537 53.1126 82.8596 59.631Z" fill="#ecfe00" fill-opacity="0.3" />
                                </svg> */}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-sm">
                                    <p className='text-cyan-700'><Clock5 /></p>
                                </div>
                                <div className={`text-xs font-medium ${!isOverBreak ? 'text-cyan-600' : 'text-cyan-600'} flex items-center rounded-full shadow-sm`}>
                                    {!isOverBreak ? '↓' : '↑'} {breakPercentageDifference}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 font-medium">Yesterday - break taken</p>
                                <p className="text-lg font-[600] mt-1 text-gray-800">
                                    {formattedBreakTime}
                                    <span className='text-[12px] text-gray-600 ml-2'>/1H 30M limit</span>
                                </p>
                            </div>
                            <div className="w-full h-1.5 rounded-full mt-3 bg-white/50 overflow-hidden">
                                <div
                                    className={`h-full ${!isOverBreak ? 'bg-cyan-500' : 'bg-cyan-500'} rounded-full transition-all duration-1000`}
                                    style={{
                                        width: `${totalBreakTime}%`,
                                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                                    }}
                                ></div>
                            </div>

                        </div>
                        <div className="relative overflow-hidden flex-grow w-[380px] h-[170px] bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl p-4 border border-violet-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute left-[20%] rotate-12">
                                    <svg
                                        height="400"
                                        width="500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <polygon
                                            points="100,10 150,190 50,190"
                                            fill="#DDD6FE"
                                            opacity="0.3"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute left-[70%] top-[40%] scale-150 rotate-12">
                                    <svg
                                        height="300"
                                        width="500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <polygon
                                            points="100,10 150,100 50,190"
                                            style={{ fill: '#DDD6FE' }}
                                            opacity="0.3"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 text-emerald-600 flex items-center justify-center text-2xl rounded-full shadow-sm">
                                    <p className='text-violet-700'><Zap /></p>
                                </div>
                                <div className={`text-xs font-medium ${!productivityStats.isOver ? 'text-violet-600' : 'text-violet-600'} flex items-center  px-2 py-1 rounded-full shadow-sm`}>
                                    {productivityStats.isOver ? '↑' : '↓'} {productivityStats.difference}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 font-medium">Yesterday - Attendence</p>
                                <p className="text-lg font-[600] mt-1 text-gray-800">
                                    {averageHours}
                                    <span className='text-[12px] text-gray-600  ml-2'>/10H</span>
                                </p>
                            </div>
                            <div className="w-full h-1.5 rounded-full mt-3 bg-white/50 overflow-hidden">
                                <div
                                    className={`h-full ${!productivityStats.isOver ? 'bg-violet-500' : 'bg-violet-500'} rounded-full transition-all duration-1000`}
                                    style={{
                                        width: `${Math.min(productivityStats.percent, 100)}%`,
                                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                                    }}
                                ></div>
                            </div>

                        </div>
                    </div>
                    <div className='flex gap-2 flex-grow'>
                        <div className="overflow-hidden relative flex-grow w-[380px] h-[170px] bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-4 border border-pink-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className='absolute z-30 opacity-15 top-0 left-[-50px]'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="300" viewBox="0 0 80 160">
                                    <path
                                        d="M70 90 L70 10 L10 60 Z"
                                        fill="violet"


                                    />

                                </svg>
                            </div>
                            <div className='absolute z-20 opacity-15 top-[-100px] left-[10px] rotate-12'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="300" viewBox="0 0 80 160">
                                    <path
                                        d="M50 53 L70 140 L10 110 Z"
                                        fill="violet"
                                    />

                                </svg>
                            </div>
                            <div className='relative'>
                                <div className='absolute z-30 opacity-55 top-6 right-16'>
                                    <p className='w-8 h-8 rounded-full border-red-400 bg-pink-100 shadow-xl'></p>
                                </div>
                                <div className='absolute z-30 opacity-55 top-15 right-[30%]'>
                                    <p className='w-6 h-6 rounded-full border-red-400 bg-pink-100 shadow-xl'></p>
                                </div>
                                <div className='absolute z-30 opacity-55 top-3 right-[40%]'>
                                    <p className='w-6 h-6 rounded-full border-red-400 bg-pink-100 shadow-xl'></p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-sm">
                                    <p className='text-pink-700'>
                                        <Sparkles />
                                    </p>
                                </div>
                                <div className={`text-xs font-medium ${parseFloat(Productivity) < 100 ? 'text-red-600' : 'text-pink-600'} flex items-center rounded-full shadow-sm`}>
                                    {parseFloat(Productivity) < 100 ? '↓' : '↑'}
                                    {Math.abs(100 - (parseFloat(Productivity) || 100)).toFixed(2)}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 font-medium">Productivity - Yesterday</p>
                                <p className="text-lg font-[600] mt-1 text-gray-800">
                                    {Productivity}
                                    <span className='text-[12px] text-gray-600 ml-2'>/100%</span>
                                </p>
                            </div>
                            <div className="w-full h-1.5 rounded-full mt-3 bg-white/50 overflow-hidden">
                                <div
                                    className={`h-full ${parseFloat(Productivity) >= 100 ? 'bg-pink-500' : 'bg-rose-500'} rounded-full transition-all duration-1000`}
                                    style={{
                                        width: `${Math.min(parseFloat(Productivity) || 100, 100)}%`,
                                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="overflow-hidden relative flex-grow w-[380px]  h-[170px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="absolute rotate-9 skew-y-[30deg]  left-[60%] z-30 opacity-5 top-0">
                                <WavyTriangle
                                    className=""
                                    color="#235377"
                                    width={200}
                                    height={150}
                                // height={00}
                                />

                            </div>
                            <div className="absolute rotate-9 skew-y-[30deg]  left-[50%] z-30 opacity-5 top-0">
                                <WavyTriangle
                                    className=""
                                    color="#235377"
                                    width={200}
                                    height={150}
                                // height={00}
                                />

                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 text-emerald-600 flex items-center justify-center text-2xl rounded-full shadow-sm">
                                    <p className='text-blue-700'><Hourglass /></p>
                                </div>
                                <div className={`text-xs font-medium ${!weeklyHours.isOver ? 'text-blue-600' : 'text-blue-600'} flex items-center  px-2 py-1 rounded-full shadow-sm`}>
                                    {weeklyHours.isOver ? '↑' : '↓'} {weeklyHours.difference}%
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 font-medium">Last {dataCount} Days Average working hours</p>
                                <p className="text-lg font-[600] mt-1 text-gray-800">
                                    {weeklyAvgHours}
                                    <span className='text-[12px] text-gray-600  ml-2'>/10H</span>
                                </p>
                            </div>
                            <div className="w-full h-1.5 rounded-full mt-3 bg-white/50 overflow-hidden">
                                <div
                                    className={`h-full ${!weeklyHours.isOver ? 'bg-blue-500' : 'bg-blue-500'} rounded-full transition-all duration-1000`}
                                    style={{
                                        width: `${Math.min(weeklyHours.percent, 100)}%`,
                                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ShowemployeeStats

const WavyTriangle = ({
    width = 200, // Default width
    height = 200, // Default height
    color = '#ccc', // Default color
    className = '', // Allow additional classNames
}) => {
    return (
        <svg
            width={width} // Dynamic width
            height={height} // Dynamic height
            viewBox="0 0 200 200"
            className={className} // Apply additional classes
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d={`
            M 10,190
            L 10,10
            C 70,40 90,60 120,90
            C 150,120 170,140 190,190
            Z
          `}
                fill={color} // Use dynamic color
                strokeLinejoin="round" // Style the corners
            />
        </svg>
    );
};

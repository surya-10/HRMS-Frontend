import React, { useState, useEffect } from 'react';
import leave from "../../assets/images/leave2.png";
// import leave from "../../assets/images/run-3.gif";
// import chatbot from "../../assets/images/chatbot-logo.webp"
import chatbot from "../../assets/images/chatbot-logo.png"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import LeaveRequest from './components/LeaveForm/LeaveRequestForm';
import LoadingAnimation from '../../Components/Layout/animations/LoadingAnimation';
import axiosInstance from '../../utils/axiosConfig';
import { isTokenExpired, handleLogout } from '../../utils/auth';
import PunchInOut from './components/Punch-In And Punch-out/PunchInOut';
import AttendenceAndLeaveChart from './components/AttendenceAndLeaveChart/AttendenceAndLeaveChart';
import ShowemployeeStats from './components/Employee stats/ShowemployeeStats';
import EmployeeBreaks from './components/Employee Breaks recorder/EmployeeBreaks';
import { UserRound, Pencil, TentTree } from 'lucide-react';
import PermissionDropdown from './components/Permission requests/EmployeePermissions';
import EmergencyContactForm from './components/EmergencyContactForm/EmergencyContactForm';
import ChatBot from '../../Components/chatbot';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function EmployeeHome() {
    const [viewBot, setViewBot] = useState(true)
    const [employee, setEmployee] = useState([])
    const [currentTime, setCurrentTime] = useState('00:00:00');
    const [currentTime2, setCurrentTime2] = useState(new Date().toLocaleTimeString());
    const [totalWorkTime, setTotalWorkTime] = useState('00:00:00');
    const [isPunchedIn, setPunchedIn] = useState(false);
    const [punchInTime, setPunchInTime] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [breakTime, setBreakTime] = useState('00:00');
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [totalBreakTime, setTotalBreakTime] = useState(0);
    const [showQuote, setShowQuote] = useState(false);
    const [currentQuote, setCurrentQuote] = useState('');
    const [closeBtn, setCloseBtn] = useState(false);
    const [show, setShow] = useState(false);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [startTime, setStartTime] = useState('');
    const [showPunchIn, setShowPunchIn] = useState(true);
    const [recordTime, setRecordTime] = useState({
        startTime: '',
        endTime: ''
    });
    const [totalLeaves, setTotalLEaves] = useState(0);
    const [lop, setLop] = useState(0)
    const [showEmergencyContactForm, setShowEmergencyContactForm] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [userPunchedIn, setUserPunchedIn] = useState(false);
    const [monthlyLeaveData, setMonthlyLeaveData] = useState({
        month: new Date().getMonth() + 1,
        year: 2025,
        total_leave_taken: 0,
        total_loss_of_pay: 0,
        half_days_taken: 0,
        half_day_count: 0,
        permission_count: 0
    });

    const breakOptions = [
        { id: 'break1', label: 'Tea Break 1', maxDuration: 1 },
        { id: 'break2', label: 'Tea Break 2', maxDuration: 1 },
        { id: 'lunch', label: 'Lunch break', maxDuration: 2 },
        { id: 'others', label: 'Other Break', maxDuration: Infinity }
    ];

    useEffect(() => {
        const user = localStorage.getItem('user');
        // console.log(JSON.parse(user))
        if (user) {
            setEmployee(JSON.parse(user))
            setShow(true)
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime2(new Date().toLocaleTimeString());
            if (startTime) {
                const now = new Date();
                const sessionDuration = new Date(now - startTime);
                const formattedDuration = sessionDuration.toLocaleTimeString("en-US", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        let timer;
        if (isPunchedIn) {
            timer = setInterval(() => {
                const elapsed = new Date() - punchInTime;
                const hours = Math.floor(elapsed / 3600000);
                const minutes = Math.floor((elapsed % 3600000) / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                setCurrentTime(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
                setTotalWorkTime(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                );
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPunchedIn, punchInTime]);


    useEffect(() => {
        let timer;
        if (isOnBreak && breakStartTime) {
            timer = setInterval(() => {
                const elapsed = new Date() - breakStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                setBreakTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOnBreak, breakStartTime]);

    const [showLeaveForm, setShowLeaveForm] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                await handleLogout();
            }
        };

        const tokenInterval = setInterval(checkToken, 5 * 60 * 1000);

        return () => {
            clearInterval(tokenInterval);
        };
    }, []);

    useEffect(() => {
        const fetchAttendence = async () => {
            try {
                const response = await axiosInstance.get(`/api/routes/attendence/get-loginHistory/${userId}`);
                if (!response.data.ok) {
                    localStorage.setItem("leaves", [])
                    localStorage.setItem("permission", [])
                    localStorage.setItem("attendenceRecords", [])
                    return
                }
                const leaves = response.data.leaves;
                if (leaves) {
                    const leaveCount = leaves.reduce((acc, val) => {
                        return acc + val.total_leave_taken
                    }, 0)
                    setTotalLEaves(leaveCount)
                    const lopCount = leaves.reduce((acc, val) => {
                        return acc + val.total_loss_of_pay
                    }, 0)
                    setLop(lopCount)
                }
                console.log(leaves)
                localStorage.setItem("leavesCount", JSON.stringify(leaves))
                localStorage.setItem("leaves", JSON.stringify(response.data.leaves))
                localStorage.setItem("permission", JSON.stringify(response.data.permissions))
                localStorage.setItem("attendenceRecords", JSON.stringify(response.data.data))
            } catch (error) {
                console.error("Error fetching attendance:", error);
            }
        }
        fetchAttendence();
    }, [userId]);

    useEffect(() => {
        const fetchEmergencyContacts = async () => {
            try {
                const response = await axiosInstance.get(`/api/routes/profile/get-profile/${userId}`);
                // console.log("Emergency contacts response:", response.data);
                if (response.data.userDetails && response.data.userDetails[0].profile.emergency_contact) {
                    setEmergencyContacts(response.data.userDetails[0].profile.emergency_contact);
                }
            } catch (error) {
                console.error("Error fetching emergency contacts:", error);
            }
        };
        fetchEmergencyContacts();
    }, [userId]);

    useEffect(() => {
        const fetchMonthlyLeaves = async () => {
            try {
                await refreshLeaveData();
            } catch (error) {
                console.error("Error fetching monthly leaves:", error);
            }
        };
        fetchMonthlyLeaves();
    }, [selectedMonth, selectedYear, userId]);

    const refreshLeaveData = async () => {
        try {
            const monthlyLeaveResponse = await axiosInstance.get(
                `/api/routes/time-off/monthly-leaves/${userId}/${selectedMonth}/${selectedYear}`
            );

            // console.log("Monthly Leave Response:", monthlyLeaveResponse);

            if (monthlyLeaveResponse.data) {
                const backendData = monthlyLeaveResponse.data;
                // console.log(backendData)
                setMonthlyLeaveData({
                    month: selectedMonth,
                    year: parseInt(selectedYear),
                    total_leave_taken: backendData.total_leave_taken || 0,
                    half_days_taken: backendData.half_days_taken || 0,
                    total_loss_of_pay: backendData.total_loss_of_pay || 0,
                    half_day_count: backendData.half_day_count || 0,
                    permission_count: backendData.permission_count || 0
                });
                // console.log(monthlyLeaveData)
            }

            // Refresh attendance and leave history
            const attendanceResponse = await axiosInstance.get(`/api/routes/attendence/get-loginHistory/${userId}`);
            if (attendanceResponse.data.ok) {
                localStorage.setItem("leavesCount", JSON.stringify(attendanceResponse.data.leaves));
                localStorage.setItem("leaves", JSON.stringify(attendanceResponse.data.leaves));
                localStorage.setItem("permission", JSON.stringify(attendanceResponse.data.permissions));
                localStorage.setItem("attendenceRecords", JSON.stringify(attendanceResponse.data.data));
            }
        } catch (error) {
            console.error("Error refreshing leave data:", error);
        }
    };

    useEffect(() => {
        refreshLeaveData();
    }, [selectedMonth, selectedYear, userId]);

    // Add a function to handle leave approval updates
    const handleLeaveApproved = () => {
        refreshLeaveData();
    };

    const handleChat = () => {
        setViewBot(false)
    }

    return (
        <div className="min-h-screen bg-[#F0F0FF] relative">
            {/* <div className='fixed right-2 bottom-[80px] z-[1000]' onClick={handleChat}> */}

            <div className='h-[300px] top-[50%] fixed right-2 bottom-[80px] z-[1000]'>
                <ChatBot />
            </div>
            {/* </div> */}
            {show ?
                <div className=" mx-auto space-y-4 ">
                    <div className=' rounded shadow-lg py-7 px-4 bg-gradient-to-br from-fuchsia-600 to-blue-500 mt-2'>
                        <div className='flex justify-start items-center gap-3 '>
                            <p className='text-white text-lg' ><UserRound size={37} /></p>
                            <h2 className="text-lg font-semibold text-white">Welcome,  {employee.username}</h2>
                        </div>
                    </div>
                    <div className="flex flex-col  md:flex-row gap-4 h-[430px]">
                        <div>
                            {showPunchIn ? (
                                <PunchInOut
                                    onPunchStateChange={(state) => setUserPunchedIn(state)}
                                />
                            ) : (
                                <LoadingAnimation />
                            )}
                        </div>
                        <EmployeeBreaks isPunchedIn={userPunchedIn} />


                    </div>
                    <div className="flex flex-row flex-wrap  flex-grow gap-5">

                        <div className="bg-white rounded-2xl shadow-xl p-8 w-[380px] h-[430px] flex flex-col grow hover:shadow-2xl transition-all duration-300 overflow-y-auto relative">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full blur-3xl -z-10 opacity-60"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100 to-violet-100 rounded-full blur-3xl -z-10 opacity-60"></div>

                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-[500] text-black flex items-center gap-3">
                                    <span className="h-8 w-1 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full"></span>
                                    Leave Details
                                </h2>
                                <div className="flex gap-3">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="px-3 py-2 bg-gray-50 text-sm font-medium border-2 border-gray-100 rounded-xl hover:border-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ].map((month, index) => (
                                            <option key={index + 1} value={index + 1}>{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="px-3 py-2 bg-gray-50 text-sm font-medium border-2 border-gray-100 rounded-xl hover:border-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="2025">2025</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-row justify-between gap-6'>
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Eligibility leaves</p>
                                                <p className="text-base font-semibold text-indigo-900">1 day or 2 half-days</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Permissions</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base font-semibold text-emerald-900">{monthlyLeaveData?.permission_count || 0} of 2</p>
                                                    {monthlyLeaveData?.permission_count > 0 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                                            Approved
                                                        </span>
                                                    )}
                                                </div>
                                                {monthlyLeaveData?.permission_count >= 2 && (
                                                    <span className="text-[10px] font-medium text-rose-600 mt-1">(Limit Reached)</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Regular Leaves</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base font-semibold text-blue-900">{monthlyLeaveData?.total_leave_taken || 0} days</p>
                                                    {monthlyLeaveData?.total_leave_taken > 0 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                            Approved
                                                        </span>
                                                    )}
                                                </div>
                                            </div> */}

                                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-3 rounded-xl border border-violet-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Half-Day Leaves</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base font-semibold text-violet-900">{monthlyLeaveData?.half_days_taken || 0}</p>
                                                    {monthlyLeaveData?.half_days_taken > 0 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
                                                            Approved
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-500">({monthlyLeaveData?.half_day_count || 0} half days)</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Total Leaves</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base font-semibold text-amber-900">
                                                        {monthlyLeaveData?.total_leave_taken + ((monthlyLeaveData?.half_days_taken || 0) * 0.5) || 0} days
                                                    </p>
                                                    {(monthlyLeaveData?.total_leave_taken + ((monthlyLeaveData?.half_days_taken || 0) * 0.5)) > 1 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                                            Exceeds
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-3 rounded-xl border border-rose-100/50 shadow-sm">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Loss of Pay</p>
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-base font-semibold ${monthlyLeaveData?.total_loss_of_pay > 0 ? "text-rose-700" : "text-gray-900"}`}>
                                                        {monthlyLeaveData?.total_loss_of_pay || 0} days
                                                    </p>
                                                    {monthlyLeaveData?.total_loss_of_pay > 0 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-medium">
                                                            LOP
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className='w-2/6 flex flex-col justify-start gap-10 mt-4'>
                                    <div className='relative group'>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                        <img src={leave} className='w-full h-48 object-contain relative z-10' />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowLeaveForm(true)
                                            setCloseBtn(true)
                                        }}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all transform hover:scale-[1.02] font-medium shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Apply New Leave</span>
                                    </button>
                                </div> */}
                            </div>
                        </div>

                    </div>
                    <div className=' w-full flex gap-4'>
                        <div className='w-2/6 h-[400px]'>
                            <AttendenceAndLeaveChart />
                        </div>
                        <div className='w-4/6'>
                            <ShowemployeeStats />
                        </div>
                    </div>

                    <div>

                        <PermissionDropdown />
                    </div>

                </div>
                :
                <LoadingAnimation />}
            {showLeaveForm
                && <div className='flex min-h-screen w-h-screen absolute justify-center items-center top-0 z-[1000] overflow-y-auto'>
                    <LeaveRequest
                        onClose={() => setShowLeaveForm(false)}
                        onLeaveSubmitted={refreshLeaveData}
                    />

                </div>
            }
            {showEmergencyContactForm && (
                <EmergencyContactForm onClose={() => setShowEmergencyContactForm(false)} />
            )}
        </div>
    );
}

export default EmployeeHome;
import React, { useEffect, useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Avatar, Tooltip, Checkbox, Tag } from 'antd';
import { LuDot } from 'react-icons/lu';
import { IoIosMail } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { Eye, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import moment from 'moment';
import AttendancePieChart from './managerDashboard/attendanceChart';
import LoadingAnimation from '../../Components/Layout/animations/LoadingAnimation';
import CircleChart from './managerDashboard/TotalEmployees';
import axios from 'axios';
import LeaveDetailsForm from './Components/All leave records/ViewLeaveForm';
import ChatBot from '../../Components/chatbot';
import TodayBreaks from './Components/TodayBreaks';

export const colorPairs = [
    { color: "#AB47BC", bgColor: "#FFDBEC" },
    { color: "#FFC107", bgColor: "#F7EEF9" },
    { color: "#E70D0D", bgColor: "#E8E9EA" },
    { color: "#03C95A", bgColor: "#EDF2F4" },
    { color: "#FD3995", bgColor: "#F6CECE" },
];

const ManagerDashboard = () => {
    const [logggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeesError, setEmployeesError] = useState(null);
    const [leaveRecordsError, setLeaveRecordsError] = useState(null);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [roleBasedCount, setRoleBasedCount] = useState([]);
    const [employees, setEmployees] = useState([]);
    const colors = ["#AB47BC", "#FFC107", "#E70D0D", "#03C95A", "#FD3995"];
    const bgColors = ["#FFDBEC", "#F7EEF9", "#E8E9EA", "#EDF2F4", "#F6CECE"];
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [allEmployees, setAllEmployees] = useState([])


    const [leaveRequests, setLeaveRequests] = useState([]);
    const [topFiveLeaveRecords, setTopFiveLeaveRecords] = useState([])
    const [topFivePermissionRecords, setTopFivePermissionRecords] = useState([])
    const [viewLeave, setViewLeave] = useState(false);
    const [leavePopup, setLEavePopup] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState([]);
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [permission, setPermission] = useState([])

    const getEmployees = async () => {
        try {
            setEmployeesError(null);
            const response = await axios.get(
                `http://localhost:3002/api/routes/employee/view-employees/${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            let employeesData = response.data.data;
            if (!employeesData || employeesData.length === 0) {
                setEmployeesError("No employees found");
                setEmployees([]);
                setAllEmployees([]);
                setViewLeave(true)
                return;
            }

            setAllEmployees(employeesData)
            const maxEmployees = 5;

            setEmployees(employeesData.slice(0, Math.min(maxEmployees, employeesData.length)));

            const dataWithColor = employeesData.map((data, ind) => ({
                ...data,
                colorPairs: colorPairs[ind % colorPairs.length] || { primary: "#000", secondary: "#fff" },
            }));

            localStorage.setItem("selectedEmployees", JSON.stringify(dataWithColor));

            const counts = employeesData.reduce((acc, { profession_id }) => {
                const designation = profession_id?.designation;
                if (designation) {
                    acc[designation] = (acc[designation] || 0) + 1;
                }
                return acc;
            }, {});

            const result = Object.entries(counts).map(([designation, count]) => ({
                designation,
                count,
            }));

            setRoleBasedCount(result);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployeesError(error.response?.data?.message || "Failed to fetch employees. Please try again later.");
            setEmployees([]);
            setAllEmployees([]);
        }
    };
    const updateLeaveStatus = async (leaveId, newStatus, comments) => {
        console.log(leaveId, newStatus, comments)

        const updatedRecords = leaveRecords.map(record => {
            if (record._id === leaveId) {
                return {
                    ...record,
                    status_name: newStatus,
                    approval_comments: comments
                };
            }
            return record;
        });

        // setLeaveRecords(updatedRecords);
        // setFilteredRecords(updatedRecords);
        await handleRefresh()

        localStorage.setItem("leaveRecords", JSON.stringify(updatedRecords));
    };


    const loadUser = () => {
        try {
            setError(null);
            const data = localStorage.getItem("user");
            if (!data) {
                setError("No user data found. Please login again.");
                return;
            }
            setLoggedInUser(JSON.parse(data));
        } catch (error) {
            console.error("Error loading user data:", error);
            setError("Error loading user data. Please login again.");
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    const getAllLeaveRecords = async () => {
        try {
            setLeaveRecordsError(null);
            const response = await axios.get(
                `http://localhost:3002/api/routes/time-off/view-timeoff/${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.data) {
                setTopFiveLeaveRecords([]);
                setTopFivePermissionRecords([]);
                setViewLeave(true);
                return;
            }

            const leaveData = response.data.data.map((leave, ind) => {
                const user = allEmployees.find((emp) => emp._id == leave.user_id);
                return {
                    ...leave,
                    first_name: user?.first_name,
                    last_name: user?.last_name,
                    email: user?.email,
                    colorPairs: colorPairs[ind % colorPairs.length]
                };
            });

            localStorage.setItem("leaveRecords", JSON.stringify(leaveData));
            setLeaveRecords(leaveData);

            const onlyLeave = leaveData.filter((data) => data.timeoff_type !== "permission");
            const onlyPermission = leaveData.filter((data) => data.timeoff_type === "permission");
            setLeaveRequests(leaveData);
            const pendingLeave = onlyLeave.filter((leave) => leave.status_name === "Requested");
            const pendingPermission = onlyPermission.filter((leave) => leave.status_name === "Requested");

            setTopFiveLeaveRecords(pendingLeave.slice(0, 5));
            setTopFivePermissionRecords(pendingPermission.slice(0, 5));
            setViewLeave(true);
        } catch (error) {
            console.error("Error fetching leave records:", error);
            setLeaveRecordsError(error.response?.data?.message || "Failed to fetch leave records");
            setTopFiveLeaveRecords([]);
            setTopFivePermissionRecords([]);
            setViewLeave(true);
        }
    };

    useEffect(() => {
        if (!userId || !token) return;

        loadUser();
        getEmployees();
    }, [userId, token]);

    useEffect(() => {
        if (employees.length > 0) {
            getAllLeaveRecords();
        }
    }, [employees]);


    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const months = moment.months();
    const years = Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i);
    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);
        const day = new Date(date).getDate();
        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                    ? "nd"
                    : day % 10 === 3 && day !== 13
                        ? "rd"
                        : "th";

        return formattedDate.replace(day, `${day}${suffix}`);
    };

    const handleApprove = (id, data) => {
        console.log("Selected leave data:", data);
        setSelectedLeave({
            ...data,
            status_name: data.status_name || 'Pending'
        });
        setLEavePopup(true);
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await getAllLeaveRecords();
            toast.success('Records refreshed successfully');
        } catch (error) {
            console.error('Error refreshing records:', error);
            toast.error('Failed to refresh records');
        } finally {
            setIsRefreshing(false);
        }
    };
    const handleLeaveApprove = async (id, data) => {
        console.log(id, data)
        try {
            // setLoading(true);
            const response = await axios.put(
                `http://localhost:3002/api/routes/time-off/approve-timeoff/${data.user_id}/${data._id}/${userId}`,
                {
                    approvalComments: "Approved"
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data)
            await handleRefresh()

            // if (response.status === 200) {
            //     updateLeaveStatus(data._id, "Approved", approvalComment);
            //     toast.success("Leave request approved successfully");
            //     onClose();
            // }
        } catch (error) {
            console.error("Error approving leave:", error);
            toast.error(error.response?.data?.message || "Error approving leave request");
        }
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center w-[100%] min-h-screen'>
                <LoadingAnimation />
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex justify-center items-center w-[100%] min-h-screen'>
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className=''>
                <div className='h-min-screen w-min-screen bg-[#F8F9FA]'>
                    <div className='h-[300px] top-[50%] fixed right-2 bottom-[80px] z-[1000]'>
                        <ChatBot />
                    </div>
                    <div className=''>
                        <div className='flex flex-col lg:flex-row flex-wrap grow w-full'>
                            {/* Pending Leave Request Section */}
                            <div className="w-full lg:w-1/2 p-2 rounded-lg shadow-xl flex-grow mb-4">
                                <div className="border-b border-black flex justify-between items-center p-4">
                                    <span className="font-[500]">Pending Leave Request</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                            className={`p-2 bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] transition-all duration-200 ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                                            title="Refresh records"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                        </button>
                                        <button
                                            onClick={() => navigate("/manager/view-records")}
                                            className="p-2 bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] flex flex-row items-center gap-2 text-sm transition-all duration-200"
                                        >
                                            View All
                                        </button>
                                    </div>
                                </div>
                                {leaveRecordsError ? (
                                    <div className="flex justify-center items-center h-[100px] text-red-500 bg-red-50 m-4 rounded-lg p-4">
                                        <div className="text-center">
                                            <p className="font-medium">Error Loading Leave Requests</p>
                                            <p className="text-sm mt-1">{leaveRecordsError}</p>
                                        </div>
                                    </div>
                                ) : !viewLeave ? (
                                    <div className="flex justify-center items-center h-[100px]">
                                        <LoadingAnimation />
                                    </div>
                                ) : topFiveLeaveRecords.length > 0 ? (
                                    <div className="overflow-y-auto space-y-2 mt-2 gap-8 h-auto">
                                        {topFiveLeaveRecords.map((data, ind) => (
                                            <div key={ind} className="border rounded-lg py-2 px-3 hover:bg-gray-50 transition-all duration-200">
                                                <div className="flex items-center gap-3 justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Avatar.Group>
                                                            <Tooltip title={`${data.first_name} ${data.last_name}`} placement="top">
                                                                <Avatar
                                                                    style={{
                                                                        backgroundColor: bgColors[ind % bgColors.length],
                                                                        color: colors[ind % colors.length],
                                                                    }}
                                                                >
                                                                    {data.first_name.slice(0, 1).toUpperCase()}
                                                                    {data.last_name.slice(0, 1).toUpperCase()}
                                                                </Avatar>
                                                            </Tooltip>
                                                        </Avatar.Group>
                                                        <div className="flex flex-col gap-2">
                                                            <div className='flex gap-2'>
                                                                <span className="font-semibold text-sm">
                                                                    {data.first_name} {data.last_name}
                                                                </span>
                                                                <Tag
                                                                    color={colors[ind % colors.length]}
                                                                    className="opacity-55 text-[12px] px-1"
                                                                >
                                                                    {data.timeoff_type === "permission"
                                                                        ? "Permission"
                                                                        : data.timeoff_type === "full_day"
                                                                            ? "Full Day"
                                                                            : "Half Day"}

                                                                </Tag>
                                                            </div>
                                                            <span className="text-xs text-gray-600">
                                                                {data.timeoff_type == "full_day" ? <p>{data.leave_type} • {formatDate(data.leave_date[0].start_date)} - {formatDate(data.leave_date[0].end_date)}</p>
                                                                    :
                                                                    <p>{data.leave_type} • {data.leave_date[0].start_date == "9 AM " ? "First half" : "Second half"}• {formatDate(data.leave_date[0].date)}</p>
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">

                                                        <button
                                                            onClick={() => handleApprove(data._id, data)}
                                                            title='view'
                                                            className="px-3 py-1 text-xs bg-[#EFF1F4] rounded-md hover:bg-[#c7cacf] transition-all text-gray-400"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleLeaveApprove(data._id, data)}
                                                            className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-[200px] text-gray-500 bg-gray-50 m-4 rounded-lg">
                                        <div className="text-center">
                                            <p className="font-medium">No Pending Leave Requests</p>
                                            <p className="text-sm mt-1">All leave requests have been processed</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pending Permission Section */}
                            <div className="w-full lg:w-1/2 p-2 rounded-lg shadow-lg flex-grow mb-4">
                                <div className="border-b border-black flex justify-between items-center p-4">
                                    <span className="font-[500]">Pending Permission</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                            className={`p-2 bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] transition-all duration-200 ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                                            title="Refresh records"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                        </button>
                                        <button
                                            onClick={() => navigate("/manager/view-records")}
                                            className="p-2 bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] flex flex-row items-center gap-2 text-sm transition-all duration-200"
                                        >
                                            View All
                                        </button>
                                    </div>
                                </div>
                                {leaveRecordsError ? (
                                    <div className="flex justify-center items-center h-[100px] text-red-500 bg-red-50 m-4 rounded-lg p-4">
                                        <div className="text-center">
                                            <p className="font-medium">Error Loading Permission Requests</p>
                                            <p className="text-sm mt-1">{leaveRecordsError}</p>
                                        </div>
                                    </div>
                                ) : !viewLeave ? (
                                    <div className="flex justify-center items-center h-[100px]">
                                        <LoadingAnimation />
                                    </div>
                                ) : topFivePermissionRecords.length > 0 ? (
                                    <div className="overflow-y-auto space-y-2 mt-2 gap-8 h-auto">
                                        {topFivePermissionRecords.map((data, ind) => (
                                            <div key={ind} className="border rounded-lg p-3 hover:bg-gray-50 transition-all duration-200">
                                                <div className="flex items-center gap-3 justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Avatar.Group>
                                                            <Tooltip title={`${data.first_name} ${data.last_name}`} placement="top">
                                                                <Avatar
                                                                    style={{
                                                                        backgroundColor: bgColors[ind % bgColors.length],
                                                                        color: colors[ind % colors.length],
                                                                    }}
                                                                >
                                                                    {data.first_name[0].toUpperCase()}
                                                                    {data.last_name[0].toUpperCase()}
                                                                </Avatar>
                                                            </Tooltip>
                                                        </Avatar.Group>
                                                        <div className="flex flex-col gap-2">
                                                            <div className='flex gap-2'>
                                                                <span className="font-semibold text-sm">
                                                                    {data.first_name} {data.last_name}
                                                                </span>
                                                                <Tag
                                                                    color={colors[ind % colors.length]}
                                                                    className="opacity-55 text-[12px] px-1"
                                                                >
                                                                    Permission
                                                                </Tag>
                                                            </div>
                                                            <span className="text-xs text-gray-600">
                                                                {data.timeoff_type} • {formatDate(data.leave_date[0].date)} - {data.leave_date[0].start_date} to {data.leave_date[0].end_date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">

                                                        <button
                                                            onClick={() => handleApprove(data._id, data)}
                                                            title='view'
                                                            className="px-3 py-1 text-xs bg-[#EFF1F4] rounded-md hover:bg-[#c7cacf] transition-all"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleLeaveApprove(data._id, data)}
                                                            className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-[200px] text-gray-500 bg-gray-50 m-4 rounded-lg">
                                        <div className="text-center">
                                            <p className="font-medium">No Pending Permission Requests</p>
                                            <p className="text-sm mt-1">All permission requests have been processed</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Today's Breaks Section */}
                        <div className="mb-8 px-2">
                            <TodayBreaks />
                        </div>

                        <div className='w-[full] h-auto flex flex-row gap-4 p-4'>

                            <div className=' p-2 rounded-lg shadow-lg w-1/2'>
                                <div className="border-b-2 border-red-100 flex justify-between items-center pt-1 pb-1">
                                    <span className="font-[500] ">Team Members</span>
                                    <button className="p-2 bg-[#EFF1F4] rounded-lg hover:bg-blue-200 text-sm hover:text-blue-700"
                                        onClick={() => navigate("/manager/employees")}>
                                        View All
                                    </button>
                                </div>
                                {employeesError ? (
                                    <div className="flex justify-center items-center h-[100px] text-red-500 bg-red-50 m-4 rounded-lg">
                                        {employeesError}
                                    </div>
                                ) : employees.length > 0 ? (
                                    employees.map((user, index) => (
                                        <div className='flex flex-col '>
                                            <div key={index} className="flex flex-row gap-6 p-2 items-center cursor-pointer" onClick={() => navigate(`/manager/view-employee/${user._id}`)}>
                                                <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg" alt="{user.userName}" className="bg-red-300 h-[40px] w-[40px] rounded-full" />

                                                <div className="flex flex-col justify-center items-start">
                                                    <p className='text-black text-[15px]'
                                                    >{user.first_name} {user.last_name}</p>
                                                    <p className='text-[gray] text-[10px] rounded px-2 py-1'
                                                        style={{
                                                            background: bgColors[index % bgColors.length],
                                                            color: colors[index % colors.length]
                                                        }}>{user.profession_id.designation}</p>
                                                </div>
                                                <div className="flex flex-row gap-3 items-center justify-end flex-1">
                                                    <IoIosMail size={17} color="black" />
                                                    <BiMessageRoundedDots size={17} color="black" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={`flex justify-center items-center ${employees.length === 0 ? "h-[100px]" : "h-[200px]"} text-gray-500`}>
                                        No employees found
                                    </div>
                                )}
                            </div>
                            <div className='w-1/2 shadow-lg p-3'>
                                <p className='mt-5 font-[500]'>Team Distribution</p>
                                {roleBasedCount.length > 0 ?
                                    <div>

                                        <CircleChart data={roleBasedCount} />
                                    </div>
                                    :
                                    <div className="flex justify-center items-center h-[200px] text-gray-500 bg-gray-50 m-4 rounded-lg">
                                        <div className="text-center">
                                            <p className="font-medium">No teams members found</p>
                                            {/* <p className="text-sm mt-1">All permission requests have been processed</p> */}
                                        </div>
                                    </div>
                                }
                            </div>

                        </div>

                        <div className=' p-2 flex flex-wrap flex-row justify-between'>
                            <div className='w-1/2'>
                                <AttendancePieChart />
                            </div>
                            <div className=' w-1/2 shadow-lg rounded  mt-4 p-4'>
                                <p className="font-[500] text-lg">Profile</p>
                                <div className='mt-4'>

                                    <div className='bg-[#daaeb5] rounded-t-lg w-full h-[100px] flex flex-row items-center p-4 gap-5'>
                                        <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg" alt="img" className='bg-red-300 h-[70px] w-[70px] rounded-full' />
                                        <div className='flex flex-col text-white gap-2'>
                                            <p>
                                                {logggedInUser.username}
                                            </p>
                                            <p className='text-sm text-red-700'>
                                                {logggedInUser.role.role_value}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='mt-4 ps-4'>
                                        <div className='flex flex-col text-white'>
                                            <span className='text-[gray] text-[14px]'>
                                                Phone Number
                                            </span>
                                            <span className='text-black '>
                                                {logggedInUser.phone}
                                            </span>
                                        </div>
                                        <div className='flex flex-col text-white gap-2 mt-4'>
                                            <span className='text-[gray] text-[14px]'>
                                                Email Address
                                            </span>
                                            <span className='text-black'>
                                                {logggedInUser.email}
                                            </span>
                                        </div>
                                        <div className='flex flex-col text-white gap-2 mt-4'>
                                            <span className='text-[gray] text-[14px]'>
                                                Joined on
                                            </span>
                                            <span className='text-black'>
                                                {logggedInUser.profile.joining_date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                {leavePopup &&
                    <div className='flex min-h-screen w-h-screen absolute justify-center items-center top-0 z-[1000]'>
                        <LeaveDetailsForm
                            data={selectedLeave}
                            onClose={() => setLEavePopup(false)}
                            updateLeaveStatus={updateLeaveStatus}
                        />
                    </div>
                }
            </div>
        </>
    )
}

export default ManagerDashboard

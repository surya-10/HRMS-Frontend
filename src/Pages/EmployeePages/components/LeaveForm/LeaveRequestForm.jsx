import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import DatePickerValue from '../DatePicker';
import TimePickerValue from '../TimePicker';
import BasicDatePicker from '../BasicDatePicker';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import axios from 'axios';

const DropdownOption = ({ children, onClick, selected }) => (
    <div
        className={`p-3 w-full rounded-md flex cursor-pointer items-center transition-all duration-200 ${selected ? 'bg-blue-50 text-[#1e3a8a]' : 'hover:bg-gray-50 hover:text-[#1e3a8a]'
            }`}
        onClick={onClick}
    >
        {children}
    </div>
);

const Dropdown = ({ setHalf, value, options, onChange, placeholder = 'Select', icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    // console.log(typeof halfDay)
    useEffect(() => {
        if (value === "Half Day" && typeof setHalf === 'function') {
            setHalf("half");
        }
    }, [value, setHalf]);

    // if(value==)
    // setHalfDay("half day")

    return (
        <div className="relative w-full">
            <div
                className={`flex items-center justify-between px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isOpen ? 'border-[#1e3a8a] bg-blue-50' : 'hover:border-[#1e3a8a] border-gray-200'
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`${value === 'Select' ? 'text-gray-500' : 'text-gray-900'}`}>
                    {value === 'Select' ? placeholder : value}
                </span>
                <DownOutlined className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg py-2 animate-fadeIn">
                    {options.map((option) => (
                        <DropdownOption
                            key={option.value}
                            selected={value === option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </DropdownOption>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeaveRequest = ({ onClose = () => { }, onLeaveSubmitted = () => { } }) => {
    const [selected, setSelected] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(false);
    const [halfDayValue, setHalfDayValue] = useState("")
    const [halfDay, setHalfDay] = useState(false);
    const [value, setValue] = useState('Select');
    const [value2, setValue2] = useState('Select');
    const [value3, setValue3] = useState('Select');
    const [reason, setReason] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    // const [halfDay, setHalfDay] = useState(false);


    const formatTimeToAMPM = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour} ${ampm}`;
    };

    

    const validateForm = () => {
        const newErrors = {};

        if (value === 'Select') {
            newErrors.leaveType = 'Please select type of leave request';
        }

        if (value === 'Leave' && value2 === 'Select') {
            newErrors.leaveSelection = 'Please select leave duration';
        }

        if (value2 === 'Half Day' && value3 === 'Select') {
            newErrors.halfDaySelection = 'Please select which half of the day';
        }

        if (value === 'Permission' && (!startTime || !endTime)) {
            newErrors.time = 'Please select both start and end time';
        }

        if (!reason.trim()) {
            newErrors.reason = 'Please provide a reason for your leave';
        }

        if (!selectedDate) {
            newErrors.date = 'Please select a date';
        }

        if (value === 'Leave' && value2 === 'One Day') {
            if (!startDate || !endDate) {
                newErrors.dateRange = 'Please select both start and end dates';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkMonthlyLeaveLimit = async (leaveDate) => {
        try {
            const date = new Date(leaveDate);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const userId = localStorage.getItem('userId');

            const response = await axios.get(
                `/api/routes/employee/monthly-leaves/${userId}/${month}/${year}`
            );

            if (response.data.ok) {
                const { totalLeaves } = response.data.data;
                // For half day leave
                if (value2 === 'Half Day' && totalLeaves >= 1) {
                    return {
                        allowed: false,
                        message: 'You have already taken maximum leaves for this month'
                    };
                }
                // For full day leave
                if (value2 === 'One Day' && totalLeaves >= 1) {
                    return {
                        allowed: false,
                        message: 'You have already taken maximum leaves for this month. This will be counted as Loss of Pay.'
                    };
                }
            }
            return { allowed: true };
        } catch (error) {
            console.error('Error checking monthly leave limit:', error);
            return { allowed: true }; // Allow in case of error, backend will handle the limit
        }
    };

    const handleSubmit = async () => {
        try {
            // if (!validateForm()) {
            //     return;
            // }

            let leaveDate;
            if (value === 'Permission') {
                leaveDate = {
                    start_date: formatTimeToAMPM(startTime),
                    end_date: formatTimeToAMPM(endTime),
                    date: selectedDate
                };
            } else if (value === 'Leave') {
                if (value2 === 'Half Day') {
                    const timeRange = value3 === 'First Half'
                        ? { start: '9 AM', end: '1 PM' }
                        : { start: '2 PM', end: '7 PM' };
                    leaveDate = {
                        start_date: timeRange.start,
                        end_date: timeRange.end,
                        date: selectedDate
                    };

                    // Check monthly limit for the selected date
                    const limitCheck = await checkMonthlyLeaveLimit(selectedDate);
                    if (!limitCheck.allowed) {
                        toast.warning(limitCheck.message);
                        // Continue with submission as it will be marked as LOP
                    }
                } else if (value2 === 'One Day') {
                    // Check monthly limit for each day in the date range
                    const limitCheck = await checkMonthlyLeaveLimit(startDate);
                    if (!limitCheck.allowed) {
                        toast.warning(limitCheck.message);
                        // Continue with submission as it will be marked as LOP
                    }

                    leaveDate = {
                        start_date: startDate,
                        end_date: endDate,
                        date: selectedDate || startDate
                    };
                }
            }

            const leaveRequest = {
                leave_request: {
                    timeoff_type: value === 'Permission' ? 'permission' : 'full_day',
                    leave_type: "Personal",
                    leave_date: [leaveDate],
                    is_permission: value === 'Permission',
                    status_name: "Requested",
                    initialed_on: "",
                    comments: reason,
                    status: true
                },
                date: selectedDate || startDate
            };

            if (halfDayValue === "half") {
                leaveRequest.leave_request.is_half_day_leave = true;
                leaveRequest.leave_request.timeoff_type = "half_day";
            } else {
                leaveRequest.leave_request.is_half_day_leave = false;
            }

            await submitLeaveRequest(leaveRequest);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit leave request. Please try again.');
        }
    };

    const submitLeaveRequest = async (data) => {
        console.log(data)
        try {
            if(halfDayValue==="half"){
                data.leave_request.is_half_day_leave=true;
                data.leave_request.timeoff_type="half_day"
            }
            else{
                data.leave_request.is_half_day_leave=false;
            }
            
            const response = await axios.post(
                `http://localhost:3002/api/routes/time-off/create-timeoff/${userId}`, 
                data,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (response.data) {
                toast.success('Leave request submitted successfully!');
                try {
                    await onLeaveSubmitted(); // Ensure this is awaited
                } catch (refreshError) {
                    console.error('Error refreshing leave data:', refreshError);
                    toast.warning('Leave submitted but the display may not be up to date. Please refresh the page.');
                }
                onClose();
                return true;
            }
        } 
        catch (error) {
            console.error('Error submitting leave request:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit leave request. Please try again.';
            toast.error(errorMessage);
            return false;
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {

        }
    };

    const leaveTypeOptions = [
        { value: 'Permission', label: 'Permission' },
        { value: 'Leave', label: 'Leave' }
    ];

    const leaveDurationOptions = [
        { value: 'Half Day', label: 'Half Day' },
        { value: 'One Day', label: 'One Day' }
    ];

    const halfDayOptions = [
        { value: 'First Half', label: 'First Half (Morning)' },
        { value: 'Second Half', label: 'Second Half (Afternoon)' }
    ];

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4 overflow-y-auto'>
            <div className='my-auto bg-white rounded-lg shadow-xl w-[500px] flex flex-col max-h-[90vh]'>
                {/* Header */}
                <div className='flex-none flex justify-between items-center p-6 border-b-2 border-gray-200'>
                    <span className='text-lg font-[500] text-gray-900'>
                        Add Leave Request
                    </span>
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className='text-xl font-semibold cursor-pointer text-gray-500 hover:text-[#1e3a8a] transition-colors'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-gray-700'>
                                Type of leave request
                            </label>
                            <Dropdown
                                setHalf={setHalfDayValue}
                                value={value}
                                options={leaveTypeOptions}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                    setValue2('Select');
                                    setValue3('Select');
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                placeholder="Select leave type"
                            />
                            {errors.leaveType && <span className="text-red-500 text-sm">{errors.leaveType}</span>}
                        </div>

                        {value === 'Permission' ? (
                            <div className='space-y-4'>
                                <div className='bg-blue-50 border-2 border-[#1e3a8a] rounded-lg p-3'>
                                    <span className='w-full flex justify-center items-center text-[#1e3a8a]'>
                                        One Hour Permission
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className='space-y-2'>
                                        <label className='text-gray-700'>Select Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            // max={new Date().toISOString().split('T')[0]}
                                            className='w-full border-2 border-gray-200 rounded-lg p-2'
                                        />
                                        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>Start Time</label>
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className='w-full border-2 border-gray-200 rounded-lg p-2'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>End Time</label>
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className='w-full border-2 border-gray-200 rounded-lg p-2'
                                            />
                                        </div>
                                    </div>
                                    {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
                                </div>
                            </div>
                        ) : value === 'Leave' && (
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <label className='text-gray-700'>
                                        Select leave duration
                                    </label>
                                    <Dropdown
                                        setHalf={setHalfDayValue}
                                        value={value2}
                                        options={leaveDurationOptions}
                                        onChange={(newValue) => {
                                            setValue2(newValue);
                                            setValue3('Select');
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                        placeholder="Select duration"
                                    />
                                    {errors.leaveSelection && <span className="text-red-500 text-sm">{errors.leaveSelection}</span>}
                                </div>

                                {value2 === 'Half Day' ? (
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>Select Date</label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                // max={new Date().toISOString().split('T')[0]}
                                                className='w-full border-2 border-gray-200 rounded-lg p-2'
                                            />
                                            {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>
                                                Select half of the day
                                            </label>
                                            <Dropdown
                                                value={value3}
                                                options={halfDayOptions}
                                                onChange={setValue3}
                                                placeholder="Select time of day"
                                            />
                                            {errors.halfDaySelection && <span className="text-red-500 text-sm">{errors.halfDaySelection}</span>}
                                        </div>
                                    </div>
                                ) : value2 === 'One Day' && (
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                // max={new Date().toISOString().split('T')[0]}
                                                className='w-full border-2 border-gray-200 rounded-lg p-2'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-gray-700'>End Date</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                // max={new Date().toISOString().split('T')[0]}
                                                className='w-full border-2 border-gray-200 rounded-lg p-2'
                                            />
                                        </div>
                                        {errors.dateRange && <span className="text-red-500 text-sm">{errors.dateRange}</span>}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className='space-y-2'>
                            <label className='text-gray-700'>
                                Reason
                            </label>
                            <textarea
                                className='w-full border-2 border-gray-200 rounded-lg p-3 min-h-[100px] max-h-[140px] leading-relaxed resize-none focus:border-[#1e3a8a] focus:outline-none transition-colors duration-200'
                                placeholder='Please provide a reason for your leave request'
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                            {errors.reason && <span className="text-red-500 text-sm">{errors.reason}</span>}
                        </div>
                    </div>
                </div>

                {/* Footer with Buttons - Fixed */}
                <div className='flex-none p-6 border-t-2 border-gray-200 bg-white'>
                    <div className='flex justify-end gap-3'>
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className='px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className='px-6 py-2.5 rounded-lg text-white bg-[#1e3a8a] hover:bg-[#1e40af] transition-colors duration-200'
                        >
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

LeaveRequest.propTypes = {
    onClose: PropTypes.func.isRequired,
    onLeaveSubmitted: PropTypes.func
};

export default LeaveRequest;

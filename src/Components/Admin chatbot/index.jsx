import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessagesSquare, X, RefreshCw, Pencil, Check, CircleCheckBig } from 'lucide-react';
import AgentLoader from '../Layout/animations/DotAnimationForAgent';
import { set } from 'date-fns';


const AdminAgent = () => {
    const [email, setEmail] = useState('')
    const userId = localStorage.getItem("userId");
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [parsedData, setParsedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showEndButton, setShowEndButton] = useState(false);
    const token = localStorage.getItem("token");
    const userName = JSON.parse(localStorage.getItem("user"))?.username || "User";
    const messagesEndRef = useRef(null);
    const [disableConfirmation, setDisableConfirmation] = useState(false);
    const [placeHolder, setPlaceHolder] = useState("")
    const [userSelectedDates, setUserSelectedDates] = useState({
        start_date: "",
        end_date: "",
        date: "",
        isHalfDay: false,
        halfDayType: ""
    })
    const [processing, setProcessing] = useState(false)
    const [leaveReason, setLeaveReason] = useState("")
    const [userDate, setUserDate] = useState("");
    const [returned, setReturned] = useState(false);
    const [isHalf, setIsHalf] = useState(false);
    const [fullDay, setFullDay] = useState(false);
    const [halfDay, setHalfDay] = useState(false);
    const [fullDayTemplate, setFullDayTemplate] = useState("I want to apply full day leave from 25/03/2025 to 26/03/2025 due to personal work");
    const [isEditing, setIsEditing] = useState(false);
    const [isHalfDayEditing, setHalfDayEditing] = useState(false);
    const [halfDayTemplate, setHalfDayTemplate] = useState("Personal leave on Feb 21 2025 first half. Or: \n Personal leave on Feb 21 2025 second half")
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        console.log(currentUser.role.role_value)
    }, [])

    const [showEmailBox, setShowEmailBox] = useState(false)

    // useEffect(() => {
    //   if (isOpen && messages.length === 0) {
    //     // Initial greeting messages
    //     setMessages([
    //       {
    //         type: 'bot',
    //         text: `👋 Welcome ${userName}! I'm your leave management assistant.`
    //       },
    //       {
    //         type: 'bot',
    //         text: 'Here are some example formats to apply for leave:',
    //         showExamples: true
    //       }
    //     ]);
    //   }
    // }, [isOpen]);

    useEffect(() => {
        showInitialMessages();
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages, parsedData, confirmationStep]);

    const leaveExamples = [
        "I want leave from Feb 20 2025 to Feb 21 2025 due to personal work",
        "Need leave on Feb 25 2025 due to family function",
        "I need leave from March 1 2025 to March 3 2025 for wedding ceremony"
    ];

    const formatDateForDisplay = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day} ${year}`;
    };

    const showInitialMessages = () => {
        const initialMessages = [
            {
                type: 'bot',
                text: `👋 Welcome ${userName}! I'm your task management assistant.`
            },
            // { 
            //   type: 'bot',
            //   text: 'Here are some example formats to apply for leave:',
            //   showExamples: true
            // }
        ];
        setMessages(initialMessages);
    };

    const resetChat = () => {
        setMessages([]);
        setParsedData(null);
        setConfirmationStep(false);
        setDisableConfirmation(false);
        setPlaceHolder("Type your leave request...");
        setLeaveReason("");
        setUserDate("");
        setReturned(false);
        setMessage("");
        setShowEndButton(false);
        showInitialMessages();
        setFullDay(false);
        setIsEditing(true);
        setHalfDayEditing(false);
        setHalfDay(false);
        setShowEmailBox(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Reset states when user enters new input
        if (!returned) {
            setLeaveReason("");
            setUserDate("");
        }
        if (message == "Half-day") {
            setIsHalf(true)
            setMessages(prev => [...prev, { type: 'bot', text: "Format to apply half-day leave 😊" }]);
            setMessages(prev => [...prev, { type: 'bot', text: "Example: Personal leave on Feb 21 2025 first half" }]);
            setMessages(prev => [...prev, { type: 'bot', text: "Or: Personal leave on Feb 21 2025 second half" }]);
            setMessage("")
            return
        }
        else if (message == "Full-day") {
            setIsHalf(false)
            setFullDay(true)
            setMessages(prev => [...prev, { type: 'bot', text: "Format to apply full-day leave 😊" }]);
            setMessage("")
            // setMessages(prev => [...prev, { type: "bot", text: "I want to apply full day leave from 25/03/2025 to 26/03/2025 due to personal work" }])
            return
        }

        setMessages(prev => [...prev, { type: 'user', text: message }]);
        setLoading(true);
        setError(null);

        try {
            setProcessing(true);
            const obj = {
                data: returned ? `${userDate} ${message}` : message
            };
            console.log(obj, 145)
            const res = await axios.post("http://localhost:3002/api/routes/apply-leave-nlp/apply-leave", obj, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(res.data)
            if (res.data.isHalfDay) {

            }
            if (res.data.reason.toLowerCase() == "not found") {
                console.log(127)
            }

            // First check if we have valid dates
            if (!res.data.date || res.data.date.length === 0) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: "Please provide the dates for your leave request. You can use formats like:\n- Feb 20 2025 to Feb 21 2025\n- March 1 2025",
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter dates for your leave");
                return;
            }

            // Store the dates if found
            const dates = res.data.date;
            setUserSelectedDates({
                start_date: dates[0].start,
                end_date: dates[0].end,
                date: dates[0].start,
            });

            // Then check for reason
            if (res.data.reason.toLowerCase() === "not found" || !res.data.reason) {
                if (!returned) {
                    setUserDate(message);
                }
                const startDate = formatDateForDisplay(dates[0].start);
                const endDate = formatDateForDisplay(dates[0].end);

                let timeRange = '';
                if (dates[0].isHalfDay) {
                    timeRange = dates[0].halfDayType === 'first' ? '(9 AM to 1 PM)' : '(2 PM to 7 PM)';
                }

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `I see you want leave on ${startDate} ${timeRange}. Please provide a reason for your leave request. For example: 'due to personal work' or 'for medical appointment'`,
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter your reason here");
                setReturned(true);
                return;
            }

            // If we have both dates and reason
            setLeaveReason(res.data.reason);
            setReturned(false);

            // Only show confirmation if we have a valid reason (not "not found")
            if (res.data.reason && res.data.reason !== "not found") {
                const startDate = formatDateForDisplay(dates[0].start);
                const endDate = formatDateForDisplay(dates[0].end);

                let timeRange = '';
                if (dates[0].isHalfDay) {
                    timeRange = dates[0].halfDayType === 'first' ? '(9 AM to 1 PM)' : '(2 PM to 7 PM)';
                }

                const confirmationMessage = dates[0].isHalfDay
                    ? `I understand you want to take half-day leave on ${startDate} ${timeRange} for ${res.data.reason}. Would you like me to submit this leave request?`
                    : `I understand you want to take leave from ${startDate} to ${endDate} for ${res.data.reason}. Would you like me to submit this leave request?`;

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: confirmationMessage,
                    isConfirmation: true
                }]);
                setConfirmationStep(true);
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm having trouble understanding your request. Please provide both dates and reason for your leave. For example: 'I want leave from Feb 20 2025 to Feb 21 2025 due to personal work'",
                isConfirmation: false
            }]);
            // Reset states on error
            setLeaveReason("");
            setUserDate("");
            setReturned(false);
        } finally {
            setLoading(false);
            setProcessing(false);
            setMessage('');
        }
    };

    const handleConfirmation = async (isConfirmed) => {
        console.log(isConfirmed)
        if (isConfirmed) {
            console.log("confirmed")
            try {
                let leaveRequest = null;
                setProcessing(true)
                const currentDate = new Date().toISOString().split('T')[0]; // Get current date for applying date

                if (isHalf) {
                    // For half-day leave
                    const selectedDate = userSelectedDates.start_date.split('T')[0]; // Extract date part only
                    const timeRange = userSelectedDates.halfDayType === 'first'
                        ? { start: "9 AM", end: "1 PM" }
                        : { start: "2 PM", end: "7 PM" };

                    leaveRequest = {
                        leave_request: {
                            timeoff_type: 'half_day',
                            leave_type: "Personal",
                            leave_date: [{
                                start_date: timeRange.start,
                                end_date: timeRange.end,
                                date: selectedDate,

                            }],
                            is_permission: false,
                            status_name: "Requested",
                            initialed_on: "",
                            comments: leaveReason,
                            status: true,
                            is_half_day_leave: true
                        },
                        date: currentDate // Current date as applying date
                    };
                } else {
                    // For full-day leave
                    leaveRequest = {
                        leave_request: {
                            timeoff_type: 'full_day',
                            leave_type: "Personal",
                            leave_date: [{
                                start_date: userSelectedDates.start_date,
                                end_date: userSelectedDates.end_date,
                                date: currentDate, // Current date as applying date

                            }],
                            is_permission: false,
                            status_name: "Requested",
                            initialed_on: "",
                            comments: leaveReason,
                            status: true,
                            is_half_day_leave: false
                        },
                        date: currentDate // Current date as applying date
                    };
                }

                console.log(leaveRequest, 280);
                const response = await axios.post(
                    `http://localhost:3002/api/routes/time-off/create-timeoff/${userId}`,
                    leaveRequest,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(response.data)
                if (response.data) {
                    setMessages(prev => [
                        ...prev,
                        {
                            type: 'bot',
                            text: "✅ Great! Your leave request has been submitted successfully. You will receive a confirmation email as well."
                        }
                    ]);
                    setShowEndButton(true);

                    // Reset all states after successful submission
                    setParsedData(null);
                    setConfirmationStep(false);
                    setLeaveReason("");
                    setUserDate("");
                    setReturned(false);
                }
            } catch (error) {
                console.log(error)
                const errorMessage = error.response?.data?.message || 'Failed to submit leave request. Please try again.';
                setMessages(prev => [
                    ...prev,
                    {
                        type: 'bot',
                        text: errorMessage + "😒." + "Try selecting different dates."
                    }
                ]);
                if (isHalf) {
                    setHalfDayEditing(false);
                    setHalfDay(true);
                } else {
                    setIsEditing(false);
                    setFullDay(true);
                }
                // Reset states on error
                setParsedData(null);
                setConfirmationStep(false);
                setLeaveReason("");
                setUserDate("");
                setReturned(false);
                setDisableConfirmation(false);
                setShowEndButton(false);
            } finally {
                setProcessing(false)
            }
        } else {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "No problem. Please provide your leave details again."
            }]);
            // Reset all states when user clicks No
            setParsedData(null);
            setConfirmationStep(false);
            setLeaveReason("");
            setUserDate("");
            setReturned(false);
            setDisableConfirmation(false);
            setShowEndButton(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            scrollToBottom();
        }
    };

    const handleLeaveExample = () => {
        setMessage("I want to apply leave from 25/03/2025 to 26/03/2025 due to personal work");
    };
    const handleFullOrHalf = (value) => {
        if (value === "generate-pay-slip") {
            setMessages(prev => [
                ...prev,
                { type: "user", text: "Generate payslip" },
                { type: "bot", text: "Provide user email to generate payslip  😊" }
            ]);

            setIsHalf(false);
            //   setFullDay(true);
            setShowEmailBox(true)
            setMessage("");
        }
        // else if (value === "Half-day") {
        //   setMessages(prev => [
        //     ...prev,
        //     { type: "user", text: value },
        //     { type: "bot", text: "Format to apply half-day leave ⏳" }
        //   ]);

        //   setIsHalf(true);
        //   setFullDay(false);
        //   setHalfDay(true)
        //   setMessage("");
        //   // setFullDayTemplate("Personal leave on Feb 21 2025 first half");

        // }
    };



    const textareaRef = useRef(null);
    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
    };
    const handleEditToggleHalfDay = () => {
        setHalfDayEditing(prev => !prev);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log(fullDayTemplate)
        setIsEditing(false);
        setMessages(prev => [...prev, {
            type: "user",
            text: fullDayTemplate
        }]);

        try {
            setFullDay(false)
            setProcessing(true);
            const obj = {
                data: fullDayTemplate
            };
            console.log(obj)
            const res = await axios.post("http://localhost:3002/api/routes/apply-leave-nlp/apply-leave", obj, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(res.data)

            // First check if we have valid dates
            if (!res.data.date || res.data.date.length === 0) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: "Please provide the dates for your leave request. You can use formats like:\n- Feb 20 2025 to Feb 21 2025\n- March 1 2025",
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter dates for your leave");
                return;
            }

            // Store the dates if found
            const dates = res.data.date;
            setUserSelectedDates({
                start_date: dates[0].start,
                end_date: dates[0].end,
                date: dates[0].start,
                isHalfDay: false,
                halfDayType: ""
            });

            // Then check for reason
            if (res.data.reason.toLowerCase() === "not found" || !res.data.reason) {
                if (!returned) {
                    setUserDate(fullDayTemplate); // Use fullDayTemplate instead of message
                }
                const startDate = formatDateForDisplay(dates[0].start);
                const endDate = formatDateForDisplay(dates[0].end);

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `I see you want leave from ${startDate} to ${endDate}. Please provide a reason for your leave request. For example: 'due to personal work' or 'for medical appointment'`,
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter your reason here");
                setReturned(true);
                return;
            }

            // If we have both dates and reason
            setLeaveReason(res.data.reason);
            setReturned(false);

            // Only show confirmation if we have a valid reason (not "not found")
            if (res.data.reason && res.data.reason !== "not found") {
                const startDate = formatDateForDisplay(dates[0].start);
                const endDate = formatDateForDisplay(dates[0].end);

                const confirmationMessage = `I understand you want to take leave from ${startDate} to ${endDate} for ${res.data.reason}. Would you like me to submit this leave request?`;

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: confirmationMessage,
                    isConfirmation: true
                }]);
                setConfirmationStep(true);
            }

        }
        catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm having trouble understanding your request. Please provide both dates and reason for your leave. For example: 'I want leave from Feb 20 2025 to Feb 21 2025 due to personal work'",
                isConfirmation: false
            }]);
            // Reset states on error
            setLeaveReason("");
            setUserDate("");
            setReturned(false);
        } finally {
            setLoading(false);
            setProcessing(false);
            setMessage('');
        }
    };

    const handleEditHalfDayLeaveSubmit = async (e) => {
        e.preventDefault();
        console.log(halfDayTemplate)
        setHalfDayEditing(false);
        setMessages(prev => [...prev, {
            type: "user",
            text: halfDayTemplate
        }]);
        try {
            setHalfDay(false)
            setProcessing(true);
            const obj = {
                data: halfDayTemplate
            };
            console.log(obj)
            const res = await axios.post("http://localhost:3002/api/routes/apply-leave-nlp/apply-leave", obj, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(res.data)

            // First check if we have valid dates
            if (!res.data.date || res.data.date.length === 0) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: "Please provide the dates for your leave request. You can use format like: 'Personal leave on Feb 21 2025 first half' or 'Personal leave on Feb 21 2025 second half'",
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter dates for your leave");
                return;
            }

            // Store the dates if found
            const dates = res.data.date;
            const isFirstHalf = halfDayTemplate.toLowerCase().includes('first half');
            const isSecondHalf = halfDayTemplate.toLowerCase().includes('second half');

            setUserSelectedDates({
                start_date: dates[0].start,
                end_date: dates[0].end,
                date: dates[0].start,
                isHalfDay: true,
                halfDayType: isFirstHalf ? 'first' : (isSecondHalf ? 'second' : '')
            });

            // Then check for reason
            if (res.data.reason.toLowerCase() === "not found" || !res.data.reason) {
                if (!returned) {
                    setUserDate(halfDayTemplate);
                }
                const startDate = formatDateForDisplay(dates[0].start);
                const timeRange = isFirstHalf ? '(9 AM to 1 PM)' : (isSecondHalf ? '(2 PM to 7 PM)' : '');

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `I see you want half-day leave on ${startDate} ${timeRange}. Please provide a reason for your leave request. For example: 'due to personal work' or 'for medical appointment'`,
                    isConfirmation: false
                }]);
                setPlaceHolder("Enter your reason here");
                setReturned(true);
                return;
            }

            // If we have both dates and reason
            setLeaveReason(res.data.reason);
            setReturned(false);

            // Only show confirmation if we have a valid reason (not "not found")
            if (res.data.reason && res.data.reason !== "not found") {
                const startDate = formatDateForDisplay(dates[0].start);
                const timeRange = isFirstHalf ? '(9 AM to 1 PM)' : (isSecondHalf ? '(2 PM to 7 PM)' : '');

                const confirmationMessage = `I understand you want to take half-day leave on ${startDate} ${timeRange} for ${res.data.reason}. Would you like me to submit this leave request?`;

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: confirmationMessage,
                    isConfirmation: true
                }]);
                setConfirmationStep(true);
            }

        } catch (error) {
            console.log(error)
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm having trouble understanding your request. Please use the format: 'Personal leave on Feb 21 2025 first half' or 'Personal leave on Feb 21 2025 second half'",
                isConfirmation: false
            }]);
            setLeaveReason("");
            setUserDate("");
            setReturned(false);
        } finally {
            setLoading(false);
            setProcessing(false);
            setMessage('');
        }
    };

    const handleGenPaySlip = async (e) => {
        e.preventDefault();
        setShowEmailBox(false);
        setMessages(prev => [...prev, {
            type: "user",
            text: email
        }]);
        setProcessing(true)
        const obj = {
            data: email
        }
        try {
            const response = await axios.post("http://localhost:3002/api/routes/payslip/generate", obj, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer' // Important: This tells axios to expect binary data
            });
            console.log(response.headers['content-type']);
            console.log(response)
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'payslip.pdf';  // Suggest a file name for download
            link.click();

            setMessages(prev => [...prev, {
                type: "bot",
                text: "✅ Payslip generated successfully! Opening in a new tab..."
            }]);
            setMessages(prev => [...prev, {
                type: "bot",
                text: "Generate again ? Provide email"
            }])
            setShowEmailBox(true)

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                type: "bot",
                text: "❌ Failed to generate payslip. Please check if the email exists in the system."
            }]);
            setShowEmailBox(true)
        } finally {
            setProcessing(false);
            setEmail('');
        }
    };


    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-indigo-500 rounded-full shadow-lg hover:bg-indigo-600 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                    <MessagesSquare className="h-8 w-8 text-white" />
                </button>
            ) : (
                <div className="w-96 bg-white shadow-2xl rounded-lg overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-indigo-500 p-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-white">HR Assistant</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={resetChat}
                                className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-indigo-600"
                                title="Start New Chat"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                            <button onClick={toggleChat} className="text-white hover:text-gray-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.type === 'user'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-800 shadow-xl'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    {msg.isConfirmation && (
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => {
                                                    handleConfirmation(true);
                                                    setDisableConfirmation(true)
                                                }}
                                                className={`px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 ${disableConfirmation ? "cursor-not-allowed" : ""} `}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleConfirmation(false)
                                                    setDisableConfirmation(true)
                                                }}
                                                className={`px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 ${disableConfirmation ? "cursor-not-allowed" : ""}`}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {processing &&
                            <div className='flex flex-start h-[30px] w-[80px] rounded-xl'>
                                <AgentLoader />
                            </div>
                        }
                        {messages.length === 1 && (
                            <div className="space-y-2 mt-4">
                                {/* <p className="text-sm text-gray-600">Select your leave type:</p> */}
                                <button
                                    onClick={() => handleFullOrHalf("generate-pay-slip")}
                                    className="m-1 p-2 text-left text-sm bg-violet-600 hover:bg-violet-400 rounded-lg transition-colors text-white">
                                    Generate payslip {"-->"}
                                </button>
                                {/* <button
                                    onClick={() => handleFullOrHalf("generate-pay-slip")}
                                    className="m-1 p-2 text-left text-sm bg-violet-600 hover:bg-violet-400 rounded-lg transition-colors text-white">
                                    Generate payslip {"-->"}
                                </button>
                                <button
                                    onClick={() => handleFullOrHalf("Half-day")}
                                    className=" p-2 text-left text-sm bg-fuchsia-600 hover:bg-fuchsia-400 rounded-lg transition-colors text-white">
                                    Half day
                                </button> */}
                                {/* <button
                  onClick={handleLeaveExample}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  "I want to apply leave from 25/03/2025 to 26/03/2025 due to personal work"
                </button> */}
                            </div>
                        )}
                        {showEmailBox && (
                            <div>
                                <form onSubmit={handleGenPaySlip}>
                                    <div className='flex gap-2'>
                                        <input
                                            type='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder='Enter email to generate payslip'
                                            className='text-sm border-gray-400 border-2 p-2 rounded'
                                        />
                                        <button
                                            type='submit'
                                            className='bg-indigo-100 text-indigo-900 px-3 py-2 text-[12px] rounded-lg'
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {showEndButton && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    End Chat
                                </button>
                            </div>
                        )}
                        {fullDay && (
                            <div className="relative group">
                                <div className="relative">
                                    <textarea
                                        ref={textareaRef}
                                        className={`rounded-lg bg-gray-100 text-gray-800 shadow-xl text-sm p-3 w-[70%] resize-none transition-all duration-200 ${isEditing
                                            ? "border-violet-500 border-2 outline-none bg-violet-100"
                                            : "border-transparent hover:border-gray-200 border"
                                            }`}
                                        disabled={!isEditing}
                                        value={fullDayTemplate}
                                        onChange={(e) => setFullDayTemplate(e.target.value)}
                                        rows={4}
                                    />

                                    {/* Edit/Save Icons */}
                                    <div className="absolute top-2 left-[72%] opacity-100 transition-opacity duration-200">
                                        {!isEditing ? (
                                            <button
                                                onClick={handleEditToggle}
                                                className="text-gray-400 hover:text-violet-500 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} className="cursor-pointer" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleEditSubmit}
                                                className="text-fuchsia-900 hover:text-fuchsia-600 transition-colors text-[12px] bg-fuchsia-100 py-2 px-3 rounded-md flex justify-center items-center gap-1"
                                                title="Submit"
                                            >
                                                Confirm
                                                <CircleCheckBig size={12} className="cursor-pointer" />

                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {halfDay &&
                            (
                                <div className="relative group">
                                    <div className="relative">
                                        <textarea
                                            ref={textareaRef}
                                            className={`rounded-lg bg-gray-100 text-gray-800 shadow-xl text-sm p-3 w-[70%] resize-none transition-all duration-200 ${isEditing
                                                ? "border-violet-500 border-2 outline-none bg-violet-100"
                                                : "border-transparent hover:border-gray-200 border"
                                                }`}
                                            disabled={!isHalfDayEditing}
                                            value={halfDayTemplate}
                                            onChange={(e) => setHalfDayTemplate(e.target.value)}
                                            rows={4}
                                        />

                                        {/* Edit/Save Icons */}
                                        <div className="absolute top-2 left-[72%] opacity-100 transition-opacity duration-200">
                                            {!isHalfDayEditing ? (
                                                <button
                                                    onClick={handleEditToggleHalfDay}
                                                    className="text-gray-400 hover:text-violet-500 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} className="cursor-pointer" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleEditHalfDayLeaveSubmit}
                                                    className="text-fuchsia-900 hover:text-fuchsia-600 transition-colors text-[12px] bg-fuchsia-100 py-2 px-3 rounded-md flex justify-center items-center gap-1"
                                                    title="Submit"
                                                >
                                                    Confirm
                                                    <CircleCheckBig size={12} className="cursor-pointer" />

                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeHolder}
                disabled={loading || showEndButton}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || showEndButton}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div> */}
                </div>
            )}
        </div>
    );
};

export default AdminAgent;
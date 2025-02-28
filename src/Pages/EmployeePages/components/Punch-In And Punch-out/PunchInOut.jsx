import axios from "axios";
import { set } from "date-fns";
import { CalendarOff, Rocket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PunchInOut = ({ onPunchStateChange }) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [showPunchIn, setShowPunchIn] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [getTime, setGetTime] = useState(false);
  const [recordTime, setRecordTime] = useState({
    startTime: "",
    endTime: "",
  });
  const [punchInTime, setPunchInTime] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [date, setDate] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [completeWorkingHours, setCompleteWorkingHours] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [holidays, setHolidays] = useState([]);
  const [isLeave, setIsLeave] = useState(false);
  const [hasApprovedLeave, setHasApprovedLeave] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [halfDayTime, setHalfDayTime] = useState({
    start:"",
    end:"",
  });
  const [runHalfDayTimer, setRunHalfDayTimer] = useState(false);
  const [halfDayLeaveType, setHalfDayLeaveType] = useState(null);
  const [canPunchIn, setCanPunchIn] = useState(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const getAll = async () => {
      // console.log("Surya");
      try {
        const holidays = await axios.get(
          "http://localhost:3002/api/routes/holiday/get-all-holidays"
        );
        // console.log(holidays.data.holidays);
        setHolidays(holidays.data.holidays);
        const date = new Date();
        let formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        const isHoliday = holidays.data.holidays.filter(
          (data) => data.date == formattedDate
        );
        if (isHoliday.length > 0) {
          setIsLeave(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  const getReadableTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const isAM = hours < 12;
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${isAM ? "AM" : "PM"
      }`;
    return formattedTime;
  };
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const handleDate = (e) => {
    // console.log(e.target.value);
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const time = getReadableTime();

    try {
      if (!isPunchedIn) {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setRecordTime({
          ...recordTime,
          startTime: time,
        });
        await handleUpdateTime(time, "checkIn", date.slice(0, 10));
        setPunchInTime(new Date());
        onPunchStateChange && onPunchStateChange(true);
      } else {
        await handleUpdateTime(time, "checkOut", date.slice(0, 10));
        setRecordTime({
          ...recordTime,
          endTime: time,
        });
        setIsPunchedIn(false);
        onPunchStateChange && onPunchStateChange(false);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.message) {
        setLeaveMessage(error.response.data.message);
        setHasApprovedLeave(true);
      }
      toast.error(error.response?.data?.message || "Error processing your request");
    }
  };

  const handleUpdateTime = async (time, type, date) => {
    // console.log(date);
    try {
      const response = await axios.post(
        `http://localhost:3002/api/routes/attendence/create-checkin/${userId}`,
        {
          date: new Date(),
          startTime: time,
          type: type,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);

      if (type == "checkIn") {
        // console.log("surya checkin")
        const time = response.data.data[0].logHistory[0].startTime;
        // console.log(time)
        setDate(response.data.data[0].date);
        setStartTime(time);
        const parseTimeString = (timeString) => {
          const [time, modifier] = timeString.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (modifier === "PM" && hours !== 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
          return { hours, minutes };
        };

        const { hours: startHours, minutes: startMinutes } =
          parseTimeString(time);
        // console.log(startHours, startMinutes);
        const punchInTime = new Date();
        punchInTime.setHours(startHours, startMinutes, 0, 0);
        punchInTime.setSeconds(0);

        setPunchInTime(punchInTime);
        startLiveTimer(punchInTime);
      } else if (type == "checkOut") {
        const time = response.data.data[0].logHistory[0].startTime;
        const endTime = response.data.data[0].logHistory[1].endTime;
        setIsRecorded(true);
        let totalWortkingHours = await calculateTotalHours(time, endTime);
        setCompleteWorkingHours(totalWortkingHours);
      }
      if (response.data) {
        toast.success(
          `${type === "checkIn" ? "Checked in" : "Checked out"} successfully!`
        );
        setIsPunchedIn(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error("Already raised for selected date.");
      }
    }
  };

  const calculateMonthlyHours = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/routes/attendence/get-loginHistory/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || !response.data.data) {
        setMonthlyHours(0);
        return;
      }

      let totalHours = 0;
      const currentMonth = selectedMonth + 1;

      // Filter records for selected month
      const monthlyRecords = response.data.data.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === currentMonth;
      });

      // Calculate total hours for the month
      for (const record of monthlyRecords) {
        if (record.logHistory && record.logHistory.length === 2) {
          const startTime = record.logHistory[0].startTime;
          const endTime = record.logHistory[1].endTime;
          const hoursWorked = calculateHoursWorked(startTime, endTime);
          totalHours += hoursWorked;
        }
      }

      setMonthlyHours(totalHours.toFixed(1));
    } catch (error) {
      console.error("Error calculating monthly hours:", error);
      setMonthlyHours(0);
    }
  };

  const calculateHoursWorked = (startTime, endTime) => {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    const diffMs = end - start;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs;
  };

  useEffect(() => {
    calculateMonthlyHours();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/routes/attendence/get-checkin/${userId}/${new Date().toString()}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setShowPunchIn(true);
        let time = "";
        let endTime = "";
        if (response.data.data[0].logHistory.length == 1) {
          time = response.data.data[0].logHistory[0].startTime;
        } else if (response.data.data[0].logHistory.length == 2) {
          time = response.data.data[0].logHistory[0].startTime;
          endTime = response.data.data[0].logHistory[1].endTime;
        }
        if (time && endTime) {
          setIsRecorded(true);
          let totalWortkingHours = await calculateTotalHours(time, endTime);
          setCompleteWorkingHours(totalWortkingHours);
          onPunchStateChange && onPunchStateChange(false);
        } else if (time && !endTime) {
          setDate(response.data.data[0].date);
          setStartTime(time);
          const parseTimeString = (timeString) => {
            const [time, modifier] = timeString.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return { hours, minutes };
          };

          const { hours: startHours, minutes: startMinutes } =
            parseTimeString(time);
          const punchInTime = new Date();
          punchInTime.setHours(startHours, startMinutes, 0, 0);
          punchInTime.setSeconds(0);

          setPunchInTime(punchInTime);
          startLiveTimer(punchInTime);
          setIsPunchedIn(true);
          onPunchStateChange && onPunchStateChange(true);

          if (endTime) {
            setIsButtonDisabled(true);
          }
        }
      } catch (error) {
        setShowPunchIn(true);
        onPunchStateChange && onPunchStateChange(false);
        console.log("error", error);
      }
    };

    fetchTime();
  }, []);

  function calculateTotalHours(startTime, endTime) {
    const start = new Date(`2024-01-29 ${startTime}`);
    const end = new Date(`2024-01-29 ${endTime}`);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hrs ${minutes} mins`;
  }

  let intervalId;

  const startLiveTimer = (punchInTime) => {
    if (intervalId) clearInterval(intervalId);

    setTime({ hours: 0, minutes: 0, seconds: 0 });

    intervalId = setInterval(() => {
      const currentTime = new Date();
      currentTime.setMilliseconds(0);
      punchInTime.setMilliseconds(0);

      const differenceInMilliseconds = currentTime - punchInTime;

      const totalSeconds = Math.floor(differenceInMilliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTime({ hours, minutes, seconds });
    }, 1000);
  };

  const checkHalfDayTimings = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (halfDayLeaveType === 'first') {
      return currentHour >= 13;
    } else if (halfDayLeaveType === 'second') {
      return currentHour < 14;
    }
    return true;
  };

  const checkApprovedLeaves = async () => {
    try {
      const today = new Date();
      const response = await axios.get(
        `http://localhost:3002/api/routes/time-off/view-timeoff/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        let shouldHidePunchIn = false;
        let isHalfDayApproved = false;

        const approvedLeave = response.data.data.some(leave => {
          if (!leave || !leave.leave_date || !Array.isArray(leave.leave_date)) {
            return false;
          }

          return leave.leave_date.some(date => {
            if (!date || !date.date) return false;

            let leaveDate = "";
            if(leave.is_half_day_leave){
              leaveDate = new Date(date.date);
            }
            else if(!leave.is_half_day_leave && !leave.is_permission){
              leaveDate = new Date(date.start_date);
            }

            const isMatchingDate = leaveDate.getDate() === today.getDate() &&
              leaveDate.getMonth() === today.getMonth() &&
              leaveDate.getFullYear() === today.getFullYear();
             
            // For full day leave
            if (isMatchingDate && !leave.is_half_day_leave && leave.status_name === "Approved") {
              setLeaveMessage("You have an approved full-day leave for today");
              setHalfDayLeaveType(null);
              shouldHidePunchIn = true;
              return true;
            }

            // For half day leave
            if (isMatchingDate && leave.is_half_day_leave && leave.status_name === "Approved") {
              isHalfDayApproved = true;
              const currentHour = today.getHours();
              const isFirstHalf = date.start_date === "9 AM";

              if (isFirstHalf) {
                setHalfDayLeaveType('first');
                if (currentHour < 13) {
                  setLeaveMessage("You have an approved leave for the first half of the day. You can punch in after 1 PM.");
                  shouldHidePunchIn = true;
                } else {
                  setLeaveMessage("First half leave completed. You can now punch in.");
                  shouldHidePunchIn = false;
                }
                return currentHour < 13;
              } else {
                setHalfDayLeaveType('second');
                if (currentHour >= 14) {
                  setLeaveMessage("You have an approved leave for the second half of the day.");
                  shouldHidePunchIn = true;
                  return true;
                } else {
                  setLeaveMessage("You have second half leave today. Please punch out before 2 PM.");
                  shouldHidePunchIn = false;
                  return false;
                }
              }
            }

            return false;
          });
        });

        setHasApprovedLeave(shouldHidePunchIn);
        setShowPunchIn(!shouldHidePunchIn);
        setCanPunchIn(!shouldHidePunchIn);
        
        if (shouldHidePunchIn) {
          onPunchStateChange && onPunchStateChange(false);
        }
      }
    } catch (error) {
      console.error("Error checking approved leaves:", error);
      setHasApprovedLeave(false);
      setShowPunchIn(true);
      setCanPunchIn(true);
    }
  };
  
  const convertTimeToDate = (timeStr) => {
    const now = new Date();
    const [hour, period] = timeStr.split(" ");
    let hours = parseInt(hour);
    
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
  
    now.setHours(hours, 0, 0, 0); // Set hours, minutes, seconds, milliseconds
    return now;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endTime = convertTimeToDate(halfDayTime.end);

      if (now >= endTime) {
        setHalfDayTime((prev) => ({
          ...prev,
          start: prev.end,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [halfDayTime.end]);

  useEffect(() => {
    checkApprovedLeaves();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (halfDayLeaveType) {
        const currentHour = new Date().getHours();
        if (halfDayLeaveType === 'first' && currentHour >= 13) {
          setCanPunchIn(true);
          setShowPunchIn(true);
          setHasApprovedLeave(false);
          setLeaveMessage("First half leave completed. You can now punch in.");
        } else if (halfDayLeaveType === 'second' && currentHour >= 14) {
          setCanPunchIn(false);
          setShowPunchIn(false);
          setHasApprovedLeave(true);
          setLeaveMessage("You have an approved leave for the second half of the day.");
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [halfDayLeaveType]);

  return (
    <div className="col-span-1 w-[400px]">
      <div className="bg-white rounded-lg shadow-l border-emerald-500 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Time Tracker
            </h3>
            <p className="text-[13px] text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="bg-emerald-100 text-emerald-800 text-sm py-2 px-3 rounded-lg shadow whitespace-nowrap">
              <span className="font-medium">
                Monthly Hours: {monthlyHours}h
              </span>
            </div>
          </div>
        </div>

        {hasApprovedLeave ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg font-medium text-gray-700">{leaveMessage || "Leave Approved for Today"}</p>
              <p className="text-sm text-gray-500 mt-2">
                {leaveMessage ?
                  "Please check your leave schedule before attempting to check in." :
                  "Punch-in is not available during approved leaves."}
              </p>
            </div>
          </div>
        ) : isLeave ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center  rounded-lg  gap-8">
            <div className="flex items-center  text-gray-800 flex-col">
              <CalendarOff className=" text-red-500" size={40} />
              <p className="text-lg md:text-xl font-semibold">
                As per our company policy, today is a holiday! 🎉 
              </p>
              <p className="text-lg md:text-xl font-semibold">
                Enjoy your time off.
              </p>
            </div>

            <button
              className="w-full py-3 md:py-4 bg-fuchsia-700 text-white font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 opacity-70"
              disabled
            >
              <Rocket className="w-5 h-5" />
              Holiday!..
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center my-6 md:my-8">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-emerald-50 opacity-20"></div>
                  <div className="text-center px-2">
                    {!isRecorded ? (
                      <div className="space-y-1 md:space-y-2">
                        <p className="text-xs md:text-sm text-gray-600 font-medium">
                          Ongoing{" "}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-gray-800">
                          {String(time.hours).padStart(2, "0")}:
                          {String(time.minutes).padStart(2, "0")}:
                          {String(time.seconds).padStart(2, "0")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 md:space-y-2">
                        <p className="text-xs md:text-sm text-gray-500">
                          Worked hours
                        </p>
                        <p className="text-lg md:text-xl font-bold text-emerald-600">
                          {completeWorkingHours}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 max-w-md mx-auto">
              <div className="text-sm text-gray-600 text-center">
                {isPunchedIn ? (
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <span className="font-medium">Started at: </span>
                    {startTime}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 w-full">
                      {isRecorded ? (
                        <p className="font-medium text-gray-700">
                          Thank you. Great Job!
                        </p>
                      ) : (
                        <p className="font-medium text-gray-700">
                          Ready to start your day
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                {!isRecorded ? (
                  <button
                    className={`text-white text-sm w-full py-2 md:py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2
                      ${isPunchedIn
                        ? "bg-gradient-to-r from-blue-400 to-rose-500 hover:bg-purple-600"
                        : "bg-gradient-to-r from-green-400 to-indigo-500 hover:bg-emerald-700"
                      } ${!canPunchIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isButtonDisabled || !canPunchIn}
                  >
                    {isPunchedIn ? "Punch Out" : "Punch In"}
                  </button>
                ) : (
                  <button
                    className="cursor-not-allowed text-white font-medium bg-gray-400 w-full py-3 md:py-4 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                    disabled
                  >
                    Completed
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PunchInOut;
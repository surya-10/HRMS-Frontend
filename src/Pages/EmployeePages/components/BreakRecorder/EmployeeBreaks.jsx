import axios from "axios";
import { CircleCheckBig, Loader, Smile } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EmployeeBreaks = () => {
  const [breakReason, setBreakReason] = useState("");
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [breakTime, setBreakTime] = useState("00:00");
  const [usedBreaks, setUsedBreaks] = useState([]);
  const [selectedBreakForReason, setSelectedBreakForReason] = useState(null);
  const [selectedBreak, setSelectedBreak] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [breakHistory, setBreakHistory] = useState([]);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [appliedBreak, setAppliedBresk] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [todayBreaks, setTodayBreaks] = useState(null);
  const [startTime, setstartTime] = useState(0);
  const [breakValue, setBreakValue] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [isLeave, setIsLeave] = useState(false);

  const breakOptions = [
    { id: "break1", label: "Tea-1", maxDuration: 1 },
    { id: "lunch", label: "Lunch", maxDuration: 60 },
    { id: "break2", label: "Tea-2", maxDuration: 15 },
    { id: "others", label: "Others", maxDuration: Infinity },
  ];

  useEffect(() => {
    const getAll = async () => {
      console.log("Surya");
      try {
        const holidays = await axios.get(
          "http://localhost:3002/api/routes/holiday/get-all-holidays"
        );
        console.log(holidays.data.holidays);
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

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = parseInt(startTime);
    const end = parseInt(endTime);

    if (isNaN(start) || isNaN(end)) return 0;

    const diffInSeconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    return `${minutes}m ${seconds}s`;
  };

  const getMaxDuration = (breakName) => {
    const breakOption = breakOptions.find((opt) => opt.label === breakName);
    return breakOption?.maxDuration || Infinity;
  };

  useEffect(() => {
    if (isOnBreak && breakStartTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - breakStartTime) / 1000);
        setBreakTimer(elapsedSeconds);
      }, 1000);
      setTimerInterval(interval);
    } else {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    return () => clearInterval(timerInterval);
  }, [isOnBreak, breakStartTime]);

  useEffect(() => {
    const fetchBreaks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/routes/break-details/get-breaks/${userId}/${new Date().toISOString()}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        setTodayBreaks(response.data.breaks?.breaks || []);
        console.log(response.data);

        // Check for active break (break without endTime)
        const activeBreak = response.data.breaks?.breaks?.find(
          (break_) => !break_.endTime
        );
        console.log(activeBreak);
        if (activeBreak) {
          const breakOption = breakOptions.find(
            (opt) => opt.label === activeBreak.breakName
          );
          console.log(breakOption);
          if (breakOption) {
            setIsOnBreak(true);
            setSelectedBreak(breakOption.id);
            // Set breakStartTime to the stored start time
            const startTimeFromServer = new Date(
              parseInt(activeBreak.startTime)
            );
            setstartTime(activeBreak.startTime);
            setBreakStartTime(startTimeFromServer);
            setAppliedBresk(activeBreak.breakName);

            // Calculate elapsed seconds correctly
            const now = new Date();
            const elapsedSeconds = Math.floor(
              (now - startTimeFromServer) / 1000
            );
            setBreakTimer(elapsedSeconds);
          }
        }
        if (response.data.breaks?.breaks) {
          const usedBreakTypes = response.data.breaks.breaks
            .filter((break_) => break_.endTime)
            .map((break_) => {
              const breakOption = breakOptions.find(
                (opt) => opt.label === break_.breakName
              );
              return breakOption?.id;
            })
            .filter(Boolean);

          setUsedBreaks(usedBreakTypes);
        }
      } catch (error) {
        console.log(error);
        setTodayBreaks([]);
      }
    };
    fetchBreaks();
  }, []);

  const handleAddBreak = async (id, used, active) => {
    // Allow multiple breaks for 'others' type
    if (used && !active && id !== "others") return;

    const label = breakOptions.find((data) => data.id === id);
    if (!label) return;

    setAppliedBresk(label.label);

    if (id === "others" && !isOnBreak) {
      setSelectedBreakForReason(id);
      setShowReasonModal(true);
      return;
    } else {
      handleBreakToggle(id);
    }

    if (!isOnBreak) {
      await updateBreak(label.label, id, "start");
    } else if (active) {
      await updateBreak(label.label, id, "end");
    }
  };

  const updateBreak = async (breakName, id, action) => {
    const currentTime = new Date().getTime();

    // For regular breaks
    const breakData =
      action === "start"
        ? {
            breakName: id === "others" ? "Others" : breakName,
            breakValue: breakOptions.filter((data) => data.id == id)[0].label, // Use 'Others' for others break
            startTime: currentTime,
            endTime: null,
            reason: id === "others" ? breakReason : null, // Add reason only for others
          }
        : {
            breakName: id === "others" ? "Others" : breakName,
            startTime: startTime,
            endTime: currentTime,
          };

    const obj = {
      name: user.username,
      breakdata: breakData,
      date: new Date(),
    };

    try {
      const response = await axios.post(
        `http://localhost:3002/api/routes/break-details/add-break/${userId}`,
        obj,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh breaks after update
      const updatedBreaks = await axios.get(
        `http://localhost:3002/api/routes/break-details/get-breaks/${userId}/${new Date().toISOString()}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setTodayBreaks(updatedBreaks.data.breaks?.breaks || []);

      if (action === "end") {
        setIsOnBreak(false);
        setSelectedBreak(null);
        setBreakStartTime(null);
        setBreakTimer(0);
      }
    } catch (error) {
      console.error("Error updating break:", error);
      toast.error("Failed to update break");
    }
  };

  const checkIfExceeded = (breakId, minutes) => {
    const breakConfig = breakOptions.find((b) => b.id === breakId);
    return minutes > breakConfig.maxDuration;
  };

  // Format time display

  const formatTime = () => {
    const minutes = Math.floor(breakTimer / 60);
    const seconds = breakTimer % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(
        remainingMinutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(remainingMinutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // Live break timer update
  useEffect(() => {
    let interval;
    if (isOnBreak) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - breakStartTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setBreakTime(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  const handleBreakToggle = (breakId) => {
    if (isOnBreak && breakId === selectedBreak) {
      const endTime = new Date();
      const duration = Math.floor((endTime - breakStartTime) / 60000);
      const breakConfig = breakOptions.find((b) => b.id === breakId);

      const isExceeded = duration > breakConfig.maxDuration;

      setBreakHistory([
        ...breakHistory,
        {
          id: breakId,
          type: breakConfig.label,
          duration,
          reason: breakId === "others" ? breakReason : null,
          exceeded: isExceeded,
        },
      ]);

      setTotalBreakTime((prev) => prev + (endTime - breakStartTime));
      setIsOnBreak(false);
      setSelectedBreak(null);
      setBreakTime("00:00");
      setBreakReason("");
      setUsedBreaks([...usedBreaks, breakId]);
    } else if (!isOnBreak) {
      setIsOnBreak(true);
      setSelectedBreak(breakId);
      setBreakStartTime(new Date());
    }
  };

  const handleOtherBreakSubmit = async () => {
    if (!breakReason.trim()) return;

    const label = breakOptions.find((data) => data.id === "others");
    if (!label) return;

    try {
      const currentTime = new Date();
      const breakData = {
        breakName: "Others",
        breakValue: breakReason, // Store just 'Others' as breakName
        startTime: currentTime.getTime(),
        endTime: null,
        reason: breakReason.trim(), // Store reason separately
      };

      const obj = {
        name: user.username,
        breakdata: breakData,
        date: new Date(),
      };

      await axios.post(
        `http://localhost:3002/api/routes/break-details/add-break/${userId}`,
        obj,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setIsOnBreak(true);
      setSelectedBreak("others");
      setBreakStartTime(currentTime);
      setShowReasonModal(false);
      setBreakReason("");
      setSelectedBreakForReason(null);

      // Refresh breaks list
      const updatedBreaks = await axios.get(
        `http://localhost:3002/api/routes/break-details/get-breaks/${userId}/${new Date().toISOString()}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setTodayBreaks(updatedBreaks.data.breaks?.breaks || []);
      toast.success("Break started successfully");
    } catch (error) {
      console.error("Error starting break:", error);
      toast.error("Failed to start break");
    }
  };

  return (
    <div className="w-full mx-auto flex shadow-xl h-[410px] bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Left Panel - Break Controls */}
      {isLeave ? (
        <div className="w-full flex flex-col items-center justify-center p-8 space-y-4 animate-fadeIn">
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            Break Tracker
          </h3>
          <p className="text-gray-600 text-center">Enjoy your leave day. Not to worry about breaks</p>
          <div className="text-rose-700 text-xl animate-bounce">
            <Smile size={48} strokeWidth={1.5} />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-6 w-full p-6">
          <div className="w-1/2 bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02]">
            {/* Timer Display */}
            <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
              <span className="mr-2">Break Tracker</span>
              {isOnBreak && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
            </h3>
            <p className="text-gray-600 text-sm">
              Date: {new Date().getDate()}-{new Date().getMonth()+1}-{new Date().getFullYear()}
            </p>

            <div className="flex justify-center items-center mt-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative text-center bg-white rounded-full w-40 h-40 border-2 border-indigo-100 flex flex-col justify-center items-center shadow-lg">
                  <p className="text-sm text-gray-600 mb-1">Break Duration</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatTime()}
                  </p>
                  {isOnBreak && (
                    <p className="text-xs text-indigo-500 mt-1 animate-pulse">
                      In Progress
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Break Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-8" id="breakSection">
              {breakOptions.map((breakOption) => {
                const isUsed = usedBreaks.includes(breakOption.id);
                const isActive = selectedBreak === breakOption.id;
                const breakEntry = breakHistory.find((entry) => entry.id === breakOption.id);
                const hasExceeded = breakEntry?.exceeded || false;
                const isDisabled = breakOption.id !== "others" && isUsed && !isActive;

                return (
                  <button
                    key={breakOption.id}
                    onClick={() => handleAddBreak(breakOption.id, isUsed, isActive)}
                    disabled={isDisabled}
                    className={`relative px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : isUsed && breakOption.id !== "others"
                        ? hasExceeded
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-indigo-300"
                    } text-sm font-medium hover:shadow-md`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-base">{breakOption.label}</span>
                      {isActive && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-sm">
                          End Break
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Break History */}
          <div className="w-1/2 bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="font-[500] mb-4 text-gray-700 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Today's Breaks
            </h3>

            <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-50 pr-2 space-y-3">
              {todayBreaks === null ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : todayBreaks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <svg
                    className="w-12 h-12 mb-2 text-gray-400 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No breaks taken today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayBreaks.map((break_, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg flex flex-col transform transition-all duration-300 hover:scale-[1.02] ${
                        calculateDuration(break_.startTime, break_.endTime) >
                        getMaxDuration(break_.breakName)
                          ? "bg-red-50 border border-red-200"
                          : "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800">
                            {break_.breakValue || break_.breakName}
                          </span>
                          {break_.endTime &&
                            calculateDuration(break_.startTime, break_.endTime) >
                              getMaxDuration(break_.breakName) && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium animate-pulse">
                                Exceeded
                              </span>
                            )}
                          {!break_.endTime && (
                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full font-medium animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium px-3 py-1 rounded-full">
                          {break_.endTime ? (
                            calculateDuration(break_.startTime, break_.endTime)
                          ) : (
                            <p className="text-sm text-indigo-500 animate-pulse">In Progress</p>
                          )}
                        </span>
                        <div className="transition-transform duration-300 hover:scale-110" title="completed">
                          {break_.endTime ? (
                            <CircleCheckBig size={16} className="text-emerald-600" />
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
                              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)">
                                <defs>
                                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: "#6366f1" }} />
                                    <stop offset="100%" style={{ stopColor: "#a855f7" }} />
                                  </linearGradient>
                                </defs>
                                <circle cx="12" cy="12" r="10" strokeWidth="4"></circle>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      {break_.reason && (
                        <div className="mt-2 text-sm text-gray-600 bg-white/80 p-2 rounded-md backdrop-blur-sm">
                          <span className="font-medium text-gray-700">Reason:</span>{" "}
                          {break_.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal with updated styling */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl transform transition-all animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Enter Break Reason
              </h3>
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedBreakForReason(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors transform hover:rotate-90 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify your break reason
              </label>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg mb-2 h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your break reason here..."
                value={breakReason}
                onChange={(e) => setBreakReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium transform hover:scale-105"
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedBreakForReason(null);
                  setBreakReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                onClick={handleOtherBreakSubmit}
                disabled={!breakReason.trim()}
              >
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBreaks;
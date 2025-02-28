import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import LeaveDetailsForm from "../../../ManagerPages/Components/All leave records/ViewLeaveForm";
import CustomDropdown from "../../../../Components/Layout/Custom dropdowns/CustomDropdown";
import axios from "axios";
import EmployeeCustomDropdown from "../../../../Components/Layout/Custom dropdowns/EmployeeCustomDropdown";
import timeOffTypes from "../../../../utils/parseData/index";
import { colorPairs } from "../../../ManagerPages/ManagerHome";


const EmployeeLeaveRecords = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [showData, setShowData] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showLeaveDetails, setShowLeaveDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [filteredRecords, setFilteredRecords] = useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const { username } = JSON.parse(localStorage.getItem("user"));

    const updateLeaveStatus = (leaveId, newStatus, comments) => {
        const updatedRecords = leaveRequests.map(record => {
            if (record._id === leaveId) {
                return {
                    ...record,
                    status_name: newStatus,
                    approval_comments: comments
                };
            }
            return record;
        });

        setLeaveRequests(updatedRecords);
        setFilteredRecords(updatedRecords);
    };

    useEffect(() => {
        getAllLeaveRecords();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [leaveRequests, statusFilter]);

    const getAllLeaveRecords = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3002/api/routes/time-off/view-timeoff/${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const leaveData = response.data.data.map((leave, index) => ({
                ...leave,
                colorPairs: colorPairs[index % colorPairs.length]
            }));

            setLeaveRequests(leaveData);
            setFilteredRecords(leaveData);
            setShowData(true);
        } catch (error) {
            console.error("Error fetching leave records:", error);
            setShowData(true); // Show empty state instead of loading
        }
    };

    const filterRecords = () => {
        let filtered = [...leaveRequests];
        
        if (statusFilter !== "All") {
            filtered = filtered.filter(record => record.status_name === statusFilter);
        }

        setFilteredRecords(filtered);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "Requested":
                return "bg-[#818CF8] text-white";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleViewDetails = (record) => {
        setSelectedLeave(record);
        setShowLeaveDetails(true);
    };

    const statusOptions = [
        { value: "All", label: "All" },
        { value: "Requested", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
    ];

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    const getTimeOffTime = (values) => {
        const response = timeOffTypes?.filter(x => x?.key === values);
        return response[0]?.label || values;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Leave Records
                            </h1>
                            <p className="text-sm text-fuchsia-800 mt-1">
                                {filteredRecords.length} records found
                            </p>
                        </div>
                        <div className="flex flex-row gap-4">
                            <CustomDropdown
                                options={statusOptions}
                                selectedValue={statusFilter}
                                onChange={handleStatusFilter}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    {showData ? (
                        filteredRecords.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRecords.map((record, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.leave_type || record.timeoff_type}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {getTimeOffTime(record.timeoff_type)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.timeoff_type=="full_day"?  formatDate(record.leave_date[0].start_date)
                                                    : record.leave_date[0].start_date}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.timeoff_type=="full_day"?  formatDate(record.leave_date[0].end_date)
                                                    : record.leave_date[0].end_date}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                            record.status_name
                                                        )}`}
                                                    >
                                                        {record.status_name || "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-blue-900">
                                                    <p>{record.comments}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-gray-500">
                                    {statusFilter !== "All"
                                        ? `No ${statusFilter.toLowerCase()} requests found.`
                                        : "No leave records available."}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-10">
                            <div className="text-gray-500">Loading leave records...</div>
                        </div>
                    )}
                </div>
            </div>
            {showLeaveDetails && selectedLeave && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <LeaveDetailsForm
                        data={selectedLeave}
                        onClose={() => setShowLeaveDetails(false)}
                        updateLeaveStatus={updateLeaveStatus}
                        isEmployee={true}
                    />
                </div>
            )}
        </div>
    );
};

export default EmployeeLeaveRecords;

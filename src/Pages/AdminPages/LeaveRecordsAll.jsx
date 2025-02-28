import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
// import LeaveDetailsForm from "./ViewLeaveForm";
import CustomDropdown from "../../Components/Layout/Custom dropdowns/CustomDropdown";
import axios from "axios";
import EmployeeCustomDropdown from "../../Components/Layout/Custom dropdowns/EmployeeCustomDropdown";
import timeOffTypes from "../../utils/parseData/index"
import { colorPairs } from "../ManagerPages/ManagerHome";
import LeaveDetailsForm from "../ManagerPages/Components/All leave records/ViewLeaveForm";
import ViewLeaveForm from "./Leave records/ViewLeaveForm";

const AdminLeaveRecords = () => {
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [showData, setShowData] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showLeaveDetails, setShowLeaveDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedUserId, setSelectedUSerID] = useState("All");
    const [selectedEmp, setSelectedEmp] = useState("All")
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
       
        getEmployees()
    }, []);

    useEffect(() => {
        let filtered = leaveRecords;

        if (selectedUserId !== "All") {
            filtered = filtered.filter(record => record.user_id === selectedUserId);
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter(record => record.status_name === statusFilter);
        }

        setFilteredRecords(filtered);
    }, [statusFilter, selectedUserId, leaveRecords]);

    const getEmployees = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3002/api/routes/employee/view-employees/${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            const employeesData = response.data.data;
            const getEmpWithNameAndId = await employeesData.map((data) => {
                return {
                    label: data.first_name + " " + data.last_name,
                    value: data.first_name + " " + data.last_name,
                    id: data._id
                }
            })
            getEmpWithNameAndId.unshift({ value: "All", label: "All", id: "All" })
            console.log(getEmpWithNameAndId);
            setEmployees(getEmpWithNameAndId);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
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


    const updateLeaveStatus = (leaveId, newStatus, comments) => {
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

        setLeaveRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        localStorage.setItem("leaveRecords", JSON.stringify(updatedRecords));
    };
    const handleUserFilter = (value, id) => {
        setSelectedEmp(value);
        setSelectedUSerID(id);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };


    const getTimeOffTime = (values) => {
        const response = timeOffTypes?.filter(x => x?.key === values)
        return response[0]?.label
    }


    // console.log("timeOffTypes", timeOffTypes)

    useEffect(()=>{
        getAllLeaveRecords()
    }, [employees])

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
            console.log(response.data.data)
            const leaveData = response.data.data.map((leave, ind) => {
                console.log(leave)
                console.log(employees)
                const user = employees.find((emp, ind) => emp.id == leave.user_id);
                console.log(user)
                return {
                    ...leave,
                    first_name: user.label,
                    email: user?.email,
                    colorPairs: colorPairs[ind % colorPairs.length]
                };
            });
            console.log(leaveData)
            localStorage.setItem("leaveRecords", JSON.stringify(leaveData));
            setLeaveRecords(leaveData)
            setFilteredRecords(leaveData)
            const onlyLeave = leaveData.filter((data) => data.timeoff_type !== "permission");
            const onlyPermission = leaveData.filter((data) => data.timeoff_type === "permission");
            setLeaveRequests(leaveData);
            const pendingLeave = onlyLeave.filter((leave) => leave.status_name === "Requested");
            const pendingPermission = onlyPermission.filter((leave) => leave.status_name === "Requested");
            setShowData(true)
        } catch (error) {
            console.error("Error fetching leave records:", error);
        }
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className=" mx-auto bg-white rounded-xl shadow-sm">
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
                            <EmployeeCustomDropdown
                                options={employees}
                                selectedValue={selectedEmp}
                                selectedId={selectedUserId}
                                onChange={handleUserFilter}
                            />
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
                            <div className=" min-h-screen">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRecords.map((record, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8">
                                                            <div
                                                                className="text-[13px]"
                                                                // style={{
                                                                //     background: record.colorPairs.bgColor,
                                                                //     color: record.colorPairs.color,
                                                                // }}
                                                            >
                                                                {record.first_name}
                                                                
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.leave_type}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {getTimeOffTime(record.timeoff_type)}
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
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        onClick={() => handleViewDetails(record)}
                                                        className="text-[#a2a8d3] hover:text-[#6c7ac9] transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-gray-500">
                                    {selectedUserId !== "All" && statusFilter !== "All"
                                        ? `No ${statusFilter.toLowerCase()} requests found for selected employee.`
                                        : selectedUserId !== "All"
                                            ? "No requests found for selected employee."
                                            : statusFilter !== "All"
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
                    <ViewLeaveForm
                        data={selectedLeave}
                        onClose={() => setShowLeaveDetails(false)}
                        updateLeaveStatus={updateLeaveStatus}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminLeaveRecords;

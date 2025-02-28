import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Mail,
    User,
    Clock,
    MessageSquare,
    Tag,
    CheckCircle,
    XCircle,
    X,
    AlertCircle
} from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewLeaveForm = ({ data, onClose, updateLeaveStatus }) => {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [approvalComment, setApprovalComment] = useState("");
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [showApprovalComment, setShowApprovalComment] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    let [leaveRecords, setLeaveRecords] = useState([]);

    console.log("Leave status:", data.status_name);

    useEffect(() => {
        const records = localStorage.getItem("leaveRecords");
        if (records) {
            const parsedRecords = JSON.parse(records);
            setLeaveRecords(parsedRecords);
        }
    }, []);

    const handleApprove = async () => {
        // if (!showApprovalComment) {
        //     setShowApprovalComment(true);
        //     return;
        // }
        // if (!approvalComment) {
        //     toast.error("Provide approval comments");
        //     return;
        // }

        try {
            setLoading(true);
            console.log(data, userId)
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

            if (response.status === 200) {
                updateLeaveStatus(data._id, "Approved", "Approved");
                toast.success("Leave request approved successfully");
                onClose();
            }
        } catch (error) {
            console.error("Error approving leave:", error);
            toast.error(error.response?.data?.message || "Error approving leave request");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!showRejectReason) {
            setShowRejectReason(true);
            return;
        }

        if (reason.trim() === "") {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:3002/api/routes/time-off/reject-timeoff/${data.user_id}/${data._id}/${userId}`,
                {
                    approvalComments: reason
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                updateLeaveStatus(data._id, "Rejected", reason);
                toast.success("Leave request rejected successfully");
                onClose();
            }
        } catch (error) {
            console.error("Error rejecting leave:", error);
            toast.error("Error rejecting leave request");
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'Pending': {
                color: 'text-white border-[#6B7280] bg-violet-600',
                icon: <Clock className="w-4 h-4" />
            },
            'Approved': {
                color: 'bg-[#7cd688] text-white border-[#7cd688]',
                icon: <CheckCircle className="w-4 h-4" />
            },
            'Rejected': {
                color: 'bg-red-500 text-white border-red-500',
                icon: <XCircle className="w-4 h-4" />
            }
        };

        const config = statusConfig[status] || statusConfig['Pending'];

        return (
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border inline-flex items-center gap-1.5 ${config.color}`}>
                {config.icon}
                {status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-[550px] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col mt-10">
                <div className="relative bg-gradient-to-r from-[#3d2044] to-[#427ac7] p-4">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4 text-white/80" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-white">Leave Request Details</h2>
                            <StatusBadge status={data.status_name || 'Pending'} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 space-y-4 overflow-y-auto">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Employee Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="font-medium text-sm">{`${data.first_name}`}</p>
                            </div>
                            {/* <div>
                                <p className="text-xs text-gray-500">Email Address</p>
                                <p className="font-medium text-sm">{data.email}</p>
                            </div> */}
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Leave Details
                        </h3>
                        <div className="space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">Leave Type</p>
                                    <p className="font-medium text-sm">{data.leave_type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="font-medium text-sm">{data.timeoff_type}</p>
                                </div>
                            </div>

                            {data.leave_date?.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Date Range</p>
                                    {data.leave_date.map((date, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded-lg text-sm">
                                            <span className="font-medium text-sm">
                                                {data.is_permission ? <span>{date.start_date}</span>
                                                :
                                                <span>{new Date(date.start_date).toLocaleDateString()}</span>
                                                    }
                                                {" to "}

                                                {data.is_permission ? <span>{date.end_date}</span>
                                                :
                                                <span> {new Date(date.end_date).toLocaleDateString()}</span>
                                                    }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Reason</p>
                                <p className="bg-gray-50 p-2 rounded-lg text-sm">
                                    {data.comments || "No reason provided"}
                                </p>
                            </div>
                            {data.status_name=="Approved" || data.status_name=="Rejected" &&
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Comments</p>
                                <p className="bg-gray-50 p-2 rounded-lg text-sm">
                                    {data.approval_comments || "No reason provided"}
                                </p>
                            </div>
}
                        </div>
                    </div>

                    {showRejectReason && (
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Rejection Reason
                            </h3>
                            <textarea
                                placeholder="Enter reason for rejection"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                                rows={2}
                            />
                        </div>
                    )}

                    {showApprovalComment && (
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Approval Comments
                            </h3>
                            <textarea
                                placeholder="Enter comments for approval "
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                required
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                                rows={2}
                            />
                        </div>
                    )}
                </div>
{/* 
                <div className="p-3 bg-white border-t border-gray-100 flex justify-end gap-2">
                    {!showRejectReason && !showApprovalComment ? (
                        <>
                            <button
                                onClick={handleReject}
                                disabled={
                                    data.status_name === "Approved" || data.status_name === "Rejected"
                                        ? true
                                        : loading
                                }
                                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </button>

                            <button
                                onClick={handleApprove}
                                disabled={
                                    data.status_name === "Approved" || data.status_name === "Rejected"
                                        ? true
                                        : loading
                                }
                                className="px-4 py-2 bg-[#432d77] text-white rounded-lg text-sm font-medium hover:bg-[#272255] transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                            </button>
                        </>
                    ) : showApprovalComment ? (
                        <>
                            <button
                                onClick={() => setShowApprovalComment(false)}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                className="px-4 py-2 bg-[#432d77] text-white rounded-lg text-sm font-medium hover:bg-[#272255] transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {loading ? 'Processing...' : 'Confirm Approval'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowRejectReason(false)}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" />
                                {loading ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                        </>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ViewLeaveForm;
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DotLoader from "../../../../Components/Layout/animations/DotsLoader";

function ApproveLeave() {
    const { userId, requestId, managerId } = useParams();
    const [searchParams] = useSearchParams();
    const action = searchParams.get("action");

    const [loading, setLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const token = localStorage.getItem("token");

    const hasTriggered = useRef(false);  // 🔥 Prevents multiple API calls
    const [rejectMsg, setRejectMsg] = useState(true);

    useEffect(() => {
        if (action === "approve" && !hasTriggered.current) {
            hasTriggered.current = true; // ✅ Ensures API runs only once
            handleLeaveAction();
        }
    }, [action]);  // ✅ `hasTriggered` is a ref, so it won't cause re-renders

    const handleLeaveAction = async () => {
        if (action === "reject" && !rejectionReason.trim()) {
            toast.error("Please enter a rejection reason.");
            return;
        }

        setLoading(true);
        try {
            console.log(`Processing ${action} action...`);

            const response = await axios.put(
                `http://localhost:3002/api/routes/time-off/${action}-timeoff-email/${userId}/${requestId}/${managerId}`,
                { approvalComments: action === "approve" ? "Approved" : rejectionReason },
                { headers: { authorization: `Bearer ${token}` } }
            );

            if (action === "reject") {
                setRejectMsg(false);
            }
            toast.success(response.data.message);
        } catch (error) {
            console.error(`Error ${action}ing leave:`, error);
            toast.error(error.response?.data?.message || `Error ${action}ing leave request`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full justify-center items-center text-center p-6 bg-gray-300">
            {loading ? (
                <DotLoader />
            ) : (
                <div>
                    {rejectMsg ? (
                        <div>
                            {action === "reject" ? (
                                <div className="space-y-4 flex flex-col justify-center items-center shadow-2xl p-5 rounded-xl bg-white">
                                    <p>Please enter a reason for rejection:</p>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="border p-2 w-full max-w-md rounded-md"
                                        placeholder="Enter rejection reason..."
                                    />
                                    <button
                                        onClick={handleLeaveAction}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <p>Leave request has been approved. You are good to close the tab.</p>
                            )}
                        </div>
                    ) : (
                        <p>Leave request has been rejected. You are good to close the tab.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ApproveLeave;

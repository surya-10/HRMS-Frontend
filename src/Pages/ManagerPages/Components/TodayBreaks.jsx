import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Tooltip, Empty, Spin, Badge } from 'antd';
import { RefreshCw, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { colorPairs } from '../ManagerHome';

const TodayBreaks = () => {
    const [loading, setLoading] = useState(true);
    const [breaks, setBreaks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchTodayBreaks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3002/api/routes/break-details/get-today-breaks/${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            setBreaks(response.data.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching breaks:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch breaks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayBreaks();
    }, []);

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await fetchTodayBreaks();
            toast.success('Break records refreshed successfully');
        } catch (error) {
            console.error('Error refreshing breaks:', error);
            toast.error('Failed to refresh break records');
        } finally {
            setIsRefreshing(false);
        }
    };

    const getBreakStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#52c41a';
            case 'Ongoing':
                return '#faad14';
            default:
                return '#d9d9d9';
        }
    };

    const getBreakTypeColor = (breakName) => {
        switch (breakName) {
            case 'Tea-1':
            case 'Tea-2':
                return 'blue';
            case 'Lunch':
                return 'orange';
            case 'Others':
                return 'purple';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[200px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="w-full p-2 rounded-lg shadow-xl">
            <div className="border-b border-black flex justify-between items-center p-4">
                <span className="font-[500]">Today's Break Records</span>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={`p-2 bg-[#EFF1F4] rounded-lg hover:bg-[#c7cacf] transition-all duration-200 ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Refresh records"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
            </div>

            {breaks.length === 0 ? (
                <Empty
                    description="No break records found for today"
                    className="my-8"
                />
            ) : (
                <div className="space-y-4 mt-4">
                    {breaks.map((employeeBreak, index) => (
                        <Card key={employeeBreak._id} className="shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size={48}
                                        style={{
                                            backgroundColor: colorPairs[index % colorPairs.length].color,
                                            color: 'white'
                                        }}
                                    >
                                        {employeeBreak.employee.name.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">{employeeBreak.employee.name}</h3>
                                        <p className="text-gray-500 text-sm">{employeeBreak.employee.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-600">
                                        Total Break: {employeeBreak.totalBreakTime}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {employeeBreak.breaks.map((breakItem, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Tag color={getBreakTypeColor(breakItem.breakName)}>
                                                {breakItem.breakValue}
                                            </Tag>
                                            <Badge 
                                                status={breakItem.status === 'Ongoing' ? 'processing' : 'success'} 
                                                text={breakItem.status}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span>{breakItem.startTime}</span>
                                            {breakItem.endTime && (
                                                <>
                                                    <span className="mx-2">-</span>
                                                    <span>{breakItem.endTime}</span>
                                                </>
                                            )}
                                            <span className="ml-2 font-medium">
                                                ({breakItem.duration})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodayBreaks; 
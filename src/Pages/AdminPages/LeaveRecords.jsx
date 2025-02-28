import { UserRound } from 'lucide-react';
import React from 'react'

const LeaveRecords = () => {
    const employees = [
        { id: 1, name: 'Surya', department: 'UI/UX', date: "01-01-2025", status: "Approved" },
        { id: 2, name: 'Aravind', department: 'Finance', date: "21-01-2025", status: "Approved" },
        { id: 3, name: 'Lakshman', department: 'Development', date: "08-01-2025", status: "Rejected" },
        { id: 4, name: 'Nithish', department: 'AI', date: "30-01-2025", status: "Pending" }
    ];

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-[#E6F4FF] text-[green]';
            case 'rejected':
                return 'bg-[#FFF1F0] text-[red]';
            case 'pending':
                return 'bg-[#FFFBE6] text-[#d48800]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='lg:w-[48%] md:w-full w-full'>
            <div className='bg-white rounded overflow-hidden'>
                <div className='bg-gradient-to-r from-[#2D62A4] to-[#3b82f6] px-6 py-4'>
                    <div className='flex justify-between items-center py-2'>
                        <h2 className='text-white text-lg font-semibold'>Leave Records</h2>
                        <button className="text-white/80 hover:text-white text-lg font-medium transition-colors">
                            View all
                        </button>
                    </div>
                </div>

                <div className='divide-y divide-gray-100'>
                    {employees.map((employee, index) => (
                        <div key={index} 
                             className="hover:bg-slate-50 transition-all duration-200">
                            <div className="flex justify-between items-center p-4">
                                <div className='flex items-center gap-3'>
                                    <div className='p-4 bg-[#95beed] rounded-full'>
                                        <UserRound className='w-5 h-5 text-[#2D62A4]'/>
                                    </div>
                                    <div>
                                        <p className='text-gray-900 font-medium'>{employee.name}</p>
                                        <p className='text-gray-500 text-sm'>{employee.department}</p>
                                    </div>
                                </div>

                                <div className='text-right'>
                                    <p className='text-gray-600 text-sm mb-1'>{employee.date}</p>
                                    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(employee.status)}`}>
                                        {employee.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LeaveRecords;
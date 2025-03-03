import { Eye, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ViewAllEmployees = () => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        const data = localStorage.getItem("employees");
        console.log(JSON.parse(data))
        if (data) {
            setUsers(JSON.parse(data))
        }
    }, [])
    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Employees
                            </h1>
                            <p className="text-sm text-fuchsia-800 mt-1">
                                Total: {users.length}
                            </p>
                        </div>
                        <div className='flex items-center relative'>
                            <input
                                type="text"
                                placeholder="Search Employees"
                                className="border-2 py-2 rounded-lg px-3 w-[300px]  focus:rings-0 text-[15px] pe-10"
                                style={{ outline: "none" }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <p className='absolute right-2 '>
                                <Search size={18} className='text-fuchsia-800'/>
                            </p>

                        </div>

                    </div>
                </div>

                <div className="p-4">
                    {users ? (
                        users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((record, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8">
                                                            <div
                                                                className="h-8 w-8 rounded-full flex items-center justify-center"
                                                                style={{
                                                                    background: record.colorPairs.bgColor,
                                                                    color: record.colorPairs.color,
                                                                }}
                                                            >
                                                                {record.first_name[0]}
                                                                {record.last_name[0]}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {record.first_name} {record.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500"
                                                                style={{
                                                                    color: record.colorPairs.color,
                                                                }}>
                                                                {record.profession_id.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.phone}
                                                </td>
                                                <td className="px-4 py-3">

                                                    {record.is_deleted ?
                                                        <p className='text-sm text-red-600'>InActive</p>
                                                        :

                                                        <p className='text-sm text-green-600'>Active</p>
                                                    }


                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        // onClick={() => handleViewDetails(record)}
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
                            <p>Helo</p>
                        )
                    ) : (
                        <div className="text-center py-10">
                            <div className="text-gray-500">Loading leave records...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewAllEmployees;
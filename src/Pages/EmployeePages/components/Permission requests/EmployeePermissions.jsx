import { useEffect, useState } from 'react';
import DotsLoader from '../../../../Components/Layout/animations/dotAnimations';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PermissionDropdown() {
    const userId = localStorage.getItem("userId");
    const [selectedMonth, setSelectedMonth] = useState('');
    const [allPermissions, setAllPermissions] = useState([]);
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedPermissions = localStorage.getItem("permission");
        // console.log(storedPermissions)
        if(!storedPermissions){
            setLoading(false)
            return 
        }
        const parsedData = JSON.parse(storedPermissions)
        if (parsedData.length > 0) {
            const selectedUserPermission = parsedData.filter((data) => data.userId == userId)
            setAllPermissions(selectedUserPermission);
            setFilteredPermissions(selectedUserPermission);
        }
        setLoading(false)
    }, [userId]);

    useEffect(() => {
        if (selectedMonth) {
            const monthIndex = months.indexOf(selectedMonth) + 1;
            const filtered = allPermissions.filter(p => new Date(p.date).getMonth() + 1 === monthIndex);
            setFilteredPermissions(filtered);
        } else {
            setFilteredPermissions(allPermissions);
        }
    }, [selectedMonth, allPermissions]);

    return (
        <div className=" bg-white shadow-lg rounded-xl p-6 mt-6 mb-6 w-1/2">
            <div className="flex justify-between items-center gap-4">

                <h3 className=" font-semibold text-[#2D3748]">Applied Permissions</h3>

                <div className='flex items-center gap-4'>
                    <h2 className=" font-[500] text-gray-500">Select Month</h2>
                    <div>
                        <select
                            className="p-1 border rounded-lg text-gray-700 focus:ring-2 focus:ring-[#2C7A7B] outline-none bg-white"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {loading ?
                <div>
                    <DotsLoader/>
                </div>
                :
                <div className="mt-5">


                    {filteredPermissions.length > 0 ? (
                        <div className="overflow-x-auto mt-3">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-[#2C7A7B] text-white">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Start Time</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPermissions.map((permission, index) => (
                                        <tr key={index} className="hover:bg-[#E6FFFA]">
                                            <td className="border border-gray-300 px-3 py-2 text-sm">{new Date(permission.date).toDateString()}</td>
                                            <td className="border border-gray-300 px-3 py-2 text-sm">{permission.startTime}</td>
                                            <td className="border border-gray-300 px-3 py-2 text-sm">{permission.endTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-3 text-gray-500">No permissions found for this month.</p>
                    )}
                </div>
            }
        </div>
    );
}

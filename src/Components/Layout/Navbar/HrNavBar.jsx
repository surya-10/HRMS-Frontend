import React, { useState } from 'react';
import { GrAnnounce } from "react-icons/gr";
import { 
    ChevronDown, 
    ChevronUp, 
    LayoutDashboard, 
    Users, 
    Building2, 
    Clock,
    ClipboardSignature,
    Settings,
    UserCircle,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { id: "employees", label: 'Employees', icon: Users, path: "/admin/employees" },
    // { id: 'departments', label: 'Departments', icon: Building2, path: "/admin/departments" },
    { id: 'attendance', label: 'Attendance', icon: Clock, path: "/admin/attendance" },
    { id: 'announcement', label: 'Announcement', icon: GrAnnounce, path: "/admin/announcement" },
    { id: 'leave-requests', label: 'Leave Requests', icon: ClipboardSignature, path: "/admin/leave-records" },
    // { id: 'settings', label: 'Settings', icon: Settings, path: "/admin/settings" },
    // { id: 'profile', label: 'Profile', icon: UserCircle, path: "/admin/profile" },
    // { id: 'logout', label: 'Logout', icon: LogOut, path: "/logout" },
];

const HrNavBar = ({ onNavigate = () => {} }) => {
    const [activeItem, setActiveItem] = useState('dashboard');
    const [currentDropdown, setCurrentDropdown] = useState(null);
    const navigate = useNavigate();

    const handleItemClick = (id, path, hasSubItems) => {
        if (hasSubItems) {
            setCurrentDropdown(currentDropdown === id ? null : id);
        } else {
            setCurrentDropdown(null);
            setActiveItem(id);
            navigate(path);
            onNavigate(path);
        }
    };

    const baseButtonClasses = "flex items-center w-full text-left py-2 rounded-lg transition-colors";
    const activeClasses = "text-white bg-indigo-400 text-sm";
    const inactiveClasses = "text-blue-900 hover:bg-blue-100 text-sm";

    return (
        <nav className="px-2 bg-white py-4 h-screen overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
            <div className="ps-4">
                <button
                    onClick={() => {
                        setActiveItem('dashboard');
                        setCurrentDropdown(null);
                        navigate('/dashboard');
                    }}
                    className={`flex items-center gap-2 w-full text-left text-lg font-bold py-3 px-4 rounded-lg transition-colors ${
                        activeItem === 'dashboard' ? activeClasses : inactiveClasses
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className='text-[16px]'>Dashboard</span>
                </button>

                <div className="mt-3 space-y-1">
                    {navItems.map(({ id, label, icon: Icon, path }) => (
                        <button
                            key={id}
                            onClick={() => handleItemClick(id, path, false)}
                            className={`text-[15px] ${baseButtonClasses} ${
                                activeItem === id ? activeClasses : inactiveClasses
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                {Icon && <Icon className="w-5 h-5" />}
                                <span>{label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default HrNavBar;

import React, { useState } from 'react';
import { 
    ChevronDown, 
    ChevronUp, 
    LayoutDashboard, 
    Users, 
    Building2, 
    TicketCheck,
    Clock,
    FileBarChart,
    Calendar,
    ClipboardSignature,
    Settings,
    UserCircle,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GrAnnounce } from 'react-icons/gr';


const navItems = [
    { 
        id: 'attendance', 
        label: 'Attendance',
        icon: Clock,
        path: '/user/attendence/history'
    },
    { 
        id: 'leave-requests', 
        label: 'Leave requests',
        icon: ClipboardSignature, 
        path: '/user/leave-requests'
    },
     { id: 'announcement', label: 'Announcement', icon: GrAnnounce, path: "/user/announcement" },
    { 
        id: 'profile', 
        label: 'Profile', 
        icon: UserCircle,
        path: '/user/profile'
    }
];

const EmployeeNavBar = ({ onNavigate = () => {} }) => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const location = useLocation();
    const [currentDropdown, setCurrentDropdown] = useState(null);

    const handleItemClick = (id, path, hasSubItems) => {
        if (hasSubItems) {
            setCurrentDropdown(currentDropdown === id ? null : id);
        } else {
            setCurrentDropdown(null);
            if (path) {
                navigate(path);
            }
        }
    };

    const handleSubItemClick = (parentId, subItemId, path) => {
        if (path) {
            navigate(path);
        }
    };

    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path;
    };

    const baseButtonClasses = "flex items-center w-full text-left py-2 rounded-lg transition-colors duration-200";
    const activeClasses = "text-white bg-indigo-400 text-sm";
    const inactiveClasses = "text-blue-900 hover:bg-blue-100 text-sm";

    return (
        <nav className="px-2 bg-white py-4 h-screen overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
            <div className="ps-4">
                <button
                    onClick={() => navigate('/employee/dashboard')}
                    className={`flex items-center gap-2 w-full text-left text-lg font-bold py-3 px-4 rounded-lg transition-colors duration-200 ${
                        isActive('/employee/dashboard') ? activeClasses : inactiveClasses
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className='text-[16px]'>Dashboard</span>
                </button>

                <div className="mt-3 space-y-1">
                    {navItems.map(({ id, label, icon: Icon, subItems, path }) => (
                        <div key={id}>
                            <button
                                onClick={() => handleItemClick(id, path, Boolean(subItems))}
                                className={`text-[15px] ${baseButtonClasses} ${
                                    isActive(path) ? activeClasses : inactiveClasses
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    {Icon && <Icon className="w-5 h-5" />}
                                    <span>{label}</span>
                                </div>
                                {subItems && (
                                    <span className="ml-2">
                                        {currentDropdown === id ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </span>
                                )}
                            </button>

                            {subItems && currentDropdown === id && (
                                <div className="ml-4 mt-2 space-y-1 bg-white rounded-lg">
                                    {subItems.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => handleSubItemClick(id, subItem.id, subItem.path)}
                                            className={`block w-full text-left text-lg py-2 px-4 rounded-lg transition-colors text-[14px] ${
                                                isActive(subItem.path) ? activeClasses : inactiveClasses
                                            }`}
                                        >
                                            {subItem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default EmployeeNavBar;
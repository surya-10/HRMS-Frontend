import React from 'react';
import { 
    LayoutDashboard,
    Users,
    Clock,
    ClipboardSignature,
    UserCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    { 
        id: 'dashboard', 
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/ad/dashboard'
    },
    { 
        id: 'employees', 
        label: 'All Employees',
        icon: Users,
        path: '/ad/employees'
    },
    { 
        id: 'attendance', 
        label: 'Attendance',
        icon: Clock,
        path: '/ad/attendence-history'
    },
    // { 
    //     id: 'profile', 
    //     label: 'Profile', 
    //     icon: UserCircle, 
    //     path: "/ad/profile" 
    // }
];

const ADNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path;
    };

    const baseButtonClasses = "flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200";
    const activeClasses = "text-white bg-indigo-400 text-sm";
    const inactiveClasses = "text-blue-900 hover:bg-blue-100 text-sm";

    return (
        <nav className="px-2 bg-white py-4 h-screen overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
            <div className="ps-4">
                {navItems.map(({ id, label, icon: Icon, path }) => (
                    <button
                        key={id}
                        onClick={() => navigate(path)}
                        className={`${baseButtonClasses} ${
                            isActive(path) ? activeClasses : inactiveClasses
                        } mb-2`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            <span className="text-[15px]">{label}</span>
                        </div>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default ADNavBar; 
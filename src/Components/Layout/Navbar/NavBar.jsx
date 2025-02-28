import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Users,
  Building,
  Settings,
  FileText,
  Calendar,
  BarChart2,
  Clock,
  DollarSign,
  Menu,
  X,
  Home,
  Shield,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleMenuItem = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Home />,
      link: '/dashboard'
    },
    {
      id: 'employees',
      title: 'Employee Management',
      icon: <Users />,
      subItems: [
        { title: 'All Employees', link: '/employees/all' },
        { title: 'Add Employee', link: '/employees/add' },
        { title: 'Employee Types', link: '/employees/types' }
      ]
    },
    {
      id: 'departments',
      title: 'Departments',
      icon: <Building />,
      subItems: [
        { title: 'All Departments', link: '/departments/all' },
        { title: 'Add Department', link: '/departments/add' },
        { title: 'Designations', link: '/departments/designations' }
      ]
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: <Clock />,
      subItems: [
        { title: 'Daily Log', link: '/attendance/daily' },
        { title: 'Monthly Report', link: '/attendance/monthly' },
        { title: 'Leave Management', link: '/attendance/leave' }
      ]
    },
    {
      id: 'payroll',
      title: 'Payroll',
      icon: <DollarSign />,
      subItems: [
        { title: 'Salary Structure', link: '/payroll/structure' },
        { title: 'Process Payroll', link: '/payroll/process' },
        { title: 'Salary Reports', link: '/payroll/reports' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: <FileText />,
      link: '/reports'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      icon: <Calendar />,
      link: '/calendar'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart2 />,
      link: '/analytics'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings />,
      subItems: [
        { title: 'Company Settings', link: '/settings/company' },
        { title: 'System Settings', link: '/settings/system' },
        { title: 'Roles & Permissions', link: '/settings/roles' }
      ]
    }
  ];

  const MenuItem = ({ item }) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div className="mb-1">
        <div
          className={`
            flex items-center px-4 py-2 cursor-pointer
            hover:bg-gray-100 rounded-lg transition-colors
            ${isExpanded ? 'bg-gray-100' : ''}
          `}
          onClick={() => hasSubItems ? toggleMenuItem(item.id) : null}
        >
          <div className="flex items-center flex-1">
            <span className="w-5 h-5 text-gray-500">
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium text-gray-700">
                {item.title}
              </span>
            )}
          </div>
          {hasSubItems && !isCollapsed && (
            <span className="w-5 h-5 text-gray-400">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </span>
          )}
        </div>

        {hasSubItems && !isCollapsed && isExpanded && (
          <div className="ml-4 mt-1">
            {item.subItems.map((subItem, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="ml-3 text-sm text-gray-600">
                  {subItem.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={`
          min-h-screen bg-white
          transition-all duration-300 ease-in-out shadow-xl
          ${isCollapsed ? 'w-16' : 'w-[100%]'}
          max-md:fixed max-md:top-0 max-md:left-0 max-md:z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">HRMS</span>
            </div>
          )}
          <button
            className="hidden md:block p-1.5 rounded-lg hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <div className="py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </aside>
      <main className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} max-md:ml-0 p-6`}>
      </main>
    </div>
  );
};

export default Navbar;
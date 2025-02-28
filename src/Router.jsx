import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import BasePage from "./Components/Layout/Base/BasePage";
import LoginPage from "./Components/Layout/login";;
import EmployeeDashboard from "./Pages/Dashboard/EmployeeDashboard";
import AllEmployees from "./Pages/AdminPages/AllEmployees";
import Profile from "./Pages/AdminPages/viewEmployees/ViewEmployeeDetails";
import EditEmployee from "./Pages/AdminPages/viewEmployees/EditEmployee";
import ManagerDashboard from "./Pages/ManagerPages/ManagerHome";
import LeaveDetailsForm from "./Pages/ManagerPages/Components/All leave records/ViewLeaveForm";
import LeaveRecords from "./Pages/ManagerPages/Components/All leave records/LeaveRecords";
import ViewAllEmployees from "./Pages/ManagerPages/Components/List employees/ViewAllEmployees";
import EmployeeHome from "./Pages/EmployeePages/EmployeeHome";
import AttendenceHistory from "./Pages/ManagerPages/Components/Attendence history/ViewAttendenceRecords";
import EmployeeLeaveRecords from "./Pages/EmployeePages/components/Employee leave history/EmployeeLeaveRecords";
import EmployeeProfile from "./Pages/EmployeePages/components/EmployeeProfile/EmployeeProfile";
import ManagerProfile from "./Pages/ManagerPages/ManagerProfile";
import ApproveLeave from "./Pages/ManagerPages/Components/Approve or reject leave requests/ApproveOrRejectLeave";
import ADDashboard from "./Pages/AssociateDirectorPages/ADDashboard";

// import EmployeeForm from "./Pages/AdminPages/AddEmployee";

import EmployeeForm from "./Pages/AdminPages/AddEmployee/Employee form/EmployeeForm";
import AttendanceRecord from "./Pages/AdminPages/PieChart";
import AttendenceHistoryByAdmin from "./Pages/AdminPages/AttendenceRecords/AttendenceRecordsAll";
import AttendenceRecords from "./Pages/EmployeePages/components/AttendenceRecords/AttendenceRecords"
import AdminLeaveRecords from "./Pages/AdminPages/LeaveRecordsAll";
import AdminAnnouncement from "./Pages/AdminPages/Announcements/AdminAnouncements";
import EmployeeAnnouncement from "./Pages/EmployeePages/components/EmployeeAnnouncements/EmployeeAnnouncements";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (data) => {
        setUserData(data);
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('token', data.accessToken);
    };

    const logout = () => {
        setUserData(null);
        localStorage.clear();
    };

    useEffect(() => {
        const loadUser = () => {
            try {
                const data = localStorage.getItem("data");
                if (data) {
                    setUserData(JSON.parse(data));
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                localStorage.clear();
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const Routers = () => {
    const { userData } = useContext(AuthContext);
    const ProtectedRoute = ({ children }) => {
        const location = useLocation();

        if (!userData) {
            return <Navigate to="/" state={{ from: location }} replace />;
        }
        return children;
    };
    const LoginRoute = () => {
        if (userData) {
            const role = userData.role.role_value;
            return <Navigate to={`/${role}/dashboard`} replace />;
        }
        return <LoginPage />;
    };

    return (
        <Routes>
            <Route exact path="/" element={<LoginRoute />} />
            <Route path="/approve-leave/:userId/:requestId/:managerId" element={<ApproveLeave />} />

            {/* Associate Director Routes */}
            <Route path="/ad/*" element={
                <ProtectedRoute>
                    {userData?.role?.role_value === "ad" ? (
                        <BasePage>
                            <Routes>
                                <Route path="/dashboard" element={<ADDashboard />} />
                                <Route path="/employees" element={<ViewAllEmployees />} />
                                <Route path="/view-employee/:id" element={<Profile />} />
                                <Route path="/view-records" element={<LeaveRecords />} />
                                <Route path="/attendence-history" element={<AttendenceHistory />} />
                            </Routes>
                        </BasePage>
                    ) : (
                        <Navigate to="/" replace />
                    )}
                </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
                <ProtectedRoute>
                    {userData?.role?.role_value === "admin" ? (
                        <BasePage>
                            <Routes>
                                <Route path="/dashboard" element={<EmployeeDashboard />} />
                                <Route path="/employees" element={<AllEmployees />} />
                                <Route path="/add-employee" element={<EmployeeForm />} />
                                <Route path="/employee/:id" element={<Profile />} />
                                <Route path="/edit-employee/:id" element={<EditEmployee />} />
                                <Route path="/add-employee" element={<EmployeeForm/>}/>
                                <Route path="/attendance" element={<AttendenceHistoryByAdmin/>}/>
                                <Route path="/leave-records" element={<AdminLeaveRecords/>}/>
                                <Route path="/announcement" element={<AdminAnnouncement/>}/>
                            </Routes>
                        </BasePage>
                    ) : (
                        <Navigate to="/" replace />
                    )}
                </ProtectedRoute>
            } />
            <Route path="/manager/*" element={
                <ProtectedRoute>
                    {userData?.role?.role_value === "manager" ? (
                        <BasePage>
                            <Routes>
                            
                                <Route path="/dashboard" element={<ManagerDashboard />} />
                                <Route path="/employees" element={<ViewAllEmployees />} />
                                <Route path="/view-employee/:id" element={<Profile />} />
                                <Route path="/view-records" element={<LeaveRecords />} />
                                <Route path="/attendence-history" element={<AttendenceHistory />} />
                                <Route path="/profile" element={<ManagerProfile />} />
                                {/* <Route path="/LeaveDetailsForm"  element={<LeaveDetailsForm/>}/> */}
                            </Routes>
                        </BasePage>
                    ) : (
                        <Navigate to="/" />
                    )}
                </ProtectedRoute>
            } />

            {/* Employee Routes */}
            <Route path="/user/*" element={
                <ProtectedRoute>
                    {userData?.role?.role_value === "user" ? (
                        <BasePage>
                            <Routes>
                                <Route path="/dashboard" element={<EmployeeHome />} />
                                <Route path="/leave-requests" element={<EmployeeLeaveRecords />} />
                                <Route path="/attendence/history" element={<AttendenceRecords />} />
                                <Route path="/profile" element={<EmployeeProfile />} />
                                <Route path="/announcement" element={<EmployeeAnnouncement/>}/>
                            </Routes>
                        </BasePage>
                    ) : (
                        <Navigate to="/" />
                    )}
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default Routers;

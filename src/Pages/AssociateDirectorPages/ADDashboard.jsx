import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Collapse,
  Badge,
} from "antd";
import { FaUsers } from "react-icons/fa";
import { CalendarDays, UserCheck, ChevronDown, User } from "lucide-react";
import axios from "axios";
import moment from "moment";
import { colorPairs } from "../ManagerPages/ManagerHome";
import LoadingAnimation from "../../Components/Layout/animations/LoadingAnimation";

const { Panel } = Collapse;

// Modern color palette
const modernColors = {
  primary: "#f0f7ff",
  secondary: "#fff6f6",
  success: "#f0fff4",
  warning: "#fffaf0",
  cardShadow:
    "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
};

const ADDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const userName = JSON.parse(localStorage.getItem("user")).username;

  const fetchManagersAndEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3002/api/routes/employee/view-employees/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter only managers from the response
      const allData = response.data.data;
      const managersData = allData.filter(
        (user) => user.role?.role_value === "manager"
      );

      // Set managers with their team members
      setManagers(managersData);

      // Calculate total employees (excluding managers)
      const total = managersData.reduce(
        (acc, manager) => acc + (manager.team_members?.length || 0),
        0
      );
      setTotalEmployees(total);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setError("Failed to fetch managers data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);

      // First, fetch all employees to get their details
      const employeesResponse = await axios.get(
        `http://localhost:3002/api/routes/employee/view-employees/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Create a map of all employees (both managers and team members)
      const employeeMap = {};

      // Process all employees from the response
      employeesResponse.data.data.forEach((manager) => {
        // Add manager to map
        employeeMap[manager._id] = {
          first_name: manager.first_name || "Unknown",
          last_name: manager.last_name || "Employee",
          designation: manager.profession_id?.designation || "Manager",
        };

        // Add team members to map if they exist
        if (manager.team_members && Array.isArray(manager.team_members)) {
          manager.team_members.forEach((member) => {
            employeeMap[member._id] = {
              first_name: member.first_name || "Unknown",
              last_name: member.last_name || "Employee",
              designation: member.profession_id?.designation || "Employee",
            };
          });
        }
      });

      // Get all leaves in a single API call
      const leaveResponse = await axios.get(
        `http://localhost:3002/api/routes/time-off/view-timeoff/${userId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      let allLeaveRequests = [];
      if (leaveResponse.data.data) {
        allLeaveRequests = leaveResponse.data.data.map((leave) => {
          const employee = employeeMap[leave.user_id] || {};
          return {
            ...leave,
            first_name: employee.first_name || leave.first_name || "Unknown",
            last_name: employee.last_name || leave.last_name || "Employee",
            designation:
              employee.designation || leave.designation || "Employee",
          };
        });
      }

      // Filter leaves for next 7 days
      const today = moment().startOf("day");
      const next7Days = moment().add(7, "days").endOf("day");

      const filteredLeaves = allLeaveRequests.filter((leave) => {
        const startDate = moment(leave.from_date);
        const endDate = moment(leave.to_date);
        return (
          startDate.isBetween(today, next7Days, "day", "[]") ||
          endDate.isBetween(today, next7Days, "day", "[]")
        );
      });

      // Group leaves by status
      const groupedLeaves = filteredLeaves.reduce((acc, leave) => {
        const status = leave.status_name || "Pending";
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(leave);
        return acc;
      }, {});

      setLeaveRequests(groupedLeaves);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setError("Failed to fetch leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagersAndEmployees();
    fetchLeaveRequests();
  }, []);

  const leaveColumns = [
    {
      title: "Employee",
      dataIndex: "user_id",
      key: "user_id",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            style={{
              backgroundColor: colorPairs[0].color,
              color: "white",
            }}
          >
            {record.first_name?.[0]}
          </Avatar>
          <span>
            {record.first_name} {record.last_name}
          </span>
        </div>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "timeoff_type",
      key: "timeoff_type",
      render: (type) => (
        <Tag color={type === "permission" ? "blue" : "green"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "From",
      dataIndex: "from_date",
      key: "from_date",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "To",
      dataIndex: "to_date",
      key: "to_date",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status_name",
      key: "status_name",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  // Add new function to format date ranges
  const formatDateRange = (fromDate, toDate) => {
    const start = moment(fromDate).format("DD MMM");
    const end = moment(toDate).format("DD MMM");
    return start === end ? start : `${start} - ${end}`;
  };

  // Add new function to sort leaves by date
  const sortLeavesByDate = (leaves) => {
    return leaves.sort((a, b) => moment(b.from_date) - moment(a.from_date));
  };

  // Update the groupLeavesByEmployee function
  const groupLeavesByEmployee = (leaveRequests) => {
    const employeeLeaves = {};

    Object.entries(leaveRequests).forEach(([status, leaves]) => {
      leaves.forEach((leave) => {
        const employeeId = leave.employee_id || leave._id;
        if (!employeeLeaves[employeeId]) {
          employeeLeaves[employeeId] = {
            id: employeeId,
            name:
              leave.employee_name ||
              `${leave.first_name || ""} ${leave.last_name || ""}`.trim(),
            firstName:
              leave.first_name || leave.employee_name?.split(" ")[0] || "",
            designation: leave.designation || "Employee",
            leaves: [],
          };
        }
        employeeLeaves[employeeId].leaves.push({
          ...leave,
          status: status,
        });
      });
    });

    // Sort leaves for each employee by date
    Object.values(employeeLeaves).forEach((employee) => {
      employee.leaves.sort((a, b) => moment(a.from_date) - moment(b.from_date));
    });

    return employeeLeaves;
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const totalUpcomingLeaves = Object.values(leaveRequests).flat().length;
  const approvedLeaves = leaveRequests["Approved"]?.length || 0;
  const pendingLeaves = leaveRequests["Requested"]?.length || 0;

  return (
    <div className=" bg-gray-50">
      <div className="bg-gradient-to-bl from-pink-500 to-blue-400 py-8 px-2">
        <h1 className="text-2xl font-[600]  text-white ">
          Welcome, {userName}{" "}
        </h1>
      </div>
      <div className="p-3">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={6}>
            <Card
              style={{
                background: modernColors.primary,
                boxShadow: modernColors.cardShadow,
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ width: "100%" }}
              bordered={false}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", color: "#1e3a8a" }}>
                    Total Managers
                  </span>
                }
                value={managers?.length || 0}
                prefix={
                  <FaUsers style={{ color: "#3b82f6" }} className="mr-2" />
                }
                valueStyle={{ color: "#1e3a8a", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                background: modernColors.secondary,
                boxShadow: modernColors.cardShadow,
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ width: "100%" }}
              bordered={false}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", color: "#991b1b" }}>
                    Total Team Members
                  </span>
                }
                value={totalEmployees}
                prefix={<User style={{ color: "#ef4444" }} className="mr-2" />}
                valueStyle={{ color: "#991b1b", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                background: modernColors.success,
                boxShadow: modernColors.cardShadow,
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ width: "100%" }}
              bordered={false}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", color: "#166534" }}>
                    Approved Leaves (7 days)
                  </span>
                }
                value={approvedLeaves}
                prefix={
                  <CalendarDays style={{ color: "#22c55e" }} className="mr-2" />
                }
                valueStyle={{ color: "#166534", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                background: modernColors.warning,
                boxShadow: modernColors.cardShadow,
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ width: "100%" }}
              bordered={false}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", color: "#854d0e" }}>
                    Pending Leaves
                  </span>
                }
                value={pendingLeaves}
                prefix={
                  <CalendarDays style={{ color: "#eab308" }} className="mr-2" />
                }
                valueStyle={{ color: "#854d0e", fontSize: "20px" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Managers List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Team Overview
          </h2>
          <Row gutter={[16, 16]}>
            {managers && managers.length > 0 ? (
              managers.map((manager, index) => (
                <Col span={8} key={manager._id}>
                  <Card
                    hoverable
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: modernColors.cardShadow,
                      borderRadius: "12px",
                      border: "none",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        count={manager.team_members?.length || 0}
                        offset={[-5, 5]}
                      >
                        <Avatar
                          size={64}
                          style={{
                            backgroundColor:
                              colorPairs[index % colorPairs.length].color,
                            color: "white",
                          }}
                        >
                          {manager.first_name?.[0]}
                        </Avatar>
                      </Badge>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {manager.first_name} {manager.last_name}
                        </h3>
                        <p className="text-gray-500">
                          {manager.profession_id?.designation || "Manager"}
                        </p>
                      </div>
                    </div>
                    <Collapse
                      ghost
                      style={{
                        background: "transparent",
                        marginTop: "8px",
                      }}
                    >
                      <Panel
                        header={
                          <div className="flex justify-between items-center text-gray-600">
                            <span>
                              Team Members: {manager.team_members?.length || 0}
                            </span>
                            <ChevronDown className="text-sm" />
                          </div>
                        }
                        key="1"
                      >
                        {manager.team_members &&
                        manager.team_members.length > 0 ? (
                          manager.team_members.map((member, idx) => (
                            <div
                              key={member._id}
                              className="flex items-center gap-2 mb-2 p-2 hover:bg-gray-50 rounded transition-all duration-200"
                            >
                              <Avatar
                                size="small"
                                style={{
                                  backgroundColor:
                                    colorPairs[
                                      (index + idx) % colorPairs.length
                                    ].color,
                                  color: "white",
                                }}
                              >
                                {member.first_name?.[0]}
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-700">
                                  {member.first_name} {member.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.profession_id?.designation ||
                                    "Employee"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-2">
                            No team members found
                          </div>
                        )}
                      </Panel>
                    </Collapse>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div className="text-center text-gray-500 py-4">
                  No managers found
                </div>
              </Col>
            )}
          </Row>
        </div>

        {/* Replace only the Leave Requests Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">
            Leave Requests (Next 7 Days)
          </h2>
          <Row gutter={[16, 16]}>
            {(() => {
              // Group leaves by employee
              const employeeLeaves = {};
              Object.values(leaveRequests)
                .flat()
                .forEach((leave) => {
                  if (!employeeLeaves[leave.user_id]) {
                    employeeLeaves[leave.user_id] = {
                      first_name: leave.first_name,
                      last_name: leave.last_name,
                      designation: leave.designation,
                      leaves: [],
                    };
                  }
                  employeeLeaves[leave.user_id].leaves.push(leave);
                });

              return Object.entries(employeeLeaves).map(
                ([userId, employee]) => (
                  <Col xs={24} sm={12} lg={8} key={userId}>
                    <Card
                      hoverable
                      className="hover:shadow-lg transition-shadow duration-300"
                      style={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: modernColors.cardShadow,
                      }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar
                          size={64}
                          style={{
                            backgroundColor:
                              colorPairs[
                                Math.floor(Math.random() * colorPairs.length)
                              ].color,
                            color: "white",
                          }}
                        >
                          {employee.first_name?.[0] || "U"}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <p className="text-gray-500">
                            {employee.designation}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">
                          Upcoming Leaves
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {employee.leaves.map((leave) => {
                            const today = moment().startOf("day");
                            const next7Days = moment()
                              .add(7, "days")
                              .endOf("day");
                            let displayDate;
                            let timeInfo = "";

                            if (
                              leave.is_half_day_leave ||
                              leave.is_permission
                            ) {
                              // For half day leave or permission
                              if (leave.leave_date) {
                                displayDate = moment(leave.leave_date[0].date);
                                const startTime =
                                  leave.leave_date[0].start_date;
                                const endTime = leave.leave_date[0].end_date;
                                console.log(leave);
                                console.log(startTime, endTime);

                                // Check if it's first half or second half
                                if (
                                  startTime === "9 AM" &&
                                  endTime === "2 PM"
                                ) {
                                  timeInfo = "(FH)";
                                } else {
                                  timeInfo = "(SH)";
                                }
                              }
                            } else {
                              // For full day leave
                              displayDate = moment(leave.from_date);
                              const endDate = moment(leave.to_date);
                              if (!displayDate.isSame(endDate, "day")) {
                                timeInfo = ` - ${endDate.format("D/M")}`;
                              }
                            }

                            // Skip if leave is not in next 7 days
                            if (
                              !displayDate.isBetween(
                                today,
                                next7Days,
                                "day",
                                "[]"
                              )
                            ) {
                              return null;
                            }

                            const bgColor =
                              leave.status_name === "Approved"
                                ? "#f0fff4"
                                : leave.status_name === "Rejected"
                                ? "#fff1f0"
                                : "#fffbe6";

                            return (
                              <Tooltip
                                key={leave._id}
                                title={
                                  <div className="p-2">
                                    <div className="font-medium">
                                      {leave.timeoff_type
                                        ?.charAt(0)
                                        .toUpperCase() +
                                        leave.timeoff_type?.slice(1)}
                                      {/* {leave.is_half_day_leave ? "Half day":""} */}
                                      {leave.is_permission}
                                    </div>
                                    <div className="text-xs">
                                      Status: {leave.status_name}
                                    </div>
                                    <div className="text-xs">
                                      {leave.is_half_day_leave ||
                                      leave.is_permission ? (
                                        <>
                                          Date: {displayDate.format("DD MMM")}
                                          <br />
                                          Time:{" "}
                                          {
                                            leave.leave_date[0]?.start_date
                                          } - {leave.leave_date[0]?.end_date}
                                        </>
                                      ) : (
                                        `${moment(leave.leave_date[0].start_date).format(
                                          "DD MMM"
                                        )} - ${moment(leave.leave_date[0].end_date).format(
                                          "DD MMM"
                                        )}`
                                      )}
                                    </div>
                                    {leave.reason && (
                                      <div className="text-xs italic mt-1">
                                        {leave.reason}
                                      </div>
                                    )}
                                  </div>
                                }
                                placement="top"
                              >
                                <div
                                  className="p-2 rounded text-center cursor-pointer transition-all duration-200 hover:shadow-sm"
                                  style={{
                                    backgroundColor: bgColor,
                                    border: "1px solid #e8e8e8",
                                    minWidth: "70px",
                                  }}
                                >
                                  <div className="font-medium">
                                    {displayDate.format("D/M")}
                                    {timeInfo}
                                  </div>
                                  <Tag
                                    color={
                                      leave.status_name === "Approved"
                                        ? "success"
                                        : leave.status_name === "Rejected"
                                        ? "error"
                                        : "warning"
                                    }
                                    style={{
                                      padding: "0 4px",
                                      marginTop: "4px",
                                    }}
                                  >
                                    {leave.timeoff_type
                                      ?.charAt(0)
                                      .toUpperCase()}
                                    {/* {(leave.is_half_day_leave || leave.is_permission) && 'H'} */}
                                  </Tag>
                                </div>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              );
            })()}
            {Object.values(leaveRequests).flat().length === 0 && (
              <Col span={24}>
                <Card className="text-center">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No leave requests for the next 7 days
                  </p>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ADDashboard;

// Add custom styles at the end of the file
const customStyles = `
.leave-details-collapse .ant-collapse-header {
    padding: 0 !important;
}
.leave-details-collapse .ant-collapse-content-box {
    padding: 0 !important;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

import React, { useEffect, useState } from 'react';
import user from "../../../assets/images/user.jpg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { set } from 'date-fns';

const CardView = ({ employees }) => {
  const data = JSON.parse(localStorage.getItem('data'));
  const navigate = useNavigate();
  const colors = ["#AB47BC", "#FFC107", "#E70D0D", "#03C95A", "#FD3995"];
  const bgColors = ["#FFDBEC", "#F7EEF9", "#E8E9EA", "#EDF2F4", "#F6CECE"];
  const textColors = ["#FD3995", "#AB47BC", "black", "#3B7080", "#E70D0D"]
  const colorPairs = bgColors.map((bgColor, index) => ({
    bgColor,
    textColor: textColors[index],
  }));
  const [employee, setEmployee] = useState([])
  const [updatedEmpWithColor, setUpdatedEmpWithColor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const token = localStorage.getItem("token");
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleNavigate = (id) => {
    navigate(`/admin/edit-employee/${id}`, { state: { employees } });
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = employees.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(employees.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMenuClick = (id, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="w-full mb-4">
        <div className="flex px-4 py-2 justify-between items-center w-full">
          {/* <p className='text-xl font-[500]'>Employees</p> */}
          <div>
            {/* <select className="p-2">
              <option className="hover:bg-[violet]">All</option>
              <option>Software Developer</option>
              <option>UI/UX</option>
              <option>AI/DS</option>
              <option>Prompt Engineer</option>
            </select> */}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(310px,1fr))] gap-4">
            {currentUsers.map((emp, ind) => (
              <div
                className="relative flex flex-col bg-white py-4 rounded-lg justify-around shadow-xl border h-[370px] "
                key={ind}
              >
                <div className='absolute top-5 right-3 menu-container'>
                  <div>
                    <EllipsisVertical 
                      size={18} 
                      color="gray" 
                      className="cursor-pointer"
                      onClick={(e) => handleMenuClick(emp.id, e)}
                    />
                    {openMenuId === emp.id && (
                      <div className='absolute flex flex-col p-2 bg-white right-0 shadow-lg rounded-lg w-32 z-10 gap-1'>
                        <div 
                          className='flex flex-row items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded-md text-blue-600 hover:text-blue-700 transition-all duration-200'
                          onClick={() => handleNavigate(emp.id)}
                        >
                          <Pencil size={14} strokeWidth={2} />
                          <p className="text-sm font-medium">Edit</p>
                        </div>
                        <div className='flex flex-row items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded-md text-red-600 hover:text-red-700 transition-all duration-200'>
                          <Trash2 size={14} strokeWidth={2} />
                          <p className="text-sm font-medium">Delete</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center flex-col gap-5 cursor-pointer" onClick={() => handleNavigate(emp.id)}>
                  <div
                    className="w-[78px] h-[78px] rounded-full flex justify-center items-center"
                    style={{ border: `2px solid ${emp.color}` }}
                  >
                    <img
                      src={user}
                      className="w-[62px] h-[62px] rounded-full"
                      alt={emp.name}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <p className="">{emp.name}</p>
                    <p className="text-sm px-2 py-1 rounded-lg"
                      style={{ color: emp.otherColors.textColor, backgroundColor: emp.otherColors.bgColor }}>{emp.designation}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between px-2 items-center">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-[#969590] text-sm">Emp ID</p>
                    <p className="text-sm">{emp.emp_id}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-[#969590] text-sm">Email</p>
                    <p className="text-[13px]">{emp.email}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                  <p>
                    Productivity:{" "}
                    <span style={{ color: emp.color }}>{emp.productivity}</span>
                  </p>
                  <div className="relative h-[5px] w-[90%] bg-[#ccc] rounded-lg m-auto">
                    <div
                      className="absolute h-[5px] rounded-lg"
                      style={{
                        width: emp.productivity,
                        backgroundColor: emp.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
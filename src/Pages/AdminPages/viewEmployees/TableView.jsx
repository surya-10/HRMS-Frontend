import React, { useState } from 'react'
import { Table, Tag, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { addDays, format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TableView = ({ employees }) => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownLabel, setDropdownLabel] = useState("Select Date Range");
  const [dateRange, setDateRange] = useState("");
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const options = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Year", value: "thisyear" },
    { label: "Next Year", value: "nextyear" },
    { label: "Custom Range", value: "custom" },
  ];

  const handleOptionSelect = (option) => {
    setDropdownOpen(false);
    const today = new Date();

    switch (option.value) {
      case "today":
        setDropdownLabel(`${format(today, "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`);
        setDateRange(`${format(today, "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`);
        setShowCustomRangePicker(false);
        break;
      case "yesterday":
        const yesterday = addDays(today, -1);
        setDropdownLabel(`${format(yesterday, "MM-dd-yyyy")} - ${format(yesterday, "MM-dd-yyyy")}`);
        setDateRange(`${format(yesterday, "MM-dd-yyyy")} - ${format(yesterday, "MM-dd-yyyy")}`);
        setShowCustomRangePicker(false);
        break;
      case "last7days":
        setDropdownLabel(
          `${format(addDays(today, -7), "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`
        );
        setDateRange(
          `${format(addDays(today, -7), "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`
        );
        setShowCustomRangePicker(false);
        break;
      case "last30days":
        setDropdownLabel(
          `${format(addDays(today, -30), "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`
        );
        setDateRange(
          `${format(addDays(today, -30), "MM-dd-yyyy")} - ${format(today, "MM-dd-yyyy")}`
        );
        setShowCustomRangePicker(false);
        break;
      case "thisyear":
        setDropdownLabel(`01-01-${today.getFullYear()} - 12-31-${today.getFullYear()}`);
        setDateRange(`01-01-${today.getFullYear()} - 12-31-${today.getFullYear()}`);
        setShowCustomRangePicker(false);
        break;
      case "nextyear":
        const nextYear = today.getFullYear() + 1;
        setDropdownLabel(`01-01-${nextYear} - 12-31-${nextYear}`);
        setDateRange(`01-01-${nextYear} - 12-31-${nextYear}`);
        setShowCustomRangePicker(false);
        break;
      case "custom":
        setShowCustomRangePicker(true);
        break;
      default:
        break;
    }
  };
  const handleNavigate = (record) => {
    console.log(record)
    navigate(`/admin/employee/${record.id}`, { state: { employees } });
  }

  const handleRangeChange = (ranges) => {
    setRange([ranges.selection]);
    const startDate = ranges.selection.startDate;
    const endDate = ranges.selection.endDate;
    setDropdownLabel(`${format(startDate, "MM-dd-yyyy")} - ${format(endDate, "MM-dd-yyyy")}`);
    setDateRange(`${format(startDate, "MM-dd-yyyy")} - ${format(endDate, "MM-dd-yyyy")}`);
    setShowCustomRangePicker(false);
    setDropdownOpen(false);
  };
  const columns = [
    {
      title: 'Emp ID',
      dataIndex: 'emp_id',
      sorter: {
        compare: (a, b) => {
          const numA = parseInt(a.emp_id.replace(/\D/g, ''), 10);
          const numB = parseInt(b.emp_id.replace(/\D/g, ''), 10);
          return numA - numB;
        },
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 2,
      },
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={record?.img}
            alt={text}
            style={{ width: 40, height: 40, borderRadius: '100%', marginRight: 10 }}
          />
          <div>
            {/* Name and Designation */}
            <span style={{ color: 'black', fontWeight: 'bold' }}>{text}</span><br />
            <span style={{ color: 'gray' }}>{record?.designation}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
        multiple: 3,
      },
      render: (text) => <span style={{ color: 'gray' }}>{text}</span>

    },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   sorter: {
    //     compare: (a, b) => {
    //       return a.phone - b.phone;
    //     },
    //     multiple: 4,
    //   },
    //   render: (text) => <span style={{ color: 'gray' }}>{text}</span>
    // },

    {
      title: 'Designation',
      dataIndex: 'designation',
      sorter: {
        compare: (a, b) => {
          console.log(a.designation, b.designation)
          return a.designation.localeCompare(b.designation)
        },
        multiple: 1,
      },
      render: (text) => (
        <span
          style={{
            color: 'black',
            border: '1px solid #ccc',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {text}
        </span>
      ),
    }
    ,
    {
      title: 'Join Date',
      dataIndex: 'joiningDate',
      sorter: {
        compare: (a, b) => new Date(a.joindate) - new Date(b.joindate),
        multiple: 1,
      },
      render: (joindate) => {
        const date = new Date(joindate);
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date);
        return formattedDate;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      render: (status) => (
        <Tag color={status === 'Active' ? '#03C95A' : '#E70D0D'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }
            }
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }
            }
            danger
          />
        </>
      ),
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  const paginationProps = {
    total: employees.length,
    pageSize: 5,
    showTotal: (total, range) => `Showing ${range[0]} - ${range[1]} of ${total} entries`,
  };

  const handleDelete = (record) =>{
    console.log(record)
  }
  const handleEdit = (record) =>{
    console.log(record)
    navigate(`/admin/edit-employee/${record.id}`, {state:employees})
  }


  const [show, setShow] = useState(false);
  const [designation, setDesignation] = useState(false);
  const [isDateHovered, setIsDateHovered] = useState(false);
  const [status, setStatus] = useState(false);
  const [order, setOrder] = useState(false);
  const [date, setDate] = useState(false);

  return (
    <>
      <div onClick={() => setShow(false)}>


        <div className='rounded-lg flex flex-col'
          onClick={() => {
            setDesignation(false);
            setStatus(false);
            setIsDateHovered(false);

          }}>
          <div className='w-full rounded-t-lg flex flex-row justify-between mb-4'>
            <div className='flex items-center'>
              {/* <p className=' font-[500] text-lg '>
                Employees details
              </p> */}
            </div>
            <div className='flex justify-end items-center flex-row gap-5'>
              {/* <div className="relative mx-auto bg-white shadow-lg   w-80 rounded-lg"
                onClick={() => {
                  setDesignation(false);
                  setStatus(false);
                }}>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={` w-full py-3 px-4 bg-white rounded-lg flex justify-between items-center hover:shadow-md focus:outline-none 
                      ${isDateHovered ? 'text-white' : 'hover:text-[#F26722]'}`}
                  >
                    {dropdownLabel}
                    <span
                      className={`ml-2 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
                        }`}
                    >
                      ▼
                    </span>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-md">
                      {options.map((option) => (
                        <li
                          key={option.value}
                          className=" m-1 py-3 px-4 hover:bg-[#FEF1EB] cursor-pointer transition-all hover:text-[#F26722] rounded-lg"
                          onClick={() => handleOptionSelect(option)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {showCustomRangePicker && (
                  <div className="mt-4 absolute z-[100] border shadow-2xl shadow-slate-800 rounded-lg bg-white">
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={range}
                      maxDate={new Date()} 
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div> */}

              {/* <div>
                <div
                  className="flex flex-row group cursor-pointer relative select-none"
                  onClick={(event) => {
                    setDesignation(!designation);
                    setStatus(false);
                    setOrder(false);
                    setDate(false);
                    event.stopPropagation();
                    setIsDateHovered(false);
                    setDropdownOpen(false);
                  }}
                >
                  <p
                    className={` rounded border-gray-200 flex flex-row gap-1 items-center pl-3 ${designation ? 'text-white' : 'group-hover:text-[#F26722]'
                      } px-4  py-3`}
                    style={designation ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
                  >
                    Designation{' '}
                    <ChevronDown
                      className={`text-gray-600 ${designation ? 'text-white' : 'group-hover:text-[#F26722]'
                        }`}
                    />
                  </p>


                  {designation && <div className='absolute bg-[white] z-[50] top-12 shadow-xl w-[200px]  rounded-lg border-2 p-2 flex flex-col'>
                    <p onClick={() => {
                      setShow(false);
                      setDesignation(false);

                    }} className='p-2 w-full h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                      Design
                    </p>
                    <p onClick={() => {
                      setShow(false);
                      setDesignation(false);
                    }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                      Developer
                    </p>
                    <p onClick={() => {
                      setShow(false);
                      setDesignation(false);
                    }} className='p-2 w-full h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                      HR
                    </p>
                    <p onClick={() => {
                      setShow(false);
                      setDesignation(false);
                    }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                      Manager
                    </p>
                    <p onClick={() => {
                      setShow(false);
                      setDesignation(false);
                    }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                      Backend
                    </p>
                  </div>

                  }
                </div>
              </div> */}
              {/* <div className="flex flex-row group cursor-pointer rounded relative select-none"
                onClick={(event) => {
                  setStatus(!status);
                  setOrder(false);
                  setDesignation(false);
                  setDate(false);
                  setIsDateHovered(false);
                  setDropdownOpen(false);
                  event.stopPropagation();
                }}>
                <p
                  className={`py-3 px-6 rounded border-gray-200 flex flex-row gap-2 items-center pl-3 ${status ? 'text-white' :
                    'group-hover:text-[#F26722]'
                    }`}
                  style={status ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
                >Status
                  <ChevronDown
                    className={`text-gray-600 ${status ? 'text-white' : 'group-hover:text-[#F26722]'
                      }`}
                  />

                </p>

                {status && <div className='w-full  absolute bottom-[-100px] bg-[white] z-[50] shadow-xl mt-[42px] w-[140px] h-[100px] rounded-lg border-2 p-2 flex flex-col'>
                  <p onClick={() => {
                    setShow(false);
                    setStatus(false);
                  }} className='p-2 w-full h-[40px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                    Active
                  </p>
                  <p onClick={() => {
                    setShow(false);
                    setStatus(false);
                  }} className='p-2 w-full h-[40px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                    Inactive
                  </p>
                </div>
                }
              </div> */}
              {/* <div className="flex flex-row group cursor-pointer h-[45px] mt-[9px] rounded"
                onClick={(event) => {
                  setOrder(!order);
                  setDesignation(false);
                  setStatus(false);
                  setDate(false);
                  event.stopPropagation();
                }}>
                <p
                  className={`w-[200px] h-[38px] mr-2 rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 ${order ? 'text-white' : 'group-hover:text-[#F26722]'
                    }`}
                  style={order ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
                >Sort By:Last 7 Days
                  <ChevronDown
                    className={`text-gray-600 ${order ? 'text-white' : 'group-hover:text-[#F26722]'
                      }`}
                  />
                </p>

                {order && <div className='absolute bg-[white] z-[50] right-[46px] mt-[41px] w-[200px] h-[110px] rounded-lg border-2 p-3 flex flex-col'>
                  <p onClick={() => {
                    setOrder(false);
                  }} className='p-2 w-[120px] h-[100px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                    Accessending
                  </p>
                  <p onClick={() => {
                    setOrder(false);
                  }} className='p-2 w-[120px] h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
                    Decending
                  </p>
                </div>
                }
              </div> */}
              {/* <select className='border border-2 h-[40px] rounded'>
                                <option value="">Sort By:Last 7 Days </option>
                                <option value="option1">Active</option>
                                <option value="option2">Inactive</option>
                            </select> */}
            </div>
          </div>
          {/* <div className='w-full h-[70px] flex items-center gap-2 pl-5 border-l-2 border-r-2 justify-between mt-2'>
            <div>
              <span className=' text-[gray] mr-2'>
                Row Per Page
              </span>
              <select className=' border-2 mr-2 rounded-lg text-[#4A4151] p-1'>
                <option value="">10</option>
                <option value="option1">20</option>
                <option value="option2">50</option>
                <option value="option3">100</option>
                <option value="option4">200</option>
              </select>
              <span className='text-[gray] font-semibold'>
                Entries
              </span>
            </div>
            <div className='flex '>
              <input
                type="search"
                placeholder="Search"
                class="border-2 rounded-lg p-2 text-[#4A4151] w-[300px]"
                aria-label="Search"
              />

            </div>
          </div> */}
          <Table className=' border-2 cursor-pointer' columns={columns} pagination={paginationProps} dataSource={employees} onChange={onChange}
            onRow={(record) => ({
              onClick: () => handleNavigate(record),
            })} />
        </div>
      </div >

    </>
  )
}

export default TableView;
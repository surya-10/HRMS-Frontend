import React, { useEffect, useState } from 'react'
import TableView from './viewEmployees/TableView';
import CardView from './viewEmployees/CardView';
import { ChevronDown, ChevronUp, CircleUserRound, FileDown, HandHelping, LayoutGrid, List, Plus, UserRound, UserRoundCheck, UserRoundX, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingAnimation from '../../Components/Layout/animations/LoadingAnimation';


const AllEmployees = () => {
  const token = localStorage.getItem("token");
  const data = JSON.parse(localStorage.getItem('data'));
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [updatedEmpWithColor, setUpdatedEmpWithColor] = useState([]);
  const [activeEmp, setActiveEmp] = useState(0)
  // const colors = ["#F26522", "#03C95A", "#E70D0D", "#1B84FF", "#FFC107", "#9C27B0", "#FF5722", "#795548", "#607D8B", "#FF9800"];
  const colors = ["#AB47BC", "#FFC107", "#E70D0D", "#03C95A", "#FD3995"];
  const bgColors = ["#FFDBEC", "#F7EEF9", "#E8E9EA", "#EDF2F4", "#F6CECE"];
  const textColors = ["#FD3995", "#AB47BC", "black", "#3B7080", "#E70D0D"];
  const [loading, setLoading] = useState(false);
  const colorPairs = bgColors.map((bgColor, index) => ({
    bgColor,
    textColor: textColors[index],
  }));


  const handleNavigation = () => {
    navigate("/admin/add-employee");
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/routes/employee/view-employees/${data.user_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("response:", response.data);
        const activeCount = response.data.data.filter((emp) => emp.status == true).length;
        setActiveEmp(activeCount)
        console.log(Array.isArray(response.data.data))
        console.log(response.data.data)
        if (Array.isArray(response.data.data)) {
          const newEmployees = response.data.data.map((emp, i) => {
            return {
              id: emp._id,
              first_name: emp.first_name,
              last_name: emp.last_name,
              email: emp.email,
              phone: 9767438712,
              designation: emp.profession_id.designation,
              emp_id: `EMP0${i + 1}`,
              status: emp.is_deleted == false ? "Active" : "Inactive",
              joiningDate: emp.createdAt.slice(0, 10),
              productivity: `${getRandomNumber()}%`,
              profile: emp.profile_id,
              profession: emp.profession_id,
              nationality: emp.profile_id.nationality,
              reportingManager: getManager(emp.manager_id, response.data.data),
              martial_status: emp.profile_id.martial_status,
              role: emp.role
            };
          });
          setEmployees(newEmployees);
          setLoading(true);
        } else {
          console.error("The response is not an array:", response.data);
        }

      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };
    fetchEmployees();

    function getManager(id, data) {
      let manager = data.filter((emp) => emp.manager_id == id);
      return `${manager[0].first_name} ${manager[0].last_name}`
    }

  }, [token, data.user_id]);

  const getRandomNumber = () => Math.floor(Math.random() * (100 - 20 + 1)) + 20;
  useEffect(() => {
    const updatedEmployees = employees.map((emp, ind) => {
      const color = colors[ind % colors.length];
      const otherColors = colorPairs[ind % colorPairs.length];
      return {
        ...emp, color, otherColors,
        img: "https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg",
        actions: 'Edit/Delete'
      };
    });
    console.log(updatedEmployees)
    console.log(employees)
    setUpdatedEmpWithColor(updatedEmployees);
  }, [employees]);


  let [show, setShow] = useState(false);
  let [tableView, setTableView] = useState(true);


  let HandleViewchange = () => {
    setTableView(!tableView);
  }
  // const handleNavigation = () => {
  //   navigate("/admin/add-employee");
  // };


  return (
    <div className='w-full'>
      {loading ?
        <div>
          {/* <div className='flex md:flex-row md:items-center md:gap-4 md:justify-between flex-col justify-start items-start mt-4'>
            <div className='flex   pt-5'>
              <div>
                <span className='text-xl font-[500]'>Employees dashboard</span>
              </div>
            </div>
            <div className='flex flex-row gap-4 pt-2'>
              <div className='flex flex-row   bg-[white] border-2 border-gray-200  rounded items-center justify-evenly  py-1 gap-2 px-1 duration-300' >
                <List size={25} className={`${tableView ? " bg-[#F26522] rounded  text-[white]" : "rounded"} p-1 duration-300 cursor-pointer`} onClick={HandleViewchange} />
                <LayoutGrid size={25} className={`${!tableView ? " bg-[#F26522] rounded  text-[white]" : "rounded"} p-1 duration-300 cursor-pointer`} onClick={HandleViewchange} />
              </div>

              <div className='select-none rounded-xl'>
                <div className='relative'>
                  <p
                    onClick={(event) => {
                      setShow(!show);
                      event.stopPropagation();
                    }}
                    className={`px-2 text-[16px] group select-none  py-2 border-gray-200 border-2 rounded-lg flex flex-row gap-1 items-center pl-3 cursor-pointer ${show ? 'bg-[#F26722] text-white' : 'bg-white hover:text-[#F26722]'
                      }`}
                  >
                    <FileDown
                      size={16}
                      className={`${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                        } text-[14px]`}
                    />
                    Export
                    {show ? <ChevronUp size={18}
                      className={`ml-6 ${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                        }`}
                    /> :
                      <ChevronDown size={18}
                        className={`ml-6 ${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                          }`}
                      />
                    }
                  </p>

                  <div className='absolute bottom-[2px]'>
                    {show &&
                      (
                        <div className='absolute bg-[white]   rounded-lg border-2 p-2 flex flex-col'>
                          <p className='pl-2 w-[150px] h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A] duration-200'>
                            <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627848/pdf_culheg.png" alt="img" className='w-5 h-5' />Export as PDF
                          </p>
                          <p className='pl-2 w-[150px] h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A] duration-200'>
                            <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627875/sheet_p5lpn6.png" alt="img" className='w-5 h-5' /> Export as Excel
                          </p>

                        </div>
                      )
                    }
                  </div>
                </div>

              </div>
              <div
                onClick={handleNavigation}
                className='bg-[#F26522] rounded-lg text-white flex flex-row items-center justify-center ps-2 cursor-pointer'
              >
                <Plus className='text-[white] text-[10px]' />
                <span className='pe-2'>Add Employee</span>
              </div>
            </div>
          </div> */}
          <div className='flex flex-row items-center justify-evenly flex-wrap px-1 gap-2 mt-6'>
            <div className='bg-[white] w-[300px] border-2 rounded-lg flex flex-row items-center flex-grow px-2 justify-between py-5'>
              <div className=' flex flex-row items-center gap-3'>
                <p className='h-10 w-10 bg-[#212529] text-[white] rounded-[100%] flex justify-center items-center'>
                  <Users className='text-sm' />
                </p>
                <div className='flex flex-col'>
                  <span className='text-[gray]'>
                    Total Employee
                  </span>
                  <span className='text-lg font-semibold'>
                    {updatedEmpWithColor.length}
                  </span>
                </div>
              </div>
              {/* <div className='w-[70px] h-[25px] bg-[#F0DEF3] rounded-lg ml-[30px] flex items-center justify-center'>
                <span className='text-[#AB47BC] text-[12px]'>+19.01%</span>
              </div> */}
            </div>
            <div className='bg-[white] w-[300px] border-2 rounded-lg flex flex-row justify-between items-center flex-grow py-5 px-2'>
              <div className='flex flex-row items-center gap-3'>
                <p className='h-10 w-10 bg-[#03C95A] text-[white] rounded-[100%] flex justify-center items-center'>
                  <UserRoundCheck className='' />
                </p>
                <div className='flex flex-col'>
                  <span className='text-[gray]'>
                    Active
                  </span>
                  <span className='text-lg font-semibold'>
                    {activeEmp}
                  </span>
                </div>
              </div>
              {/* <div className='w-[70px] h-[25px] bg-[#FEEFE8] rounded-lg ml-[30px] flex items-center justify-center'>
                <span className='text-[#F68822] text-[12px]'>+19.01%</span>
              </div> */}
            </div>
            <div className='bg-[white] w-[300px] border-2 rounded-lg flex flex-row items-center flex-grow justify-between py-5 px-2'>
              <div className=' flex flex-row items-center gap-3'>
                <p className='h-10 w-10 bg-[#E70D0D] text-[white] rounded-[100%] flex justify-center items-center '>
                  <UserRoundX className='' />
                </p>

                <div className='flex flex-col'>
                  <span className='text-[gray]'>
                    InActive
                  </span>
                  <span className='text-lg font-semibold'>
                    {updatedEmpWithColor.length - activeEmp}
                  </span>
                </div>
              </div>
              {/* <div className='w-[70px] h-[25px] bg-[#E8E9E9] rounded-lg ml-[30px] flex items-center justify-center'>
                <span className='text-[#216DB1] text-[12px]'>+19.01%</span>
              </div> */}
            </div>
            <div className='bg-[white] w-[300px] border-2 rounded-lg flex flex-row items-center flex-grow justify-between py-5 px-2'>
              <div className=' flex flex-row items-center gap-3'>
                <p className='h-10 w-10 bg-[#1B84FF] text-[white] rounded-[100%] flex justify-center items-center'>
                  <UserRound className='' />
                </p>

                <div className='flex flex-col'>
                  <span className='text-[gray]'>
                    Interns
                  </span>
                  <span className='text-lg font-semibold'>
                    0
                  </span>
                </div>
              </div>
              {/* <div className='w-[70px] h-[25px] bg-[#EBF0F2] rounded-lg ml-[30px] flex items-center justify-center'>
                <span className='text-[#79709E] text-[12px]'>+19.01%</span>
              </div> */}
            </div>

          </div>
          <div className='flex md:flex-row md:items-center md:gap-4 md:justify-between flex-col justify-start items-start mt-4'>
            <div className='flex   pt-5'>
              <div>
                <span className='text-xl font-[500]'>Employees</span>
              </div>
            </div>
            <div className='flex flex-row gap-4 pt-2'>
              <div className='flex flex-row   bg-[white] border-2 border-gray-200  rounded items-center justify-evenly  py-1 gap-2 px-1 duration-300' >
                <List size={25} className={`${tableView ? " bg-[#F26522] rounded  text-[white]" : "rounded"} p-1 duration-300 cursor-pointer`} onClick={HandleViewchange} />
                <LayoutGrid size={25} className={`${!tableView ? " bg-[#F26522] rounded  text-[white]" : "rounded"} p-1 duration-300 cursor-pointer`} onClick={HandleViewchange} />
              </div>

              <div className='select-none rounded-xl'>
                <div className='relative'>
                  <p
                    onClick={(event) => {
                      setShow(!show);
                      event.stopPropagation();
                    }}
                    className={`px-2 text-[16px] group select-none  py-2 border-gray-200 border-2 rounded-lg flex flex-row gap-1 items-center pl-3 cursor-pointer ${show ? 'bg-[#F26722] text-white' : 'bg-white hover:text-[#F26722]'
                      }`}
                  >
                    <FileDown
                      size={16}
                      className={`${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                        } text-[14px]`}
                    />
                    Export
                    {show ? <ChevronUp size={18}
                      className={`ml-6 ${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                        }`}
                    /> :
                      <ChevronDown size={18}
                        className={`ml-6 ${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
                          }`}
                      />
                    }
                  </p>

                  <div className='absolute bottom-[2px]'>
                    {show &&
                      (
                        <div className='absolute bg-[white]   rounded-lg border-2 p-2 flex flex-col'>
                          <p className='pl-2 w-[150px] h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A] duration-200'>
                            <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627848/pdf_culheg.png" alt="img" className='w-5 h-5' />Export as PDF
                          </p>
                          <p className='pl-2 w-[150px] h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A] duration-200'>
                            <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627875/sheet_p5lpn6.png" alt="img" className='w-5 h-5' /> Export as Excel
                          </p>

                        </div>
                      )
                    }
                  </div>
                </div>

              </div>
              <div
                onClick={handleNavigation}
                className='bg-[#F26522] rounded-lg text-white flex flex-row items-center justify-center ps-2 cursor-pointer'
              >
                <Plus className='text-[white] text-[10px]' />
                <span className='pe-2'>Add Employee</span>
              </div>
            </div>
          </div>
          {tableView ?
            <TableView
              employees={updatedEmpWithColor}
              setEmployees={setUpdatedEmpWithColor}
            />
            :
            <CardView
              employees={updatedEmpWithColor}
              setEmployees={setUpdatedEmpWithColor}
            />
          }
        </div>
        :
        <div className='flex justify-center items-center w-[100%] min-h-screen'>
          <LoadingAnimation />
        </div>
      }
    </div>
  )
}

export default AllEmployees;

// import React, { useState } from 'react'
// import { Table, Tag, Button } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { ChevronDown, CircleUserRound, FileDown, LayoutGrid, List, Plus, UserRound, UserRoundCheck, UserRoundX, Users } from 'lucide-react';

// const AllEmployees = () => {

//     const columns = [
//         {
//             title: 'Emp ID',
//             dataIndex: 'key',
//             sorter: {
//                 compare: (a, b) => a.key - b.key,
//                 multiple: 1,
//             },
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             sorter: {
//                 compare: (a, b) => a.name.localeCompare(b.name),
//                 multiple: 2,
//             },
//             render: (text, record) => (
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                     {/* Image */}
//                     <img
//                         src={record?.img}  // Assuming image URL is in record.image
//                         alt={text}
//                         style={{ width: 40, height: 40, borderRadius: '100%', marginRight: 10 }}
//                     />
//                     <div>
//                         {/* Name and Designation */}
//                         <span style={{ color: 'black', fontWeight: 'bold' }}>{text}</span><br />
//                         <span style={{ color: 'gray' }}>{record?.designation}</span>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             sorter: {
//                 compare: (a, b) => a.email.localeCompare(b.email),
//                 multiple: 3,
//             },
//             render: (text) => <span style={{ color: 'gray' }}>{text}</span>

//         },
//         {
//             title: 'Phone',
//             dataIndex: 'phone',
//             sorter: {
//                 compare: (a, b) => a.phone - b.phone,
//                 multiple: 4,
//             },
//             render: (text) => <span style={{ color: 'gray' }}>{text}</span>
//         },

//         {
//             title: 'Designation',
//             dataIndex: 'designation',
//             sorter: {
//                 compare: (a, b) => a.designation.localeCompare(b.designation),
//                 multiple: 1,
//             },
//             render: (text) => (
//                 <span
//                     style={{
//                         color: 'black',
//                         border: '1px solid #ccc',
//                         padding: '4px 8px',
//                         borderRadius: '4px',
//                     }}
//                 >
//                     {text}
//                 </span>
//             ),
//         },
//         {
//             title: 'Join Date',
//             dataIndex: 'joindate',
//             sorter: {
//                 compare: (a, b) => new Date(a.joindate) - new Date(b.joindate),
//                 multiple: 1,
//             },
//             render: (joindate) => {
//                 const date = new Date(joindate);
//                 const formattedDate = new Intl.DateTimeFormat('en-GB', {
//                     day: '2-digit',
//                     month: 'short',
//                     year: 'numeric',
//                 }).format(date);
//                 return formattedDate;
//             },
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             sorter: {
//                 compare: (a, b) => a.english - b.english,
//                 multiple: 1,
//             },
//             render: (status) => (
//                 <Tag color={status === 'Active' ? '#03C95A' : '#E70D0D'}>
//                     {status}
//                 </Tag>
//             ),
//         },
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             render: (_, record) => (
//                 <>
//                     <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleEdit(record)}
//                         style={{ marginRight: 8 }}
//                     />
//                     <Button
//                         icon={<DeleteOutlined />}
//                         onClick={() => handleDelete(record)}
//                         danger
//                     />
//                 </>
//             ),
//         },
//     ];
//     const data = [
//         {
//             key: 'Emp 01',
//             name: 'John Brown',
//             email: 'johnbrown@Empdetails.com',
//             phone: 1254783698,
//             designation: 'Design',
//             joindate: '2021-05-10',
//             status: 'Active',
//             actions: 'Edit/Delete',
//             img: 'https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg',
//         },
//         {
//             key: 'Emp 02',
//             name: 'Jane Smith',
//             email: 'janesmith@Empdetails.com',
//             phone: 9876543210,
//             designation: 'Developer',
//             joindate: '2021-05-15',
//             status: 'Inactive',
//             actions: 'Edit/Delete',
//             img:'https://res.cloudinary.com/da6xossg7/image/upload/v1735627735/user2_ya3x9j.jpg',
//         },
//         {
//             key: 'Emp 03',
//             name: 'Alice Johnson',
//             email: 'alicejohnson@Empdetails.com',
//             phone: 1234567890,
//             designation: 'HR',
//             joindate: '2021-05-20',
//             status: 'Active',
//             actions: 'Edit/Delete',
//             img:'https://res.cloudinary.com/da6xossg7/image/upload/v1735627761/user3_s7m7s0.jpg',
//         },
//         {
//             key: 'Emp 04',
//             name: 'Bob Williams',
//             email: 'bobwilliams@Empdetails.com',
//             phone: 9876543210,
//             designation: 'Manager',
//             joindate: '2021-05-25',
//             status: 'Inactive',
//             actions: 'Edit/Delete',
//             img:'https://res.cloudinary.com/da6xossg7/image/upload/v1735627798/user4_ie4giq.jpg',
//         },
//         {
//             key: 'Emp 05',
//             name: 'Charlie Davis',
//             email: 'charliedavis@Empdetails.com',
//             phone: 9876543210,
//             designation: 'Backend Developer',
//             joindate: '2021-06-01',
//             status: 'Active',
//             actions: 'Edit/Delete',
//             img: 'https://res.cloudinary.com/da6xossg7/image/upload/v1735627823/user5_bmupj3.jpg',
//         },
//     ];
//     const onChange = (pagination, filters, sorter, extra) => {
//         console.log('params', pagination, filters, sorter, extra);
//     };
//     const paginationProps = {
//         total: data.length, // Total number of items
//         pageSize: 10, // Number of items per page
//         showTotal: (total, range) => `Showing ${range[0]} - ${range[1]} of ${total} entries`, // Custom text
//     };


//     const [show, setShow] = useState(false);
//     const [designation, setDesignation] = useState(false);
//     const [status, setStatus] = useState(false);
//     const [order, setOrder] = useState(false);
//     const [date, setDate] = useState(false);

//     return (
//         <>
//             <div onClick={() => setShow(false)}>
//                 <div className='flex flex-row items-center gap-4 '>
//                     <div className='flex flex-col pl-[70px] pt-5'>
//                         <div>
//                             <span className='text-3xl font-bold'>Employee</span>
//                         </div>
//                         {/* <div>
//                             path navigation
//                         </div> */}
//                     </div>
//                     <div className='flex flex-row gap-4 pt-5 pl-[840px]'>
//                         <div className='flex flex-row w-[70px] h-[30px] bg-[white] border-2 border-gray-200 mt-1 rounded items-center justify-between '>
//                             <List size={20} strokeWidth={2.50} className='ml-2 bg-[#F26522] rounded p-1 text-[white]' />
//                             <LayoutGrid size={20} strokeWidth={2.50} className='mr-2 rounded p-1 text-gray-600' />
//                         </div>

//                         <div className=''>
//                             <p
//                                 onClick={(event) => {
//                                     setShow(!show);
//                                     event.stopPropagation();
//                                 }}
//                                 className={`group w-[140px] h-[40px] rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 cursor-pointer ${show ? 'bg-[#F26722] text-white' : 'bg-white hover:text-[#F26722]'
//                                     }`}
//                             >
//                                 <FileDown
//                                     size={16}
//                                     className={`${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
//                                         }`}
//                                 />
//                                 Export
//                                 <ChevronDown
//                                     className={`ml-6 ${show ? 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'
//                                         }`}
//                                 />
//                             </p>


//                             {show &&
//                                 (
//                                     <div className='absolute bg-[white] right-[229px] mt-[5px] w-[190px] h-[120px] rounded-lg border-2 p-5 gap-3 flex flex-col'>
//                                         <p className='pl-2 w-[150px] h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                             <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627848/pdf_culheg.png" alt="img" className='w-6 h-6' />Export as PDF
//                                         </p>
//                                         <p className='pl-2 w-[150px] h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                             <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627875/sheet_p5lpn6.png" alt="img" className='w-6 h-6' /> Export as Excel
//                                         </p>

//                                     </div>
//                                 )
//                             }

//                         </div>
//                         <div className='w-[150px] h-[40px] bg-[#F26522] rounded-lg text-white flex flex-row items-center justify-center'>
//                             <Plus strokeWidth={2.50} className='text-[white] font-bold' />
//                             <span className='font-semibold'>
//                                 Add Employee
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='flex flex-row justify-center gap-16'>
//                     <div className='bg-[white] w-[300px] h-[80px] border-2 rounded-lg flex flex-row items-center mb-9 mt-4'>
//                         <div className='ml-[30px] flex flex-row items-center gap-3'>
//                             <p className='h-10 w-10 bg-[#212529] text-[white] rounded-[100%] flex justify-center items-center'>
//                                 <Users className='text-sm' />
//                             </p>
//                             <div className='flex flex-col'>
//                                 <span className='text-[gray]'>
//                                     Total Employee
//                                 </span>
//                                 <span className='text-lg font-semibold'>
//                                     1007
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='w-[70px] h-[25px] bg-[#F0DEF3] rounded-lg ml-[30px] flex items-center justify-center'>
//                             <span className='text-[#AB47BC] text-[12px]'>+19.01%</span>
//                         </div>
//                     </div>
//                     <div className='bg-[white] w-[300px] h-[80px] border-2 rounded-lg flex flex-row items-center mb-9 mt-4'>
//                         <div className='ml-[30px] flex flex-row items-center gap-3'>
//                             <p className='h-10 w-10 bg-[#03C95A] text-[white] rounded-[100%] flex justify-center items-center'>
//                                 <UserRoundCheck className='' />
//                             </p>
//                             <div className='flex flex-col'>
//                                 <span className='text-[gray]'>
//                                     Active
//                                 </span>
//                                 <span className='text-lg font-semibold'>
//                                     1007
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='w-[70px] h-[25px] bg-[#FEEFE8] rounded-lg ml-[30px] flex items-center justify-center'>
//                             <span className='text-[#F68822] text-[12px]'>+19.01%</span>
//                         </div>
//                     </div>
//                     <div className='bg-[white] w-[300px] h-[80px] border-2 rounded-lg flex flex-row items-center mb-9 mt-4'>
//                         <div className='ml-[30px] flex flex-row items-center gap-3'>
//                             <p className='h-10 w-10 bg-[#E70D0D] text-[white] rounded-[100%] flex justify-center items-center'>
//                                 <UserRoundX className='' />
//                             </p>

//                             <div className='flex flex-col'>
//                                 <span className='text-[gray]'>
//                                     InActive
//                                 </span>
//                                 <span className='text-lg font-semibold'>
//                                     1007
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='w-[70px] h-[25px] bg-[#E8E9E9] rounded-lg ml-[30px] flex items-center justify-center'>
//                             <span className='text-[#216DB1] text-[12px]'>+19.01%</span>
//                         </div>
//                     </div>
//                     <div className='bg-[white] w-[300px] h-[80px] border-2 rounded-lg flex flex-row items-center mb-9 mt-4'>
//                         <div className='ml-[30px] flex flex-row items-center gap-3'>
//                             <p className='h-10 w-10 bg-[#1B84FF] text-[white] rounded-[100%] flex justify-center items-center'>
//                                 <UserRound className='' />
//                             </p>

//                             <div className='flex flex-col'>
//                                 <span className='text-[gray]'>
//                                     Interns
//                                 </span>
//                                 <span className='text-lg font-semibold'>
//                                     1007
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='w-[70px] h-[25px] bg-[#EBF0F2] rounded-lg ml-[30px] flex items-center justify-center'>
//                             <span className='text-[#79709E] text-[12px]'>+19.01%</span>
//                         </div>
//                     </div>

//                 </div>
//                 <div className='rounded-lg flex flex-col pl-10 pr-10 pb-10'>
//                     <div className='w-full h-[70px] border border-b-2 border-t-2 rounded-t-lg flex flex-row '>
//                         <div className='flex items-center  justify-start '>
//                             <span className=' font-bold ml-6 text-3xl w-[120px]'>Plan list</span>
//                         </div>
//                         <div className='flex ml-[530px] justify-end items-center flex-row gap-5'>
//                             <div>
//                                 <div
//                                     className="flex flex-row group cursor-pointer"
//                                     onClick={(event) => {
//                                         setDate(!date);
//                                         setStatus(false);
//                                         setOrder(false);
//                                         setDesignation(false);
//                                         event.stopPropagation();
//                                     }}
//                                 >
//                                     <p
//                                         className={`w-[220px] h-[38px] rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 ${date ? 'text-white' : 'group-hover:text-[#F26722]'
//                                             }`}
//                                         style={date ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
//                                     >
//                                         30/12/2024 -30/12/2024
//                                         <ChevronDown
//                                             className={`text-gray-600 ${date ? 'text-white' : 'group-hover:text-[#F26722]'
//                                                 }`}
//                                         />
//                                     </p>
//                                 </div>

//                                 {date && <div className='absolute bg-[white] z-[50] right-[585px] mt-[4px] w-[220px] h-[290px] rounded-lg border-2 p-1 flex flex-col'>
//                                     <p onClick={() => {

//                                         setDate(false);
//                                     }} className='p-2 w-full h-[100px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Today
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Yesterday
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Last 7 Days
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Last 30 Days
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         This Year
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Previous Year
//                                     </p>
//                                     <p onClick={() => {
//                                         setDate(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Custom Range
//                                     </p>
//                                 </div>
//                                 }
//                             </div>
//                             <div>
//                                 <div
//                                     className="flex flex-row group cursor-pointer"
//                                     onClick={(event) => {
//                                         setDesignation(!designation);
//                                         setStatus(false);
//                                         setOrder(false);
//                                         setDate(false);
//                                         event.stopPropagation();
//                                     }}
//                                 >
//                                     <p
//                                         className={`w-[140px] h-[38px] rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 ${designation ? 'text-white' : 'group-hover:text-[#F26722]'
//                                             }`}
//                                         style={designation ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
//                                     >
//                                         Designation{' '}
//                                         <ChevronDown
//                                             className={`text-gray-600 ${designation ? 'text-white' : 'group-hover:text-[#F26722]'
//                                                 }`}
//                                         />
//                                     </p>
//                                 </div>

//                                 {designation && <div className='absolute bg-[white] z-[50] right-[423px] mt-[4px] w-[140px] h-[220px] rounded-lg border-2 p-2 flex flex-col'>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setDesignation(false);

//                                     }} className='p-2 w-full h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Design
//                                     </p>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setDesignation(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Developer
//                                     </p>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setDesignation(false);
//                                     }} className='p-2 w-full h-[50px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         HR
//                                     </p>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setDesignation(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Manager
//                                     </p>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setDesignation(false);
//                                     }} className='p-2 w-full h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Backend
//                                     </p>
//                                 </div>
//                                 }
//                             </div>
//                             <div className="flex flex-row group cursor-pointer h-[45px] mt-[9px] rounded"
//                                 onClick={(event) => {
//                                     setStatus(!status);
//                                     setOrder(false);
//                                     setDesignation(false);
//                                     setDate(false);
//                                     event.stopPropagation();
//                                 }}>
//                                 <p
//                                     className={`w-[140px] h-[38px] rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 ${status ? 'text-white' : 'group-hover:text-[#F26722]'
//                                         }`}
//                                     style={status ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
//                                 >Select Status
//                                     <ChevronDown
//                                         className={`text-gray-600 ${status ? 'text-white' : 'group-hover:text-[#F26722]'
//                                             }`}
//                                     />

//                                 </p>

//                                 {status && <div className='absolute bg-[white] z-[50] right-[264px] mt-[42px] w-[140px] h-[100px] rounded-lg border-2 p-2 flex flex-col'>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setStatus(false);
//                                     }} className='p-2 w-full h-[40px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Active
//                                     </p>
//                                     <p onClick={() => {
//                                         setShow(false);
//                                         setStatus(false);
//                                     }} className='p-2 w-full h-[40px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Inactive
//                                     </p>
//                                 </div>
//                                 }
//                             </div>
//                             <div className="flex flex-row group cursor-pointer h-[45px] mt-[9px] rounded"
//                                 onClick={(event) => {
//                                     setOrder(!order);
//                                     setDesignation(false);
//                                     setStatus(false);
//                                     setDate(false);
//                                     event.stopPropagation();
//                                 }}>
//                                 <p
//                                     className={`w-[200px] h-[38px] mr-2 rounded border-gray-200 border-2 font-semibold flex flex-row gap-1 items-center pl-3 ${order ? 'text-white' : 'group-hover:text-[#F26722]'
//                                         }`}
//                                     style={order ? { backgroundColor: 'rgb(242, 101, 34)' } : { backgroundColor: 'white' }}
//                                 >Sort By:Last 7 Days
//                                     <ChevronDown
//                                         className={`text-gray-600 ${order ? 'text-white' : 'group-hover:text-[#F26722]'
//                                             }`}
//                                     />
//                                 </p>

//                                 {order && <div className='absolute bg-[white] z-[50] right-[46px] mt-[41px] w-[200px] h-[110px] rounded-lg border-2 p-3 flex flex-col'>
//                                     <p onClick={() => {
//                                         setOrder(false);
//                                     }} className='p-2 w-[120px] h-[100px] rounded flex cursor-pointer items-center hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Accessending
//                                     </p>
//                                     <p onClick={() => {
//                                         setOrder(false);
//                                     }} className='p-2 w-[120px] h-[50px] rounded cursor-pointer flex items-center text-black hover:bg-[#FEF1EB] hover:text-[#F36A2A]'>
//                                         Decending
//                                     </p>
//                                 </div>
//                                 }
//                             </div>
//                             {/* <select className='border border-2 h-[40px] rounded'>
//                                 <option value="">Sort By:Last 7 Days </option>
//                                 <option value="option1">Active</option>
//                                 <option value="option2">Inactive</option>
//                             </select> */}
//                         </div>
//                     </div>
//                     <div className='w-full h-[70px] flex items-center gap-2 pl-5 border-l-2 border-r-2'>
//                         <div>
//                             <span className='font-semibold text-[#4A4151] mr-2'>
//                                 Row Per Page
//                             </span>
//                             <select className=' border-2 mr-2 rounded-lg text-[#4A4151]'>
//                                 <option value="">10</option>
//                                 <option value="option1">20</option>
//                                 <option value="option2">50</option>
//                                 <option value="option3">100</option>
//                                 <option value="option4">200</option>
//                             </select>
//                             <span className='text-[#4A4151] font-semibold'>
//                                 Entries
//                             </span>
//                         </div>
//                         <div className='flex ml-[950px]'>
//                             <input
//                                 type="search"
//                                 placeholder="Search"
//                                 class="border-2 rounded-lg p-2 text-[#4A4151]"
//                                 aria-label="Search"
//                             />

//                         </div>
//                     </div>
//                     <Table className=' border-2' columns={columns} pagination={paginationProps} dataSource={data} onChange={onChange} />
//                 </div>
//             </div >

//         </>
//     )
// }

// export default AllEmployees
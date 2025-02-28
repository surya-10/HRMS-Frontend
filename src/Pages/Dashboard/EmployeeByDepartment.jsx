import { UserRound } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Router';
import axios from 'axios';
import DotsLoader from '../../Components/Layout/animations/dotAnimations';

const EmployeeByDepartment = () => {
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token");
  const [employees, setEmployees] = useState([]);
  let navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
    let employee = [
        { id: 1, name: 'Surya', department: 'UI/UX', color: 'text-blue-500' },
        { id: 3, name: 'Aravind', department: 'Finance', color: 'text-red-500' },
        { id: 4, name: 'Lakshman', department: 'Development', color: 'text-teal-500' },
        { id: 4, name: 'Nithish', department: 'AI', color: 'text-fuchsia-500' }
      ]
      const handleViewAll = () => {
        // Navigate based on user role
        if (userData?.role?.role_value === 'admin') {
          navigate('/admin/employees');
        } else if (userData?.role?.role_value === 'manager') {
          navigate('/manager/employees');
        }
      };

      useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const response = await axios.get(`http://localhost:3002/api/routes/employee/view-employees/${userId}`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            console.log("response:", response.data.data);
            const data = response.data.data;
            setEmployees(data.slice(0, 4));
            setLoading(false)
    
          } catch (error) {
            console.error("Error fetching employees:", error.message);
          }
        };
        fetchEmployees();    
      }, [userId]);

  return (
    <div className='lg:w-[49%] md:w-full w-full'>
    <div className='flex justify-between items-center w-full  h-[50px] rounded-t-xl  pe-4'>
      <p className=' text-gray-800 text-lg font-[600]'>Employees</p>
      <p className="cursor-pointer hover:underline text-[blue] text-[14px]" onClick={handleViewAll} >View all</p>
    </div>
    <div className='shadow-lg rounded-lg border-2 bg-white '>
      <div className='flex justify-between items-center w-full text-white rounded-t shadow-xl  px-4 font-[500] bg-[#6c5b7c] border-b-2 border-[#E5E7EB] py-6'>
        <p>Name</p>
        <p>Department</p>
      </div>
      {loading ? 
      <div className='flex justify-center items-center h-[280px]'>
        <DotsLoader/>
        </div>:
      <div className='flex flex-col flex-wrap px-4 bg-white rounded-xl'>
        {employees.map((employee, index) => (
          <div key={index}>
            <div className="bg-white flex justify-between items-center pt-2 mb-3">
              <div className='flex items-center gap-2'>
                <div className='p-3 bg-[#F0EFFF] rounded-full w-12'>
                  <UserRound className='text-[#6C5FFC]' />
                </div>
                <div>
                  <p className='self-start'>{employee.first_name} {employee.last_name}</p>
                  <p className='text-xs'>{employee.profession_id.department}</p>
                </div>
              </div>
              <div>

                <p className="text-fuchsia-800">{employee.profession_id.designation}</p>
              </div>

            </div>
            <hr />
          </div>
        ))}
        <div>
        </div>

      </div>
}
    </div>
  </div>
  )
}

export default EmployeeByDepartment
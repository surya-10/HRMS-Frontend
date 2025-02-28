import { Bookmark, BriefcaseBusiness, Cake, CalendarCheck2, CalendarX2, ChevronDown, Dot, FilePenLine, Handshake, IdCard, Inbox, MailCheck, MapPinCheck, MapPinHouse, MessageCircleMore, Pencil, PersonStanding, Phone, Star, UsersRound } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingAnimation from '../../../Components/Layout/animations/LoadingAnimation';

const Profile = () => {
    let location = useLocation();
    // let datas = location.state.employees;
    let { id } = useParams();
    let [employee, setEmployee] = useState(null);
    let [show, setShow] = useState(true);

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3002/api/routes/employee/get-employee/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                console.log(response.data)
                setShow(false);
                console.log("Raw Response:", response.data.data);

                const flattenedData = covertToSingleObject(response.data.data);
                console.log("Flattened Employee Data:", flattenedData);
                setEmployee(flattenedData);
                console.log("Flattened Employee Data:", flattenedData);
            } catch (error) {
                console.error("Error fetching employee:", error);
            }
        };

        getEmployee();

        function covertToSingleObject(obj) {
            console.log(obj);
            // Check if the object is empty or null
            if (!obj || Object.keys(obj).length === 0) return obj;
        
            const newObj = {};
            for (let key in obj) {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                    // Recursively flatten nested objects
                    Object.assign(newObj, covertToSingleObject(obj[key]));
                } else {
                    // Assign non-object values directly
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        }
        
    }, [id]);
    const usereducations = {
        bio: "Passionate about technology and creating impactful software solutions. With over 8 years of experience in web development, I specialize in JavaScript, React, Node.js, and cloud technologies.",

        educations: [
            {
                institution: "Oxford University",
                program: "Computer Science",
                duration: "2020 - 2022"
            },
            {
                institution: "Cambridge University",
                program: "Computer Network & Systems",
                duration: "2016 - 2019"
            },
            {
                institution: "Oxford School",
                program: "Grade X",
                duration: "2012 - 2016"
            }
        ],

        experience: [
            {
                company: "Google",
                position: "UI/UX Developer",
                duration: "Jan 2013 - Present"
            },
            {
                company: "Salesforce",
                position: "Web Developer",
                duration: "Dec 2012 - Jan 2015"
            },
            {
                company: "HubSpot",
                position: "Software Developer",
                duration: "Dec 2011 - Jan 2012"
            }
        ]
    };


    return (
        <div className=''>

            {show ?
                <div className='flex justify-center items-center w-[100%] min-h-screen'>
                    <LoadingAnimation />
                </div>
                :
                <div className='flex lg:flex-row flex-col gap-2 p-2'>
                    <div className='lg:w-[38%] h-[100%] w-full bg-white rounded-lg'>
                        <div className='w-full h-auto rounded-lg flex flex-col shadow-lg'>
                            <div className='w-full h-[20vh] flex justify-center items-center relative rounded'>
                                <img
                                    className='w-full h-full object-cover rounded'
                                    src="https://res.cloudinary.com/da6xossg7/image/upload/v1735632342/Untitled_design_1_yqelex.png"
                                    alt="img"
                                />
                                <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex justify-center items-center absolute'>
                                    <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735633113/user-13_u6brz6.jpg" alt="img" className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full items-center' />
                                </div>
                            </div>
                            <div className='flex flex-row justify-center gap-2 mt-3'>
                                <span>
                                    {employee.first_name} {employee.last_name}
                                </span>
                                <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735634096/approved_wkuoel.png" alt="img" className='h-7 w-7' />
                            </div>
                            <div className='flex justify-center gap-2 items-center '>
                                <span className='flex flex-row w-auto p-1 pr-2 text-[10px] items-center text-[#7F2800] font-bold bg-[#E8E9E9] rounded'>
                                    <Dot className='flex items-center' />{employee.designation}
                                </span>
                                <span className='flex flex-row w-auto p-1 text-[13px] font-semibold text-[#3B7080] bg-[#EBF0F2] rounded'>
                                    3 years of experience
                                </span>
                            </div>
                            <div >
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <IdCard />
                                        <span>
                                            Client ID
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span>
                                            EMP001
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <Star strokeWidth={1.75} />
                                        <span>
                                            Team
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            {employee.designation}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <CalendarCheck2 strokeWidth={1.75} />
                                        <span>
                                            Data Of Join
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            {employee.joining_date}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <CalendarCheck2 strokeWidth={1.75} />
                                        <span>
                                            Reporting Manager
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            Raj kanu
                                        </span>
                                    </div>
                                </div>
                                <div className=' '>
                                    <button className='w-[90%]  m-auto text-white bg-[black] flex justify-center flex-row gap-2 rounded-lg p-4'>
                                        <FilePenLine strokeWidth={1.75} />
                                        <span className='text-white font-bold '>
                                            Edit Info
                                        </span>
                                    </button>
                                </div>

                                <div className=' border-t-2 w-full h-[80%] flex flex-col'>
                                    <div className='flex flex-row justify-between p-3'>
                                        <span className='text-xl font-semibold'>
                                            Personal information
                                        </span>
                                        <div className='h-[20px] w-[20px] flex items-center justify-center hover:bg-[#E8E9EA] rounded'>
                                            <Pencil size={16} strokeWidth={1.75} className=' ' />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex flex-row p-3'>
                                            <div className='w-full flex justify-start gap-2 text-[gray]'>
                                                <Inbox strokeWidth={1.25} />
                                                <span>
                                                    Passport No
                                                </span>
                                            </div>
                                            <div className='w-full flex justify-end'>
                                                <span className='text-end'>
                                                    123456WERTHGF
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row p-3'>
                                            <div className='w-full flex justify-start gap-2 text-[gray]'>
                                                <CalendarX2 strokeWidth={1.25} />
                                                <span>
                                                    Passport Exp Date
                                                </span>
                                            </div>
                                            <div className='w-full flex justify-end'>
                                                <span className='text-end'>
                                                    15 May 2029
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row p-3'>
                                            <div className='w-full flex justify-start gap-2 text-[gray]'>
                                                <MapPinHouse strokeWidth={1.25} />
                                                <span>
                                                    Nationality
                                                </span>
                                            </div>
                                            <div className='w-full flex justify-end'>
                                                <span className='text-end'>
                                                    Indian
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row p-3'>
                                            <div className='w-full flex justify-start gap-2 text-[gray]'>
                                                <Bookmark strokeWidth={1.25} />
                                                <span>
                                                    Religion
                                                </span>
                                            </div>
                                            <div className='w-full flex justify-end'>
                                                <span className='text-end'>
                                                    Christianity
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row p-3 justify-between items-center">
                                            <div className="w-full flex justify-start gap-2 text-[gray]">
                                                <UsersRound strokeWidth={1.25} />
                                                <span>Marital status</span>
                                            </div>
                                            <div className="w-full justify-end flex">
                                                <span className='text-end'>Single</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row p-3 justify-between items-center">
                                            <div className="w-full flex justify-start gap-2 text-[gray]">
                                                <BriefcaseBusiness strokeWidth={1.25} />
                                                <span>Employment of spouse</span>
                                            </div>
                                            <div className="w-full justify-end flex">
                                                <span className='text-end'>No</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='lg:w-[62%]  w-[100%] h-[100%] flex flex-col gap-3'>
                        {/* <div className='w-[100%] h-auto'>
                            <div className='w-full h-auto border-2 justify-between items-center p-4 bg-[white] rounded-t-lg flex flex-row'>
                                <span className='text-lg font-bold'>About Employee</span>
                                <div className='flex items-center justify-center'>
                                </div>
                            </div>
                            <div className='w-full h-auto p-7 border-2 border-t-0 rounded-b-lg bg-white'>
                                <span className='text-[#302f2f] text-[15px]'>
                                    {usereducations.bio}
                                </span>
                            </div>
                        </div> */}
                        {/* <div className=' border-t-2 w-full h-[80%] flex flex-col bg-white rounded-lg'>
                            <div className='flex flex-row justify-between p-3 border-b' >
                                <span className='text-lg font-[500]'>
                                    Basic information
                                </span>
                                <div className='h-[20px] w-[20px] flex items-center justify-center hover:bg-[#E8E9EA] rounded'>
                                    <Pencil size={16} strokeWidth={1.75} className=' ' />
                                </div>

                            </div>
                            <div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <Phone strokeWidth={1.75} />
                                        <span>
                                            Phone
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            {employee.contact_details[0].phone_number}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <MailCheck strokeWidth={1.75} />
                                        <span>
                                            Email
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-sm'>
                                            {employee.email}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <PersonStanding strokeWidth={3} />
                                        <span>
                                            Gender
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            {employee.gender}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row p-3'>
                                    <div className='w-full flex justify-start gap-2 text-[gray]'>
                                        <Cake strokeWidth={1.25} />
                                        <span>
                                            Birthday
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <span className='text-end'>
                                            {employee.date_of_birth}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-row p-3 justify-between items-center">
                                    <div className="w-full flex justify-start gap-2 text-[gray]">
                                        <MapPinCheck strokeWidth={1.25} />
                                        <span>Address</span>
                                    </div>
                                    <div className="w-full flex justify-end" >
                                        <span className='text-end'>{employee.location_details[0].current_address}</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className='flex lg:flex-row flex-col gap-3'>
                            <div className='lg:w-[50%] w-full h-auto'>
                                <div className='w-full h-auto border-2 justify-between items-center p-4 bg-[white] rounded-t-lg flex flex-row'>
                                    <span className='text-lg font-[500]'>Education Details</span>
                                    <div className='flex items-center justify-center'>
                                        <div className='h-[20px] w-[20px] flex items-center justify-center hover:bg-[#E8E9EA] rounded'>
                                            <Pencil size={16} strokeWidth={1.75} className=' ' />
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-white w-full h-auto p-7 border-2 border-t-0 rounded-b-lg flex flex-col'>
                                    {usereducations.educations.map((education, index) => (
                                        <div key={index} className='flex flex-row justify-between items-center mb-4'>
                                            <div className='flex flex-col'>
                                                <span className='text-[black] font-[500] text-[15px]'>
                                                    {education.institution}
                                                </span>
                                                <span className='text-[gray] text-[14px]'>
                                                    {education.program}
                                                </span>
                                            </div>

                                            <span className='text-[gray] text-[14px] text-end'>
                                                {education.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='lg:w-[50%] w-full h-auto'>
                                <div className='w-full h-auto border-2 justify-between items-center p-4 bg-[white] rounded-t-lg flex flex-row'>
                                    <span className='text-lg font-[500]'>Experience</span>
                                    <div className='flex items-center justify-center'>
                                        <div className='h-[20px] w-[20px] flex items-center justify-center hover:bg-[#E8E9EA] rounded'>
                                            <Pencil size={16} strokeWidth={1.75} className=' ' />
                                        </div>
                                        <ChevronDown
                                    className={`ml-6 'text-white' : 'text-gray-600 group-hover:text-[#F26722]'}`}
                                />
                                    </div>
                                </div>
                                <div className='bg-white w-full h-auto p-7 border-2 border-t-0 rounded-b-lg flex flex-col'>
                                    {usereducations.experience.map((experience, index) => (
                                        <div key={index} className='flex flex-row justify-between items-center mb-4'>
                                            <div className='flex flex-col'>
                                                <span className='text-[black] font-[500] text-[15px]'>
                                                    {experience.company}
                                                </span>
                                                <span className='text-[gray] text-[14px]'>
                                                    {experience.position}
                                                </span>
                                            </div>
                                            <span className='text-[gray] text-[14px] text-end'>
                                                {experience.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div> */}
                        <div>
                            <div className="bg-white w-full flex flex-col gap-4 rounded-lg py-6">
                                <div className="flex flex-row justify-between p-3">
                                    <span className="text-lg font-[500]">Emergency Contact Number</span>
                                    <div className="h-[20px] w-[20px] flex items-center justify-center hover:bg-[#E8E9EA] rounded cursor-pointer">
                                        <Pencil size={16} strokeWidth={1.75} />
                                    </div>
                                </div>

                                <div className="rounded-lg">
                                    {employee?.emergency_contact?.length > 0 ? (
                                        <table className="w-full table-auto border-collapse border rounded-lg">
                                            <thead className="bg-white border-b">
                                                <tr>
                                                    <th className=" px-4 py-2 text-left">Name</th>
                                                    <th className="px-4 py-2 text-left">Phone</th>
                                                    <th className="px-4 py-2 text-left">Relationship</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employee.emergency_contact.map((contact, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                                    >
                                                        <td className=" px-4 py-2 text-[14px]">{contact.name}</td>
                                                        <td className=" px-4 py-2 text-[14px]">{contact.phone_number}</td>
                                                        <td className=" px-4 py-2 text-[14px]">{contact.relationship}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-gray-500 text-center mt-4">No emergency contacts available.</p>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            }
        </div>
    )
}

export default Profile
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DotsLoader from '../../../Components/Layout/animations/dotAnimations';
import { Check, CheckCheck, ChevronDown, CircleX, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditEmployee = () => {
    const { id } = useParams();
    const data = JSON.parse(localStorage.getItem('data'));
    const token = localStorage.getItem("token");
    const location = useLocation();
    const employeesData = location.state || [];
    console.log(employeesData)
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [show, setShow] = useState(false);
    const [sampleDate, setSampleDate] = useState("")
    const [professionDetails, setProfessionDetails] = useState({
        current_employment: "",
        department: "",
        designation: ""
    })
    const userId = localStorage.getItem("userId")
    const [managers, setManagers] = useState([]);
    const [isEditing, setEditing] = useState(false);
    const [editProfession, setEditProfession] = useState(false);
    const [viewPorfessionDropDown, setViewPorfessionDropDown] = useState(false);
    const [viewManagersList, setManagersList] = useState(false)

    const [basicDetails, setBasicDetails] = useState({
        first_name: "",
        last_name: "",
        phone: 0,
        role: "",
        manager: "",
        manager_id: "",
        id: "",
        email: "",
        profile: "",
        is_deleted: ""
    })
    const [profession, setProfession] = useState({
        current_employment: "",
        department: "",
        designation: "",
        employment_type: ""
    })
    const [profile, setProfile] = useState({
        user_id: "",
        date_of_birth: "",
        joining_date: "",
        releiving_date: "",
        marital_status: "",
        gender: "",
        contact_details: [
            {
                phone_number: "",
                email_id: "",
            },
        ],
        location_details: [
            {
                permanent_address: "",
                current_address: "",
            },
        ],
        nationality: "",
        emergency_contact: [
            {
                name: "",
                relationship: "",
                phone_number: "",
            },
        ],
        status: false,
    });
    const [dropDownValues, setDropDownValues] = useState(["full-time", "part-time", "intern"]);
    const [copiedDropDown, setCopiedDropDown] = useState([]);
    const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const statusOptions = ["Active", "InActive"];
    const [openDropdown, setOpenDropdown] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(null);

    const maritalStatusOptions = ["Single", "Married"];
    const genderOptions = ["Male", "Female", "Other"];
    const [roles] = useState(["admin", "manager", "user"]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/api/routes/employee/view-employees/${data.user_id}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                console.log("response:", response.data.data);
                const employee = response.data.data.find((emp) => emp._id == id);
                setSelectedEmp(employee);
                setBasicDetails({
                    profile: "https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg",
                    first_name: employee.first_name || "",
                    last_name: employee.last_name || "",
                    phone: employee.phone || 0,
                    role: employee.role?.role_value || "",
                    is_deleted: employee.status ? "Active" : "InaActive",
                    manager: getManager(employee.manager_id, response.data.data),
                    manager_id: employee.manager_id || "",
                    id: employee._id,
                    email: employee.email
                });
                setShow(true);
                setProfession({
                    department: employee.profession_id.department,
                    designation: employee.profession_id.designation,
                    current_employment: employee.profession_id.current_employment,
                    employment_type: employee.profession_id.employee_type
                })
                setProfile({
                    user_id: employee.profile_id?.user_id || "",
                    date_of_birth: employee.profile_id?.date_of_birth
                        ? formatCustomDate(employee.profile_id.date_of_birth)
                        : "",
                    joining_date: employee.profile_id?.joining_date
                        ? formatCustomDate(employee.profile_id.joining_date)
                        : "",
                    releiving_date: employee.profile_id?.releiving_date || "",
                    marital_status: employee.profile_id?.marital_status || "",
                    gender: employee.profile_id?.gender || "",
                    contact_details: [
                        {
                            phone_number: employee.profile_id?.contact_details?.[0]?.phone_number || "",
                            email_id: employee.profile_id?.contact_details?.[0]?.email_id || "",
                        },
                    ],
                    location_details: [
                        {
                            permanent_address: employee.profile_id?.location_details?.[0]?.permanent_address || "",
                            current_address: employee.profile_id?.location_details?.[0]?.current_address || "",
                        },
                    ],
                    nationality: employee.profile_id?.nationality || "",
                    emergency_contact: employee.profile_id?.emergency_contact?.map((contact) => ({
                        name: contact?.name || "",
                        relationship: contact?.relationship || "",
                        phone_number: contact?.phone_number || "",
                    })) || [],
                    status: employee.profile_id?.status || false,
                });

                console.log(profile)
                setCopiedDropDown(dropDownValues.filter((item) => item !== profession.employment_type));
                const availableManagers = response.data.data
                    .filter((data) => data.role.role_value === "manager")
                    .map((data) => ({
                        id: data._id,
                        first_name: data.first_name,
                        last_name: data.last_name,
                    }));

                setManagers(availableManagers);


            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        fetchEmployees();

        function getManager(id, data) {
            console.log(id, data)
            let manager = data.filter((emp) => emp.
                manager_id == id);
            return `${manager[0].first_name} ${manager[0].last_name}`
        }

    }, []);

    const formatDateForInput = (dateString) => {
        try {
            const [day, month, year] = dateString.split("-").map(Number);
            if (!day || !month || !year) {
                return "";
            }

            const date = new Date(year, month - 1, day);
            const formattedYear = date.getFullYear();
            const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
            const formattedDay = String(date.getDate()).padStart(2, "0");

            return `${formattedYear}-${formattedMonth}-${formattedDay}`;
        } catch (error) {
            console.error("Error formatting date for input:", error);
            return "";
        }
    };

    const formatCustomDate = (dateString) => {
        console.log(dateString);
        let splittedDate = dateString.split("-");
        return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
    };


    if (!show || !selectedEmp) {
        return (
            <div className="flex justify-center items-center w-full" style={{ height: '90vh' }}>
                <DotsLoader />
            </div>
        );
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBasicDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleProfessionInputChange = (e) => {
        const { name, value } = e.target;
        setBasicDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSave = async () => {
        console.log('Updated Employee Details:', {
            ...basicDetails,
            manager_id: basicDetails.manager_id
        });
        setEditing(false);
        await handleAddEmployeeDetails(basicDetails);
    };

    const handleAddEmployeeDetails = async (data) => {
        // console.log(data)
        try {
            data.is_deleted = data.is_deleted === "InActive";
            const obj = {
                data: {
                    ...data,
                    role: data.role
                },
                id
            }
            // console.log(obj, id)
            const response = await axios.put(`http://localhost:3002/api/routes/employee/update-employee-details/${userId}`, obj, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })
            if(response.data){
                toast.success("User details updated ")
            }
            // console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setEditing(false);
        setBasicDetails((prev) => ({
            ...prev,
            ...selectedEmp,
        }));
    };
    const handleProfessionSave = () => {
        console.log('Updated Employee Details:', basicDetails);
        setEditProfession(false);
    };

    const handleProfessionCancel = () => {
        setEditProfession(false);
        setBasicDetails((prev) => ({
            ...prev,
            ...selectedEmp,
        }));
    };
    const handleProfession = (e) => {
        setProfessionDetails({ ...professionDetails, [e.target.name]: e.target.value })
    }

    const handleChangeEmployment = (type) => {
        setProfession((prev) => ({
            ...prev,
            employment_type: type,
        }));
        setShowEmploymentDropdown(false);
        setCopiedDropDown(dropDownValues.filter((item) => item !== type));
    };

    const handleChangeManager = (manager) => {
        setBasicDetails((prev) => ({
            ...prev,
            manager: `${manager.first_name} ${manager.last_name}`,
            manager_id: manager.id
        }));
        setManagersList(false);
    };

    const handleDropdownToggle = (dropdownName) => {
        if (openDropdown === dropdownName) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownName);
        }
    };
    console.log(profile)

    const handleChangeRole = (selectedRole) => {
        setBasicDetails(prev => ({
            ...prev,
            role: selectedRole
        }));
        setOpenDropdown(null);
    };

    return (
        <div className="p-6 bg-white m-4 rounded-xl shadow-xl">
            <div className='grid md:grid-cols-2 gap-5 grid-cols-1'>
                <div className='border-2 p-4 rounded-lg'>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>

                        {!isEditing && <p title='edit'><Edit2 size={20} className=' text-[#F24444] hover:text-[#e98181] cursor-pointer' onClick={() => {
                            setEditing(true)
                            // setManagersList(true)
                        }} /></p>}
                        {isEditing &&
                            <div className='flex gap-2'>


                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <CircleX size={16} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-colors duration-200"
                                >
                                    <Check size={16} />
                                    <span>Save</span>
                                </button>


                            </div>
                        }
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Official Details</h2>
                            <div>
                                <img src="https://res.cloudinary.com/da6xossg7/image/upload/v1735627700/user1_k9cfrj.jpg" className='w-32 h-32 rounded-full' />
                                <div>

                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
                                <div className='flex justify-between gap-2 lg:flex-row flex-col'>
                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">First Name</label>
                                        <input
                                            type="text"
                                            value={basicDetails.first_name}
                                            disabled={!isEditing}
                                            onChange={handleInputChange}
                                            placeholder="First name"
                                            name='first_name'
                                            className={`w-full p-2 rounded-lg border text-sm ${isEditing
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                : 'bg-gray-50 border-gray-200'
                                                } transition-colors duration-200`}
                                        />
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">Last Name</label>
                                        <input
                                            type="text"
                                            value={basicDetails.last_name}
                                            disabled={!isEditing}
                                            onChange={handleInputChange}
                                            placeholder="Last name"
                                            name='last_name'
                                            className={`w-full p-2 rounded-lg border text-sm ${isEditing
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                : 'bg-gray-50 border-gray-200'
                                                } transition-colors duration-200`}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-between gap-2 lg:flex-row flex-col'>
                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">Email Address</label>
                                        <input
                                            type="email"
                                            value={basicDetails.email}
                                            disabled={true}
                                            placeholder="Email address"
                                            className="w-full p-2 text-sm  rounded-lg border bg-gray-50 border-gray-200 text-gray-500 hover cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1 text-red-500">Email cannot be edited</p>
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                        <input
                                            type="number"
                                            name='phone'
                                            value={basicDetails.phone}
                                            disabled={!isEditing}
                                            onChange={handleInputChange}
                                            placeholder="Phone number"
                                            className={`w-full p-2 rounded-lg border text-sm ${isEditing
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                : 'bg-gray-50 border-gray-200'
                                                } transition-colors duration-200`}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-between gap-2 lg:flex-row flex-col'>
                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">
                                            Employment Status
                                        </label>
                                        {isEditing ? (
                                            <div className="w-full relative">
                                                <div
                                                    className="w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                                                    onClick={() => handleDropdownToggle('status')}
                                                >
                                                    <span className={`flex items-center gap-2 text-sm ${basicDetails.is_deleted === "Active"
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                        }`}>
                                                        <div className={`w-2 h-2 rounded-full ${basicDetails.is_deleted === "Active"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                            }`} />
                                                        {basicDetails.is_deleted}
                                                    </span>
                                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${openDropdown === 'status' ? 'transform rotate-180' : ''
                                                        }`} />
                                                </div>

                                                {openDropdown === 'status' && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg transform transition-all duration-200 ease-out">
                                                        {statusOptions.map((status, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${status === "Active"
                                                                    ? "text-green-700"
                                                                    : "text-red-700"
                                                                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === statusOptions.length - 1 ? 'rounded-b-lg' : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    setBasicDetails(prev => ({
                                                                        ...prev,
                                                                        is_deleted: status
                                                                    }));
                                                                    setOpenDropdown(null);
                                                                }}
                                                            >
                                                                <div className={`w-2 h-2 rounded-full p-2 text-sm ${status === "Active"
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500"
                                                                    }`} />
                                                                {status}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`w-full p-3 rounded-lg flex items-center gap-2 text-sm ${basicDetails.is_deleted === "Active"
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${basicDetails.is_deleted === "Active"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`} />
                                                {basicDetails.is_deleted}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <label className="block text-sm font-medium text-gray-600">Reporting Manager</label>
                                        {isEditing ? (
                                            <div className="w-full relative">
                                                <div
                                                    className="w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                                                    onClick={() => handleDropdownToggle('manager')}
                                                >
                                                    <span className="text-gray-700 text-sm">{basicDetails.manager}</span>
                                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${openDropdown === 'manager' ? 'transform rotate-180' : ''
                                                        }`} />
                                                </div>

                                                {openDropdown === 'manager' && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto transform transition-all duration-200 ease-out">
                                                        {managers.map((manager, index) => (
                                                            <div
                                                                key={manager.id}
                                                                className={`p-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 hover:bg-[orange] ${index === 0 ? 'rounded-t-lg' : ''

                                                                    } ${index === managers.length - 1 ? 'rounded-b-lg' : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    handleChangeManager(manager);
                                                                    setOpenDropdown(null);
                                                                }}
                                                            >
                                                                {`${manager.first_name} ${manager.last_name}`}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full p-2 rounded-lg border bg-gray-50 text-sm ">
                                                {basicDetails.manager}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 w-full">
                                    <label className="block text-sm font-medium text-gray-600">Role</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <div
                                                className="w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                                                onClick={() => handleDropdownToggle('role')}
                                            >
                                                <span className="text-gray-700 text-sm">{basicDetails.role || 'Select Role'}</span>
                                                <ChevronDown className={`text-gray-400 transition-transform duration-200 ${openDropdown === 'role' ? 'transform rotate-180' : ''}`} />
                                            </div>

                                            {openDropdown === 'role' && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                                    {roles.map((role, index) => (
                                                        <div
                                                            key={index}
                                                            className={`p-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${index === 0 ? 'rounded-t-lg' : ''} ${index === roles.length - 1 ? 'rounded-b-lg' : ''}`}
                                                            onClick={() => handleChangeRole(role)}
                                                        >
                                                            {role}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full p-2 rounded-lg border bg-gray-50 text-sm">
                                            {basicDetails.role || 'Not specified'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' border-2 p-3 rounded-lg'>
                    <div className='flex justify-between items-center mb-6'>
                        <p className='text-lg font-semibold text-gray-700 mb-6 '>Profession details</p>
                        {!editProfession && <p title='edit'><Edit2 size={20} className=' text-[#F24444] hover:text-[#e98181] cursor-pointer' onClick={() => setEditProfession(true)} /></p>}
                        {editProfession &&
                            <div className='flex gap-2'>

                                <p title="Cancel">
                                    <CircleX
                                        size={25}
                                        className="cursor-pointer text-red-500"
                                        onClick={handleProfessionCancel}
                                    />
                                </p>
                                <p title="Save">
                                    <Check
                                        size={25}
                                        className="cursor-pointer text-green-600"
                                        onClick={handleProfessionSave}
                                    />
                                </p>

                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Department</label>
                            <input
                                type="department"
                                value={profession.department}
                                disabled={!editProfession}
                                onChange={handleProfessionInputChange}
                                placeholder="First name"
                                name='first_name'
                                className={`w-full p-2 text-sm rounded-lg border  transition-colors duration-200`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Designation</label>
                            <input
                                type="designation"
                                value={profession.designation}
                                disabled={!editProfession}
                                onChange={handleProfessionInputChange}
                                placeholder="First name"
                                name='first_name'
                                className={`w-full p-2 text-sm rounded-lg border  transition-colors duration-200`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Employment Type</label>
                            {editProfession ? (
                                <div className="w-full relative">
                                    <div
                                        className="w-full p-2 text-sm border rounded-lg cursor-pointer flex justify-between items-center"
                                        onClick={() => setShowEmploymentDropdown(prev => !prev)}
                                    >
                                        <span className={`${profession.employment_type === "full-time"
                                            ? "text-green-700"
                                            : profession.employment_type === "part-time"
                                                ? "text-blue-700"
                                                : "text-yellow-600"
                                            }`}>
                                            {profession.employment_type.charAt(0).toUpperCase() + profession.employment_type.slice(1)}
                                        </span>
                                        <ChevronDown className="text-gray-400" />
                                    </div>

                                    {showEmploymentDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                            {copiedDropDown.map((type, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 hover:bg-gray-100 cursor-pointer ${type === "full-time"
                                                        ? "text-green-700"
                                                        : type === "part-time"
                                                            ? "text-blue-700"
                                                            : "text-yellow-600"
                                                        }`}
                                                    onClick={() => handleChangeEmployment(type)}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={profession.employment_type.charAt(0).toUpperCase() + profession.employment_type.slice(1)}
                                        disabled
                                        className={`w-full p-2 text-sm rounded-lg border transition-colors duration-200 ${profession.employment_type === "full-time"
                                            ? "bg-green-50 text-green-700"
                                            : profession.employment_type === "part-time"
                                                ? "bg-blue-50 text-blue-700"
                                                : "bg-yellow-50 text-yellow-600"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
            <div className='flex w-full'>
                <div className="bg-gray-100 w-full">
                    {/* <div className=" mx-auto bg-white pt-4">
                        <h1 className="text-lg font-bold text-gray-700 mb-6 text-center">
                            Profile Details
                        </h1>
                        <div className="border-2 p-6 rounded-lg bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-lg font-bold text-gray-800">Profile Details</h1>
                                {!editProfile ? (
                                    <button
                                        onClick={() => setEditProfile(true)}
                                        className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-800 transition-colors duration-200 text-white bg-black"
                                    >
                                        <Edit2 size={16} className="" />
                                        <span >Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setEditProfile(false)}
                                            className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <CircleX size={16} />
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Add save logic here
                                                setEditProfile(false);
                                            }}
                                            className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-colors duration-200"
                                        >
                                            <Check size={16} />
                                            <span>Save</span>
                                        </button>
                                    </div>
                                )}
                            </div>
{/* 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {/* <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                        {editProfile ? (
                                            <input
                                                type="date"
                                                value={profile.date_of_birth}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    date_of_birth: e.target.value
                                                }))}
                                                className={`w-full p-3 rounded-lg border text-sm
                                                    border-gray-300 hover:border-gray-400 
                                                    focus:border-blue-500 focus:ring-2 
                                                    focus:ring-blue-200 transition-colors duration-200`}
                                            />
                                        ) : (
                                            // <div className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                                            //     {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-GB', {
                                            //         day: '2-digit',
                                            //         month: 'short',
                                            //         year: 'numeric'
                                            //     }) : 'Not specified'}
                                            // </div>
                                        )}
                                    </div> */}

                                    {/* <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-600">Marital Status</label>
                                        {editProfile ? (
                                            <div className="relative">
                                                <div
                                                    className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                                                    onClick={() => setOpenProfileDropdown(prev => prev === 'marital' ? null : 'marital')}
                                                >
                                                    <span className="text-gray-700">{profile.marital_status || 'Select Status'}</span>
                                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${openProfileDropdown === 'marital' ? 'transform rotate-180' : ''
                                                        }`} />
                                                </div>
                                                {openProfileDropdown === 'marital' && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                                        {maritalStatusOptions.map((status, index) => (
                                                            <div
                                                                key={index}
                                                                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                                                onClick={() => {
                                                                    setProfile(prev => ({ ...prev, marital_status: status }));
                                                                    setOpenProfileDropdown(null);
                                                                }}
                                                            >
                                                                {status}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200">
                                                {profile.marital_status || 'Not specified'}
                                            </div>
                                        )}
                                    </div> */}

                                    {/* <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                                        {editProfile ? (
                                            <div className="relative">
                                                <div
                                                    className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                                                    onClick={() => setOpenProfileDropdown(prev => prev === 'gender' ? null : 'gender')}
                                                >
                                                    <span className="text-gray-700">{profile.gender || 'Select Gender'}</span>
                                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${openProfileDropdown === 'gender' ? 'transform rotate-180' : ''
                                                        }`} />
                                                </div>
                                                {openProfileDropdown === 'gender' && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                                        {genderOptions.map((gender, index) => (
                                                            <div
                                                                key={index}
                                                                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                                                onClick={() => {
                                                                    setProfile(prev => ({ ...prev, gender: gender }));
                                                                    setOpenProfileDropdown(null);
                                                                }}
                                                            >
                                                                {gender}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200">
                                                {profile.gender || 'Not specified'}
                                            </div>
                                        )}
                                    </div> */}
                                </div>

                                {/* Contact Details */}
                                {/* <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">Contact Information</h3>
                                    {profile.contact_details.map((contact, index) => (
                                        <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                <input
                                                    type="tel"
                                                    value={contact.phone_number}
                                                    disabled={!editProfile}
                                                    onChange={(e) => {
                                                        const newContacts = [...profile.contact_details];
                                                        newContacts[index].phone_number = e.target.value;
                                                        setProfile(prev => ({ ...prev, contact_details: newContacts }));
                                                    }}
                                                    className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                        ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                        : 'bg-white border-gray-200'
                                                        } transition-colors duration-200`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                                    type="email"
                                                    value={contact.email_id}
                                                    disabled={!editProfile}
                                                    onChange={(e) => {
                                                        const newContacts = [...profile.contact_details];
                                                        newContacts[index].email_id = e.target.value;
                                                        setProfile(prev => ({ ...prev, contact_details: newContacts }));
                                                    }}
                                                    className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                        ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                        : 'bg-white border-gray-200'
                                                        } transition-colors duration-200`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div> */}
                            {/* </div>  */}

                            {/* Location Details */}
                            {/* <div className="mt-8">
                                <h3 className="font-semibold text-gray-700 mb-4">Location Details</h3>
                                {profile.location_details.map((location, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-600">Permanent Address</label>
                                            <textarea
                                                value={location.permanent_address}
                                                disabled={!editProfile}
                                                onChange={(e) => {
                                                    const newLocations = [...profile.location_details];
                                                    newLocations[index].permanent_address = e.target.value;
                                                    setProfile(prev => ({ ...prev, location_details: newLocations }));
                                                }}
                                                className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                    ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    } transition-colors duration-200`}
                                                rows="3"
                                            />
                    </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-600">Current Address</label>
                                            <textarea
                                                value={location.current_address}
                                                disabled={!editProfile}
                                                onChange={(e) => {
                                                    const newLocations = [...profile.location_details];
                                                    newLocations[index].current_address = e.target.value;
                                                    setProfile(prev => ({ ...prev, location_details: newLocations }));
                                                }}
                                                className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                    ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    } transition-colors duration-200`}
                                                rows="3"
                            />
                        </div>
                    </div>
                                ))}
                    </div> */}

                            {/* Emergency Contacts */}
                            {/* <div className="mt-8">
                                <h3 className="font-semibold text-gray-700 mb-4">Emergency Contacts</h3>
                                {profile.emergency_contact.map((contact, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-600">Name</label>
                                <input
                                    type="text"
                                    value={contact.name}
                                                disabled={!editProfile}
                                                onChange={(e) => {
                                                    const newContacts = [...profile.emergency_contact];
                                                    newContacts[index].name = e.target.value;
                                                    setProfile(prev => ({ ...prev, emergency_contact: newContacts }));
                                                }}
                                                className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                    ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    } transition-colors duration-200`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-600">Relationship</label>
                                <input
                                    type="text"
                                    value={contact.relationship}
                                                disabled={!editProfile}
                                                onChange={(e) => {
                                                    const newContacts = [...profile.emergency_contact];
                                                    newContacts[index].relationship = e.target.value;
                                                    setProfile(prev => ({ ...prev, emergency_contact: newContacts }));
                                                }}
                                                className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                    ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    } transition-colors duration-200`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={contact.phone_number}
                                                disabled={!editProfile}
                                                onChange={(e) => {
                                                    const newContacts = [...profile.emergency_contact];
                                                    newContacts[index].phone_number = e.target.value;
                                                    setProfile(prev => ({ ...prev, emergency_contact: newContacts }));
                                                }}
                                                className={`w-full p-3 rounded-lg border text-sm ${editProfile
                                                    ? 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    } transition-colors duration-200`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                        {/* </div>  */}
                    {/* </div> */}
                 </div>
            {/* </div> */}
            {/* <div>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    console.log(sampleDate)
                }}>
                    <input type='date'
                    value={sampleDate}
                    onChange={(e)=>setSampleDate(e.target.value)}/>
                    <button>Save</button>
                </form>
            </div> */}
        </div>
    );
};

export default EditEmployee;
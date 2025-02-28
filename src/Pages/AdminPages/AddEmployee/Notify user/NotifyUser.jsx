import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DotsLoader from "../../../../Components/Layout/animations/dotAnimations";

export default function NotifyForm() {
    const [email, setEmail] = useState(localStorage.getItem("createdUserEmail"));

    const [password, setPassword] = useState(localStorage.getItem("password"));
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }
        localStorage.setItem("userEmail", email);
        localStorage.setItem("password", password);
        toast.success("Credentials saved successfully!");
    };

    const handleNotify = async () => {
        setLoading(true);
        const obj = {
            hr_email: user.email,
            user_email: email,
            password,
        };
        
        try {
            const response = await axios.post('http://localhost:3002/api/routes/user/notify-user', obj, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            
            if (response.data) {
                toast.success("Employee created successfully");
                navigate('/admin/employees');
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to notify employee. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <div className="flex justify-center items-center h-screen ">
            <Toaster />
            <div className="w-96 shadow-2xl   p-6 rounded-lg border-fuchsia-800 shadow-fuchsia-200">
                <div className="text-center text-lg mb-4">Employee created successfully</div>
                <div className="flex flex-col gap-4">
                    <p className="text-gray-500">Email: {email}</p>
                    <p className="text-gray-500">Password: {password}</p>
                    {/* <button 
            onClick={handleSave} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
            Save Credentials
          </button> */}
                    <button
                        onClick={handleNotify}
                        className="bg-violet-700 hover:bg-violet-600 text-white py-2 rounded-lg">
                       {loading ? <DotsLoader/>:" Notify User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
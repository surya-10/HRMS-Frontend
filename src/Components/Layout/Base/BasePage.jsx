import { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/NavBar";
import HRMSDashboard from "../../../Pages/Dashboard/Dashboard";
import NavHome from "../Navbar/NavHome";
import { Bell, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { AuthContext } from "../../../Router";

let BasePage = ({ children }) => {
  let location = useLocation();
  const [show, setShow] = useState(true);
  const { logout, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShow(false);
      }
      else {
        setShow(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [show]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EFEFF5] ">
      <div className="fixed top-0 w-full z-[100] bg-white">
        <div className="h-[80px] flex items-center justify-between px-[2%] border-b-2 border-[#E5E7EB]">
          <p className="flex gap-1 font-bold">
            <ShieldCheck className="text-[blue] text-2xl" />HRMS
          </p>
          <div className="flex gap-10 items-center justify-center">
            <p className="cursor-pointer text-red-400">
              <Bell size={22} strokeWidth={2} />
            </p>
            {/* <div className="text-gray-600 mr-4">
              Welcome, {userData?.name || 'User'} ({userData?.role?.role_value?.toUpperCase()})
            </div> */}
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="flex pt-[80px] h-full w-full gap-1">
        {show && (
          <div className="left-0 top-[80px] bottom-0 w-[20%] bg-[whitesmoke] overflow-y-auto scrollbar-hide">
            <NavHome />
          </div>
        )}

        <div className={`${show ? 'w-[80%]' : 'w-full'} flex-1 px-3 overflow-y-auto scrollbar-hide`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <StyledWrapper>
      <button className="Btn" onClick={handleLogout}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </div>
        <div className="text">Logout</div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: .3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: rgb(255, 65, 65);
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: .3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 15px;
    font-weight: 500;
    transition-duration: .3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: .3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: .3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: .3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px ,2px);
  }`;

export default BasePage;


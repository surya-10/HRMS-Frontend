import React, { useState, useContext } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import hr from "../../../assets/images/user.png";
import axios from "axios";
import DotsLoader from "../animations/dotAnimations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Router";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  let [isHovered, setIsHovered] = useState(false);
  let [view, setView] = useState(false);
  let [type, setType] = useState("password");
  let [isClicked, setIsClicked] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  let viewPass = () => {
    setView(!view);
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };
  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  let handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
  };
  const loginUser = async () => {
    try {
      setIsClicked(true);

      let response = await axios.post(
        "http://localhost:3002/api/routes/user/login",
        formData
      );
      console.log(response);
      if (response.status === 200) {
        const { role } = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userId", response.data.user_id);
        login(response.data);

        switch (role.role_value) {
          case "admin":
            navigate("/admin/dashboard", { replace: true });
            break;
          case "manager":
            navigate("/manager/dashboard", { replace: true });
            break;
          case "user":
            navigate("/user/dashboard", { replace: true });
            break;
          case "ad":
            navigate("/ad/dashboard", {replace:true});
            break;
          default:
            toast.error("Invalid role type");
            return;
        }

        toast.success("Login successful");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error(error.response || error);
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60" />

      <div className="w-full max-w-4xl flex rounded-2xl shadow-xl bg-white overflow-hidden">
        <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-blue-400 to-indigo-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              width="2000px"
              height="1600px"
              viewBox="0 0 2000 1600"
              enable-background="new 0 0 2000 1600"
            >
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M992.408,521.738c0,65.648-53.218,118.866-118.865,118.866 s-118.866-53.219-118.866-118.866s53.219-118.866,118.866-118.866S992.408,456.091,992.408,521.738z"
              />
              <g transform="matrix(.29674 0 0 .29674 621.18 246.21)">
                <path d="M850.754,707.259c30.326,0,54.913-24.59,54.913-54.92c0-30.326-24.587-54.913-54.913-54.913s-54.913,24.587-54.913,54.913 C795.841,682.669,820.425,707.259,850.754,707.259z" />
                <path d="M850.754,652.339" />
                <path d="M791.987,719.376c-38.889,0-70.163,31.718-70.163,71.276v168.613c0,32.781,47.972,32.781,47.972,0V805.096h11.36v422.152 c0,43.826,63.881,42.536,63.881,0V982.196h11.002v245.052c0,42.536,64.236,43.826,64.236,0V805.096h11.091v154.169 c0,33.035,47.722,33.031,47.637,0V791.675c0-36.48-28.329-72.21-71.026-72.21l-115.99-0.076V719.376z" />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M420.417,347.077c0,65.648-53.218,118.866-118.866,118.866 s-118.866-53.219-118.866-118.866c0-65.647,53.218-118.866,118.866-118.866S420.417,281.43,420.417,347.077z"
              />
              <g transform="matrix(.29674 0 0 .29674 195.86 116.34)">
                <path d="M356.524,556.346c30.326,0,54.915-24.588,54.915-54.918c0-30.328-24.588-54.915-54.915-54.915 c-30.325,0-54.915,24.589-54.915,54.915C301.609,531.756,326.194,556.346,356.524,556.346z" />
                <path d="M356.524,501.428" />
                <path d="M297.757,568.465c-38.888,0-70.163,31.717-70.163,71.276v168.613c0,32.781,47.974,32.781,47.974,0V654.185h11.357v422.153 c0,43.826,63.883,42.536,63.883,0V831.282h11.003v245.056c0,42.536,64.233,43.826,64.233,0V654.185h11.091v154.169 c0,33.031,47.724,33.031,47.638,0V640.764c0-36.48-28.327-72.21-71.026-72.21l-115.99-0.076V568.465z" />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M500.783,1177.664c0,65.648-53.219,118.865-118.866,118.865 s-118.866-53.218-118.866-118.865s53.219-118.866,118.866-118.866S500.783,1112.016,500.783,1177.664z"
              />
              <g transform="matrix(.29674 0 0 .29674 255.62 733.95)">
                <path d="M425.966,1274.02c30.326,0,54.915-24.587,54.915-54.916c0-30.326-24.588-54.916-54.915-54.916 c-30.325,0-54.913,24.59-54.913,54.916S395.636,1274.02,425.966,1274.02z" />
                <path d="M425.966,1219.104" />
                <path d="M367.199,1286.141c-38.888,0-70.163,31.715-70.163,71.276v168.613c0,32.781,47.974,32.781,47.974,0v-154.169h11.357 v422.149c0,43.829,63.883,42.539,63.883,0v-245.052h11.003v245.052c0,42.539,64.233,43.829,64.233,0v-422.149h11.091v154.169 c0,33.031,47.726,33.031,47.64,0v-167.593c0-36.477-28.329-72.207-71.026-72.207l-115.992-0.076V1286.141z" />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M1536.279,655.041c0,65.648-53.218,118.865-118.865,118.865 s-118.866-53.218-118.866-118.865s53.219-118.866,118.866-118.866S1536.279,589.393,1536.279,655.041z"
              />
              <g transform="matrix(.29674 0 0 .29674 1025.6 345.34)">
                <path d="M1320.698,822.449c30.326,0,54.916-24.59,54.916-54.916c0-30.33-24.59-54.916-54.916-54.916 c-30.323,0-54.913,24.59-54.913,54.916S1290.369,822.449,1320.698,822.449z" />
                <path d="M1320.698,767.533" />
                <path d="M1261.931,834.57c-38.886,0-70.163,31.715-70.163,71.273v168.616c0,32.778,47.976,32.778,47.976,0V920.286h11.357v422.153 c0,43.829,63.881,42.539,63.881,0v-245.052h11.005v245.052c0,42.539,64.233,43.829,64.233,0V920.286h11.091v154.172 c0,33.031,47.722,33.031,47.637,0V906.866c0-36.477-28.325-72.207-71.026-72.207l-115.99-0.076V834.57z" />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#CC0033"
                stroke-width="5"
                d="M1126.218,1043.975c0,65.648-53.218,118.866-118.865,118.866 s-118.866-53.219-118.866-118.866s53.219-118.866,118.866-118.866S1126.218,978.328,1126.218,1043.975z"
              />
              <path fill="#FF5500" d="M1007.456,962.032" />
              <g>
                <path
                  fill="#CC0000"
                  d="M1004.107,972.611c9.378,0,16.981-7.604,16.981-16.983c0-9.382-7.604-16.985-16.981-16.985 c-9.38,0-16.985,7.606-16.985,16.985C987.122,965.008,994.725,972.611,1004.107,972.611z"
                />
                <path
                  fill="#E3001C"
                  d="M985.93,976.359c-12.028,0-21.7,9.81-21.7,22.045v52.149c0,10.139,14.837,10.139,14.837,0v-47.683h3.512 v130.565c0,13.557,19.759,13.155,19.759,0v-75.792h3.402v75.792c0,13.155,19.864,13.557,19.864,0v-130.565h3.431v47.683 c0,10.217,14.762,10.217,14.735,0v-51.832c0-11.283-8.761-22.333-21.967-22.333l-35.874-0.023V976.359z"
                />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M1691.271,1285.357c0,65.648-53.219,118.865-118.866,118.865 s-118.865-53.219-118.865-118.865c0-65.647,53.218-118.866,118.865-118.866S1691.271,1219.71,1691.271,1285.357z"
              />
              <g transform="matrix(.29674 0 0 .29674 1140.9 814.03)">
                <path d="M1454.68,1367.076c30.326,0,54.916-24.59,54.916-54.916c0-30.33-24.59-54.916-54.916-54.916s-54.913,24.59-54.913,54.916 S1424.35,1367.076,1454.68,1367.076z" />
                <path d="M1454.68,1312.16" />
                <path d="M1395.913,1379.197c-38.886,0-70.163,31.715-70.163,71.276v168.613c0,32.778,47.976,32.778,47.976,0v-154.172h11.354 v422.152c0,43.829,63.884,42.539,63.884,0v-245.052h11.005v245.052c0,42.539,64.233,43.829,64.233,0v-422.152h11.091v154.172 c0,33.031,47.722,33.031,47.637,0v-167.593c0-36.477-28.325-72.207-71.026-72.207l-115.99-0.076V1379.197z" />
              </g>
              <path
                fill="#FFFFFF"
                stroke="#000000"
                stroke-width="5"
                d="M1801.344,308.736c0,65.649-53.219,118.866-118.866,118.866 s-118.865-53.219-118.865-118.866c0-65.647,53.218-118.865,118.865-118.865S1801.344,243.089,1801.344,308.736z"
              />
              <g transform="matrix(.29674 0 0 .29674 1222.7 87.824)">
                <path d="M1549.736,523.209c30.323,0,54.913-24.588,54.913-54.916c0-30.328-24.59-54.915-54.913-54.915 c-30.326,0-54.916,24.589-54.916,54.915C1494.819,498.62,1519.406,523.209,1549.736,523.209z" />
                <path d="M1549.736,468.292" />
                <path d="M1490.965,535.33c-38.886,0-70.163,31.715-70.163,71.276v168.613c0,32.778,47.976,32.778,47.976,0v-154.17h11.357v422.151 c0,43.829,63.881,42.539,63.881,0V798.146h11.005v245.052c0,42.539,64.233,43.829,64.233,0V621.048h11.091v154.17 c0,33.031,47.726,33.031,47.637,0V607.627c0-36.479-28.325-72.209-71.022-72.209l-115.994-0.076V535.33z" />
              </g>
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M430.423,384.087l317.511,92.374"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1000.8,561.521l283.596,66.144"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1497.321,549.634l105.731-134.345"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M896.9,652.7l76.767,261.782"
              />
              <path
                fill="#FF5500"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1329.285,755.499l-215.654,209.469"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M513.613,1150.848l363.396-81.184"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1116.697,1120.469l326.401,132.547"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M890.552,982.019L371.614,461.427"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M769.263,602.001l-325.809,456.835"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M996.605,468.057L1549.58,327.47"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1669.189,444.146l-72.771,709.875"
              />
              <path
                fill="none"
                stroke="#000000"
                stroke-width="5"
                stroke-linecap="round"
                d="M1457.917,780.445l65.797,380.557"
              />
              {/* <rect x="1063.771" y="1131.5" fill="#FFFFFF" width="20.101" height="22.015" />
                            <path d="M1068.771,1129.114v63.5h-5v-14.2h-5v-5h-10v9.5h5v5h-5v-5h-5v-14.5h15v5h5v-44.3H1068.771c0-5,0-5,0-5h10.101v5h5v19.4h10 v5h-10v19.699h-5v-44.1H1068.771L1068.771,1129.114z M1118.471,1163.515h5v5h-5V1163.515L1118.471,1163.515z M1128.371,1168.414 v34.2h-5v-34.2H1128.371L1128.371,1168.414z M1113.571,1163.515v14.699h-5v-19.699h-9.8v14.699h-5v-19.699h14.8v5h9.801v5H1113.571 L1113.571,1163.515z M1073.771,1226.314h39.601v-9.3h5v-14.4h5v14.3h-5v14.3h-49.601v-14.3h-5v-9.7h5v9.7h5V1226.314 L1073.771,1226.314z M1058.871,1188.015v9.6h5v9.7h-5v-9.7h-5v-9.7h5V1188.015z" /> */}
            </svg>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Secure Login</h3>
            <p className="text-white/80">
              Access your account with our secure login system
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <img
                    src={hr}
                    alt="Logo"
                    className="rounded-full shadow-lg w-20 h-20 object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500">Please sign in to continue</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                      type={type}
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                    />
                    {view ? (
                      <Eye
                        onClick={viewPass}
                        className="cursor-pointer absolute right-2 top-1/2  -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-200"
                      />
                    ) : (
                      <EyeOff
                        onClick={viewPass}
                        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  {isClicked ? <DotsLoader /> : "Sign In"}
                </button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <div className='bottom-[83px] h-[5px] absolute max-w-4xl w-full rounded-2xl m'>
                <div className='h-[5px] w-1/4 bg-[red]'>
                </div>
                <div className='absolute top-0 left-[25%] h-[5px] w-1/4 bg-[green]'>
                </div>
                <div className='absolute top-0 left-[50%] h-[5px] w-1/4 bg-[blue]'>
                </div>
                <div className='absolute top-0 left-[75%] h-[5px] w-1/4 bg-[violet]'>
                </div>
            </div> */}
    </div>
  );
};

export default LoginPage;

import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Routers from "./Router";
import { AuthProvider } from './Router';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routers />
      </BrowserRouter>
    </AuthProvider>
  )
}

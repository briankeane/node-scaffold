import { Outlet } from "react-router";
import Navbar from "./Components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";

function App() {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Outlet />
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;

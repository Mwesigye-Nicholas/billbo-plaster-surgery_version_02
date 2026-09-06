import { FaBars, FaTimes } from "react-icons/fa";
import billboLogo from "../assets/billboLogo.jpg";
import {useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface HeaderProps {
  isDrawOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
}

const Header = ({ isDrawOpen, onOpenDrawer, onCloseDrawer }: HeaderProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout} = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const message = await logout();
      toast.success(message);
      console.log(message);
      
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Logout Error: ", error);
      if (error instanceof Error && error.message) {
        return toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className=" border-2 border-amber-500">
      <div className="flex justify-between items-center  px-7">
        <div className="">
          <img className="w-48 h-24" src={billboLogo} alt="site logo" />
        </div>
        <div className="hidden md:block">
          <h1>BillBo Plastic Surgery</h1>
        </div>
        {isLoggingOut ? (
          <span className="text-sm text-gray-500">Logging out...</span>
        ) : (
          <button onClick={handleLogout} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition duration-200">
            Logout
          </button>
        )}

        <div className=" md:hidden">
          {!isDrawOpen ? (
            <button
              type="button"
              aria-label="Open-navigation menu"
              onClick={onOpenDrawer}
            >
              <FaBars size={24} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={onCloseDrawer}
            >
              <FaTimes size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;

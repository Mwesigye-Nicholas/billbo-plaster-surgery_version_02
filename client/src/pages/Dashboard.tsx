import { FaUserInjured } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaProcedures } from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { FaFileMedicalAlt } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { NavLink} from "react-router-dom";

const Dashboard = () => {
 
  return (
    <div className="text-2xl font-bold text-center mt-20">
      Dashboard
      <div className="border border-amber-400 mt-6 p-4 flex flex-col gap-6 md:flex-row md:justify-around md:items-center text-base md:text-2xl">
        <NavLink
          to="/dashboard/patients"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaUserInjured size={32} />
          <span className="">Patients</span>
        </NavLink>
        <NavLink
          to="/dashboard/images"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaImage size={32} />
          <span>Images</span>
        </NavLink>
        <NavLink
          to="/dashboard/appointments"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaCalendarAlt size={32} />
          <span>Appointments</span>
        </NavLink>
        <NavLink
          to="/dashboard/surgeries"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaProcedures size={32} />
          <span>Surgeries</span>
        </NavLink>
        <NavLink
          to="/dashboard/staffs"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaUserMd size={32} />
          <span>Staffs</span>
        </NavLink>
        <NavLink
          to="/dashboard/reports"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaFileMedicalAlt size={32} />
          <span>Reports</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className="flex flex-col items-center justify-center gap-2"
        >
          <FaCog size={32} />
          <span>Settings</span>
        </NavLink>
      </div>
     
    </div>
  );
};
export default Dashboard;

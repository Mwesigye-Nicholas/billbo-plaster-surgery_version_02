import { NavLink } from "react-router-dom";
const Appointments = () => {
    return (
           <div>
      <h2>Available Appointments</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/appointments">Patient Appointments</NavLink>
      </button>
    </div>
    )
}
export default Appointments;
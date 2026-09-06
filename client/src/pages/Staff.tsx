import { NavLink } from "react-router-dom";
const Staff = () => {
    return (
           <div>
      <h2>Available staffs</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/staffs">Available staffs</NavLink>
      </button>
    </div>
    )
}
export default Staff;
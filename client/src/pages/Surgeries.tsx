import { NavLink } from "react-router-dom";
const Surgeries = () => {
    return (
          <div>
      <h2>Patients</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/surgeries">Available Patient for surgery</NavLink>
      </button>
    </div>
    )
}
export default Surgeries;
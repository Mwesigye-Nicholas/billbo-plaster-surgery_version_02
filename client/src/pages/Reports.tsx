import { NavLink } from "react-router-dom";
const Reports = () => {
    return (
           <div>
      <h2>Reports</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/reports">Available Reports</NavLink>
      </button>
    </div>
    )
}
export default Reports;
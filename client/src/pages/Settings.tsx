import { NavLink } from "react-router-dom";
const Settings = () => {
    return (
            <div>
      <h2>Settings Page</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/settings">Setting Available</NavLink>
      </button>
    </div>
    )
}
export default Settings;
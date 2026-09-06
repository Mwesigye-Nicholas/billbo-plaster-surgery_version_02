import { NavLink } from "react-router-dom";
const Images = () => {
    return (
        <div>
      <h2>Patient Images</h2>
      <button className="border border-blue-900 py-1 px-2">
        <NavLink to="/dashboard/images">Search for images</NavLink>
      </button>
    </div>
    )
}
export default Images;
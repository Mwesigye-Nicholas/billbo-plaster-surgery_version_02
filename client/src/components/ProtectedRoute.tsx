import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";


const ProtectedRoute = () => {
  const { isAuthenticated} = useAuth();

  console.log("Is Authenticated: ", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;

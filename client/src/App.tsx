import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/useAuth";
import LoaderSpinner from "./components/ui/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isLoading } = useAuth();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <LoaderSpinner fullScreen />
        </div>
      ) : (
        <AppRoutes />
      )}
    </>
  );
}

export default App;

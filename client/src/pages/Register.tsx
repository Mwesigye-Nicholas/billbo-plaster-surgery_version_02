import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { NavLink } from "react-router-dom";

interface RegistrationCredentials {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface RegistrationCredentialErrors {
  name: string;
  email: string;
  role: string;
  password: string;
}

const Registration = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] =
    useState<RegistrationCredentials>({
      name: "",
      email: "",
      role: "",
      password: "",
    });

  const [userCredentialErrors, setUserCredentialErrors] =
    useState<RegistrationCredentialErrors>({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleUserCredentialsChange = (
    field: keyof RegistrationCredentials,
    value: string,
  ) => {
    setUserCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOnBlur = (
    field: keyof RegistrationCredentials,
    value: string,
  ) => {
    setUserCredentialErrors((prev) => ({
      ...prev,
      [field]: validateRequired(value),
    }));
  };

  const validateRequired = (value: string) => {
    return value.trim() === "" ? "This field is required" : "";
  };
  const validateForm = () => {
    const nameErrorValue = validateRequired(userCredentials.name);
    const emailErrorValue = validateRequired(userCredentials.email);
    const roleErrorValue = validateRequired(userCredentials.role);
    const passwordErrorValue = validateRequired(userCredentials.password);

    const isValid =
      !nameErrorValue &&
      !emailErrorValue &&
      !roleErrorValue &&
      !passwordErrorValue;

    setUserCredentialErrors((prev) => ({
      ...prev,
      username: nameErrorValue,
      email: emailErrorValue,
      role: roleErrorValue,
      password: passwordErrorValue,
    }));

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        userCredentials.name.trim(),
        userCredentials.email.trim(),
        userCredentials.role.trim(),
        userCredentials.password.trim(),
      );
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        setServerError(error.message);
      } else {
        setServerError("Registration Failed, please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-col min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 border-green-500 border-2">
      <div className="w-full max-w-md p-8 text-center mb-2">
        <h1 className="sm:text-3xl text-2xl font-bold text-center mb-4">
          BillBo Plastic Surgery
        </h1>

        <h2 className="sm:text-xl text-lg font-semibold text-center mt-2">
          Registration Page
        </h2>
      </div>
      <div className="border border-amber-500 p-9 rounded-2xl">
        {serverError && (
          <p className="text-sm text-center text-red-600">{serverError}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="text-sm font-medium mb-4 sm:text-base">
              Enter Your Registration Credentials.
            </legend>

            <div className="sm:w-96 flex flex-col flex-1 gap-1 mb-3">
              <label
                htmlFor="username"
                className="text-sm sm:text-base mb-1 font-medium"
              >
                Username Name:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userCredentials.name}
                placeholder="Enter your full name: ..."
                onChange={(e) =>
                  handleUserCredentialsChange("name", e.target.value)
                }
                onBlur={(e) => handleOnBlur("name", e.target.value)}
                className="w-full  px-9 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
              />
              {userCredentialErrors.name && (
                <p className="text-sm text-red-600">
                  {userCredentialErrors.name}
                </p>
              )}
            </div>

            <div className="sm:w-96 flex flex-col flex-1 gap-1 mb-3">
              <label
                htmlFor="email"
                className="text-sm sm:text-base mb-1 font-medium"
              >
                User Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userCredentials.email}
                placeholder="Enter your email: ..."
                onChange={(e) =>
                  handleUserCredentialsChange("email", e.target.value)
                }
                onBlur={(e) => handleOnBlur("email", e.target.value)}
                className="w-full  px-9 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
              />
              {userCredentialErrors.email && (
                <p className="text-sm text-red-600">
                  {userCredentialErrors.email}
                </p>
              )}
            </div>

            <div className="sm:w-96 flex flex-col flex-1 gap-1 mb-4">
              <label
                htmlFor="role"
                className="text-sm sm:text-base mb-1 font-medium"
              >
                User Role:
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={userCredentials.role}
                placeholder="Enter your role(eg: surgeon, doctor etc): ..."
                onChange={(e) =>
                  handleUserCredentialsChange("role", e.target.value)
                }
                onBlur={(e) => handleOnBlur("role", e.target.value)}
                className="w-full  px-8 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
              />
              {userCredentialErrors.role && (
                <p className="text-sm text-red-600">
                  {userCredentialErrors.role}
                </p>
              )}
            </div>
            <div className="sm:w-96 flex flex-col flex-1 gap-1 mb-7">
              <label
                htmlFor="password"
                className="text-sm sm:text-base mb-1 font-medium"
              >
                User Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={userCredentials.password}
                  placeholder="Enter your password: ..."
                  onChange={(e) =>
                    handleUserCredentialsChange("password", e.target.value)
                  }
                  onBlur={(e) => handleOnBlur("password", e.target.value)}
                  className="w-full px-8 py-3 border rounded-md focus:ring-2 pr-10 focus:ring-blue-500  focus:outline-none mb-1 focus:border-0"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 pr-4"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {userCredentialErrors.password && (
                <p className="text-red-600 text-sm">
                  {userCredentialErrors.password}
                </p>
              )}
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-base bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Loading, please wait..." : "Register"}
            </button>
          </div>
        </form>
        <div className="p-2 text-sm text-red-600 flex justify-center items-center font-semibold">
          <p>Already have an Account?.</p>
        </div>
        <NavLink
          to="/login"
          className="block text-center text-base bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Registration;

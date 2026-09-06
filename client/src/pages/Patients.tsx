import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "../components/ui/Spinner";
import calculateAge from "../utils/calculatePatientAge";
import BASE_API_URL from "../config/api";

type MedicalData = {
  status: string;
  plannedProcedure: string;
  dateOfSurgery: string;
  _id: string;
};

type PatientIdSearch = {
  type: "patientId";
  value: string;
};

type ConditionSearch = {
  type: "condition";
  value: string;
};

type Patient = {
  _id: string;
  name: string;
  sex: string;
  patientId: string;
  status: string;
  procedure: string;
  dateOfBirth: string;
  medicalData: MedicalData[];
};
const Patients = () => {
  const { accessToken } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredPatient, setFilteredPatient] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [condition, setCondition] = useState("");
  const { handleAuthError} = useAuth();

  const dataToRender = isSearching ? filteredPatient : patients;

  const navigate = useNavigate();

  const fetchAllPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/v1/patients`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        return handleAuthError();
      }

      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.message || "Failed to fetch patients");
      }
      
      const data = result.data;
      console.log("Fetched patient data:", data.patients);
      setPatients(data.patients);
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.log("Fetch patients error", error.message);
        toast.error(error.message);
      } else {
        console.log("Unknown error: ", error);
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, handleAuthError]);

  const handlePatientSearch = async (
    search: PatientIdSearch | ConditionSearch,
  ) => {
    if (!search.value) {
      toast.error("Please enter patient Id or condition");
      return;
    }

    setIsSearching(true);
    try {
      let response;
      if (search.type === "patientId") {
        response = await fetch(
          `${BASE_API_URL}/api/v1/patients/${search.value}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        response = await fetch(
          `${BASE_API_URL}/api/v1/patients/search/${search.value}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(
          errorMessage ||
            `Failed to fetch patient Data with id ${search.value}`,
        );
        return;
      }

      const data = await response.json();
      if (search.type === "patientId") {
        setFilteredPatient([data.data.patientData]);
      } else if (search.type === "condition") {
        setFilteredPatient(data.data.patientData);
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/v1/patients/${patientId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(
          errorMessage || "Failed to delete patient, please try again",
        );
      }

      const resMessage = await response.json();
      toast.success(resMessage.message);
      setPatients((prevPatients) =>
        prevPatients.filter((p) => p.patientId !== patientId),
      );
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.log("Patient deletion error", error.message);
        toast.error(error.message);
      } else {
        console.log("Unknown error: ", error);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    fetchAllPatients();
  }, [fetchAllPatients, accessToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-500 ${
        isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Header*/}
      <div className="flex items-center justify-center flex-col">
        <h1 className="font-bold text-2xl text-green-600 items-center justify-center">
          All Patients
        </h1>
        <div className="mt-4">
          <button className="m-4 border border-black rounded-xl py-2 px-3 bg-green-400 hover:bg-green-600 transition duration-200 hover:text-white text-black">
            <NavLink to="/dashboard/patients/create">Register Patient</NavLink>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row w-full justify-between  items-center gap-6 p-4 border rounded-xl shadow-sm bg-white min-h-24">
          {/*Search by patientId */}
          <div className="flex flex-col gap-2 w-full max-w-md">
            <label
              htmlFor="patientId"
              className="text-xm
            font-medium text-gray-700"
            >
              Search Patient By PatientId:{" "}
            </label>
            <div className="flex items-center  rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 ">
              <input
                placeholder="Enter patient ID here:...."
                value={patientId}
                type="search"
                id="patientId"
                name="patientId"
                className="flex-1 outline-none px-3 py-2  focus:outline-none focus:ring-0 bg-transparent
               "
                onChange={(e) => setPatientId(e.target?.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                onClick={() =>
                  handlePatientSearch({ type: "patientId", value: patientId })
                }
              >
                Search
              </button>
              <button
                onClick={() => {
                  setFilteredPatient([]);
                  setCondition("");
                  setPatientId("");
                  setIsSearching(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
          {/*Search by condition */}
          <div className="flex flex-col gap-2 w-full max-w-md">
            <label
              htmlFor="condition"
              className="text-xm
            font-medium text-gray-700"
            >
              Search Patient By Condition:{" "}
            </label>
            <div className="flex items-center  rounded-lg overflow-hidden focus:outline-none focus-within:ring-2 focus-within:ring-blue-500">
              <input
                placeholder="Enter patient'condition here:...."
                value={condition}
                type="search"
                id="condition"
                name="condition"
                className="flex-1 outline-none px-3 py-2 focus:outline-none  focus:ring-0 bg-transparent"
                onChange={(e) => setCondition(e.target?.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                onClick={() =>
                  handlePatientSearch({ type: "condition", value: condition })
                }
              >
                Search
              </button>
              <button
                onClick={() => {
                  setFilteredPatient([]);
                  setCondition("");
                  setPatientId("");
                  setIsSearching(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Sex</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Planned Procedure</th>
            <th className="border px-4 py-2">Patient Id</th>
            <th className="border px-4 py-2">Date of Surgery</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {dataToRender.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No patients found
              </td>
            </tr>
          ) : (
            dataToRender.map((patient) => {
              const latestMedical = patient.medicalData?.[0];
              return (
                <tr key={patient._id} className="text-center">
                  <td className="border px-4 py-2">{patient.name}</td>
                  <td className="border px-4 py-2 capitalize">{patient.sex}</td>
                  <td className="border px-4 py-2">
                    {patient.dateOfBirth
                      ? (() => {
                          const age = calculateAge(patient.dateOfBirth);
                          return `${age.years} years | ${age.months} months | ${age.weeks} weeks | ${age.days} days`;
                        })()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {latestMedical?.status || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {latestMedical?.plannedProcedure}
                  </td>
                  <td className="border px-4 py-2">{patient.patientId}</td>
                  <td className="border px-4 py-2">
                    {latestMedical?.dateOfSurgery
                      ? new Date(
                          latestMedical?.dateOfSurgery,
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="border px-2 py-2 space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/patients/${patient.patientId}`)
                      }
                      className="px-2 py-1 border hover:text-white hover:bg-blue-700 border-blue-500 text-blue-700 rounded"
                    >
                      View Details
                    </button>
                    <button
                      className="px-2 py-1 my-2 border hover:text-white hover:bg-yellow-600  border-yellow-500 text-yellow-700 rounded"
                      onClick={() =>
                        navigate(
                          `/dashboard/patients/updatePatientData/${patient.patientId}`,
                        )
                      }
                    >
                      Update
                    </button>
                    <button
                      className="px-2 py-1 border hover:text-white hover:bg-red-700 border-red-500 text-red-700  rounded"
                      onClick={() => handleDeletePatient(patient.patientId)}
                    >
                      Delete
                    </button>
                    <button
                      className="px-2 py-1 border mt-2 hover:shadow-md hover:text-white hover:bg-purple-700 transition duration-400 border-purple-500 text-purple-700  rounded"
                      onClick={() =>
                        navigate(
                          `/dashboard/patients/prescriptions/${patient.patientId}`,
                        )
                      }
                    >
                      Prescribe meds
                    </button>
                      <button
                      className="px-2 py-1 border mt-2 hover:shadow-md hover:text-white hover:bg-purple-700 transition duration-400 border-purple-500 text-purple-700  rounded"
                      onClick={() =>
                        navigate(
                          `/dashboard/patients/images/${patient.patientId}`,
                        )
                      }
                    >
                    Patient Images
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Patients;

import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCallback, useEffect, useState } from "react";
import LoaderSpinner from "../components/ui/Spinner";

type Params = {
  patientId: string;
};
type Surgeon = {
  name: string;
};

type Medicines = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type MedicalAndSurgicalHistory = {
  category: string;
  year: string;
  notes: string;
  conditions: string[];
};

type MedicalData = {
  status: string;
  medicines: Medicines[];
  plannedProcedure: string;
  dateOfSurgery: string;
  surgeon: Surgeon;
  diagnosis: string[];
  medicalAndSurgicalHistory: MedicalAndSurgicalHistory;
  _id: string;
};

type PhoneNumbers = {
  type: string;
  number: string;
};

type Patient = {
  _id: string;
  name: string;
  sex: string;
  patientId: string;
  status: string;
  procedure: string;
  address: string;
  email: string;
  medicalData: MedicalData[];
  phoneNumbers: PhoneNumbers[];
};

const ViewPatient = () => {
  const { patientId } = useParams<Params>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  console.log("Patient Id: ", patientId);

  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleFetchPatientData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/patients/${patientId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        toast.error("Failed to fetch patient Data");
      }

      const data = await response.json();
      setPatientData(data.data.patientData);

      console.log(
        "Patient data in View Patient from view patient: ",
        data.data.patientData,
      );
      //console.log("Surgeon: ", data.data.surgeon);
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.log("Fetch patient error", error.message);
        toast.error(error.message);
      } else {
        console.log("Unknown error: ", error);
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, patientId]);

  useEffect(() => {
    if (!patientId) return;
    handleFetchPatientData();
  }, [handleFetchPatientData, patientId]);

  if (!patientId) {
    return (
      <div>
        <h4>Invalid patient Id</h4>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <LoaderSpinner />
        <p className="text-black font-medium mt-4">
          Loading patient's data, please wait.....
        </p>
      </div>
    );
  }

  return (
   <div className="h-screen bg-gray-50 p-6">
      <h1 className="text-center mb-8 text-3xl font-extrabold underline">
        Patient Details
      </h1>

      <div className="flex flex-col md:flex-row  gap-6">
        {/*Patient bio data */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-2">Patient Bio Data:</h2>
          <p className="text-lg font-semibold">Name: <span className="font-normal">{patientData?.name}</span></p>
          <p  className="text-lg font-semibold">PatientId: <span className="font-normal">{patientData?.patientId}</span></p>
            <p  className="text-lg font-semibold">Sex: <span className="text-base font-normal">{patientData?.sex}</span></p>
            <p  className="text-lg font-semibold"> Address: <span className="text-base font-normal">{patientData?.address}</span></p>
            <p  className="text-lg font-semibold">Email: <span  className="text-base font-normal">{patientData?.email}</span></p>
            
          {
            patientData?.phoneNumbers.length ? (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold mt-4">Phone Numbers:</h2>
                {
                  patientData.phoneNumbers.map((phone, idx) => (
                    <ul key={idx} className="list-disc list-inside space-y-1">
                      <li>Type: {phone.type}</li>
                      <li>Number: { phone.number}</li>
                    </ul>
                  ))
                }
              </div>
            ) : null
          }
        </div>

        {/*Medical Data*/}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-2">Patient Medical Data:</h2>
          <div>
            {patientData?.medicalData.map((record) => (
              <div key={record._id} className="space-y-4">
                <p className="text-lg font-semibold">Seen By Doctor: <span className="font-normal"> {record.surgeon?.name || "N/A"}</span></p>
                <p className="text-lg font-semibold">Planned procedure: <span className="font-normal">{record.plannedProcedure}</span></p>
                <p className="text-lg font-semibold">
                  Date of Surgery:{" "}
                  <span className="font-normal">
                    {record.dateOfSurgery
                    ? new Date(record.dateOfSurgery).toLocaleDateString()
                    : ""}
                  </span>
                </p>

                <h3 className="text-lg font-semibold mt-2">Medicines:</h3>
                {record.medicines.map((medicine, idx) => (
                  <div key={idx}>
                    <ul key={idx} className="list-disc list-inside space-y-1 ml-4">
                      <li>Name: {medicine.name}</li>
                      <li>Dosage: {medicine.dosage}</li>
                      <li>Duration: {medicine.duration}</li>
                      <li>Frequency: {medicine.frequency}</li>
                    </ul>
                  </div>
                ))}

                 <h3 className="text-lg font-semibold mt-2">Diagnosis</h3>
                  {record.diagnosis.map((condition, idx) => (
                    <ul key={idx} className="list-disc list-inside ml-4">
                      <li key={idx}>{condition}</li>
                    </ul>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Medical And Surgical History */}

        <div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Medical And Surgical History:</h2>
          <div>
            {patientData?.medicalData.map((record) => (
              <div key={record._id} className="space-y-3">
                <h3 className="text-lg font-semibold"> Conditions:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                   {record.medicalAndSurgicalHistory.conditions.map(
                  (condition, idx) => (
                      <li key={idx}>Conditions: {condition}</li>
                  ),
                )}
               </ul>
                <p className="text-lg font-semibold">Category: <span className="font-normal"> {record.medicalAndSurgicalHistory.category}</span></p>
                <p className="text-lg font-semibold">Year: <span className="font-normal">{record.medicalAndSurgicalHistory.year}</span></p>
                <p className="text-lg font-semibold">Notes: <span className="font-normal"> {record.medicalAndSurgicalHistory.notes}</span></p>
              </div>
            ))}
          </div>
       
        </div>
      </div>
         <button onClick={() => navigate( `/dashboard/patients/medicalReport/${patientData?.patientId}`)}  className="px-2 py-1 border border-blue-500 mt-7 hover:bg-blue-500 hover:text-white transition duration-300 text-blue-700 rounded">
            View Medical Report
          </button>
      </div>
  );
};

export default ViewPatient;

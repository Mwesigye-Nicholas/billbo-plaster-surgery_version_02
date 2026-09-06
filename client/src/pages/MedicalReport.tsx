import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import LoaderSpinner from "../components/ui/Spinner";
import BASE_API_URL from "../config/api";

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

const MedicalReport = () => {
  const { patientId } = useParams<Params>();
  const { accessToken } = useAuth();

  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleAuthError } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  const handleFetchPatientData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/v1/patients/${patientId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        return handleAuthError();
      }

      if (!response.ok) {
       return toast.error("Failed to fetch patient Data");

      }

      const data = await response.json();
      setPatientData(data.data.patientData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, patientId, handleAuthError]);

  useEffect(() => {
    if (!patientId) return;
    handleFetchPatientData();
  }, [handleFetchPatientData, patientId]);

  if (!patientId) {
    return <h4>Invalid patient Id</h4>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <LoaderSpinner />
        <p className="mt-4">Loading patient's data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="print-area bg-white w-full max-w-5xl p-10 shadow-lg rounded-lg">
        
        {/* HEADER */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">Medical Report</h1>
          <p className="text-sm text-gray-500">Patient Summary Document</p>
        </div>

        {/* PATIENT INFO */}
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b mb-4 pb-1">
            Patient Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <p><strong>Name:</strong> {patientData?.name}</p>
            <p><strong>Patient ID:</strong> {patientData?.patientId}</p>
            <p><strong>Sex:</strong> {patientData?.sex}</p>
            <p><strong>Email:</strong> {patientData?.email}</p>
            <p className="col-span-2">
              <strong>Address:</strong> {patientData?.address}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Phone Numbers</h3>
            {patientData?.phoneNumbers.map((phone, idx) => (
              <p key={idx}>
                {phone.type}: {phone.number}
              </p>
            ))}
          </div>
        </div>

        {/* MEDICAL RECORDS */}
        {patientData?.medicalData.map((record, index) => (
          <div key={record._id} className="mb-10">
            
            <h2 className="text-xl font-bold border-b mb-4 pb-1">
              Medical Record #{index + 1}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p>
                <strong>Doctor:</strong> {record.surgeon?.name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {record.status}
              </p>
              <p>
                <strong>Procedure:</strong> {record.plannedProcedure}
              </p>
              <p>
                <strong>Surgery Date:</strong>{" "}
                {record.dateOfSurgery
                  ? new Date(record.dateOfSurgery).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <h3 className="font-semibold">Diagnosis</h3>
              <ul className="list-disc ml-6">
                {record.diagnosis.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Medicines */}
            <div className="mb-4">
              <h3 className="font-semibold">Medications</h3>
              {record.medicines.map((med, idx) => (
                <div key={idx} className="ml-4 mb-2">
                  <p><strong>{med.name}</strong></p>
                  <p className="text-sm">
                    {med.dosage} | {med.frequency} | {med.duration}
                  </p>
                </div>
              ))}
            </div>

            {/* History */}
            <div>
              <h3 className="font-semibold">Medical & Surgical History</h3>
              <ul className="list-disc ml-6">
                {record.medicalAndSurgicalHistory.conditions.map(
                  (c, idx) => (
                    <li key={idx}>{c}</li>
                  )
                )}
              </ul>

              <p className="mt-2">
                <strong>Category:</strong>{" "}
                {record.medicalAndSurgicalHistory.category}
              </p>
              <p>
                <strong>Year:</strong>{" "}
                {record.medicalAndSurgicalHistory.year}
              </p>
              <p>
                <strong>Notes:</strong>{" "}
                {record.medicalAndSurgicalHistory.notes}
              </p>
                </div>
                
          </div>
        ))}
        
          {/* SIGNATURE AND STAMP */}
              
              <div className="mt-10 flex flex-row justify-between">
                  <div>
                      <p>----------------------------</p>
                      <p>Doctor's signature</p>
                  </div>

                   <div>
                      <p>----------------------------</p>
                      <p>Hospital stamp</p>
                  </div>
                  
              </div>

        {/* FOOTER */}
        <div className="border-t pt-4 text-sm text-gray-500 text-center">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* PRINT BUTTON */}
      <button
        className="no-print fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded shadow-md"
        onClick={handlePrint}
      >
        Print
      </button>
    </div>
  );
};

export default MedicalReport;
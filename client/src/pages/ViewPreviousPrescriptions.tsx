import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import LoaderSpinner from "../components/ui/Spinner";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface Prescription {
  _id: string;
  medicines: Medicine[];
  issuedOn: string;
  patientBioData: string;
  doctorId:
  | string
  | {
    _id: string;
    name: string;
  };
  medicalData: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ViewPrescriptions = () => {
  const { patientId } = useParams();
  const { accessToken } = useAuth();

  const [currentPrescription, setCurrentPrescription] =
    useState<Prescription | null>(null);
  const [previousPrescriptions, setPreviousPrescriptions] = useState<
    Prescription[]
  >([]);
  //const [total, setTotal] = useState(0);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/prescriptions/${patientId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(errorMessage || "Failed to fetch patient prescriptions");
      }

      const res = await response.json();

      setCurrentPrescription(res.data.currentPrescription);
      setPreviousPrescriptions(res.data.history);
      //setTotal(data.total);
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, patientId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  //Toggle
  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Previous Prescriptions.</h1>
      <h2 className="text-xl font-semibold mb-2">Current Prescription.</h2>
      <div className="flex flex-col border rounded-xl p-5 shadow-sm bg-white">
        {/*Header */}
        <div className="flex flex-col justify-between items-center border-b pb-3 mb-4">
          <div className="flex flex-col">
            <span className="font-semibold">
              {currentPrescription?.issuedOn
                ? new Date(currentPrescription.issuedOn).toLocaleDateString()
                : "N/A"}
            </span>
            <span className="text-sm text-gray-600">
              Doctor :{" "}
              {typeof currentPrescription?.doctorId === "object"
                ? currentPrescription.doctorId.name
                : "Unknown Doctor"}
            </span>
          </div>
          <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Active
          </span>
        </div>
      </div>

      {/*Medicines */}
      <div className="flex flex-col gap-4">
        {currentPrescription?.medicines?.map((med, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 bg-gray-50 rounded-md"
          >
            <p>
              <span className="font-medium">Name:</span> {med.name}
            </p>
            <p>
              <span className="font-medium">Dosage:</span> {med.dosage}
            </p>
            <p>
              <span className="font-medium">Frequency:</span> {med.frequency}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {med.duration}
            </p>
            <p>
              <span className="font-medium">Route:</span> {med.route}
            </p>
            <p>
              <span className="font-medium">Instructions:</span>{" "}
              {med.instructions}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold">Previous Prescriptions</h1>

        {previousPrescriptions.length === 0 ? (
          <p className="text-gray-500">No previous prescriptions found</p>
        ) : (
          previousPrescriptions.map((prescription, index) => {
            const doctorName =
              typeof prescription.doctorId === "object"
                ? prescription.doctorId.name
                : "Unknown Doctor";

            return (
              <div
                key={prescription._id}
                className="flex flex-col border rounded-xl p-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {new Date(prescription.issuedOn).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Doctor: {doctorName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md"
                  >
                    {openIndex === index ? "Hide" : "View"}
                  </button>
                </div>

                {/* EXPANDED SECTION */}
                {openIndex === index && (
                  <div className="flex flex-col gap-4 mt-4 border-t pt-4">
                    {prescription.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1 bg-gray-50 p-3 rounded-md"
                      >
                        <p>
                          <strong>Name:</strong> {med.name}
                        </p>
                        <p>
                          <strong>Dosage:</strong> {med.dosage}
                        </p>
                        <p>
                          <strong>Frequency:</strong> {med.frequency}
                        </p>
                        <p>
                          <strong>Duration:</strong> {med.duration}
                        </p>
                        <p>
                          <strong>Route:</strong> {med.route}
                        </p>
                        <p>
                          <strong>Instructions:</strong> {med.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default ViewPrescriptions;

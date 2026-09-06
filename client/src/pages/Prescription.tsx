import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_API_URL from "../config/api";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface MedicineErrors {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

const Prescription = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicinesErrors, setMedicinesErrors] = useState<MedicineErrors[]>([]);
  const { accessToken } = useAuth();
  const { patientId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {handleAuthError } = useAuth();

  const navigate = useNavigate();

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        route: "",
        instructions: "",
      },
    ]);
  };
  const handleOnChange = (
    index: number,
    field: keyof Medicine,
    value: string,
  ) => {
    setMedicines((prevMedicine) => {
      const updatedMedicine = [...prevMedicine];

      updatedMedicine[index] = {
        ...updatedMedicine[index],
        [field]: value,
      };
      return updatedMedicine;
    });
  };

  const handleDeleteMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const validateRequired = (value: string) => {
    return value.trim() === "" ? "This filed is required" : "";
  };

  const handleValidatePrescriptionField = (
    index: number,
    name: keyof Medicine,
    value: string,
  ) => {
    setMedicinesErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];

      if (!updatedErrors[index]) {
        updatedErrors[index] = {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          route: "",
          instructions: "",
        };
      }
      updatedErrors[index][name] = validateRequired(value);
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const newErrors = medicines.map((medicine) => ({
      name: validateRequired(medicine.name),
      dosage: validateRequired(medicine.dosage),
      frequency: validateRequired(medicine.frequency),
      duration: validateRequired(medicine.duration),
      route: validateRequired(medicine.route),
      instructions: validateRequired(medicine.instructions),
    }));
    setMedicinesErrors(newErrors);

    const hasErrors = newErrors.some((med) =>
      Object.values(med).some((error) => error !== ""),
    );
    return !hasErrors;
  };

  const confirmSubmission = async () => {
    const prescriptionPayLoad = {
      medicines,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/v1/prescriptions/${patientId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(prescriptionPayLoad),
        },
      );

      if (response.status === 401) {
        return handleAuthError();
      }

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to create patient prescription");
        return;
      }

      toast.success(
        result.message || "Patient prescription created successfully",
      );
      navigate("/dashboard/patients", { replace: true });
      setMedicines([
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          route: "",
          instructions: "",
        },
      ]);
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error(
          "Prescription creation failed please try again later, or call the technical team if it persists",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;
    setIsPreviewOpen(true);
  };

  return (
    <form
      method="POST"
      className={`space-y-6 rounded-xl p-6 bg-white shadow-md max-w-4xl  ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-green-600 text-center">
        Create Prescription
      </h2>
      {medicines.map((medicine, index) => (
        <fieldset
          key={index}
          disabled={isSubmitting}
          className="font-semibold text-gray-700"
        >
          <legend className="text-sm font-semibold text-gray-600">
            PrescriptionForm : medicine {index + 1}
          </legend>

          {/* ROW 1*/}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                value={medicine.name}
                id="name"
                name="name"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter the drug name:..."
                onChange={(e) => handleOnChange(index, "name", e.target.value)}
                onBlur={(e) =>
                  handleValidatePrescriptionField(index, "name", e.target.value)
                }
              />
              {medicinesErrors[index]?.name && (
                <p className="text-red-500 text-sm">
                  {medicinesErrors[index]?.name}
                </p>
              )}
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="dosage" className="text-sm font-medium">
                Dosage:{" "}
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={medicine.dosage}
                placeholder="Enter the dosage:..."
                onChange={(e) =>
                  handleOnChange(index, "dosage", e.target.value)
                }
                onBlur={(e) =>
                  handleValidatePrescriptionField(
                    index,
                    "dosage",
                    e.target.value,
                  )
                }
              />
              {medicinesErrors[index]?.dosage && (
                <p className="text-red-700 text-sm">
                  {medicinesErrors[index]?.dosage}
                </p>
              )}
            </div>
          </div>
          {/*ROW 2*/}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="frequency" className="text-sm font-medium">
                Frequency:{" "}
              </label>
              <input
                type="text"
                id="frequency"
                name="frequency"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={medicine.frequency}
                placeholder="eg twice daily"
                onChange={(e) =>
                  handleOnChange(index, "frequency", e.target.value)
                }
                onBlur={(e) =>
                  handleValidatePrescriptionField(
                    index,
                    "frequency",
                    e.target.value,
                  )
                }
              />
              {medicinesErrors[index]?.frequency && (
                <p className="text-red-700 text-sm">
                  {medicinesErrors[index]?.frequency}
                </p>
              )}
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration:{" "}
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={medicine.duration}
                placeholder="Enter the Duration:..."
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  handleOnChange(index, "duration", e.target.value)
                }
                onBlur={(e) =>
                  handleValidatePrescriptionField(
                    index,
                    "duration",
                    e.target.value,
                  )
                }
              />
              {medicinesErrors[index]?.duration && (
                <p className="text-red-700 text-sm">
                  {medicinesErrors[index]?.duration}
                </p>
              )}
            </div>
          </div>

          {/*ROW 3 */}
          <div className="flex flex-col">
            <label htmlFor="route" className="text-sm font-medium">
              Route:{" "}
            </label>
            <input
              type="text"
              id="route"
              name="route"
              value={medicine.route}
              placeholder="eg oral / IV"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => handleOnChange(index, "route", e.target.value)}
              onBlur={(e) =>
                handleValidatePrescriptionField(index, "route", e.target.value)
              }
            />
            {medicinesErrors[index]?.route && (
              <p className="text-red-700 text-sm">
                {medicinesErrors[index]?.route}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instructions:{" "}
            </label>
            <textarea
              rows={5}
              cols={50}
              id="instructions"
              name="instructions"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={medicine.instructions}
              placeholder="Enter the instructions:..."
              onChange={(e) =>
                handleOnChange(index, "instructions", e.target.value)
              }
              onBlur={(e) =>
                handleValidatePrescriptionField(
                  index,
                  "instructions",
                  e.target.value,
                )
              }
            ></textarea>
            {medicinesErrors[index]?.instructions && (
              <p className="text-red-700 text-sm">
                {medicinesErrors[index]?.instructions}
              </p>
            )}
          </div>

          {/*Delete Button */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDeleteMedicine(index)}
              className="px-3 py-3 mt-2 text-sm rounded-md border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition disabled:opacity-50"
            >
              Delete Medicine
            </button>
          </div>
        </fieldset>
      ))}

      {/*Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={handleAddMedicine}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
        >
          Add medicine
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit prescription"}
        </button>
      </div>
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
            <h3 className="text-lg font-bold mb-4">Confirm Prescription</h3>
            {medicines.map((med, index) => (
              <div key={index} className="border-b py-2 text-sm">
                <p>
                  <strong>Name: </strong>
                  {med.name}
                </p>
                <p>
                  <strong>Dosage: </strong>
                  {med.dosage}
                </p>
                <p>
                  <strong>Frequency: </strong>
                  {med.frequency}
                </p>
                <p>
                  <strong>Duration: </strong>
                  {med.duration}
                </p>
                <p>
                  <strong>Route: </strong>
                  {med.route}
                </p>
                <p>
                  <strong>Instructions : </strong>
                  {med.instructions}
                </p>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="border border-green-500 rounded-md px-4 py-1 text-sm bg-green-600 hover:bg-green-700 transition duration-200"
              >
                Edit
              </button>
              <button onClick={confirmSubmission} className="border rounded-md border-blue-500 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 transition duration-200">Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
export default Prescription;

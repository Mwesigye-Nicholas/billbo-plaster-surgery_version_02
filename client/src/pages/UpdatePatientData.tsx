import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { formChangeEvent } from "../types/eventType";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import LoaderSpinner from "../components/ui/Spinner";

interface PatientData {
  patientId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  sex: string;
  dateOfBirth: string;
  email: string;
  diagnosis: string[];
  status: string;
  address: string;
  plannedProcedure: string;
  dateOfSurgery: string;
  dateOfVisit: string;
}

interface PhoneNumber {
  type: string;
  number: string;
}

interface Medicines {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface MedAndSurgicalHx {
  conditions: string[];
  category: string;
  year: string;
  notes: string;
}

const UpdatePatientData = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [patientData, setPatientData] = useState<PatientData>({
    patientId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    dateOfBirth: "",
    email: "",
    diagnosis: [],
    status: "",
    address: "",
    plannedProcedure: "",
    dateOfSurgery: "",
    dateOfVisit: "",
  });

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [medicines, setMedicines] = useState<Medicines[]>([]);
  const [medicalAndSurgicalHistory, setMedicalAndSurgicalHistory] =
    useState<MedAndSurgicalHx>({
      conditions: [],
      category: "",
      year: "",
      notes: "",
    });

  const [serverError, setServerError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //* fetching existing patient Data.

  useEffect(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    const fetchPatient = async () => {
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
          const errorMessage = await response.json();
          toast.error(errorMessage.message || "Failed to fetch patient data");
        }

        setRetryCount(0);
        const data = await response.json();

        const patient = data.data.patientData;
        const latestMedical = patient.medicalData?.[0];

        const nameParts = patient.name?.split(" ") || [];

        setPatientData({
          patientId: patient.patientId,
          firstName: nameParts[0]|| "",
          middleName: nameParts.length > 2 ? nameParts[1] : "",
          lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
          sex: patient.sex || "",
          dateOfBirth: patient.dateOfBirth || "",
          email: patient.email || "",
          address: patient.address || "",
          diagnosis: latestMedical?.diagnosis || [],
          status: latestMedical?.status || "",
          plannedProcedure: latestMedical?.plannedProcedure || "",
          dateOfSurgery: latestMedical?.dateOfSurgery || "",
          dateOfVisit: latestMedical?.dateOfVisit || "",
        });
        setPhoneNumbers(patient?.phoneNumbers || []);
        setMedicines(latestMedical?.medicines || []);
        setMedicalAndSurgicalHistory(
          latestMedical?.medicalAndSurgicalHistory || {
            conditions: [],
            category: "",
            year: "",
            notes: "",
          },
        );
      } catch (error: unknown) {
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
    };
    fetchPatient();
  }, [patientId, accessToken]);

  //* input onChange controllers.
  const handlePatientDataChange = (e: formChangeEvent) => {
    const { name, value } = e.target;

    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (
    index: number,
    field: keyof PhoneNumber,
    value: string,
  ) => {
    setPhoneNumbers((prev) =>
      prev.map((phone, i) =>
        i === index ? { ...phone, [field]: value } : phone,
      ),
    );
  };

  const addPhoneNumber = () => {
    setPhoneNumbers((prev) => [...prev, { type: "", number: "" }]);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof Medicines,
    value: string,
  ) => {
    setMedicines((prev) =>
      prev.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine,
      ),
    );
  };

  const addMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiagnosisChange = (index: number, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      diagnosis: prev.diagnosis.map((d, i) => (i === index ? value : d)),
    }));
  };

  const addDiagnosis = () => {
    setPatientData((prev) => ({
      ...prev,
      diagnosis: [...prev.diagnosis, ""],
    }));
  };

  const removeDiagnosis = (index: number) => {
    setPatientData((prev) => ({
      ...prev,
      diagnosis: prev.diagnosis.filter((_, i) => i !== index),
    }));
  };

  const handleConditionChange = (index: number, value: string) => {
    setMedicalAndSurgicalHistory((prev) => {
      const updatedConditions = [...prev.conditions];
      updatedConditions[index] = value;

      return {
        ...prev,
        conditions: updatedConditions,
      };
    });
  };

  const handleMedicineAndSurgeryHistory = (
    field: keyof MedAndSurgicalHx,
    value: string,
  ) => {
    setMedicalAndSurgicalHistory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addMedicalAndSurgicalCondition = () => {
    setMedicalAndSurgicalHistory((prev) => ({
      ...prev,
      conditions: [...prev.conditions, ""],
    }));
  };

  const removeMedicalAndSurgicalCondition = (index: number) => {
    setMedicalAndSurgicalHistory((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const updatePatient = async () => {
    if (!patientId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/patients/${patientId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: [
              patientData.firstName,
              patientData?.middleName,
              patientData.lastName,
            ]
              .filter((name) => name && name.trim() !== "")
              .join(" "),
            dateOfBirth: patientData.dateOfBirth,
            sex: patientData.sex,
            address: patientData.address,
            email: patientData.email,
            phoneNumbers,
            diagnosis: patientData.diagnosis,
            status: patientData.status,
            plannedProcedure: patientData.plannedProcedure,
            dateOfSurgery: patientData.dateOfSurgery,
            medicines,
            medicalAndSurgicalHistory,
          }),
        },
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(errorMessage || "Failed to update patient Data");
      }

      const responseMessage = await response.json();
      toast.success(responseMessage.message);
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.log("Fetch patient error", error.message);
        toast.error(error.message);
      } else {
        console.log("Unknown error: ", error);
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //* handle submit.
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    try {
      await updatePatient();
      setRetryCount(0);
      navigate("/dashboard/patients", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
        setRetryCount((prev) => prev + 1);
      } else {
        setServerError("An unexpected error occurred");
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //*render states

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }
  if (serverError && !patientData.patientId) {
    return <p className="text-red-600">{serverError}</p>;
  }
  return (
    <div className="w-full px-4 py-6 border-2 border-green-500">
      <h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 text-blue-600 flex justify-center items-center">
        Update Patient Data Page
      </h2>
      <p className="text-center text-red-600 mb-6">
        This patient data will be updated in the data base, once you submit.
      </p>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="max-w-full mx-auto flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          
        <div className="flex flex-col flex-1 gap-4">
          <fieldset className="border rounded-lg p-4 sm:p-6 flex-col gap-4">
            <legend>Patient Bio Data:</legend>

            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="patientId">Patient ID:</label>
              <input
                type="text"
                name="patientId"
                id="patientId"
                placeholder="Enter patient id:..."
                value={patientData.patientId}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter first name:..."
                  size={30}
                  value={patientData.firstName}
                  onChange={handlePatientDataChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="middleName" className="text-sm font-medium">
                  Middle Name:
                </label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  placeholder="Enter middle name:..."
                  size={30}
                  value={patientData.middleName}
                  onChange={handlePatientDataChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter last name:..."
                  size={30}
                  value={patientData.lastName}
                  onChange={handlePatientDataChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="sex" className="font-medium">
                Sex:
              </label>
              <select
                name="sex"
                id="sex"
                value={patientData.sex}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="dateOfBirth" className="font-medium">
                Date Of Birth:
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                placeholder="Enter the Date Of Birth:..."
                value={patientData.dateOfBirth}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="font-medium">
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                size={30}
                value={patientData.address}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-medium">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email:..."
                value={patientData.email}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-4">
              <fieldset className="border rounded-lg sm:p-6 flex flex-col gap-4">
                <legend>Phone Numbers</legend>

                {phoneNumbers.map((phone, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 sm:flex-row items-end"
                  >
                    <div className="flex flex-col flex-1 gap-1">
                      <label htmlFor={`phoneType-${index}`} className="text-sm">
                        Phone Type:
                      </label>
                      <select
                        name={`phoneNumbers[${index}][type]`}
                        id={`phoneType-${index}`}
                        value={phone.type}
                        onChange={(e) =>
                          handlePhoneChange(index, "type", e.target.value)
                        }
                        className="px-3 border rounded-md"
                      >
                        <option value="">Select type</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="mobile">Mobile</option>
                        <option value="emergency">Emergency</option>
                        <option value="relative">Relative</option>
                      </select>
                    </div>

                    <div className="flex flex-col flex-1 gap-1">
                      <label
                        htmlFor={`phoneNumber-${index}`}
                        className="text-sm"
                      >
                        Phone Number:
                      </label>
                      <input
                        type="tel"
                        name={`phoneNumbers[${index}][number]`}
                        id={`phoneNumber-${index}`}
                        placeholder="+256 700 123456"
                        value={phone.number}
                        onChange={(e) =>
                          handlePhoneChange(index, "number", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none"
                      />
                    </div>

                    {phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneNumber(index)}
                        className="px-3 py-2 border rounded-md text-sm self-start sm:self-auto"
                      >
                        Remove Phone Number
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPhoneNumber()}
                  className=" self-start px-4 py-2 border rounded-md text-sm"
                >
                  Add Phone Number
                </button>
              </fieldset>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <fieldset className="border rounded-lg p-4 sm:p-6 flex flex-col gap-4">
            <legend className="font-semibold text-lg">
              Patient Medical Data
            </legend>

            <div className="flex flex-col gap-3">
              <fieldset
                className="border rounded-lg flex flex-col gap-4 sm:p-6
              "
              >
                <legend>Diagnosis:</legend>
                {patientData.diagnosis.map((diag, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <input
                      type="text"
                      name={`diagnosis[${index}]`}
                      id={`diagnosis-${index}`}
                      placeholder="Enter diagnosis"
                      value={diag}
                      onChange={(e) =>
                        handleDiagnosisChange(index, e.target.value)
                      }
                    />

                    {patientData.diagnosis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDiagnosis(index)}
                        className="self-start text-sm"
                      >
                        Remove Diagnosis
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDiagnosis}
                  className="self-start px-4 py-2 border rounded-md"
                >
                  Add Diagnosis
                </button>
              </fieldset>
            </div>

            <div>
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                id="status"
                value={patientData.status}
                onChange={handlePatientDataChange}
              >
                <option value="">Select status</option>
                <option value="waiting">Waiting</option>
                <option value="booked">Booked</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="discharged">Discharged</option>
                <option value="postponed">Postponed</option>
              </select>
            </div>

            <div>
              <label htmlFor="plannedProcedure">Planned Procedure:</label>
              <input
                type="text"
                name="plannedProcedure"
                id="plannedProcedure"
                placeholder="Enter planned procedure"
                value={patientData.plannedProcedure}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="dateOfSurgery">Date of Surgery:</label>
              <input
                type="date"
                name="dateOfSurgery"
                id="dateOfSurgery"
                value={patientData.dateOfSurgery}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="dateOfVisit">Date of Visit:</label>
              <input
                type="date"
                name="dateOfVisit"
                id="dateOfVisit"
                value={patientData.dateOfVisit}
                onChange={handlePatientDataChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div>
              {medicines.map((medicine, index) => (
                <fieldset
                  key={index}
                  className=" border rounded-lg sm:p-6 flex flex-col"
                >
                  <legend>Medicines</legend>

                  <div>
                    <label htmlFor={`medicine-name-${index}`}>
                      Medicine Name:
                    </label>
                    <input
                      type="text"
                      name={`medicines[${index}][name]`}
                      id={`medicine-name-${index}`}
                      placeholder="e.g. Paracetamol"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor={`medicine-duration-${index}`}>
                      Duration:
                    </label>
                    <input
                      type="text"
                      name={`medicines[${index}][duration]`}
                      id={`medicine-duration-${index}`}
                      placeholder="days or weeks or months"
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, "duration", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor={`medicine-frequency-${index}`}>
                      Frequency:
                    </label>
                    <input
                      type="text"
                      name={`medicines[${index}][frequency]`}
                      id={`medicine-frequency-${index}`}
                      placeholder="e.g. Twice daily"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor={`medicine-dosage-${index}`}>Dosage:</label>
                    <input
                      type="text"
                      name={`medicines[${index}][dosage]`}
                      id={`medicine-dosage-${index}`}
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                  </div>
                  {medicines.length > 1 && (
                    <button type="button" onClick={() => removeMedicine(index)}>
                      Remove Medicine
                    </button>
                  )}
                </fieldset>
              ))}
              <button type="button" onClick={addMedicine}>
                Add Medicine
              </button>
            </div>

            <div>
              <fieldset className="border rounded-lg p-4 sm:p-6 flex flex-col gap-4">
                <legend>Medical & Surgical History</legend>
                <div>
                  {medicalAndSurgicalHistory.conditions.map(
                    (condition, index) => (
                      <div key={index}>
                        <label htmlFor={`history-condition-${index}`}>
                          Condition and Surgery:
                        </label>
                        <input
                          type="text"
                          name={`medicalAndSurgicalHistory.conditions[${index}]`}
                          id={`history-condition-${index}`}
                          placeholder="e.g. Diabetes, Appendectomy"
                          value={condition}
                          onChange={(e) =>
                            handleConditionChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />

                        {medicalAndSurgicalHistory.conditions.length > 1 && (
                          <button
                            type="button"
                            className="self-start px-4 py-2 border rounded-md text-sm"
                            onClick={() =>
                              removeMedicalAndSurgicalCondition(index)
                            }
                          >
                            Remove Condition
                          </button>
                        )}
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    className="self-start px-4 py-2 border rounded-md text-sm"
                    onClick={addMedicalAndSurgicalCondition}
                  >
                    Add Condition
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="history-type"
                    className="font-semibold
                  text-sm"
                  >
                    Type:
                  </label>
                  <select
                    name="type"
                    id="history-type"
                    value={medicalAndSurgicalHistory.category}
                    onChange={(e) =>
                      handleMedicineAndSurgeryHistory(
                        "category",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="medical">Medical</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="history-year">Year:</label>
                  <input
                    type="number"
                    name="year"
                    id="history-year"
                    placeholder="e.g. 2018"
                    value={medicalAndSurgicalHistory.year}
                    onChange={(e) =>
                      handleMedicineAndSurgeryHistory("year", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="history-notes">Notes:</label>
                  <textarea
                    name="notes"
                    id="history-notes"
                    rows={5}
                    cols={50}
                    placeholder="Additional details"
                    value={medicalAndSurgicalHistory.notes}
                    onChange={(e) =>
                      handleMedicineAndSurgeryHistory("notes", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  ></textarea>
                </div>
              </fieldset>
            </div>
          </fieldset>
          {serverError && retryCount <= 2 ? (
            <div className="text-red-600 mb-4">
              <p>{serverError}</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-2xl"
              >
                Retry ({retryCount}/3)
              </button>
            </div>
          ) : serverError && retryCount >= 3 ? (
            <div className="bg-red-800 font-bold text-base sm:text-3xl">
              <p>Please, inform the Engineering team!</p>
            </div>
          ) : null}
        </div>
       
        </div>
        <div className="flex justify-center items-center my-4">
         <button
            type="submit"
            className="mt-2 px-4 py-2 border border-blue-700 sm:text-2xl rounded-md text-blue-700 hover:text-white hover:bg-blue-600 transition duration 200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating patient data..." : "Update Patient Data"}
          </button>
         </div>
   
      </form>
      
    </div>
  );
};

export default UpdatePatientData;

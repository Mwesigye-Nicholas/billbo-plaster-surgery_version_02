import { useState } from "react";
import type { formChangeEvent } from "../types/eventType";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "../components/ui/Spinner";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import BASE_API_URL from "../config/api";

interface PatientData {
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

interface MedicalAndSurgicalError {
  conditions: string[];
  category?: string;
  year?: string;
  notes?: string;
}

interface MedicineErrorInterface {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

type medicalAndSurgicalHx = keyof MedAndSurgicalHx;
type medicineFields = keyof Medicines;
type phoneFields = keyof PhoneNumber;
type PatientErrors = Partial<Record<keyof PatientData, string>>;

type PhoneErrors = {
  type?: string;
  number?: string;
};

const CreatePatient = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const {handleAuthError} = useAuth()
  //* Error state variables.

  const [patientErrors, setPatientErrors] = useState<PatientErrors>({});
  const [diagnosisError, setDiagnosisErrors] = useState<string>("");
  const [phoneErrors, setPhoneErrors] = useState<PhoneErrors[]>([
    {
      type: "",
      number: "",
    },
  ]);

  const [medicineError, setMedicineError] = useState<MedicineErrorInterface[]>([
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  ]);

  const [medicalAndSurgicalHistoryError, setMedicalAndSurgicalHistoryError] =
    useState<MedicalAndSurgicalError>({
      conditions: [],
      category: "",
      year: "",
      notes: "",
    });

  //* state variables for inputs.
  const [patientData, setPatientData] = useState<PatientData>({
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

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      type: "",
      number: "",
    },
  ]);

  const [medicines, setMedicines] = useState<Medicines[]>([
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  ]);

  const [medicalAndSurgicalHistory, setMedicalAndSurgicalHistory] =
    useState<MedAndSurgicalHx>({
      conditions: [],
      category: "",
      year: "",
      notes: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    field: phoneFields,
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
    setPhoneErrors((prev) => [...prev, { type: "", number: "" }]);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
    setPhoneErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: medicineFields,
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

  const handleMedicineAndSurgeryHistory = (
    field: medicalAndSurgicalHx,
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

  //* Error controllers for input validation.

  const validateRequired = (value: string) => {
    return value.trim() === "" ? "This field is required" : "";
  };

  const validatePatientField = (name: keyof PatientData, value: string) => {
    const error = validateRequired(value);

    setPatientErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  //* diagnosis in put error handling
  const validateDiagnosis = (values: string[]) => {
    if (values.length == 0) return "At least one diagnosis is required";
    if (values.some((v) => v.trim() === "")) return "Diagnosis cannot be empty";
    return "";
  };

  const validateDiagnosisField = () => {
    const error = validateDiagnosis(patientData.diagnosis);
    setDiagnosisErrors(error);
  };

  //* phone input validation
  const validatePhoneField = (
    index: number,
    field: keyof PhoneNumber,
    value: string,
  ) => {
    setPhoneErrors((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: validateRequired(value),
      };
      return copy;
    });
  };

  // *handle medical and surgical history error onBlur validation:
  const handleMedicalAndSurgicalConditionError = (
    index: number,
    value: string,
  ) => {
    const error = validateRequired(value);

    setMedicalAndSurgicalHistoryError((prev) => {
      const updatedConditionsErrors = [...prev.conditions];

      updatedConditionsErrors[index] = error;
      return {
        ...prev,
        conditions: updatedConditionsErrors,
      };
    });
  };

  const handleOtherErrorsForMedicalAndSurgicalHistory = (
    field: "type" | "year" | "notes",
    value: string,
  ) => {
    const error = validateRequired(value);

    setMedicalAndSurgicalHistoryError((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  //* medicine Error handling
  const handleMedicineError = (
    index: number,
    field: keyof MedicineErrorInterface,
    value: string,
  ) => {
    setMedicineError((prev) => {
      const medicineErrorCopy = [...prev];
      medicineErrorCopy[index] = {
        ...prev[index],
        [field]: validateRequired(value),
      };
      return medicineErrorCopy;
    });
  };

  //* form level validation.
  const validateForm = () => {
    let isValid = true;
    /* * ---------= Patient core fields =-------*/
    const newPatientErrors: PatientErrors = {};

    const requiredPatientFields: (keyof PatientData)[] = [
      "firstName",
      "lastName",
      "sex",
      "dateOfBirth",
      "email",
      "address",
      "status",
      "plannedProcedure",
      "dateOfSurgery",
      "dateOfVisit",
    ];

    requiredPatientFields.forEach((field) => {
      const value = patientData[field] as string;

      const error = validateRequired(value);

      if (error) {
        newPatientErrors[field] = error;
        isValid = false;
      }
    });

    setPatientErrors(newPatientErrors);

    /* * ----------------=  Diagnosis = ---------------- */
    const diagnosisValidationError = validateDiagnosis(patientData.diagnosis);
    setDiagnosisErrors(diagnosisValidationError);

    if (diagnosisValidationError) {
      isValid = false;
    }

    /* * ---------------- = Phone numbers = ---------------- */

    const newPhoneErrors: PhoneErrors[] = phoneNumbers.map((phone) => {
      const errors: PhoneErrors = {};

      const typeError = validateRequired(phone.type);
      const numberError = validateRequired(phone.number);

      if (typeError) {
        errors.type = typeError;
        isValid = false;
      }

      if (numberError) {
        errors.number = numberError;
        isValid = false;
      }
      return errors;
    });

    setPhoneErrors(newPhoneErrors);

    // *---------- = Medical and surgical conditions form submission level error  handling= ---------*

    //* conditions form level validation
    const newMedicalAndSurgicalConditionError =
      medicalAndSurgicalHistory.conditions.map((condition) =>
        validateRequired(condition),
      );

    setMedicalAndSurgicalHistoryError((prev) => ({
      ...prev,
      conditions: newMedicalAndSurgicalConditionError,
    }));

    const hasConditionErrors = newMedicalAndSurgicalConditionError.some(
      (error) => error !== "",
    );

    if (hasConditionErrors) {
      isValid = false;
    }

    //* form level validation of other remaining conditions:

    const typeCopy = medicalAndSurgicalHistory.category;
    const yearCopy = medicalAndSurgicalHistory.year;
    const notesCopy = medicalAndSurgicalHistory.notes;

    const typeErrorValue = validateRequired(typeCopy);
    const yearErrorValue = validateRequired(yearCopy);
    const notesErrorValue = validateRequired(notesCopy);

    if (typeErrorValue !== "") {
      isValid = false;
    }

    if (yearErrorValue !== "") {
      isValid = false;
    }

    if (notesErrorValue !== "") {
      isValid = false;
    }

    setMedicalAndSurgicalHistoryError((prev) => ({
      ...prev,
      type: typeErrorValue,
      year: yearErrorValue,
      notes: notesErrorValue,
    }));

    /* * ---------= medicine form level validation =-------- */

    const allMedicineErrors: MedicineErrorInterface[] = [];

    medicines.forEach((medicine) => {
      const medicineErrors: MedicineErrorInterface = {
        name: validateRequired(medicine.name),
        dosage: validateRequired(medicine.dosage),
        frequency: validateRequired(medicine.frequency),
        duration: validateRequired(medicine.duration),
      };
      allMedicineErrors.push(medicineErrors);
    });

    setMedicineError(allMedicineErrors);

    allMedicineErrors.forEach((medicineError) => {
      Object.values(medicineError).forEach((errorValue) => {
        if (errorValue !== "") {
          isValid = false;
        }
      });
    });
    return isValid;
  };

  const isFormFilled = Object.values(patientData).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    const payload = {
      name: `${patientData.firstName} ${patientData.middleName ?? ""} ${patientData.lastName}`.trim(),
      ...patientData,
      phoneNumbers,
      medicines,
      medicalAndSurgicalHistory: {
        ...medicalAndSurgicalHistory,
        year: Number(medicalAndSurgicalHistory.year),
      },
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/v1/patients`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Form data is valid: ", {
        patientData,
        phoneNumbers,
        medicines,
        medicalAndSurgicalHistory,
      });

      const result = await response.json();
      if (response.status === 401) {
      return handleAuthError();  
      }
      
      if (!response.ok) {
        const errorMessage = result.message;
        toast.error(
          errorMessage.message ||
            "Failed to create patient, please try again later or contact the technical team if error persists",
        );
      }    

      toast.success(result?.message || "Patient created successfully");

      setTimeout(() => {
        navigate("/dashboard/patients", { replace: true });
      }, 1500);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error(
          "Patient creation failed, please try again or call the technical team",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full px-4 py-6 border-2 border-green-500">
      //* overlay LoaderSpinner
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/30  transition-opacity duration-200 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <LoaderSpinner />
          <p className="mt-3 text-sm font-medium text-gray-700">
            Submitting...
          </p>
        </div>
      )}
      <h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 text-blue-600 flex justify-center items-center">
        Create Patient Page
      </h2>
      <form
        method="post"
        onSubmit={handleSubmit}
        className={`max-w-6xl mx-auto flex flex-col sm:flex-row gap-6 transition-opacity duration-200 ${
          isSubmitting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col flex-1 gap-4">
          <fieldset className="border rounded-lg p-4 sm:p-6 flex-col gap-4">
            <legend>Patient Bio Data:</legend>
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
                  onBlur={(e) =>
                    validatePatientField(
                      e.target.name as keyof PatientData,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
                {patientErrors.firstName && (
                  <p className="text-sm text-red-600">
                    {patientErrors.firstName}
                  </p>
                )}
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
                  onBlur={(e) => {
                    if (e.target.name && e.target.value === "") return;
                    validatePatientField(
                      e.target.name as keyof PatientData,
                      e.target.value,
                    );
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
                {patientErrors.middleName && (
                  <p className="text-red-600 text-sm">
                    {patientErrors.middleName}
                  </p>
                )}
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
                  onBlur={(e) =>
                    validatePatientField(
                      e.target.name as keyof PatientData,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
                {patientErrors.lastName && (
                  <p className="text-red-600 text-sm">
                    {patientErrors.lastName}
                  </p>
                )}
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
                onBlur={(e) => validatePatientField("sex", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {patientErrors.sex && (
                <p className="text-red-600 text-sm">{patientErrors.sex}</p>
              )}
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
                onBlur={(e) =>
                  validatePatientField(
                    e.target.name as keyof PatientData,
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
              {patientErrors.dateOfBirth && (
                <p className="text-red-600 text-sm">
                  {patientErrors.dateOfBirth}
                </p>
              )}
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
                onBlur={(e) =>
                  validatePatientField(
                    e.target.name as keyof PatientData,
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
              {patientErrors.address && (
                <p className="text-red-600 text-sm">{patientErrors.address}</p>
              )}
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
                onBlur={(e) =>
                  validatePatientField(
                    e.target.name as keyof PatientData,
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
              {patientErrors.email && (
                <p className="text-red-600 text-sm">{patientErrors.email}</p>
              )}
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
                        onBlur={(e) =>
                          validatePhoneField(index, "type", e.target.value)
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
                      {phoneErrors[index]?.type && (
                        <p className="text-red-600 text-sm">
                          {phoneErrors[index].type}
                        </p>
                      )}
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
                        onBlur={(e) =>
                          validatePhoneField(index, "number", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none"
                      />

                      {phoneErrors[index]?.number && (
                        <p className="text-red-600 text-sm">
                          {phoneErrors[index]?.number}
                        </p>
                      )}
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
                      onBlur={() => validateDiagnosisField()}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
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
              {diagnosisError && (
                <p className="text-sm text-red-600">{diagnosisError}</p>
              )}
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
              {patientErrors.status && (
                <p className="text-red-600 text-sm">{patientErrors.status}</p>
              )}
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
              {patientErrors.plannedProcedure && (
                <p className="text-red-600 text-sm">
                  {patientErrors.plannedProcedure}
                </p>
              )}
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
              {patientErrors.dateOfVisit && (
                <p className="text-red-600 text-sm">
                  {patientErrors.dateOfVisit}
                </p>
              )}
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
                      onBlur={(e) =>
                        handleMedicineError(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                    {medicineError[index]?.name && (
                      <p className="text-red-600">
                        {medicineError[index].name}
                      </p>
                    )}
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
                      onBlur={(e) =>
                        handleMedicineError(index, "duration", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                    {medicineError[index]?.duration && (
                      <p className="text-red-600">
                        {medicineError[index].duration}
                      </p>
                    )}
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
                      onBlur={(e) =>
                        handleMedicineError(index, "frequency", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                    {medicineError[index]?.frequency && (
                      <p className="text-red-600">
                        {medicineError[index].frequency}
                      </p>
                    )}
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
                      onBlur={(e) =>
                        handleMedicineError(index, "dosage", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                    {medicineError[index]?.dosage && (
                      <p className="text-red-600">
                        {medicineError[index].dosage}
                      </p>
                    )}
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
                          onBlur={(e) =>
                            handleMedicalAndSurgicalConditionError(
                              index,
                              e.target.value,
                            )
                          }
                        />
                        {medicalAndSurgicalHistoryError.conditions[index] && (
                          <p>
                            {medicalAndSurgicalHistoryError.conditions[index]}
                          </p>
                        )}
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
                    onBlur={(e) =>
                      handleOtherErrorsForMedicalAndSurgicalHistory(
                        "type",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">Select type</option>
                    <option value="medical">Medical</option>
                  </select>
                  {medicalAndSurgicalHistoryError.category && (
                    <p className="text-sm text-red-600">
                      {medicalAndSurgicalHistoryError.category}
                    </p>
                  )}
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
                    onBlur={(e) =>
                      handleOtherErrorsForMedicalAndSurgicalHistory(
                        "year",
                        e.target.value,
                      )
                    }
                  />
                  {medicalAndSurgicalHistoryError.year && (
                    <p className="text-sm text-red-600">
                      {medicalAndSurgicalHistoryError.year}
                    </p>
                  )}
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
                    onBlur={(e) =>
                      handleOtherErrorsForMedicalAndSurgicalHistory(
                        "notes",
                        e.target.value,
                      )
                    }
                  ></textarea>
                  {medicalAndSurgicalHistoryError.notes && (
                    <p className="text-sm text-red-600">
                      {medicalAndSurgicalHistoryError.notes}
                    </p>
                  )}
                </div>
              </fieldset>
            </div>
          </fieldset>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !isFormFilled}
              className="w-full text-base bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting data...." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreatePatient;

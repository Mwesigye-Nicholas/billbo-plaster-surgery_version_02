import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import LoaderSpinner from "../components/ui/Spinner";
import BASE_API_URL from "../config/api";

interface Patient {
  _id: string;
  name: string;
}

interface ImagesMetaData {
  _id: string;
  fileId: string;
  imageType: string;
  originalFileName?: string;
  sizeInBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  createdAt: string;
  patient: Patient;
}

const PatientImages = () => {
  const { patientId } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imagesMetaData, setImagesMetaData] = useState<ImagesMetaData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagesMetaData | null>(
    null,
  );
  const { handleAuthError } = useAuth();

  {
    /*Delete state */
  }
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  {
    /*Upload state */
  }

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageType, setImageType] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async () => {
    if (files.length === 0 || !patientId) {
      return toast.error("Please select a file");
    }

    if (files.length > 6) {
      return toast.error("Maximum of 6 images allowed");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("imageType", imageType);

    setIsUploading(true);

    try {
      const response = await fetch(
        `${BASE_API_URL}/api/patients/v1/stream/images/${patientId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      console.log("AccessTOken in Upload Image Handler: ", accessToken);

      if (response.status === 401) {
        const result = await response.json();
        console.log("Message from upload images:", result.message);
        return handleAuthError();
      }

      const result = await response.json();
    
      if (!response.ok) {
        return toast.error(result.message || "Patient Image Upload failed");
      }

      setImagesMetaData((prev) => [...result.data, ...prev]);
      toast.success("Image uploaded successfully");

      setFiles([]);
      setPreviews([]);
      setImageType("X-ray");
      setIsUploadOpen(false);
      navigate(`/dashboard/patients`, { replace: true });
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFetchPatientImages = useCallback(async () => {
    if (!patientId) {
      return toast.error("Patient Id is required please");
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}/api/patients/v1/stream/imageMetadata/${patientId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const ErrorMessage = await response.json();
        return toast.error(ErrorMessage || "Failed to fetch patient Images");
      }
      const res = await response.json();
      setImagesMetaData(res.data);
    } catch (error) {
      if (error instanceof Error && error.message) {
        return toast.error(error.message);
      } else {
        return toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, patientId]);

  const handleDeleteImage = async (imageId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/patients/v1/stream/images/${imageId}`,
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
        return toast.error(errorMessage || "Failed to delete patient Image");
      }

      setImagesMetaData((prev) => prev.filter((img) => img._id !== imageId));
      toast.success("Patient's Image deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    handleFetchPatientImages();
  }, [handleFetchPatientImages]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Patient Images
      </h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setIsUploadOpen(true)}
      >
        Upload Image
      </button>
      {imagesMetaData.length === 0 ? (
        <p className="text-gray-500 text-center">
          No images found for patient this patient.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {imagesMetaData.map((imagesInfo) => (
            <div
              key={imagesInfo._id}
              className="flex flex-col w-72 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* image container*/}

              <div className="relative group w-full h-48 bg-gray-100">
                <img
                  src={`${BASE_API_URL}/api/patients/v1/stream/images/${imagesInfo._id}`}
                  alt={imagesInfo.originalFileName || "patient image"}
                  className="w-full h-full object-cover"
                  onClick={() => setSelectedImage(imagesInfo)}
                />

                <button
                  onClick={() => setImageToDelete(imagesInfo._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {/* image meta data */}
              <div className="flex flex-col gap-2 p-4 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Patient:</span>{" "}
                  {imagesInfo.patient.name}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Type:</span>{" "}
                  {imagesInfo.imageType}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Uploaded by:
                  </span>{" "}
                  {imagesInfo.uploadedBy}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Uploaded At:
                  </span>{" "}
                  {new Date(imagesInfo.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image deletion confirmation Box */}
      {imageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this image? This action cannot be
              undone
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 rounded"
                onClick={() => setImageToDelete(null)}
              >
                cancel
              </button>
              <button
                className={`px-3 py-1 bg-red-600 text-white rounded ${isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                onClick={() => {
                  if (!imageToDelete) return;
                  handleDeleteImage(imageToDelete);
                  setImageToDelete(null);
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom in */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 "
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full h-full flex-col flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-blue-700 text-3xl z-50"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={`${BASE_API_URL}/api/patients/v1/stream/images/${selectedImage?._id}`}
              alt="preview"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg"
            />

            {/* Metadata */}
            <div className="text-white mt-4 text-center">
              <p>
                <strong>Patient:</strong> {selectedImage?.patient.name}
              </p>
              <p>
                <strong>Type:</strong> {selectedImage?.imageType}
              </p>
              <p>
                <strong>Uploaded By:</strong> {selectedImage?.uploadedBy}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*Upload Image modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Upload Patient Image</h3>

            {/*File input */}

            <input
              type="file"
              multiple
              id="fileInput"
              accept="image/*"
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                setFiles(selectedFiles);

                const previewUrls = selectedFiles.map((file) =>
                  URL.createObjectURL(file),
                );
                setPreviews(previewUrls);
              }}
              className="mb-4 hidden"
            />
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500
            "
            >
              <p className="text-gray-600 font-medium">
                Click to upload image/s(max:6)
              </p>
            </label>
            <div className="flex flex-wrap gap-2 mb-4 p-3">
              {previews.map((src, index) => (
                <img
                  src={src}
                  key={index}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}

              <p>{files.length} files(s) selected</p>
            </div>

            {/* Image Type*/}
            <select
              name=""
              id=""
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full mb-4 border px-2 py-1 rounded"
            >
              <option value="" disabled>
                Chose Image Type
              </option>
              <option value="X-ray">X-ray</option>
              <option value="CT-Scan">CT-Scan</option>
              <option value="MRI">MRI</option>
              <option value="Other">Other</option>
            </select>

            {/*Action */}
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                onClick={() => setIsUploadOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadImage}
                disabled={isUploading}
                className={`px-3 py-1 rounded text-white ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PatientImages;

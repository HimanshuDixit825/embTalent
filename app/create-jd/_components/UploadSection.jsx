"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { uploadPdf } from "@/lib/supabase";
import PdfViewer from "./PdfViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import {
  addMustHaveSkill,
  addGoodToHaveSkill,
  clearSkills,
  setAnalyzing,
  selectAnalyzing,
} from "@/app/store/techSlice";
export default function UploadSection() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const dispatch = useDispatch();
  const analyzing = useSelector(selectAnalyzing);
  const router = useRouter();
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      try {
        setUploading(true);
        setError(null);
        dispatch(clearSkills());
        dispatch(setAnalyzing(true));
        // Create FormData
        const formData = new FormData();
        formData.append("file", file);
        // Upload to Supabase first
        const publicUrl = await uploadPdf(file);
        setPdfUrl(publicUrl);
        // Create initial record if no token exists
        const temporary_token = localStorage.getItem("recruitment_flow_token");
        if (!temporary_token) {
          const createResponse = await fetch("/api/lead-line-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jd_filename: file.name,
              jd_fileurl: publicUrl,
            }),
          });
          if (!createResponse.ok) {
            throw new Error("Failed to create initial record");
          }
          const {
            data: { temporary_token: newToken },
          } = await createResponse.json();
          localStorage.setItem("recruitment_flow_token", newToken);
        }
        // Send for analysis
        const response = await fetch("/api/analyze-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to analyze PDF");
        }
        if (!data.analysis?.skills) {
          throw new Error("Invalid analysis response");
        }
        // Add skills to store
        const { mustHave = [], goodToHave = [] } = data.analysis.skills;
        mustHave.forEach((skill) => dispatch(addMustHaveSkill(skill)));
        goodToHave.forEach((skill) => dispatch(addGoodToHaveSkill(skill)));
        // Get current token (which might be new if we just created it)
        const currentToken = localStorage.getItem("recruitment_flow_token");
        if (currentToken) {
          // Update record with JD details
          const updateResponse = await fetch("/api/lead-line-item", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              temporary_token: currentToken,
              jd_filename: file.name,
              jd_fileurl: publicUrl,
              must_have: mustHave,
              good_to_have: goodToHave,
            }),
          });
          if (!updateResponse.ok) {
            throw new Error("Failed to update record with JD details");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "An unexpected error occurred");
        setPdfUrl(null); // Clear PDF URL if there's an error
        dispatch(clearSkills()); // Clear skills if there's an error
      } finally {
        setUploading(false);
        dispatch(setAnalyzing(false));
      }
    },
    [dispatch]
  );
  const onDropRejected = useCallback((rejectedFiles) => {
    const file = rejectedFiles[0];
    if (file.errors[0]?.code === "file-too-large") {
      setError("File is too large. Maximum size is 10MB.");
    } else if (file.errors[0]?.code === "file-invalid-type") {
      setError("Only PDF files are supported.");
    } else {
      setError("Invalid file. Please try again.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || analyzing,
  });
  const handleBack = () => {
    setPdfUrl(null);
  };
  if (pdfUrl && !error && !uploading && !analyzing) {
    return <PdfViewer url={pdfUrl} onBack={handleBack} />;
  }
  return (
    <div className="w-full h-[calc(100vh-6rem)]  rounded-lg flex flex-col p-6">
      {/* Header */}
      <div className="bg-[#3C3C3C] p-5 rounded-lg">
        <div className="flex items-center justify-center gap-4 mb-8 ">
          <div>
            <h1 className="text-white text-2xl font-inter font-[20px]">
              Upload Files
            </h1>
          </div>
        </div>
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`w-full bg-[#646464] rounded-lg  mb-4 ${
            uploading || analyzing ? "opacity-50 cursor-not-allowed" : ""
          } ${
            isDragActive
              ? "border-blue-500 border"
              : "border border-spacing-6 border-dashed border-white"
          }`}
        >
          <div className="text-center p-8 rounded-lg">
            <input {...getInputProps()} disabled={uploading || analyzing} />
            {uploading || analyzing ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner />
                <p className="text-white mb-1 text-[14px]">
                  {analyzing ? "Analyzing PDF..." : "Uploading PDF..."}
                </p>
                <p className="text-gray-400 text-[12px]">
                  This may take a few moments
                </p>
              </div>
            ) : (
              <>
                <p className="text-white mb-2 text-sm">
                  {isDragActive ? "Drop files here" : "Drop files here"}
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  Supported format: PDF, DOCX
                </p>
                <p className="text-gray-400 text-xs mb-2">OR</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Browse files
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* OR Divider */}
      <div className="flex items-center justify-center my-4">
        <div className="border-t border-gray-600 flex-grow"></div>
        <span className="px-4 text-gray-400 text-sm">OR</span>
        <div className="border-t border-gray-600 flex-grow"></div>
      </div>
      {/* Create from scratch button */}
      <button
        onClick={() => router.push("/chat")}
        className="w-full bg-[#3C3C3C] text-white p-4 rounded-lg hover:bg-[#4C4C4C] transition-colors cursor-pointer"
      >
        Create from scratch
      </button>
      {error && (
        <div className="mt-4 w-full bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-lg text-sm flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

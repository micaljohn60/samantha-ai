"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import InfoFormColumn from "@/components/InfoFrom";
import Message from "@/components/ui/Message/Message";

export default function Dashboard() {
  // PDF & file state
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [s3Key, setS3Key] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Form & extraction state
  const [formData, setFormData] = useState<any>({});
  const [isExtracted, setIsExtracted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // UI messages
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // ----------------------
  // Handle PDF Upload
  // ----------------------
  const handleUploadComplete = async (
    uploadedFileUrl: string,
    uploadedS3Key: string,
    uploadedFileName: string,
  ) => {
    setFileUrl(uploadedFileUrl);
    setS3Key(uploadedS3Key);
    setFileName(uploadedFileName);
    setIsExtracting(true);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: uploadedFileUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      // Convert raw text to object
      const extracted: Record<string, string> = {};
      data.extractedText.split("\n").forEach((line: string) => {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) extracted[key.trim()] = rest.join(":").trim();
      });

      setFormData(extracted);
      setIsExtracted(true);
      setMessage({ text: "Document Extracted Successfully", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({
        text: "Extraction failed: " + (err as Error).message,
        type: "error",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // ----------------------
  // Handle Save / Submit
  // ----------------------
  const handleSaveDocument = async () => {
    if (!fileUrl && !isEditMode) {
      return setMessage({ text: "Please upload a PDF", type: "error" });
    }

    // Format date
    let formattedDate: string | null = null;
    if (formData.date_of_report) {
      const date = new Date(formData.date_of_report);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split("T")[0];
      } else {
        const parts = formData.date_of_report.split("/");
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
      }
    }

    const payload = { ...formData, date_of_report: formattedDate };
    if (!isEditMode) {
      payload.s3_key = s3Key;
      payload.s3_url = fileUrl;
      payload.file_name = fileName;
    }

    try {
      const apiUrl = isEditMode
        ? `/api/documents/${formData.id}`
        : "/api/save_data";
      const res = await fetch(apiUrl, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      setMessage({
        text: isEditMode
          ? "Document updated successfully!"
          : "Document saved successfully!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: "Operation Failed: " + (err as Error).message,
        type: "error",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Message */}
      {message && (
        <Message
          text={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <main className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left column: PDF uploader */}
        <PdfUploader
          setPdfBuffer={() => {}}
          setPdfUrl={setFileUrl}
          isExtracting={isExtracting}
          onUploadComplete={handleUploadComplete}
          onDocumentSelected={(docData) => {
            setFormData(docData);
            setIsExtracted(true);
            setIsEditMode(true);
          }}
          onReset={() => {
            setFormData({});
            setIsEditMode(false);
            setFileUrl(null);
            setFileName(null);
            setS3Key(null);
            setIsExtracted(false);
          }}
        />

        {/* Right column: Form */}
        <InfoFormColumn
          isExtracted={isExtracted}
          isEditMode={isEditMode}
          data={formData}
          setData={setFormData}
          onSave={handleSaveDocument}
        />
      </main>
    </div>
  );
}

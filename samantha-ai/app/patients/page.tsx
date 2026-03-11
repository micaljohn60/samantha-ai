"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";

interface Document {
  document_id: number;
  document_subject: string;
  date_of_report: string;
  s3_key: string;
  gp_name: string;
}

interface Patient {
  patient_id: number;
  full_name: string;
  documents: Document[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch(`/api/patients-documents?page=${page}&limit=12`);
      const json = await res.json();

      if (json.success) {
        setPatients(json.data);
        setTotalPages(json.pagination.totalPages);
      }
    };

    fetchPatients();
  }, [page]);

  // ESC key close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPatient(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDocumentClick = (s3Key: string) => {
    const pdfUrl = `/api/files/${encodeURIComponent(s3Key)}`;
    window.open(pdfUrl, "_blank");
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      {/* PAGE */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 flex  justify-center p-6">
        <div className="w-full max-w-6xl h-[80vh] bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">Patients</h1>
            <p className="text-slate-500 mt-2">
              Manage patient records and medical documents
            </p>
          </div>

          {/* Scrollable Grid Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {patients.map((p) => (
                <div
                  key={p.patient_id}
                  onClick={() => setSelectedPatient(p)}
                  className="bg-white/70 backdrop-blur-lg border border-slate-200
                       rounded-2xl shadow-md hover:shadow-xl
                       transition-all duration-300 
                       hover:-translate-y-1 cursor-pointer p-6"
                >
                  <h2 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition">
                    {p.full_name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    {p.documents?.length || 0} document(s)
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination fixed at bottom of card */}
          <div className="flex justify-center items-center gap-4 pt-6 border-t mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-slate-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            {/* Patient Info */}
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {selectedPatient.full_name}
            </h2>

            <p className="text-slate-500 mb-6">
              {selectedPatient.documents?.length || 0} document(s)
            </p>

            {/* Documents */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {selectedPatient.documents &&
              selectedPatient.documents.length > 0 ? (
                selectedPatient.documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    onClick={() => handleDocumentClick(doc.s3_key)}
                    className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">
                        {doc.document_subject}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(doc.date_of_report)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      GP:{" "}
                      <span className="font-medium text-slate-800">
                        {doc.gp_name || "Not recorded"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No documents available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

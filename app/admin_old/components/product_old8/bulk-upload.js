"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";


export default function BulkUploadPage() {
  const [excelFile, setExcelFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);
  const [overviewZip, setOverviewZip] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file, allowedExtensions) => {
    if (!file) return false;
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some((ext) => fileName.endsWith(ext));
  };
  useEffect(() => {
    import("react-toastify/dist/ReactToastify.css");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required files
    if (!excelFile || !validateFile(excelFile, [".xlsx", ".csv"])) {
      toast.error("Please upload a valid Excel (.xlsx) or CSV (.csv) file.");
      return;
    }

    if (!imageZip || !validateFile(imageZip, [".zip"])) {
      toast.error("Please upload a valid .zip file for product images.");
      return;
    }

    // Validate optional Overview ZIP file
    if (overviewZip && !validateFile(overviewZip, [".zip"])) {
      toast.error("Please upload a valid .zip file for overview images.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("images", imageZip);
    if (overviewZip) formData.append("overview", overviewZip);

    try {
      const response = await fetch("/api/product/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Product Upload</h1>
        <p className="text-gray-600">Upload products in bulk using Excel/CSV and ZIP files</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-8">
        {/* Excel File Section */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel/CSV File
            </h3>
            <p className="text-sm text-gray-500 mt-1">Upload your product data file</p>
          </div>
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              
            />
            <Link
              href="/uploads/files/test_upload.xlsx"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Sample Format
            </Link>
          </div>
        </div>

        {/* Product Images Section */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Product Images (ZIP)
            </h3>
            <p className="text-sm text-gray-500 mt-1">Upload compressed product images</p>
          </div>
          <div className="space-y-4">
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setImageZip(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              
            />
            <Link
              href="/uploads/files/Sample.zip"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Sample ZIP
            </Link>
          </div>
        </div>

        {/* Overview Images Section */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Overview Images (ZIP)
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">Upload additional overview images</p>
          </div>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setOverviewZip(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <Link
            href="/admin/product"
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Start Upload'
            )}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  </div>
  );
}

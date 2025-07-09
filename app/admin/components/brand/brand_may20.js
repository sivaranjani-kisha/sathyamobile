"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Icon } from '@iconify/react';

export default function BrandComponent() {
  const [brand, setBrand] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newBrand, setNewBrand] = useState({
    brand_name: "",
    status: "Active",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Fetch categories from API
  const fetchBrand = async () => {
    try {
      const response = await fetch("/api/brand");
      const data = await response.json();
      setBrand(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching brand:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewBrand({ ...newBrand, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBrand((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle category submission
  const handleAddBrand = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("brand_name", newBrand.brand_name);
    formData.append("status", newBrand.status);
    if (newBrand.image) {
      formData.append("image", newBrand.image);
    }

    try {
      const response = await fetch("/api/brand/add", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        fetchBrand();
        setNewBrand({
          brand_name: "",
          status: "Active",
          image: null,
        });
        setImagePreview(null);
      } else {
        console.error("Error adding brand:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle category deletion
  const handleDeleteBrand = async (brandId) => {
    try {
      const response = await fetch("/api/brand/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Brand Deleted Successfully");
        setShowSuccessModal(true);
        fetchBrand();
      } else {
        console.error("Error:", result.error);
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    } finally {
      setShowConfirmationModal(false);
      setBrandToDelete(null);
    }
  };

  const flattenCategories = (brand, parentId = "none", level = 0, result = []) => {
    brand.forEach((category) => {
      result.push({ ...category, level });
    });
    return result;
  };

  // Render category rows with pagination
  const renderBrandRows = () => {
    const flattenedCategories = flattenCategories(brand);
    const filteredCategories = flattenedCategories.filter((brand) =>
      brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.brand_slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredCategories
      .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
      .map((brand, index) => (
        <tr key={brand._id} className="text-center border-b">
          <td className="p-2">{brand.brand_name}</td>
          <td className="p-2">{brand.brand_slug}</td>
          <td className="p-2">
            {brand.image ? (
              <img src={`/uploads/brands/${brand.image}`} alt="brand" className="h-7 mx-auto" />
            ) : (
              "No Image"
            )}
          </td>
          <td className="p-2 font-semibold">
            {brand.status === "Active" ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </td>
          <td>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => {
                  setBrandToDelete(brand._id);
                  setShowConfirmationModal(true);
                }}
                className="w-7 h-7 bg-pink-100 text-pink-600 rounded-full inline-flex items-center justify-center"
                title="Delete"
              >
                <Icon icon="mingcute:delete-2-line" />
              </button>
            </div>
          </td>
        </tr>
      ));
  };

  const flattenedCategories = flattenCategories(brand);
  const filteredCategories = flattenedCategories.filter((brand) =>
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.brand_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);
  const totalEntries = filteredCategories.length;
  const startEntry = currentPage * itemsPerPage + 1;
  const endEntry = Math.min((currentPage + 1) * itemsPerPage, totalEntries);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5 mt-5">
        <h2 className="text-2xl font-bold">Brand List</h2>
        {/* <div className="flex items-center space-x-2">
          <Icon icon="solar:home-smile-angle-outline" className="w-6 h-6 text-gray-700" />
          <span className="text-lg font-semibold">Dashboard - Brand</span>
        </div> */}
      </div>

      {isLoading ? (
        <p>Loading Brands...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
          {/* Search and Add Brand Row */}
          <div className="flex justify-between items-center mb-5">
            {/* Search Box */}
            <div>
              <input
                type="text"
                placeholder="Search Brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-2 rounded-md w-64"
              />
            </div>

            {/* Add Brand Button */}
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                + Add brand
              </button>
            </div>
          </div>
          <hr className="border-t border-gray-200 mb-4" />
          
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Brand Name</th>
                <th className="p-2">Brand Slug</th>
                <th className="p-2">Image</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                renderBrandRows()
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            {/* Left side: Entry text */}
            <div className="text-sm text-gray-600">
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>

            {/* Right side: Pagination */}
            <ReactPaginate
              previousLabel={"«"}
              nextLabel={"»"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"flex items-center space-x-1"}
              activeClassName={"bg-blue-500 text-white"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
              }
              previousClassName={"page-item"}
              previousLinkClassName={
                "px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
              }
              nextClassName={"page-item"}
              nextLinkClassName={
                "px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
              }
              breakClassName={"page-item"}
              breakLinkClassName={
                "px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black"
              }
            />
          </div>
        </div>
      )}

      {/* Modal for Adding Brand */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center border-b-2 border-gray-300 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Brand</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="px-6 py-6 overflow-y-auto flex-grow">
              <form onSubmit={handleAddBrand} className="space-y-5">
                {/* Brand Name */}
                <div>
                  <label htmlFor="brand_name" className="block mb-1 text-sm font-semibold text-gray-700">
                    Brand Name
                  </label>
                  <input
                    name="brand_name"
                    value={newBrand.brand_name}
                    onChange={handleInputChange}
                    id="brand_name"
                    className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Brand Name"
                    required
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Upload Image</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600
                      file:mr-3 file:py-1 file:px-3
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                    "
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 h-16 rounded-md object-contain mx-auto"
                    />
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block mb-1 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={newBrand.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Add Brand
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Brand</h2>
            <p className="mb-4">Are you sure you want to delete this Brand?</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                No, Close
              </button>
              <button
                onClick={() => handleDeleteBrand(brandToDelete)}
                className="bg-red-500 px-4 py-2 rounded-md text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p className="mb-4">{successMessage}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-500 px-4 py-2 rounded-md text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
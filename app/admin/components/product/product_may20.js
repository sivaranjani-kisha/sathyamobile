"use client";

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function ProductComponent() { // Changed from CategoryComponent to ProductComponent
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product/get");
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle product deletion 
  const handleDeleteProduct = async (productId) => { // Changed parameter name from categoryId to productId
    try {
      const response = await fetch("/api/product/delete", { // Changed API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }), // Changed from categoryId to productId
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Product has been deleted successfully.");
        setShowSuccessModal(true);
        fetchProducts();
      } else {
        console.error("Error:", result.error);
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    } finally {
      setShowConfirmationModal(false);
      setProductToDelete(null);
    }
  };

  // Flatten product list for pagination
  const flattenProducts = (products, result = []) => {
    products
      .filter((product) => product.item_code !== 'none')
      .forEach((product) => {
        result.push(product);
      });
    return result;
  };

  // Filter products based on search query
  const filteredProducts = flattenProducts(products).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.slug && product.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination calculations
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalEntries = filteredProducts.length;
  const startEntry = currentPage * itemsPerPage + 1;
  const endEntry = Math.min((currentPage + 1) * itemsPerPage, totalEntries);

  // Render product rows with pagination
  const renderProductRows = () => {
    return filteredProducts
      .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
      .map((product) => (
        <tr key={product._id} className="text-center border-b">
          <td className="p-2 font-bold flex items-center justify-center">
            {product.name.length > 30 ? `${product.name.slice(0, 30)}...` : product.name}
          </td>
          <td className="p-2">{product.price}</td>
          <td className="p-2">{product.special_price}</td>
          <td className="p-2">{product.quantity}</td>
          <td className="p-2">
            {product.hasVariants ? (
              product.variants && product.variants[0]?.attributes?.length ? (
                <span className="text-green-500">{product.variants[0].attributes.length}</span>
              ) : (
                <span className="text-red-500">No attributes</span>
              )
            ) : (
              <span className="text-red-500">0 variants</span>
            )}
          </td>
          <td className="p-2 font-semibold">
            {product.status === "Active" ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </td>
          <td>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => {
                  setProductToDelete(product._id);
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

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5 mt-5">
        <h2 className="text-2xl font-bold">Product List</h2>
      </div>

      {isLoading ? (
        <p>Loading Products...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
          <div className="flex justify-between items-center mb-5">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-2 rounded-md w-64"
            />
            <div className="flex gap-4">
              <Link href="/admin/product/create" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                + Add Product
              </Link>
            </div>
          </div>
          
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Spl Price</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Inventory</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                renderProductRows()
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No Products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>

            <ReactPaginate
              previousLabel={"«"}
              nextLabel={"»"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"flex items-center space-x-1"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "px-3 py-1.5 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100"
              }
              activeClassName={"bg-blue-500 text-white"}
              activeLinkClassName={"!bg-blue-500 !text-white"}
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p className="mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                No, Close
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete)}
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
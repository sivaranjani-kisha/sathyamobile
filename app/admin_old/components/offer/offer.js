"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Select from "react-select";

export default function OfferComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [selectedOfferType, setSelectedOfferType] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offerData, setOfferData] = useState({
    offer_code: "",
    fest_offer_status: "",
    notes: "",
    from_date: "",
    to_date: "",
    offer_product_category: "",
    offer_product: [],
    offer_category: [],
    offer_type: "",
    percentage: "",
    fixed_price: "",
  });

  // Search and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const CategoryTree = ({ 
    categories, 
    products, 
    handleChange, 
    offerData 
  }) => {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (categoryId) => {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    };

    const buildTree = (categories, parentId = "none") => {
      return categories
        .filter((category) => category.parentid === parentId)
        .map((category) => ({
          ...category,
          children: buildTree(categories, category._id),
        }));
    };

    const categoryTree = buildTree(categories);

    const renderCategoryTree = (categories, level = 0) => {
      return categories.map((category) => (
        <div key={category._id} className={`ml-${level * 4} p-1`}>
          <div className="flex items-center cursor-pointer">
            {category.children.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category._id);
                }}
                className="mr-2 text-blue-500"
              >
                {expandedCategories[category._id] ? <FaMinus /> : <FaPlus />}
              </button>
            )}
            <input
              type="checkbox"
              name="offer_category"
              value={category._id}
              checked={offerData.offer_category.includes(category._id)}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="font-semibold">{category.category_name}</span>
          </div>
          {expandedCategories[category._id] && (
            <>
              {renderCategoryTree(category.children, level + 1)}
            </>
          )}
        </div>
      ));
    };

    return <div className="border p-2 rounded-md">{renderCategoryTree(categoryTree)}</div>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch("/api/product/get");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories/get");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch offers
        const offersResponse = await fetch("/api/offers/get");
        if (!offersResponse.ok) {
          throw new Error("Failed to fetch offers");
        }
        const offersData = await offersResponse.json();
        setOffers(offersData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertMessage("Failed to fetch data");
        setAlertType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "offer_category") {
        const categoryId = value;
        const allCategories = getAllSubcategories(categoryId);

        setOfferData((prev) => ({
          ...prev,
          offer_category: checked
            ? [...prev.offer_category, ...allCategories]
            : prev.offer_category.filter((item) => !allCategories.includes(item)),
        }));
      }
    } else {
      setOfferData({ ...offerData, [name]: value });
    }
  };
  const handleDelete = async (offerId) => {
    try {
      const response = await fetch("/api/offers/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete offer");
      }

      setAlertMessage("Offer deleted successfully!");
      setAlertType("success");
      setTimeout(() => setAlertMessage(""), 3000);

      // Refresh offers list after deletion
      const offersResponse = await fetch("/api/offers/get");
      if (!offersResponse.ok) {
        throw new Error("Failed to refresh offers list");
      }
      const offersData = await offersResponse.json();
      setOffers(offersData.data);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(error.message || "Failed to delete offer");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };
  const getAllSubcategories = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) return [categoryId];

    const subcategories = categories
      .filter((cat) => cat.parentid === categoryId)
      .flatMap((cat) => getAllSubcategories(cat._id));

    return [categoryId, ...subcategories];
  };

  const validateForm = () => {
    if (!offerData.offer_product_category) {
      setAlertMessage("Please select whether to apply to products or categories");
      setAlertType("error");
      return false;
    }

    if (offerData.offer_product_category === "product" && offerData.offer_product.length === 0) {
      setAlertMessage("Please select at least one product");
      setAlertType("error");
      return false;
    }

    if (offerData.offer_product_category === "category" && offerData.offer_category.length === 0) {
      setAlertMessage("Please select at least one category");
      setAlertType("error");
      return false;
    }

    if (!offerData.offer_type) {
      setAlertMessage("Please select an offer type");
      setAlertType("error");
      return false;
    }

    if (offerData.offer_type === "percentage" && !offerData.percentage) {
      setAlertMessage("Please enter a percentage value");
      setAlertType("error");
      return false;
    }

    if (offerData.offer_type === "fixed_price" && !offerData.fixed_price) {
      setAlertMessage("Please enter a fixed price");
      setAlertType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    try {
      const formattedData = {
        ...offerData,
        from_date: new Date(offerData.from_date),
        to_date: new Date(offerData.to_date),
      };

      const response = await fetch("/api/offers/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      setAlertMessage("Offer created successfully!");
      setAlertType("success");
      setTimeout(() => setAlertMessage(""), 3000);

      setIsModalOpen(false);
      setOfferData({
        offer_code: "",
        fest_offer_status: "",
        notes: "",
        from_date: "",
        to_date: "",
        offer_product_category: "",
        offer_product: [],
        offer_category: [],
        offer_type: "",
        percentage: "",
        fixed_price: "",
      });

      // Refresh offers list
      const offersResponse = await fetch("/api/offers/get");
      if (!offersResponse.ok) {
        throw new Error("Failed to refresh offers list");
      }
      const offersData = await offersResponse.json();
      setOffers(offersData.data);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(error.message || "Failed to create offer");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  // Search functionality
  const filteredOffers = offers.filter((offer) =>
    offer.offer_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-bold">Offer List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          + Add Offer
        </button>
      </div>
      {alertMessage && (
        <div
          className={`mb-4 p-3 rounded-md ${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {alertMessage}
        </div>
      )}
      <div className="flex justify-start mb-5">
        <input
          type="text"
          placeholder="Search Offer..."
          className="border px-3 py-2 rounded-md w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Loading offers...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Offer Code</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Type</th>
                <th className="p-2">Value</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((offer) => (
                  <tr key={offer._id} className="text-center border-b">
                    <td className="p-2 font-bold">{offer.offer_code}</td>
                    <td className="p-2">{offer.from_date.split("T")[0]}</td>
                    <td className="p-2">{offer.to_date.split("T")[0]}</td>
                    <td className="p-2">{offer.offer_type}</td>
                    <td className="p-2">
                      {offer.offer_type === "percentage"
                        ? `${offer.percentage}%`
                        : `₹${offer.fixed_price}`}
                    </td>
                    <td className="p-2 font-semibold">
                      {offer.fest_offer_status === "active" ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-500">Inactive</span>
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-3 text-center">
                    No offers available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded mx-1 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {Array.from(
              { length: Math.ceil(filteredOffers.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-2 border rounded mx-1 ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredOffers.length / itemsPerPage)}
              className={`px-3 py-2 border rounded mx-1 ${
                currentPage === Math.ceil(filteredOffers.length / itemsPerPage)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 top-0 bg-white p-2 z-10">
              <h3 className="text-lg font-semibold">Create Festival Offer</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500"
              >
                ✖
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Offer Code</label>
                <input
                  type="text"
                  name="offer_code"
                  value={offerData.offer_code}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Offer Status</label>
                <select
                  name="fest_offer_status"
                  value={offerData.fest_offer_status}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select Your Offer Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Note</label>
                <input
                  type="text"
                  name="notes"
                  value={offerData.notes}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700">From Date</label>
                  <input
                    type="date"
                    name="from_date"
                    value={offerData.from_date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    value={offerData.to_date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Apply Offer To</label>
                <select
                  name="offer_product_category"
                  value={offerData.offer_product_category}
                  onChange={(e) => {
                    handleChange(e);
                    // Clear existing selections when changing type
                    setOfferData(prev => ({
                      ...prev,
                      offer_product: [],
                      offer_category: [],
                      [e.target.name]: e.target.value
                    }));
                  }}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select Apply To</option>
                  <option value="product">Specific Products</option>
                  <option value="category">Product Categories</option>
                </select>
              </div>

              {/* Show products selection only when "Specific Products" is selected */}
              {offerData.offer_product_category === "product" && (
                <div>
                  <label className="block text-gray-700">Select Products</label>
                  <Select
                    options={products.map(product => ({
                      value: product._id,
                      label: product.name
                    }))}
                    isMulti
                    placeholder="Search and select products..."
                    value={offerData.offer_product.map(p => ({
                      value: p,
                      label: products.find(prod => prod._id === p)?.name || p
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(option => option.value);
                      setOfferData(prev => ({
                        ...prev,
                        offer_product: selectedValues
                      }));
                    }}
                    className="mt-2"
                  />
                </div>
              )}

              {/* Show category tree only when "Product Categories" is selected */}
              {offerData.offer_product_category === "category" && (
                <div>
                  <label className="block text-gray-700">Select Categories</label>
                  <CategoryTree 
                    categories={categories} 
                    products={products} 
                    handleChange={handleChange} 
                    offerData={offerData}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700">Offer Type</label>
                <select
                  name="offer_type"
                  value={offerData.offer_type}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedOfferType(e.target.value);
                  }}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select Offer Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed_price">Fixed Price</option>
                </select>
              </div>
              {selectedOfferType === "percentage" && (
                <div>
                  <label className="block text-gray-700">Percentage (%)</label>
                  <input
                    type="number"
                    name="percentage"
                    value={offerData.percentage}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                    min="1"
                    max="100"
                  />
                </div>
              )}
              {selectedOfferType === "fixed_price" && (
                <div>
                  <label className="block text-gray-700">Fixed Price (₹)</label>
                  <input
                    type="number"
                    name="fixed_price"
                    value={offerData.fixed_price}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                    min="1"
                  />
                </div>
              )}
              <div className="text-right sticky bottom-0 bg-white p-2 z-10">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";

// ✅ Custom option with checkbox
const Option = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        className="mr-2"
      />
      {props.label}
    </components.Option>
  );
};

// ✅ Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Status Notification Modal Component
const StatusModal = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  // Set styles based on notification type
  const bgColor = type === "success" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const icon = type === "success" ? "✅" : "❌";

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`${bgColor} ${textColor} border px-6 py-4 rounded-lg shadow-lg max-w-sm flex items-start`}>
        <span className="mr-2 text-xl">{icon}</span>
        <p className="flex-1">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
    </div>
  );
};

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState({});
  const [existingCategoryProducts, setExistingCategoryProducts] = useState({});
  const [mode, setMode] = useState({}); // 'add' or 'edit' mode for each category
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, message: "", type: "" });
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategoriesByParent, setSubcategoriesByParent] = useState({});
const MultiValueLabel = (props) => (
  <components.MultiValueLabel {...props}>
    <span title={props.data.label}>{props.data.label}</span>
  </components.MultiValueLabel>
);
  // ✅ Show status modal
  const showStatusModal = (message, type = "success") => {
    setStatusModal({ isOpen: true, message, type });
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setStatusModal({ isOpen: false, message: "", type: "" });
    }, 3000);
  };

  // ✅ Close status modal manually
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, message: "", type: "" });
  };

  // ✅ Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories/get");
        const data = await res.json();
        setCategories(data);
        
        // Only get ACTIVE parent categories (parentid === "none" AND status === "Active")
        const mainCats = data.filter(cat => 
          cat.parentid === "none" && cat.status === "Active"
        );
        setMainCategories(mainCats);
        
        // Create a map of parent categories to their ACTIVE direct children
        const subcategoriesMap = {};
        data.forEach(category => {
          if (category.parentid !== "none" && category.status === "Active") {
            if (!subcategoriesMap[category.parentid]) {
              subcategoriesMap[category.parentid] = [];
            }
            subcategoriesMap[category.parentid].push(category);
          }
        });
        
        setSubcategoriesByParent(subcategoriesMap);
        
      } catch (err) {
        console.error("Error fetching categories:", err);
        showStatusModal("Error fetching categories", "error");
      }
    }
    fetchCategories();
  }, []);

  // ✅ Fetch products - only active and in stock
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product/get");
        const data = await res.json();
        
        // Filter only active and in-stock products
        const activeProducts = data.filter(p => 
          p.status === "Active" && p.stock_status === "In Stock"
        );
        
        setProducts(activeProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        showStatusModal("Error fetching products", "error");
      }
    }
    fetchProducts();
  }, []);

  // ✅ Fetch existing category products
  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const res = await fetch("/api/categoryproduct/get");
        const data = await res.json();
        
        // Organize by categoryId
        const organizedData = {};
        data.forEach(item => {
          organizedData[item.subcategoryId] = item;
          // Set mode to edit for existing entries
          setMode(prev => ({...prev, [item.subcategoryId]: 'edit'}));
        });
        
        setExistingCategoryProducts(organizedData);
        
        // Pre-fill form data for existing entries
        const initialFormData = {};
        const initialSelectedProducts = {};
        
        data.forEach(item => {
          initialFormData[item.subcategoryId] = {
            borderColor: item.borderColor || "#000000",
            alignment: item.alignment || "left",
            status: item.status || "Active",
            position: item.position || 0,
            bannerImage: null,
            bannerRedirectUrl: item.bannerRedirectUrl || "",
            categoryImage: null,
            categoryRedirectUrl: item.categoryRedirectUrl || "",
          };
          
          initialSelectedProducts[item.subcategoryId] = item.products.map(p => ({
            value: p,
            label: products.find(prod => prod._id === p)?.name || p
          }));
        });
        
        setFormData(initialFormData);
        setSelectedProducts(initialSelectedProducts);
      } catch (err) {
        console.error("Error fetching category products:", err);
        showStatusModal("Error fetching category products", "error");
      }
    }
    
    if (products.length > 0) {
      fetchCategoryProducts();
    }
  }, [products]);

  // ✅ Get all products for a parent category (including subcategory products)
  const getProductsForParentCategory = (parentCategoryId) => {
    // Get all subcategory IDs under this parent (including the parent itself)
    const allCategoryIds = [parentCategoryId];
    
    // Add all active subcategory IDs
    if (subcategoriesByParent[parentCategoryId]) {
      subcategoriesByParent[parentCategoryId].forEach(subcat => {
        allCategoryIds.push(subcat._id);
      });
    }
    
    // Filter products that belong to any of these categories
    const categoryProducts = products.filter(p =>
      allCategoryIds.includes(p.category) || allCategoryIds.includes(p.sub_category)
    );

    return categoryProducts;
  };

  // ✅ Handle product selection
  const handleProductSelect = (categoryId, selectedOptions) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [categoryId]: selectedOptions || [],
    }));
  };

  // ✅ Handle input changes
  const handleInputChange = (categoryId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  // ✅ Handle Save/Update for each category
  const handleSave = async (categoryId) => {
    setLoading((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const fd = new FormData();

      fd.append("subcategoryId", categoryId);
      
      // Add category name - find the category from the categories list
      const category = categories.find(cat => cat._id === categoryId);
      if (category) {
        fd.append("subcategoryName", category.category_name);
      }
      
      fd.append(
        "products",
        JSON.stringify(selectedProducts[categoryId]?.map((p) => p.value) || [])
      );

      const data = formData[categoryId] || {};

      // Only append files if they exist and are actually File objects
      if (data.bannerImage instanceof File) {
        fd.append("bannerImage", data.bannerImage);
      }
      
      if (data.categoryImage instanceof File) {
        fd.append("categoryImage", data.categoryImage);
      }
      
      // Append other fields
      fd.append("borderColor", data.borderColor || "#000000");
      fd.append("alignment", data.alignment || "left");
      fd.append("status", data.status || "Active");
      fd.append("position", data.position || 0);
      fd.append("bannerRedirectUrl", data.bannerRedirectUrl || "");
      fd.append("categoryRedirectUrl", data.categoryRedirectUrl || "");

      // Determine if we're updating or creating
      const method = existingCategoryProducts[categoryId] ? "PUT" : "POST";
      
      const res = await fetch("/api/categoryproduct", {
        method,
        body: fd,
      });

      if (res.ok) {
        const result = await res.json();
        showStatusModal(`Saved successfully `);
        
        // Update existing data
        if (method === "POST") {
          setExistingCategoryProducts(prev => ({
            ...prev,
            [categoryId]: result.data
          }));
          setMode(prev => ({...prev, [categoryId]: 'edit'}));
        } else {
          // Update existing record with new data
          setExistingCategoryProducts(prev => ({
            ...prev,
            [categoryId]: {
              ...prev[categoryId],
              ...result.data
            }
          }));
        }
      } else {
        showStatusModal("Error saving", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showStatusModal("Something went wrong", "error");
    } finally {
      setLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // ✅ Handle Delete (set status to Inactive)
  const handleDelete = async (categoryId) => {
    setLoading((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const res = await fetch("/api/categoryproduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subcategoryId: categoryId }),
      });

      if (res.ok) {
        showStatusModal(`Status changed to Inactive `);
        
        // Update local state
        setExistingCategoryProducts(prev => {
          const updated = {...prev};
          if (updated[categoryId]) {
            updated[categoryId].status = "Inactive";
          }
          return updated;
        });
        
        // Update form data status
        setFormData(prev => ({
          ...prev,
          [categoryId]: {
            ...prev[categoryId],
            status: "Inactive"
          }
        }));
      } else {
        showStatusModal("Error updating status", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showStatusModal("Something went wrong", "error");
    } finally {
      setLoading((prev) => ({ ...prev, [categoryId]: false }));
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = (categoryId) => {
    setDeleteModal({ isOpen: true, categoryId });
  };

  // ✅ Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, categoryId: null });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Categories & Products</h2>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.categoryId)}
        title="Confirm Status Change"
        message="Are you sure you want to change the status to Inactive? This will hide the category from the frontend."
      />

      {/* Status Notification Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        message={statusModal.message}
        type={statusModal.type}
        onClose={closeStatusModal}
      />
      
      <div className="bg-white shadow-md rounded-lg p-5 mb-5 overflow-x-auto">
        <a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md text-sm font-medium shadow-sm transition duration-150 inline-block" href="/admin/homesettings/product/navmenu">
          Category Drag
        </a>
        
        {/* Show message if no active categories */}
        {mainCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active categories found. Please activate some categories first.
          </div>
        )}
        
        {/* Only show ACTIVE parent categories */}
        {mainCategories.map((category) => {
          // Get ALL products for this parent category (including subcategory products)
          const allCategoryProducts = getProductsForParentCategory(category._id);
          
          // Get subcategories for this parent
          const subcategories = subcategoriesByParent[category._id] || [];

          const productOptions = allCategoryProducts.map((p) => ({
            value: p._id,
            label: p.name,
          }));

          const existingData = existingCategoryProducts[category._id];
          const currentMode = mode[category._id] || 'add';

          return (
            <div
              key={category._id}
              className="p-5 border rounded-lg shadow bg-white space-y-4 mb-6"
            >
              {/* Category Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <h3 className="font-semibold text-lg">
                    {category.category_name}
                  </h3>
                  {subcategories.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Includes products from {subcategories.length} subcategories
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Category Status Badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Category: Active
                  </span>
                  
                  {/* Existing Data Status Badge */}
                  {existingData && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      existingData.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      Config: {existingData.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Subcategories Info */}
              {subcategories.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Included Subcategories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map(subcat => (
                      <span key={subcat._id} className="px-2 py-1 bg-white border rounded text-xs">
                        {subcat.category_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Multi Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Products ({allCategoryProducts.length} active products available from category and subcategories)
                </label>
                <Select
                classNamePrefix="react-select"
                  options={productOptions}
                  value={selectedProducts[category._id] || []}
                  onChange={(options) =>
                    handleProductSelect(category._id, options)
                  }
                  placeholder="Select products"
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                   components={{ Option, MultiValueLabel }}
                />
                {allCategoryProducts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No active products available for this category and its subcategories.
                  </p>
                )}
              </div>

              {/* First Row: Banner Image and Category Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex flex-col gap-2">
                    <span>Banner Image</span>
                    {existingData?.bannerImage && (
                      <img
                        src={existingData.bannerImage}
                        alt="Banner Preview"
                        className="w-full h-32 rounded object-contain"
                      />
                    )}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(category._id, "bannerImage", e.target.files[0])
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Banner Redirect URL"
                    value={formData[category._id]?.bannerRedirectUrl || ""}
                    onChange={(e) =>
                      handleInputChange(category._id, "bannerRedirectUrl", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex flex-col gap-2">
                    <span>Category Image</span>
                    {existingData?.categoryImage && (
                      <img
                        src={existingData.categoryImage}
                        alt="Category Preview"
                        className="w-full h-32 rounded object-contain"
                      />
                    )}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(category._id, "categoryImage", e.target.files[0])
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Category Redirect URL"
                    value={formData[category._id]?.categoryRedirectUrl || ""}
                    onChange={(e) =>
                      handleInputChange(category._id, "categoryRedirectUrl", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Second Row: Border Color, Alignment, Status, and Position */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Border Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Border Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={formData[category._id]?.borderColor || "#000000"}
                      onChange={(e) =>
                        handleInputChange(category._id, "borderColor", e.target.value)
                      }
                      className="w-10 h-10 p-1 border rounded mr-2"
                    />
                    <span className="text-sm">{formData[category._id]?.borderColor || "#000000"}</span>
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alignment
                  </label>
                  <select
                    value={formData[category._id]?.alignment || "left"}
                    onChange={(e) =>
                      handleInputChange(category._id, "alignment", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData[category._id]?.status || "Active"}
                    onChange={(e) =>
                      handleInputChange(category._id, "status", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Position Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position
                  </label>
                  <input
                    type="number"
                    value={formData[category._id]?.position || 0}
                    onChange={(e) =>
                      handleInputChange(category._id, "position", parseInt(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleSave(category._id)}
                  disabled={loading[category._id]}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading[category._id] 
                    ? "Saving..." 
                    : currentMode === 'add' ? "Add" : "Update"}
                </button>
                
                {currentMode === 'edit' && (
                  <button
                    onClick={() => openDeleteModal(category._id)}
                    disabled={loading[category._id]}
                    className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loading[category._id] ? "Processing..." : "Set to Inactive"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
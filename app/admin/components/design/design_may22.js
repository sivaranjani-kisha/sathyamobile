import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaEdit } from "react-icons/fa";
import { Icon } from '@iconify/react';

export default function DesignComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerType, setBannerType] = useState("topbanner");
  const [bgImageSize, setBgImageSize] = useState({ width: 1680, height: 499 });
  const [bannerImageSize, setBannerImageSize] = useState({ width: 291, height: 147 });
  const [bgImage, setBgImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [existingBgImage, setExistingBgImage] = useState(null);
  const [existingBannerImage, setExistingBannerImage] = useState(null);
  // Table data and pagination
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBannerType, setFilterBannerType] = useState("");
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [categoryImages, setCategoryImages] = useState({});
  const [categoryRedirectUrls, setCategoryRedirectUrls] = useState({});
  const itemsPerPage = 5;

  const bannerOptions = [
    { 
      value: "topbanner", 
      label: "Top Banner", 
      bgSize: { width: 1680, height: 499 },
      bannerSize: { width: 291, height: 147 }
    },
    { 
      value: "flashsale", 
      label: "Flash Sale", 
      bgSize: { width: 828, height: 250 },
      bannerSize: { width: 285, height: 173 }
    },
    { 
      value: "categorybanner", 
      label: "Category Banner", 
      categorySize: { width: 400, height: 400 }
    }
  ];

  // Calculate pagination values
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);
const handleDeleteBanner = async () => {
  try {
    setLoading(true);
    const res = await fetch(`/api/design/delete/${bannerToDelete}`, {
      method: "PUT", // Using PUT to update status rather than DELETE
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "Banner inactivated successfully");
      fetchBanners(); // Refresh the list
    } else {
      setErrors({ error: data.message || "Failed to inactivate banner" });
    }
  } catch (err) {
    setErrors({ error: "Something went wrong, please try again." });
    console.error(err);
  } finally {
    setLoading(false);
    setShowConfirmationModal(false);
    setBannerToDelete(null);
  }
};
  // Fetch banners from API
  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      let url = `/api/design/get?page=${currentPage}&limit=${itemsPerPage}`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (filterStatus) {
        url += `&status=${filterStatus}`;
      }
      if (filterBannerType) {
        url += `&bannerType=${filterBannerType}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setBanners(data.data);
        setTotalPages(data.pagination.pages);
        setTotalItems(data.pagination.total);
      } else {
        setErrors({ error: data.error || "Failed to fetch banners" });
      }
    } catch (err) {
      setErrors({ error: "Failed to fetch banners" });
      console.error(err);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  const handleCategoryImageChange = (e, index) => {
    const file = e.target.files[0];
    setCategoryImages(prev => ({ ...prev, [index]: file }));
  };
  
  const handleCategoryRedirectUrlChange = (e, index) => {
    const value = e.target.value;
    setCategoryRedirectUrls(prev => ({ ...prev, [index]: value }));
  };


  
    // Add function to handle edit click
    const handleEditClick = (banner) => {
      setEditingBanner(banner);
      setBannerType(banner.bannerType);
      setTitle(banner.title);
      setRedirectUrl(banner.redirectUrl);
      setStartDate(banner.startDate.split('T')[0]);
      setEndDate(banner.endDate.split('T')[0]);
      setStatus(banner.status);
      setExistingBgImage(banner.bgImage);
      setExistingBannerImage(banner.bannerImage);
      
      // Set image sizes based on banner type
      const selectedOption = bannerOptions.find(option => option.value === banner.bannerType);
      if (selectedOption) {
        setBgImageSize(selectedOption.bgSize);
        setBannerImageSize(selectedOption.bannerSize);
      }
      
      setIsEditModalOpen(true);
    };
  
    // Add function to handle edit submission
    const handleEditSubmit = async () => {
      const newErrors = {};
    
      if (!title) newErrors.title = "Title is required";
      if (!existingBgImage && !bgImage) newErrors.bgImage = "Background image is required";
      if (!existingBannerImage && !bannerImage) newErrors.bannerImage = "Banner image is required";
      if (!redirectUrl) newErrors.redirectUrl = "Redirect URL is required";
      if (!startDate) newErrors.startDate = "Start date is required";
      if (!endDate) newErrors.endDate = "End date is required";
      if (endDate && startDate && endDate < startDate) newErrors.endDate = "End date must be after the start date";
    
      const validBannerTypes = bannerOptions.map(option => option.value);
      if (!validBannerTypes.includes(bannerType)) {
        newErrors.bannerType = "Invalid banner type";
      }
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("id", editingBanner._id);
        formData.append("title", title);
        formData.append("bannerType", bannerType);
        formData.append("redirectUrl", redirectUrl);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("status", status);
        
        if (bgImage) {
          formData.append("bgImage", bgImage);
        }
        if (bannerImage) {
          formData.append("bannerImage", bannerImage);
        }
        formData.append("existingBgImage", existingBgImage || "");
        formData.append("existingBannerImage", existingBannerImage || "");
  
        const res = await fetch("/api/design/update", {
          method: "PUT",
          body: formData,
        });
  
        const data = await res.json();
        console.log(data);
  
        if (res.ok) {
          setMessage(data.message || "Banner updated successfully");
          resetForm();
          setIsEditModalOpen(false);
          setEditingBanner(null);
          setErrors({});
          fetchBanners(); // Refresh the table after successful update
        } else {
          setErrors(data.errors || { error: data.message || "Failed to update banner" });
        }
      } catch (err) {
        setErrors({ error: "Something went wrong, please try again." });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
  // Load banners on component mount and when filters change
  useEffect(() => {
    fetchBanners();
  }, [currentPage, searchTerm, filterStatus, filterBannerType]);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleBannerChange = (e) => {
    const selectedType = e.target.value;
    setBannerType(selectedType);
    const selectedOption = bannerOptions.find(option => option.value === selectedType);
    if (selectedOption.bgSize) setBgImageSize(selectedOption.bgSize);
    if (selectedOption.bannerSize) setBannerImageSize(selectedOption.bannerSize);
  };

  const handleBgImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;
    
    setErrors(prev => ({ ...prev, bgImage: "" }));
    setBgImage(selectedImage);
  };

  const handleBannerImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;
    
    setErrors(prev => ({ ...prev, bannerImage: "" }));
    setBannerImage(selectedImage);
  };

  const resetForm = () => {
    setBannerType("topbanner");
    setBgImageSize({ width: 1680, height: 499 });
    setBannerImageSize({ width: 291, height: 147 });
    setBgImage(null);
    setBannerImage(null);
    setTitle("");
    setRedirectUrl("");
    setStartDate("");
    setEndDate("");
    setStatus("active");
    setErrors({});
    setCategoryImages({});
    setCategoryRedirectUrls({});
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    // Common validations
    if (!title) newErrors.title = "Title is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (endDate && startDate && endDate < startDate) newErrors.endDate = "End date must be after the start date";
  
    const validBannerTypes = bannerOptions.map(option => option.value);
    if (!validBannerTypes.includes(bannerType)) {
      newErrors.bannerType = "Invalid banner type";
    }
  
    // Banner type specific validations
    if (bannerType === 'categorybanner') {
      for (let i = 1; i <= 4; i++) {
        if (!categoryImages[i]) newErrors[`image${i}`] = `Image ${i} is required`;
        if (!categoryRedirectUrls[i]) newErrors[`redirectUrl${i}`] = `Redirect URL ${i} is required`;
      }
    } else {
      if (!bgImage) newErrors.bgImage = "Background image is required";
      if (!redirectUrl) newErrors.redirectUrl = "Redirect URL is required";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("bannerType", bannerType);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("status", status);
  
      if (bannerType === 'categorybanner') {
        for (let i = 1; i <= 4; i++) {
          formData.append(`image${i}`, categoryImages[i]);
          formData.append(`redirectUrl${i}`, categoryRedirectUrls[i]);
        }
      } else {
        formData.append("redirectUrl", redirectUrl);
        formData.append("bgImage", bgImage);
        if (bannerImage) formData.append("bannerImage", bannerImage);
      }
  
      const res = await fetch("/api/design/add", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage(data.message || "Banner added successfully");
        resetForm();
        setIsModalOpen(false);
        setErrors({});
        fetchBanners();
      } else {
        setErrors(data.errors || { error: data.message || "Failed to add banner" });
      }
    } catch (err) {
      setErrors({ error: "Something went wrong, please try again." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle page change
  const paginate = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Banner List</h2>
      </div>

      {message && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
          {message}
        </div>
      )}

      {errors.error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-md mb-4">
          {errors.error}
        </div>
      )}

      {/* Banners Table */}
      <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
        {/* Banner Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
          <select
            value={filterBannerType}
            onChange={(e) => {
              setFilterBannerType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {bannerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Add Design Banner Button */}
        <div className="flex justify-end">
          <button
            onClick={openModal}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          >
            + Add Design Banner
          </button>
        </div>
      </div>

        <hr className="border-t border-gray-200 mb-4" />

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">From</th>
                <th className="p-3 text-left">To</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingBanners ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading banners...
                  </td>
                </tr>
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {bannerOptions.find(opt => opt.value === banner.bannerType)?.label || banner.bannerType}
                    </td>
                    <td className="p-3 font-semibold">{banner.title}</td>
                    <td className="p-3">{formatDate(banner.startDate)}</td>
                    <td className="p-3">{formatDate(banner.endDate)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                         <button onClick={() => handleEditClick(banner)} className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full inline-flex items-center justify-center"  title="Edit">
                            <FaEdit className="w-3 h-3" />
                         </button>
                        <button
                          onClick={() => {
                            setBannerToDelete(banner._id);
                            setShowConfirmationModal(true);
                          }}
                          className="w-7 h-7 bg-red-100 text-red-600 rounded-full inline-flex items-center justify-center hover:bg-red-200 transition"
                          title="Inactivate"
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-600">
            Showing {startEntry} to {endEntry} of {totalItems} entries
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-black bg-white hover:bg-gray-100"
              }`}
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "text-black bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-black bg-white hover:bg-gray-100"
              }`}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Add Banner Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Add Design Banner</h2>
        <button
          onClick={() => {
            setIsModalOpen(false);
            setErrors({});
          }}
          className="text-gray-400 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="px-6 py-6 overflow-y-auto flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Banner Type */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Type of Banner*</label>
            <select
              value={bannerType}
              onChange={handleBannerChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            >
              {bannerOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.bannerType && <span className="text-red-500 text-sm">{errors.bannerType}</span>}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter banner title"
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>
        </div>

        {bannerType === 'categorybanner' ? (
          <div className="space-y-5">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
                {/* Image Upload */}
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Image {num}* (Size: 400x400)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCategoryImageChange(e, num)}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors[`image${num}`] && <span className="text-red-500 text-sm">{errors[`image${num}`]}</span>}
                  {categoryImages[num] && (
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {categoryImages[num].name} ({(categoryImages[num].size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>

                {/* Redirect URL */}
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Redirect URL {num}*</label>
                  <input
                    type="text"
                    value={categoryRedirectUrls[num] || ""}
                    onChange={(e) => handleCategoryRedirectUrlChange(e, num)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
                    placeholder="https://example.com"
                  />
                  {errors[`redirectUrl${num}`] && <span className="text-red-500 text-sm">{errors[`redirectUrl${num}`]}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Background Image */}
            <div className="mb-5">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Banner Background Image* (Size: {bgImageSize.width}x{bgImageSize.height})
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgImageChange}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.bgImage && <span className="text-red-500 text-sm">{errors.bgImage}</span>}
              {bgImage && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected: {bgImage.name} ({(bgImage.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            {/* Banner Image */}
            {bannerType !== 'categorybanner' && (
              <div className="mb-5">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Banner Image* (Size: {bannerImageSize.width}x{bannerImageSize.height})
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.bannerImage && <span className="text-red-500 text-sm">{errors.bannerImage}</span>}
                {bannerImage && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected: {bannerImage.name} ({(bannerImage.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>
            )}

            {/* Redirect URL */}
            <div className="mb-5">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Redirect URL*</label>
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
                placeholder="https://example.com"
              />
              {errors.redirectUrl && <span className="text-red-500 text-sm">{errors.redirectUrl}</span>}
            </div>
          </>
        )}

        {/* Start & End Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Start Date*</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">End Date*</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}
          </div>
        </div>

        {/* Status */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-semibold text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setErrors({});
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

 {/* Edit Banner Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Design Banner</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Type of Banner*</label>
                <select
                  value={bannerType}
                  onChange={handleBannerChange}
                  className="border p-2 rounded w-full mb-3"
                >
                  {bannerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.bannerType && <span className="text-red-500 text-sm">{errors.bannerType}</span>}
              </div>
              <div>
                <label className="block mb-2 font-medium">Title*</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                  placeholder="Enter banner title"
                />
                {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
              </div>
            </div>

            <div className="mb-3">
              <label className="block mb-2 font-medium">
                Banner Background Image* (Size: {bgImageSize.width}x{bgImageSize.height})
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgImageChange}
                className="border p-2 rounded w-full"
              />
              {errors.bgImage && <span className="text-red-500 text-sm">{errors.bgImage}</span>}
              {existingBgImage && !bgImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current Image:</p>
                  <img src={existingBgImage} alt="Current Background" className="h-20 mt-1" />
                </div>
              )}
              {bgImage && (
                <div className="mt-2 text-sm text-gray-500">
                  New Selected: {bgImage.name} ({(bgImage.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="block mb-2 font-medium">
                Banner Image* (Size: {bannerImageSize.width}x{bannerImageSize.height})
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="border p-2 rounded w-full"
              />
              {errors.bannerImage && <span className="text-red-500 text-sm">{errors.bannerImage}</span>}
              {existingBannerImage && !bannerImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current Image:</p>
                  <img src={existingBannerImage} alt="Current Banner" className="h-20 mt-1" />
                </div>
              )}
              {bannerImage && (
                <div className="mt-2 text-sm text-gray-500">
                  New Selected: {bannerImage.name} ({(bannerImage.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Redirect URL*</label>
                <input
                  type="text"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                  placeholder="https://example.com"
                />
                {errors.redirectUrl && <span className="text-red-500 text-sm">{errors.redirectUrl}</span>}
              </div>
              <div>
                <label className="block mb-2 font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Start Date*</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="border p-2 rounded w-full mb-3"
                />
                {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
              </div>
              <div>
                <label className="block mb-2 font-medium">End Date*</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="border p-2 rounded w-full mb-3"
                />
                {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBanner(null);
                  setErrors({});
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}


{/* Confirmation Modal for Delete */}
{showConfirmationModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-medium mb-4">Confirm Inactivation</h3>
      <p className="mb-6">
        Are you sure you want to inactivate this banner? It will no longer be displayed.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowConfirmationModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteBanner}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Inactivate"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
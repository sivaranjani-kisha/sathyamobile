"use client";

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { FaPlus, FaMinus, FaEdit } from "react-icons/fa";
import DateRangePicker from '@/components/DateRangePicker';
import EditProductModal from "./EditProductModal";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

export default function CategoryComponent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [SelectedProduct, setSelectedProduct] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Fetch products, categories and brands from API
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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand/get");
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
// const exportToExcel = () => {
//   // Prepare data in the exact requested format
//   const dataForExport = filteredProducts.map(product => ({
//     'Item No.': product.item_code,
//     'Product Name': product.name,
//     'StockQty': product.quantity,
//     'Category': product.category?.category_name || product.category || 'No Category',
//     'Subcategory': product.sub_category || 'No Subcategory',
//     'Brand': product.brand?.brand_name || product.brand || 'No Brand',
//     'Size': product.filter?.size || '',
//     'Star': product.featured_products?.star_rating || '',
//     'Movement': product.stock_status === "In Stock" ? "In Stock" : "Out of Stock",
//     'MRP PRICE': product.price,
//     'Special Price': product.special_price,
//     'Description': product.description || '',
//     'Key Features': product.key_specifications || '',
//     'image1': product.images?.[0] || '',
//     'image2': product.images?.[1] || '',
//     'image3': product.images?.[2] || '',
//     'overview images': product.overview_image?.join(", ") || '',
//     'overview_description': product.overviewdescription || '',
//     'variants': product.hasVariants ? JSON.stringify(product.variants) : '',
//     'Status': product.status
//   }));

//   // Create worksheet with the exact column order
//   const worksheet = XLSX.utils.json_to_sheet(dataForExport, {
//     header: [
//       'Item No.',
//       'Product Name',
//       'StockQty',
//       'Category',
//       'Subcategory',
//       'Brand',
//       'Size',
//       'Star',
//       'Movement',
//       'MRP PRICE',
//       'Special Price',
//       'Description',
//       'Key Features',
//       'image1',
//       'image2',
//       'image3',
//       'overview images',
//       'overview_description',
//       'variants',
//       'Status'
//     ]
//   });
  
//   // Create workbook
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
//   // Generate file and trigger download
//   XLSX.writeFile(workbook, `products_export_${new Date().toISOString().slice(0,10)}.xlsx`);
// };
  // Export to Excel function
  // const exportToExcel = () => {
  //   const dataForExport = filteredProducts.map(product => ({
  //     'Item Code': product.item_code,
  //     'Name': product.name,
  //     'Price': product.price,
  //     'Special Price': product.special_price,
  //     'Quantity': product.quantity,
  //     'Status': product.status,
  //     'Brand': product.brand?.brand_name || 'No Brand',
  //     'Category': product.category?.category_name || 'No Category',
  //     'Created At': new Date(product.createdAt).toLocaleDateString()
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(dataForExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  //   XLSX.writeFile(workbook, `products_export_${new Date().toISOString().slice(0,10)}.xlsx`);
  // };
const exportToExcel = () => {
  // Create mapping objects for faster lookup
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat._id] = cat.category_name;
  });

  const brandMap = {};
  brands.forEach(brand => {
    brandMap[brand._id] = brand.brand_name;
  });

  // Prepare data with names instead of IDs
  const dataForExport = filteredProducts.map(product => {
    // Resolve category name
    let categoryName = 'No Category';
    if (product.category) {
      if (typeof product.category === 'object') {
        categoryName = product.category.category_name;
      } else if (categoryMap[product.category]) {
        categoryName = categoryMap[product.category];
      }
    }

    // Resolve subcategory name
    let subcategoryName = 'No Subcategory';
    if (product.sub_category) {
      if (typeof product.sub_category === 'object') {
        subcategoryName = product.sub_category.category_name;
      } else if (categoryMap[product.sub_category]) {
        subcategoryName = categoryMap[product.sub_category];
      }
    }

    // Resolve brand name
    let brandName = 'No Brand';
    if (product.brand_name) {
      if (typeof product.brand_name === 'object') {
        brandName = product.brand.brand_name;
      } else if (brandMap[product.brand_name]) {
        brandName = brandMap[product.brand_name];
      }
    }

    return {
      'Item No.': product.item_code,
      'Product Name': product.name,
      'StockQty': product.quantity,
      'Category': categoryName,
      'Subcategory': subcategoryName,
      'Brand': brandName,
      'Size': product.filter?.size || '',
      'Star': product.featured_products?.star_rating || '',
      'Movement': product.stock_status === "In Stock" ? "In Stock" : "Out of Stock",
      'MRP PRICE': product.price,
      'Special Price': product.special_price,
      'Description': product.description || '',
      'Key Features': product.key_specifications || '',
      'image1': product.images?.[0] || '',
      'image2': product.images?.[1] || '',
      'image3': product.images?.[2] || '',
      'overview images': product.overview_image?.join(", ") || '',
      'overview_description': product.overviewdescription || '',
      'variants': product.hasVariants ? JSON.stringify(product.variants) : '',
      'Status': product.status
    };
  });

  // Create worksheet with the exact column order
  const worksheet = XLSX.utils.json_to_sheet(dataForExport, {
    header: [
      'Item No.',
      'Product Name',
      'StockQty',
      'Category',
      'Subcategory',
      'Brand',
      'Size',
      'Star',
      'Movement',
      'MRP PRICE',
      'Special Price',
      'Description',
      'Key Features',
      'image1',
      'image2',
      'image3',
      'overview images',
      'overview_description',
      'variants',
      'Status'
    ]
  });
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
  // Generate file and trigger download
  XLSX.writeFile(workbook, `products_export_${new Date().toISOString().slice(0,10)}.xlsx`);
};
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
    setEditingProduct(product._id);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDateChange = ({ startDate, endDate }) => {
    const normalizedStartDate = startDate ? new Date(startDate) : null;
    const normalizedEndDate = endDate ? new Date(endDate) : null;
    
    setDateFilter({ 
      startDate: normalizedStartDate,
      endDate: normalizedEndDate 
    });
    setCurrentPage(0);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch("/api/product/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Product deleted successfully.");
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

  const clearDateFilter = () => {
    setDateFilter({
      startDate: null,
      endDate: null
    });
    setCurrentPage(0);
  };

  const flattenProducts = (products, level = 0, result = []) => {
    products.forEach((product) => {
      if (product.item_code !== 'none') {
        result.push({ ...product, level });
      }
    });
    return result;
  };

  const renderCategoryOptions = () => {
    const mainCategories = categories.filter(cat => cat.parentid === "none");
    const options = [];
    
    options.push(
      <option key="all" value="">
        All Categories
      </option>
    );

    mainCategories.forEach(mainCat => {
      options.push(
        <option 
          key={mainCat._id} 
          value={mainCat._id.toString()}
        >
          {mainCat.category_name}
        </option>
      );
    });

    return options;
  };

  const renderBrandOptions = () => {
    return [
      <option key="all" value="">
        All Brands
      </option>,
      ...brands.map(brand => (
        <option 
          key={brand.id} 
          value={brand.id}
        >
          {brand.brand_name}
        </option>



      ))
    ];
  };

  const getFilteredProducts = () => {
    const flattenedProducts = flattenProducts(products);
    
    return flattenedProducts.filter((product) => {
      // Search filter
      const matchesSearch = debouncedSearchQuery === "" || 
        product.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.slug?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.item_code?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "" || 
        product.status?.toLowerCase() === statusFilter.toLowerCase();

      // Date filter
      let matchesDate = true;
      if (dateFilter.startDate && dateFilter.endDate && product.createdAt) {
        const productDate = new Date(product.createdAt);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        matchesDate = productDate >= startDate && productDate <= endDate;
      }

      // Category filter
      let matchesCategory = true;
      if (categoryFilter) {
        if (product.category && typeof product.category === 'object') {
          const productCategoryId = product.category._id.toString();
          const selectedCategory = categories.find(cat => cat._id.toString() === categoryFilter);
          
          if (selectedCategory.parentid === "none") {
            const subCategoryIds = categories
              .filter(cat => cat.parentid === categoryFilter)
              .map(cat => cat._id.toString());
            
            matchesCategory = productCategoryId === categoryFilter || 
                            subCategoryIds.includes(productCategoryId);
          } else {
            matchesCategory = productCategoryId === categoryFilter;
          }
        } else if (product.category) {
          const productCategoryId = product.category.toString();
          const selectedCategory = categories.find(cat => cat._id.toString() === categoryFilter);
          
          if (selectedCategory.parentid === "none") {
            const subCategoryIds = categories
              .filter(cat => cat.parentid === categoryFilter)
              .map(cat => cat._id.toString());
            
            matchesCategory = productCategoryId === categoryFilter || 
                            subCategoryIds.includes(productCategoryId);
          } else {
            matchesCategory = productCategoryId === categoryFilter;
          }
        } else {
          matchesCategory = false;
        }
      }

      // Brand filter
      let matchesBrand = true;
      if (brandFilter) {
        if (product.brand && typeof product.brand === 'object') {
          matchesBrand = product.brand._id.toString() === brandFilter;
        } else if (product.brand) {
          matchesBrand = product.brand.toString() === brandFilter;
        } else {
          matchesBrand = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate && matchesCategory && matchesBrand;
    });
  };

  const filteredProducts = getFilteredProducts();
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      {showAlert && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
          {alertMessage}
        </div>
      )}

  <div className="flex justify-between items-center mb-5">
  <h2 className="text-2xl font-bold">Product List</h2>
  
  <div className="flex items-center gap-4">
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
    >
      <Icon icon="mdi:microsoft-excel" className="text-lg" />
      Export to Excel
    </button>

    <Link href="/admin/product/create" className="bg-red-500 text-white px-4 py-2 rounded-md">
      + Add Product
    </Link>
  </div>
</div>


      {isLoading ? (
        <p>Loading Products...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-5 h-[500px] overflow-x-auto">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4">
            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                {renderCategoryOptions()}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                {renderBrandOptions()}
              </select>
            </div>

            {/* Date Range Picker */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <DateRangePicker 
                onChange={handleDateChange}
                onClear={clearDateFilter}
              />
            </div> */}
          </div>

          <hr className="border-t border-gray-200 mb-4" />

          {/* Products Table */}
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Item Code</th>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2 whitespace-nowrap">Spl Price</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <tr key={product._id} className="text-center border-b">
                    {/* Item Code Column */}
                    <td className="p-2 text-center align-middle">
                      {product.item_code}
                    </td>
                  
                    {/* Image Column */}
                    <td className="p-2">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={`/uploads/products/${product.images[0]}`}
                          alt={product.name}
                          className="w-12 h-12 object-contain mx-auto"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/no-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mx-auto">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </td>
                    
                    {/* Name Column */}
                    <td className="p-2 text-center align-middle">
                      <a
                        href={`/product/${product.slug}`}
                        className="block mx-auto text-center truncate max-w-xs text-sm hover:underline"
                        title={product.name}
                      >
                        {product.name}
                      </a>
                    </td>
                    
                    {/* Price Column */}
                    <td className="p-2">{product.price}</td>
                    
                    {/* Special Price Column */}
                    <td className="p-2">{product.special_price}</td>
                    
                    {/* Quantity Column */}
                    <td className="p-2">{product.quantity}</td>
                    
                    {/* Status Column */}
                    <td className="p-2 font-semibold">
                      {product.status === "Active" ? (
                        <span className="bg-green-100 text-green-600 px-6 py-1.5 rounded-full font-medium text-sm">Active</span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-6 py-1.5 rounded-full font-medium text-sm">Inactive</span>
                      )}
                    </td>
                    
                    {/* Action Column */}
                    <td>
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="w-7 h-7 bg-red-100 text-red-600 rounded-full inline-flex items-center justify-center"
                          title="Edit"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
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
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No Products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
            <div className="text-sm text-gray-600">
              Showing {Math.min(currentPage * itemsPerPage + 1, filteredProducts.length)} to{" "}
              {Math.min((currentPage + 1) * itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} entries
            </div>

            <div className="pagination flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                  currentPage === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black bg-white hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                «
              </button>

              {Array.from({ length: pageCount }, (_, i) => {
                const isFirst = i === 0;
                const isLast = i === pageCount - 1;
                const isNearCurrent = Math.abs(currentPage - i) <= 1;

                if (isFirst || isLast || isNearCurrent) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                        currentPage === i
                          ? "bg-red-500 text-white"
                          : "text-black bg-white hover:bg-gray-100"
                      }`}
                      aria-label={`Page ${i + 1}`}
                      aria-current={currentPage === i ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (
                  (i === currentPage - 2 && i > 1) ||
                  (i === currentPage + 2 && i < pageCount - 2)
                ) {
                  return (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount - 1))}
                disabled={currentPage === pageCount - 1}
                className={`px-3 py-1.5 border border-gray-300 rounded-md ${
                  currentPage === pageCount - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black bg-white hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                »
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p className="mb-4">Are you sure you want to delete this Product?</p>

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

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p className="mb-4">{successMessage}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-red-500 px-4 py-2 rounded-md text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && SelectedProduct && (
        <EditProductModal
          product={SelectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
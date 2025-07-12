'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const ProductPrebook = ({ imageUrls = [], productName, productList = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    store: '',
    product: productName || '',
  });
  const [errors, setErrors] = useState({});

  const [sectionRef, inView] = useInView({ threshold: 0.1 });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product/get');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        if (!form.product) {
          setForm((prev) => ({ ...prev, product: data[0]?.name || '' }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Valid 10-digit phone number required';
    if (!form.store.trim()) newErrors.store = 'Store/location is required';
    if (!form.product) newErrors.product = 'Product selection is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('/api/prebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert('Pre-booking successful!');
        setShowModal(false);
        setForm({ name: '', email: '', phone: '', store: '', product: products[0]?.name || '' });
        setErrors({});
      } else {
        alert('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const availableProducts = productList.length > 0 ? productList : products.map((p) => p.name);

  return (
    <div className="relative w-full bg-red-50 min-h-screen">
      {/* Floating button */}
      {inView && (
        <motion.button
          onClick={() => setShowModal(true)}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold py-3 px-6 sm:px-8 rounded-full shadow-xl z-50"
        >
          Pre-book Now!
        </motion.button>
      )}

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold text-center text-red-700 py-12 px-4"
      >
        Pre-book Your <span className="text-red-600">{productName}</span> Today!
      </motion.h1>

      {/* Image Section */}
      <div ref={sectionRef}>
        {imageUrls
          .filter((url) => url && url.trim() !== '')
          .map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="w-full flex justify-center py-10 px-4"
            >
              <Image
                src={url}
                alt={`Image ${index + 1} of ${productName}`}
                width={800}
                height={800}
                className="w-full max-w-4xl h-auto object-contain"
              />
            </motion.div>
          ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold text-red-600">Pre-book Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="store"
                  placeholder="Store Name / Location"
                  value={form.store}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.store && <p className="text-sm text-red-500 mt-1">{errors.store}</p>}
              </div>

              <div>
                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                >
                  {availableProducts.map((prod, i) => (
                    <option key={i} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
                {errors.product && <p className="text-sm text-red-500 mt-1">{errors.product}</p>}
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPrebook;

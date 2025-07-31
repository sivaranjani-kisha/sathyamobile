"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/store/get")
      .then((res) => res.json())
      .then((data) => {
        setStores(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
        setLoading(false);
      });
  }, []);

  const generateSlug = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-");

  if (loading) {
    return <p className="text-center text-gray-500">Loading stores...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Store Locator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map((store, index) => (
          <div
            key={store._id || index}
            className="border border-gray-300 rounded-lg shadow-md bg-white p-4"
          >
            <div className="bg-blue-200 h-40 mb-4 rounded-md flex items-center justify-center overflow-hidden">
              {store.images && store.images.length > 0 ? (
                <Image
                  src={store.images[0]}
                  alt={store.organisation_name}
                  width={200}
                  height={150}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-600">No Image</span>
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {store.organisation_name}
            </h3>
            <p className="text-sm text-gray-700 mt-1">{store.address}</p>
            <p className="text-sm text-gray-700">
              {store.city} - {store.zipcode}
            </p>
            {store.phone && (
              <p className="text-md mt-2 font-bold text-gray-900">
                {store.phone}
              </p>
            )}

            <Link
              href={`/all-stores/${generateSlug(store.organisation_name)}`}
              className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
            >
              Visit Store
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;

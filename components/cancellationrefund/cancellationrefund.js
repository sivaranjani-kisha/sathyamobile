"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FaTimesCircle } from "react-icons/fa";
import { FaRightLeft, FaArrowsRotate, FaRegHandshake } from "react-icons/fa6";

import { FiRotateCcw, FiPackage, FiCheckCircle, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineMoneyOff } from "react-icons/md";

const CancellationRefundPolicy = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <div>
      {/* Header Bar */}
      <div className="bg-red-100 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Cancellation & Refund Policy</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-red-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-red-600 font-semibold">Cancellation & Refund</span>
        </div>
      </div>

      
    {/* Cancellation & Refund Policy Content */}
      <div className="container mx-auto px-8 py-12 text-gray-800 leading-relaxed">

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Cancellation & Refund Policy</h1>

        <p className="mb-8">
          At Sathya Mobiles, we strive to ensure your satisfaction with every purchase. This policy outlines the terms and conditions for order cancellations, product returns, and refunds.
        </p>

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaTimesCircle className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for Cancellation
        </h2>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            Cancellations will be taken into consideration at any time **before the delivery of the product**.
          </li>
          <li>
            If you cancel your order **before it has been shipped**, we will refund the entire amount.
          </li>
          <li>
            Cancellation will **not be accepted** for orders placed under the **Same Day Delivery** category.
          </li>
          <li>
            If your product has shipped but has not yet been delivered, please **contact Customer Support** and inform them of the same.
          </li>
          <li>
            If you have received the product, it will only be eligible for **replacement** in cases where **defects are found** with the product.
          </li>
          <li>
            When the product is delivered by courier and the customer does not accept the package, the **2-way shipment charge** will be collected from the customer.
          </li>
        </ul>

     

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaArrowsRotate className="mr-3 text-red-600 text-3xl" /> The Return and Refund Policy
        </h2>
        <p className="mb-4">
          There could be certain circumstances beyond our control where you might receive a damaged product or a product that doesn't match its visualization on the website. Sathya Mobiles always tries its best to help you with a replacement or refund.
        </p>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            The products sold by SATHYA Mobiles can be **returned or exchanged within 30 days** from the date of your in-store purchase or 30 days from the date your online order is delivered.
          </li>
        </ul>


        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaRegHandshake className="mr-3 text-red-600 text-3xl" /> Grievance Officer
        </h2>
        <p className="mb-4">
          In case of any escalation of customer service inquiries with regards to defects in products or complaints with services, you are free to contact our grievance officer at the below address:
        </p>
        <ul className="list-disc list-inside mb-8 space-y-2">
          <li className="flex items-center"><FiUser className="mr-2 text-red-600"/> <strong>Name:</strong> Mr. Ian J</li>
          <li className="flex items-center"><FiMail className="mr-2 text-red-600"/> <strong>Email Address:</strong> <a href="mailto:sathyamobiles@sathyaindia.com" className="text-red-600 hover:underline">sathyamobiles@sathyaindia.com</a></li>
          <li className="flex items-center"><FiPhone className="mr-2 text-red-600"/> <strong>Phone:</strong> 8098872777</li>
        </ul>

        <p className="text-sm text-gray-500 mt-8">
          <em>Last updated on: {currentDate}</em>
        </p>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;
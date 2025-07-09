"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FaTruck,FaShoppingCart, FaCreditCard, FaGavel,  FaUserCircle, FaComments  } from "react-icons/fa";
import { FiFileText, FiBook, FiShield, FiMail, FiLink, FiCreditCard  } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineSecurity } from "react-icons/md";

const TermsAndConditions = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Terms & Conditions</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-red-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-red-600 font-semibold">Terms & Conditions</span>
        </div>
      </div>

   {/* Terms and Conditions Content */}
      <div className="container mx-auto px-8 py-12 text-gray-800 leading-relaxed">

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Terms and Conditions</h1>

        <p className="mb-8">
          Welcome to sathyamobiles.com. By using this website, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this site.
        </p>

       

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaTruck className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for Delivery of the Product
        </h2>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            <strong>DELIVERY REGION:</strong> Tamil Nadu, Andhra Pradesh, Karnataka, Kerala, and Pondicherry.
          </li>
          <li>
            Products purchased from us will be delivered within **5 business days** from the date of Billing through Courier. The products will be delivered through courier service only in Karnataka, Kerala, Andhra Pradesh, Pondicherry, and Tamil Nadu.
          </li>
          <li>
            Any product purchased online before **12:00 PM** will be billed the same day. Products purchased after **12:00 PM** will be billed on the next business day.
          </li>
          <li>
            The **Estimated shipping date** will be the billed date and the **estimated delivery date** will be within 5 business days from the date of billing/Shipping.
          </li>
          <li>
            <strong>Estimated Shipping Date:</strong> The day the product is shipped from SATHYA Mobiles India Pvt Ltd.
          </li>
          <li>
            <strong>Estimated Delivery Date:</strong> The day the customer receives the product.
          </li>
          <li>
            Product will be delivered through courier. If the purchase mode is through **“Cash on Delivery” (COD)**, please make the payment to the respective courier delivery person after you have received the product. The invoice for the purchase will be in the package and an email for the order placed will be sent out to you.
          </li>
          <li>
            However, if any product is delivered that is not the same as per your original order or is delivered in a damaged condition, the same will be replaced by us at no extra cost.
          </li>
          <li>
            You are more than welcome to make your purchases on our site from anywhere in the world, but you'll have to ensure that the **Delivery Address is within Karnataka, Kerala, Andhra Pradesh, Pondicherry, and Tamil Nadu**.
          </li>
        </ul>

        

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FiShield className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for Refunds and Replacement
        </h2>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            All products sold at <a href="https://sathyamobiles.com/" className="text-red-600 hover:underline">https://sathyamobiles.com/</a> are covered under our **3 Day Replacement Guarantee**.
          </li>
          <li>
            Please notify us of any problems, damages or defects within **3 days** from the date of delivery, and we will issue a brand new replacement product to you at no extra cost.
          </li>
          <li>
            In order to get a defective item replaced, please Contact Customer Care via the <Link href="/contact-us" className="text-red-600 hover:underline">Contact Us Page</Link> (at the bottom of sathyamobiles.com webpage) or call us on **+91 8098872777** (Monday to Saturday 9:30 am to 7:30 pm IST), within 3 days from the date of delivery.
          </li>
          <li>
            The defective product or part will be recalled and a replacement will be shipped immediately.
          </li>
          <li>
            If there is any cosmetic damage, we will not replace the product. However, if there is any other concern, you can still get in touch with us.
          </li>
          <li>
            During the replacement process, the product that is being returned should contain all original packaging and accessories, including the retail box, manuals, cables, and all other items originally included with the product at the time of delivery.
          </li>
          <li>
            Products without a valid, readable, untampered serial number (including but not limited to products with missing, damaged, altered, or otherwise unreadable serial numbers) will not be eligible for replacement.
          </li>
          <li>
            All Electronics are insured against theft and damages incurred during transit. If you receive a package that is open or looks to have been tampered with, **do not accept it**. Contact Sathya Customer Care on **+91 8098872777** (Monday to Saturday 9 am to 9 pm IST), and we will have the issue quickly resolved.
          </li>
          <li>
            For orders placed through Gift Coupons/vouchers, the refund would be provided in the form of a fresh Gift Coupon/voucher of the same value, and the Expiry date will be the same as in the original gift coupons.
          </li>
          <li>
            It may take up to **7-10 working days** to complete the refund from the time we have received our product back.
          </li>
          <li>
            Though we give free shipping, during the cancel and refund process, the shipping charge will be deducted from the refund amount. If the order is cancelled before shipping, there will not be any shipping charge detected on the refund funds.
          </li>
          <li>
            In case the payment was done through COD, it will take longer. As soon as we receive the funds from the courier, we will process the refund. You need to provide us with the below-mentioned information for COD refunds:
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>Name as on Account</li>
              <li>Name of Bank</li>
              <li>Account number</li>
              <li>IFSC Code</li>
              <li>Order Number and reason for Refund</li>
            </ul>
          </li>
          <li>
            We will either transfer the funds to your account or provide you with a cheque under the billing address name.
          </li>
        </ul>

        

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaShoppingCart className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for Cancellation
        </h2>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            If you cancel your order before your product has been shipped, we will refund the entire amount.
          </li>
          <li>
            If the cancellation is after your product has been shipped:
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>
                If your product has shipped but has not yet been delivered, contact Customer Support and inform them.
              </li>
              <li>
                If you received the product, it will only be eligible for replacement, only in cases where defects are found with the product.
              </li>
            </ul>
          </li>
          <li>
            When the product is delivered by courier and the customer does not accept the package, the **2-way shipment charge** will be collected from the Customer.
          </li>
        </ul>

      

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaCreditCard className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for the Payment
        </h2>
        <p className="mb-4">
          Please make the payment to the respective courier delivery person after you have received the product. The invoice for the purchase will be in the package and an email for the order placed will be sent out to you.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <FiBook className="mr-2 text-red-600" /> Payment Options in Sathyamobiles.com
        </h3>
        <p className="mb-4">
          Following Payment options are available as of Dec 24, 2012:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Credit Card</li>
          <li>Debit Card</li>
          <li>Net Banking</li>
          <li>Cash Card</li>
          <li>Cash on Delivery</li>
          <li>RTGS & NEFT (within India)</li>
        </ul>
        <p className="mb-4">
          You will not be able to make any payment using the below mentioned options:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Mobile Payment options (mChek)</li>
          <li>Payment by DD</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <FiCreditCard className="mr-2 text-red-600" /> Card Payments
        </h3>
        <p className="mb-2">**All major Credit cards are accepted:**</p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>All Visa credit cards National (India)</li>
        </ul>
        <p className="mb-2">**All major Visa, Master, and Maestro Debit cards are accepted.**</p>

        <h4 className="text-md font-semibold text-gray-800 mb-2">Debit Card</h4>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Visa</li>
          <li>Master Card</li>
          <li>Maestro</li>
          <li>Rupay</li>
        </ul>

        <h4 className="text-md font-semibold text-gray-800 mb-2">Credit Card</h4>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Visa</li>
          <li>Master Card</li>
          <li>American Express</li>
          <li>JCB</li>
          <li>American Express Eze Click</li>
        </ul>
        <p className="mb-4">EBS Credit Card Screen Shot.</p>

        <h4 className="text-md font-semibold text-gray-800 mb-2">Cash Card</h4>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>ICash</li>
          <li>ItzCash</li>
          <li>Jio Money</li>
          <li>MobiKwik</li>
          <li>PayCash</li>
          <li>PayZapp</li>
          <li>YPayCash</li>
        </ul>

        <h4 className="text-md font-semibold text-gray-800 mb-2">EMI</h4>
        <p className="mb-2">Our Supported EMI Options are:</p>
        <ul className="list-disc pl-5 space-y-1 mb-8">
          <li>HDFC Bank Visa Card</li>
          <li>HDFC Bank Master Card</li>
          <li>CITI Bank Visa Card</li>
          <li>CITI Bank Master Card</li>
          <li>Bajaj Finserv (No Cost EMI)</li>
        </ul>

        <p className="mb-4">
          Shopping at <a href="https://sathyamobiles.com/" className="text-red-600 hover:underline">https://sathyamobiles.com/</a> is **100% safe**. We are a Verisign Secured SSL certified site which gives maximum security to the users. All the online payments are made through our payment gateway EBS which is approved by McAfee Secure, Verisign by Norton secure, PCI Security Standards, and ISO 27001 Certified.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <FiFileText className="mr-2 text-red-600" /> What is Cash on Delivery (COD)?
        </h3>
        <p className="mb-8">
          Cash on delivery (COD) is a payment option in which, at the time of delivery, you hand over the **CASH** against delivery of the product. The product will be delivered in a sealed condition. Please **DO NOT accept any packet which appears to be tampered or damaged externally**. Please **DO NOT pay more than the order value**. You pay for what you see on the Website and there are no hidden charges. For any other query, you can inform us through mail or call our customer care, and we will be glad enough to help you with the query.
        </p>


        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaGavel className="mr-3 text-red-600 text-3xl" /> Trademark
        </h2>
        <p className="mb-8">
          The logo/image of Sathya Mobiles on the home page of the website & other pages and as used in the communication to the User is registered by SATHYA Mobiles India Pvt Ltd and cannot be used or communicated or distributed without the specific and written permission of SATHYA Mobiles India Pvt Ltd.
        </p>

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaUserCircle className="mr-3 text-red-600 text-3xl" /> Account
        </h2>
        <p className="mb-4">
          If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and also you agree to accept responsibility for all activities that occur under your account or password.
        </p>
        <p className="mb-4">
          SATHYA Mobiles India Pvt Ltd does sell products to children, but it sells them to adults, who can purchase with a credit/Debit card or COD. If you are under 18, you may use SATHYA Mobiles India Pvt Ltd only with the involvement of a parent or guardian or otherwise, SATHYA Mobiles India Pvt Ltd has the right to cancel any order or service to the User.
        </p>
        <p className="mb-4">
          SATHYA Mobiles India Pvt Ltd and its affiliates reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in their sole discretion.
        </p>
        <p className="mb-8">
          SATHYA Mobiles India Pvt. Ltd is associated with various business partners for the supply and service of goods directly to the customers. SATHYA Mobiles India Pvt Ltd is a marketplace for the products with its business partners. The after-sales service and warranty for the products sold by our business partners, as duly applicable, for the respective products, will be undertaken and handled by the respective business partners or through their respective service centers.
        </p>


        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <MdOutlinePolicy className="mr-3 text-red-600 text-3xl" /> Applicable Law
        </h2>
        <p className="mb-4">
          This site is created and controlled by SATHYA Mobiles India Pvt Ltd. The laws of India shall apply, and courts in Tuticorin shall have jurisdiction in respect of all the terms, conditions, and disclaimers. SATHYA Mobiles India Pvt Ltd reserves the right to make changes to the website and the terms, conditions, and disclaimers at any time and without any prior information provided to the customers/users of the services/website of SATHYA Mobiles India Pvt Ltd.
        </p>
        <p className="mb-6">
          This Agreement shall be governed by and interpreted and construed in accordance with the laws of India. The place of jurisdiction shall be in Tuticorin, Tamil Nadu.
        </p>
        <p className="mb-8 text-base text-gray-700 italic font-semibold">
          **Please Note:** All products sold on sathyamobiles.com / SATHYA Mobiles India Pvt Ltd are brand new and 100% genuine.
        </p>

        

        <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
          <FaComments className="mr-3 text-red-600 text-3xl" /> Terms and Conditions for Communication
        </h2>
        <p className="mb-8">
          Acceptance to receive communications (Promotional and Transactional) through omni channels (Emails, SMS, WhatsApp, Telephone etc.) from the SATHYA Mobiles India Pvt Ltd, its affiliates, and third-party vendors.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          <em>Last updated on: {currentDate}</em>
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
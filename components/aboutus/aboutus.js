'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillAwardFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { MdBusiness, MdWork, MdVisibility, MdRocketLaunch, MdCategory, MdOutlineLink } from "react-icons/md";
import { FiShield, FiFileText, FiRotateCcw } from "react-icons/fi";

import { GiNetworkBars } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa";
import { FiHeadphones,  FiSettings,FiTag, FiTarget, FiMapPin, FiAward, FiUsers,FiUser,  FiMonitor, FiSpeaker, FiShoppingCart, FiStar } from 'react-icons/fi';




const AboutUs = () => {


  return (
    <div className="text-[#1d1d1f]">

         {/* 🟠 About us Header Bar */}
              <div className="bg-red-100 py-4 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">About Us</h2>
                <div className="flex items-center space-x-2">
                  <Link href="/" className="text-gray-600 hover:text-red-600">🏠 Home</Link>
                  <span className="text-gray-500">›</span>
                  <span className="text-red-600 font-semibold">About us</span>
                </div>
              </div>

              
      
 {/* About Us Content Section */}
      <div className="container mx-auto px-8 py-2">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">About Sathya Mobiles</h1>

        {/* Our Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
            <MdBusiness className="mr-3 text-red-600 text-3xl" /> Our Info
          </h2>
          <p className="text-md leading-relaxed text-gray-700">
            Our business venture started in **1983** in a modest form in the Pearl City called **TUTICORIN** located in the southernmost part of Tamil Nadu, India. At present, our **SATHYA Agencies Pvt. Ltd.**, has been spread all over south Tamil Nadu with **81 branches** and its Head Office in **TUTICORIN**.
          </p>
        </div>

    
        {/* Our Works */}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
            <MdWork className="mr-3 text-red-600 text-3xl" /> Our Works
          </h2>
          <p className="text-md leading-relaxed text-gray-700 mb-4">
            Basically, we are dealing with all kinds of Consumer Electronics, Household articles, Kitchen wares, etc.
          </p>
          <ul className="list-disc list-inside text-md leading-relaxed text-gray-700 space-y-2">
            <li className="flex items-center"><FaThumbsUp className="mr-2 text-red-600 flex-shrink-0"/> **Wide product range, best brands, customer satisfaction, competitive pricing** are our trademarks.</li>
            <li className="flex items-center"><FiTag className="mr-2 text-red-600 flex-shrink-0"/> **0% interest installment schemes, exchange offers and attractive seasonal gifts** are our sales boosters.</li>
          </ul>
        </div>

       

        {/* Our Vision */}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
            <MdVisibility className="mr-3 text-red-600 text-3xl" /> Our Vision
          </h2>
          <p className="text-md font-semibold text-gray-800 italic leading-relaxed">
            &quot;To make life easier by adding the latest products to your lifestyle&quot;
          </p>
        </div>

       

        {/* Our Mission */}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
            <MdRocketLaunch className="mr-3 text-red-600 text-3xl" /> Our Mission
          </h2>
          <p className="text-md font-semibold text-gray-800 italic leading-relaxed">
            &quot;To spread happiness in you by the essential products and to make you delight by our valuable customer service&quot;
          </p>
        </div>

       

       

       
      </div>
    </div>
  );
};

export default AboutUs;

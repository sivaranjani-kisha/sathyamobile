"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiShield, FiLock, FiMail} from 'react-icons/fi';
import { FaCookieBite } from 'react-icons/fa'; // Keep this import as it is
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


const PrivacyPolicy = () => {

    const [currentDate, setCurrentDate] = useState('');
    
    useEffect(() => {
        // This will only run on client side after hydration
        setCurrentDate(new Date().toLocaleDateString());
    }, []);
    return (

        <div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-red-100 py-4 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-gray-600 hover:text-red-600">🏠 Home</Link>
                            <span className="text-gray-500">›</span>
                            <span className="text-red-600 font-semibold">Privacy policy</span>
                    </div>
            </div>

            {/* Privacy Policy Content */}
         <div className="container mx-auto px-8 py-12 text-gray-800 leading-relaxed">

    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Privacy Policy</h1>

    <p className="mb-8">
        We value the trust you place in us. That's why we insist upon the highest standards for secure transactions and customer information privacy. By visiting this website you agree to be bound by the terms and conditions of this Privacy Policy. If you do not agree, please do not use or access our Site. By mere use of the website, you expressly consent to our use and disclosure of your personal information in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to the terms of the User Agreement.
    </p>

    

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <MdOutlineCollectionsBookmark className="mr-3 text-red-600 text-3xl" /> Collection of Personally Identifiable Information and Other Information
    </h2>
    <p className="mb-4">
        When you use our website, we collect and store your personal information. Our primary goal in doing so is to provide a safe, efficient, smooth, and customized experience. This allows us to provide services and features that most likely meet your needs and to customize our Site to make your experience safer and easier. Importantly, we only collect personal information about you that we consider necessary for achieving this purpose.
    </p>
    <p className="mb-4">
        In general, you can browse the website without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information by choosing not to use a particular service or feature on the website. You may provide us with a user ID.
    </p>
    <p className="mb-4">
        We may automatically track certain information about you based upon your behavior on our site. We use this information to do internal research on our users' demographics, interests, and behavior to better understand, protect, and serve our users. This information is compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our site or not), which URL you next go to (whether this URL is on our site or not), your computer browser information, and your IP address.
    </p>
    <p className="mb-6 flex items-start">
        <FaCookieBite className="mt-1 mr-3 text-red-600 text-xl flex-shrink-0" /> We use data collection devices such as &quot;cookies&quot; on certain pages of the website to help analyze our web page flow, measure promotional effectiveness, and promote trust and safety. &quot;Cookies&quot; are small files placed on your hard drive that assist us in providing our services. We offer certain features that are only available through the use of a &quot;cookie&quot;. We also use cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are &quot;session cookies,&quot; meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline our cookies if your browser permits, although in that case you may not be able to use certain features on the website and you may be required to reenter your password more frequently during a session. Additionally, you may encounter &quot;cookies&quot; or other similar devices on certain pages of the website that are placed by third parties. We do not control the use of cookies by third parties.
    </p>
    <p className="mb-4">
        If you choose to buy on the website, we collect information about your buying behavior. If you transact with us, we collect some additional information, such as a billing address, a credit/debit card number and a credit/debit card expiration date and/or other payment instrument details and tracking information.
    </p>
    <p className="mb-4">
        If you choose to post messages on our Reviews or leave feedback, we will collect that information you provide to us. We retain this information as necessary to resolve disputes, provide customer support and troubleshoot problems as permitted by law. If you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the Site, we may collect such information into a file specific to you.
    </p>
    <p className="mb-8">
        We collect personally identifiable information (email address, name, phone number, credit card/debit card/other payment instrument details, etc.) from you when you set up a free account with us. While you can browse some sections of our site without being a registered member, certain activities (such as placing an order) do require registration. We do use your contact information to send you offers based on your previous orders and your interests.
    </p>

  

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <IoIosInformationCircle className="mr-3 text-red-600 text-3xl" /> Use of Demographic / Profile Data / Your Information
    </h2>
    <p className="mb-4">
        We use personal information to provide the services you request. To the extent we use your personal information to market to you, we will provide you the ability to opt-out of such uses. We use your personal information to resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services, inform you about online and offline offers, products, services, and updates; customize your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection.
    </p>
    <p className="mb-8">
        In our efforts to continually improve our product and service offerings, we collect and analyze demographic and profile data about our users' activity on our website. We identify and use your IP address to help diagnose problems with our server, and to administer our website. Your IP address is also used to help identify you and to gather broad demographic information. We will occasionally ask you to complete optional online surveys. These surveys may ask you for contact information and demographic. We use this data to tailor your experience at our site, providing you with content that we think you might be interested in and to display content according to your preferences.
    </p>


    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <FaCookieBite className="mr-3 text-red-600 text-3xl" /> Cookies
    </h2>
    <p className="mb-8">
        A &quot;cookie&quot; is a small piece of information stored by a Web server on a Web browser so it can be later read back from that browser. Cookies are useful for enabling the browser to remember information specific to a given user. We place both permanent and temporary cookies in your computer&apos;s hard drive. The cookies do not contain any of your personally identifiable information.
    </p>

   

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <FiShield className="mr-3 text-red-600 text-3xl" /> Sharing of Personal Information
    </h2>
    <p className="mb-4">
        We may share personal information with our other corporate entities and affiliates to: help detect and prevent identity theft, fraud and other potentially illegal acts; correlate related or multiple accounts to prevent abuse of our services; and to facilitate joint or co-branded services that you request where such services are provided by more than one corporate entity. Those entities and affiliates may not market to you as a result of such sharing unless you explicitly option.
    </p>
    <p className="mb-8">
        We may disclose personal information if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal information to law enforcement offices, third-party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
    </p>

   

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <Link href="/other-sites" className="flex items-center text-red-700 hover:text-red-900">
            <FiLock className="mr-3 text-red-600 text-3xl" /> Links to Other Sites
        </Link>
    </h2>
    <p className="mb-8">
        Our site links to other websites that may collect personally identifiable information about you. **sathyamobiles.com** is not responsible for the privacy practices or the content of those linked websites.
    </p>

    

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <MdOutlineSecurity className="mr-3 text-red-600 text-3xl" /> Security Precautions
    </h2>
    <p className="mb-8">
        Our site has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession, we adhere to strict security guidelines, protecting it against unauthorized access.
    </p>


    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <FiMail className="mr-3 text-red-600 text-3xl" /> Choice/Opt-Out
    </h2>
    <p className="mb-8">
        We provide all users with the opportunity of receiving non-essential (promotional, marketing-related) communications from us, after setting up an account. If you want to remove your contact information from **sathyamobiles.com**, kindly send an email to <a href="mailto:info@sathyainia.com" className="text-red-600 hover:underline font-semibold">info@sathyaindia.com</a>.
    </p>

  

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <MdPolicy className="mr-3 text-red-600 text-3xl" /> Your Consent
    </h2>
    <p className="mb-8">
        By using the Website and/or by providing your information, you consent to the collection and use of the information you disclose on the website in accordance with this Privacy Policy, including but not limited to your consent for sharing your information as per this privacy policy. If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.
    </p>

   

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <IoIosInformationCircle className="mr-3 text-red-600 text-3xl" /> Grievance
    </h2>
    <p className="mb-2">For any grievance or concern, contact us at <a href="mailto:info@sathyaindia.com" className="text-red-600 hover:underline font-semibold">info@sathyaindia.com</a></p>
    <ul className="list-disc list-inside mb-6 space-y-1">
        <li><strong>Name:</strong> Mr. Charles Packiaraj</li>
        <li><strong>Address:</strong> 2/86, Palaymkottai Main Road, NH7A, Maravanmadam Tuticorin 628101</li>
        <li><strong>Phone:</strong> 9894024985</li>
        <li><strong>Time:</strong> 9 am to 6 pm Mon-Sat (IST)</li>
    </ul>
    <p className="mb-8 text-sm text-gray-600 italic">
        <strong>Note:</strong> Our privacy policy is subject to change at any time without notice. To make sure you are aware of any changes, please review this policy periodically. By visiting this website you agree to be bound by the terms and conditions of this Privacy Policy. If you do not agree, please do not use or access our Site.
    </p>

    

    <h2 className="text-2xl font-extrabold text-red-700 mb-6 pb-2 flex items-center border-b-2 border-red-200">
        <IoIosInformationCircle className="mr-3 text-red-600 text-3xl" /> Disclaimers
    </h2>
    <p className="mb-4">
        This site is created and controlled by **Sathya Mobiles India Pvt Ltd.** The laws of India shall apply and courts in Tuticorin shall have jurisdiction in respect of all the terms, conditions, and disclaimers. **Sathya Mobiles India Pvt Ltd.**, reserves the right to make changes to the website and the terms, conditions, and disclaimers at any time and without any prior information provided to the customers/users of the services/website of **Sathya Mobiles India Pvt Ltd.**
    </p>
    <p className="mb-6">
        This Agreement shall be governed by and interpreted and construed in accordance with the laws of India. The place of jurisdiction shall be in Tuticorin, Tamil Nadu.
    </p>
    <p className="mb-6 text-base text-gray-700 italic font-semibold">
        <strong>Note:</strong> All products sold on **sathyamobiles.com** are brand new and 100% genuine. We are the authorized dealers of all companies&apos; products shown on our site.
    </p>
    <p className="text-sm text-gray-500 mt-8">
        <em>Last updated on: {currentDate}</em>
    </p>
</div>
            
            </div>
        );
    };

export default PrivacyPolicy;
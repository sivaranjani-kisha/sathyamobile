// app/page.js (or any React component)
'use client';
import ProductPrebook from "@/components/prebook/prebook"; // Update the path if needed

const imageUrls = [
  '/images/prebook_image1.png',
  '/images/prebook_image2.png',
  '/images/prebook_image3.png',
  '/images/prebook_image4.png',
  '/images/prebook_image5.png',
  '/images/prebook_image6.png',
  '/images/prebook_image7.png',

];

export default function HomePage() {
  return (
    <div>
      <ProductPrebook imageUrls={imageUrls} productName="Galaxy S24 Ultra" />
    </div>
  );
}

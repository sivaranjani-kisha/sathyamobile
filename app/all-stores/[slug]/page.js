import connectDB from "@/lib/db";
import storeModel from "@/models/store";
import Link from "next/link";

export default async function StoreDetailPage({ params }) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const slug = params.slug;
  const formattedSlug = normalize(slug.replace(/-/g, " "));

  await connectDB();

  const allStores = await storeModel.find({});

  const store = allStores.find((store) => {
    const normalizedName = normalize(store.organisation_name);
    return normalizedName === formattedSlug;
  });

  if (!store) {
    return <div className="p-4 text-red-500">Store not found</div>;
  }

  const whatsappURL = `https://wa.me/${store.phone}`;
  const directionURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  const enquiryURL = `mailto:info@sathyamobiles.com?subject=Enquiry about ${store.organisation_name}`;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6">Address</h2>

      {/* Address Details */}
      <div className="text-gray-800 space-y-2 mb-6">
        <p><strong>📍 Address:</strong> {store.address}</p>
        <p><strong>📞 Mobile:</strong> <span className="text-red-600">{store.phone}</span></p>
        <p><strong>🕒 Opening Hours:</strong> {store.opening_hours || "Sunday – Monday: 09:30 AM – 09:30 PM"}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-8">
        <Link href={directionURL} target="_blank">
          <div className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold">
            DIRECTION
          </div>
        </Link>
        <Link href={enquiryURL}>
          <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold">
            ENQUIRY
          </div>
        </Link>
        <Link href={whatsappURL} target="_blank">
          <div className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
            WHATSAPP
          </div>
        </Link>
      </div>

      {/* Store Image */}
      {/* {store.images?.length > 0 && (
        <div className="mb-6 flex justify-center">
          <img
            src={store.images[0]}
            alt={store.organisation_name}
            className="rounded-md shadow-md"
          />
        </div>
      )} */}

      {/* Embedded Google Map */}
      {store.address && (
        <div className="mb-6">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Store Description */}
      <h3 className="text-2xl font-semibold mb-2">{store.organisation_name}</h3>
      <p className="text-gray-700">{store.description || "No description available."}</p>
    </div>
  );
}

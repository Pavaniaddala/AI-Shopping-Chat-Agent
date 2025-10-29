interface PhoneCardProps {
  phone: {
    brand: string;
    model: string;
    price: number;
    specs?: {
      display?: string;
      processor?: string;
      camera?: string;
      battery?: string;
    };
    features: string[];
    pros: string[];
    cons: string[];
    reviews?: { user: string; comment: string }[];
  };
}

export default function PhoneCard({ phone }: PhoneCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-4 hover:shadow-xl transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {phone.brand} {phone.model}
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            ₹{phone.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-gray-600 font-medium">Display</p>
          <p className="text-gray-800">{phone.specs?.display ?? "N/A"}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <p className="text-gray-600 font-medium">Processor</p>
          <p className="text-gray-800">{phone.specs?.processor ?? "N/A"}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-gray-600 font-medium">Camera</p>
          <p className="text-gray-800">{phone.specs?.camera ?? "N/A"}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2">
          <p className="text-gray-600 font-medium">Battery</p>
          <p className="text-gray-800">{phone.specs?.battery ?? "N/A"}</p>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {phone.features.map((feature, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="font-semibold text-green-700 mb-1">✓ Pros:</p>
          <ul className="text-gray-700 space-y-0.5">
            {phone.pros.slice(0, 2).map((pro, idx) => (
              <li key={idx}>• {pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-red-700 mb-1">✗ Cons:</p>
          <ul className="text-gray-700 space-y-0.5">
            {phone.cons.slice(0, 2).map((con, idx) => (
              <li key={idx}>• {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews */}
      {phone.reviews && phone.reviews.length > 0 && (
        <div className="mt-3 text-xs bg-gray-100 rounded p-2">
          <p className="font-semibold mb-1">User Reviews:</p>
          {phone.reviews.map((review, idx) => (
            <p key={idx} className="mb-1">
              <strong>{review.user}</strong>: {review.comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

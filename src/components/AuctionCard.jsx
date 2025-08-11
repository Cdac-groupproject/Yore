import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function extractRoleName(roleStr) {
  const match = roleStr?.match(/roleName=([^,)]+)/);
  return match ? match[1] : null;
}

function AuctionCard({ image, title, autioneer, sdate, edate, auctionId, basePrice, currentHighestBid, onView, cardWidth }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isOnGoingPage = location.pathname === "/ongoing";

  // Get user role from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const roleName = extractRoleName(user?.role);

  const handleViewAuction = () => {
    if (roleName === "AUCTIONEER") {
      navigate(`/auctioneer/ongoing/${auctionId}`);
    } else if (roleName === "BIDDER") {
      navigate(`/bidder/${auctionId}`);
    } else {
      // default fallback or alert
      alert("Access denied: unknown role");
    }
  };

  return (
    <div className={`bg-[#fdf6ec] py-8 px-4 flex justify-center ${cardWidth || "w-full"}`}>
      <div className="flex flex-col md:flex-row items-center bg-white border border-yellow-600 rounded-2xl shadow-md w-full max-w-xl overflow-hidden hover:shadow-xl transition duration-300">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={image}
            alt="Auction Banner"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Right Info Section */}
        <div className="w-full md:w-1/2 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-[#5e3b1e]">{title}</h2>

          <div className="flex items-center text-[#5e3b1e] gap-2">
            <FaUser className="text-yellow-600" />
            <p className="text-md">
              Auctioneer: <span className="font-medium">{autioneer}</span>
            </p>
          </div>

          <div className="flex items-center text-[#5e3b1e] gap-2">
            <FaCalendarAlt className="text-yellow-600" />
            <p className="text-md">
              Start Date: <span className="font-medium">{sdate}</span>
            </p>
          </div>
    <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Base Price</div>
            <div className="text-sm font-medium">
              ₹{basePrice != null ? basePrice.toFixed(2) : "--"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Highest Bid</div>
            <div className="text-sm font-medium text-green-600">
              {currentHighestBid != null
                ? `₹${currentHighestBid.toFixed(2)}`
                : "No bids"}
            </div>
          </div>
        </div>

          <div className="flex items-center text-[#5e3b1e] gap-2">
            <FaCalendarAlt className="text-yellow-600" />
            <p className="text-md">
              End Date: <span className="font-medium">{edate}</span>
            </p>
          </div>
          {isOnGoingPage && (
            <button
              onClick={handleViewAuction}
              className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-yellow-700 hover:scale-95 cursor-pointer transition-all duration-200"
            >
              View Auction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;

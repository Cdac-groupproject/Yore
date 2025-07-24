import { FaCalendarAlt, FaUser } from "react-icons/fa";
function AuctioneerAuctionCard({ image, title, autioneer, sdate, edate }) {
  return (
    <div className="bg-[#fdf6ec] py-8 px-4 flex justify-center">
      <div className="flex flex-col md:flex-row items-center bg-white border border-yellow-600 rounded-2xl shadow-md w-full max-w-4xl overflow-hidden hover:shadow-xl transition duration-300">
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

          <div className="flex items-center text-[#5e3b1e] gap-2">
            <FaCalendarAlt className="text-yellow-600" />
            <p className="text-md">
              End Date: <span className="font-medium">{edate}</span>
            </p>
          </div>

          <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-yellow-700 hover:scale-95 cursor-pointer transition-all duration-200">
            View Auction
          </button>
          <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-yellow-700 hover:scale-95 cursor-pointer transition-all duration-200">
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuctioneerAuctionCard;

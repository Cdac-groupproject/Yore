import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnGoingAuction from "./pages/OnGoingAuction";
import UpcomingAuction from "./pages/UpcomingAuction";
import Profile from "./components/Profile";
import ContactUs from "./pages/ContactUs";
import UpdateProduct from "./pages/MuseumManager/UpdateProduct";
import AddProduct from "./pages/MuseumManager/AddProduct";
import ProductList from "./pages/MuseumManager/ProductList";
import OrdersPage from "./pages/MuseumManager/OrdersPage";
import AuctioneerSessionSummary from "./pages/Auctioneer/AuctioneerSessionSummary";
import AuctioneerOngoingPage from "./pages/Auctioneer/AuctioneerOngoingPage";
import AuctioneerUpcomingAuction from "./pages/Auctioneer/AuctioneerUpcomingAuction";

//import ContactUs from "./pages/ContactUs";
import EmployeesList from "./pages/EmployeesList";

import BiddersAuction from "./pages/BiddersAuction";
import { Toaster } from "react-hot-toast";
import AddEmployee from "./pages/AddEmployee";
import OtpVerification from "./components/OtpVerification";
import AuctionDetail from "./components/Bidder/AuctionDetail";
import AddAuctionPage from "./pages/Auctioneer/AddAuctionPage";
import AuctionListPage from "./pages/Auctioneer/AuctionListPage";
import AllUsers from "./pages/AllUsers";
import MuseumArtifacts from "./pages/MuseumArtifacts";
import AddArtifacts from "./pages/AddArtifacts";
import BidderOrders from "./pages/BidderOrders";

function App() {
  return (
    <div className="w-screen border-t-orange-200">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "0.9rem",
            borderRadius: "8px",
          },
          success: {
            style: {
              background: "#15803d", // green for success
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#dc2626", // red for error
              color: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ongoing" element={<OnGoingAuction />} />
        <Route path="/upcoming" element={<UpcomingAuction />} />
        <Route path="/bidder/:auctionId" element={<BiddersAuction />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route
          path="/auctioneer/upcoming"
          element={<AuctioneerUpcomingAuction />}
        />
        <Route
          path="/auctioneer/summary"
          element={<AuctioneerSessionSummary />}
        />
        <Route
          path="/auctioneer/ongoing/:auctionId"
          element={<AuctioneerOngoingPage />}
        />

        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/bidders/:auctionId" element={<BiddersAuction />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employees" element={<EmployeesList />} />
        <Route path="/museummanager/addproduct" element={<AddProduct />} />
        <Route path="/museummanager/productlist" element={<ProductList />} />
        <Route path="/museummanager/orders" element={<OrdersPage />} />
        <Route path="/update-product/:productId" element={<UpdateProduct />} />
        <Route path="/auctions/:auctionId" element={<AuctionDetail />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/create-auction" element={<AddAuctionPage />} />
        <Route path="/auction-list" element={<AuctionListPage />} />

        <Route path="/museum-art" element={<MuseumArtifacts />} />
        <Route path="/add-artifact" element={<AddArtifacts />} />

        <Route path="/bidder/orders" element={<BidderOrders />} />

        <Route path="/all-users" element={<AllUsers />} />
      </Routes>
    </div>
  );
}

export default App;

// ...inside <Routes>

import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnGoingAuction from "./pages/OnGoingAuction";
import UpcomingAuction from "./pages/UpcomingAuction";
import Profile from "./components/Profile";       
import ContactUs from "./pages/ContactUs";
import UpdateProduct from './pages/MuseumManager/UpdateProduct';
import AddProduct from "./pages/MuseumManager/AddProduct";
import ProductList from "./pages/MuseumManager/ProductList";

import AuctioneerSessionSummary from "./pages/Auctioneer/AuctioneerSessionSummary";
import AuctioneerOngoingPage from "./pages/Auctioneer/AuctioneerOngoingPage";
import AuctioneerUpcomingAuction from "./pages/Auctioneer/AuctioneerUpcomingAuction";

//import ContactUs from "./pages/ContactUs";

import BiddersAuction from "./pages/BiddersAuction";
import { Toaster } from "react-hot-toast";
import AddEmployee from "./pages/AddEmployee";

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
        <Route path="/bidder" element={<BiddersAuction />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route
          path="/auctioneer/upcoming"
          element={<AuctioneerUpcomingAuction />}
        />
        <Route
          path="/auctioneer/summary"
          element={<AuctioneerSessionSummary />}
        />
        <Route path="/auctioneer/ongoing" element={<AuctioneerOngoingPage />} />

        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/contact-us" element={<ContactUs />} />

         <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/museummanager/addproduct" element={<AddProduct />}/>
        <Route path="/museummanager/productlist" element={<ProductList />}/>
        <Route path="/update-product" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
}

export default App;


// ...inside <Routes>


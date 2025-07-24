import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnGoingAuction from "./pages/OnGoingAuction";
import UpcomingAuction from "./pages/UpcomingAuction";
import Profile from "./components/Profile";
import BiddersAuction from "./pages/BiddersAuction";

import AuctioneerSessionSummary from "./pages/Auctioneer/AuctioneerSessionSummary"
import AuctioneerOngoingPage from "./pages/Auctioneer/AuctioneerOngoingPage";
import AuctioneerUpcomingAuction from './pages/Auctioneer/AuctioneerUpcomingAuction';

function App() {
  return (
    <div className="w-screen border-t-orange-200">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ongoing" element={<OnGoingAuction />} />
        <Route path="/upcoming" element={<UpcomingAuction />} />
        <Route path="/bidder" element={<BiddersAuction />} />
       
        <Route path="/auctioneer/upcoming" element={<AuctioneerUpcomingAuction />} />
        <Route path="/auctioneer/summary" element={<AuctioneerSessionSummary/>}/>
        <Route path="/auctioneer/ongoing" element={<AuctioneerOngoingPage/>}/>
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </div>
  );
}

export default App;

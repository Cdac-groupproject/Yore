import logo from "../assets/newLogo.png";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#fefae0] bg-opacity-90 flex flex-col items-center justify-center">
      <img
        src={logo}
        alt="Loading..."
        className="h-20 w-20 animate-pulse-slow mb-4"
      />
      <p className="text-yellow-900 text-lg font-semibold animate-fade">
        {message}
      </p>
    </div>
  );
};

export default Loader;

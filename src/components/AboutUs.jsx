import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-[#fdf6ec] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#5e3b1e] mb-6">About YORE</h2>
        <p className="text-[#5e3b1e] text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
          <strong>YORE</strong> is a vintage-themed online auction platform
          designed to bring antique enthusiasts, collectors, and sellers
          together in a trusted digital space. We’re passionate about giving
          timeless treasures a second life through secure and engaging bidding
          experiences.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-yellow-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-2xl font-semibold text-[#5e3b1e] mb-2">
              Our Vision
            </h3>
            <p className="text-sm text-[#5e3b1e]">
              To become the most trusted and elegant online destination for
              discovering, bidding on, and preserving valuable artifacts from
              the past.
            </p>
          </div>
          <div className="bg-white border border-yellow-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-2xl font-semibold text-[#5e3b1e] mb-2">
              Our Mission
            </h3>
            <p className="text-sm text-[#5e3b1e]">
              We aim to empower auctioneers and collectors by offering seamless
              bidding tools, secure payment systems, and a platform that
              respects the stories behind each object.
            </p>
          </div>
          <div className="bg-white border border-yellow-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-2xl font-semibold text-[#5e3b1e] mb-2">
              Why YORE?
            </h3>
            <p className="text-sm text-[#5e3b1e]">
              YORE stands for "Your Own Rare Estate" — we celebrate heritage,
              craftsmanship, and stories that last generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

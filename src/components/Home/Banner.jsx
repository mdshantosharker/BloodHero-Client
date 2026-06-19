import Link from "next/link";
import { HeartPulse, Search, UserPlus } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-red-600 via-red-500 to-red-700 w-full">
      <div className="max-w-7xl mx-auto px-5 py-24 grid md:grid-cols-2 gap-10 items-center">
        {/* Text */}

        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-5">
            <HeartPulse size={20} />

            <span>Save Lives Together</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Donate Blood,
            <br />
            <span className="text-red-100">Be Someone's Hero</span>
          </h1>

          <p className="mt-5 text-red-100 max-w-lg text-lg">
            Join BloodHero and connect with people who need blood. Your small
            action can give someone a second chance.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/auth/registration"
              className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition shadow-lg"
            >
              <UserPlus size={20} />
              Join as a donor
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition"
            >
              <Search size={20} />
              Search Donors
            </Link>
          </div>
        </div>

        {/* Right Card */}

        <div className="flex justify-center">
          <div className="relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white flex items-center justify-center shadow-2xl">
                <div className="text-center text-red-600">
                  <HeartPulse size={80} className="mx-auto" />

                  <h2 className="text-3xl font-bold mt-3">BloodHero</h2>

                  <p className="text-gray-500">Every drop matters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { HeartPulse, Search, UserPlus } from "lucide-react";

export default function Banner() {
  return (
    <section
      className="relative overflow-hidden w-full bg-cover bg-center bg-no-repeat py-24 md:py-32"
      style={{ backgroundImage: "url('/banner3.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/60 to-black/40 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-sm">
            <HeartPulse size={18} className="text-red-500 animate-pulse" />
            <span className="text-xs md:text-sm font-medium tracking-wide text-gray-200">
              Save Lives Together
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Donate Blood,
            <br />
            <span className="bg-linear-to-r from-red-500 via-red-400 to-pink-500 bg-clip-text text-transparent">
              Be Someone's Hero
            </span>
          </h1>

          <p className="text-gray-300 max-w-lg text-lg leading-relaxed font-normal">
            Join BloodHero and connect with people who need blood. Your small
            action can give someone a second chance.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/auth/registration"
              className="flex items-center gap-2 bg-red-600 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus size={20} />
              Join as a donor
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white hover:text-slate-950 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search size={20} />
              Search Donors
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-red-600 to-red-900 blur-3xl opacity-20 group-hover:opacity-35 transition duration-1000" />

            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/4 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-slate-950/40 backdrop-blur-lg border border-white/5 flex items-center justify-center shadow-inner">
                <div className="text-center text-white p-4">
                  <HeartPulse
                    size={70}
                    className="mx-auto text-red-500 drop-shadow-lg animate-bounce animation-duration-[2.5s]"
                  />
                  <h2 className="text-3xl font-black tracking-tight mt-3 bg-linear-to-b from-white to-gray-300 bg-clip-text text-transparent">
                    BloodHero
                  </h2>
                  <p className="text-gray-400 font-medium text-sm mt-1">
                    Every drop matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { HeartHandshake, Search, ShieldCheck, Clock } from "lucide-react";

export default function Featured() {
  const features = [
    {
      icon: HeartHandshake,
      title: "Trusted Donors",
      text: "Connect with verified blood donors and build a life saving community.",
    },

    {
      icon: Search,
      title: "Find Blood Easily",
      text: "Search donors by blood group and location whenever you need.",
    },

    {
      icon: Clock,
      title: "Quick Response",
      text: "Emergency blood requests reach nearby donors faster.",
    },

    {
      icon: ShieldCheck,
      title: "Safe Platform",
      text: "Your information stays protected with our secure system.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 py-20">
      {/* Heading */}

      <div className="text-center mb-12">
        <p className="text-red-500 font-semibold">Why BloodHero?</p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
          Together We Can Save Lives
        </h2>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Our platform connects blood donors and recipients to make emergency
          blood donation simple and faster.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-md
              border
              hover:-translate-y-2
              transition
              "
            >
              <div
                className="
              w-14 h-14
              rounded-xl
              bg-red-100
              flex
              items-center
              justify-center
              text-red-600
              mb-5
              "
              >
                <Icon size={30} />
              </div>

              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

              <p className="text-gray-500 text-sm leading-6">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

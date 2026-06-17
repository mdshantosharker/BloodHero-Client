import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-20">
      {/* Title */}

      <div className="text-center mb-12">
        <p className="text-red-500 font-semibold">Contact Us</p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
          Get In Touch With BloodHero
        </h2>

        <p className="text-gray-500 mt-3">
          Have questions or need help? Contact us anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <h3 className="text-2xl font-semibold mb-6">Send Message</h3>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              className="
              w-full
              bg-red-500
              text-white
              py-3
              rounded-xl
              font-semibold
              hover:bg-red-600
              transition
              "
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}

        <div
          className="
        bg-gradient-to-br 
        from-red-600 
        to-red-800
        rounded-2xl
        p-8
        text-white
        shadow-lg
        "
        >
          <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Phone />
              </div>

              <div>
                <p className="text-red-100 text-sm">Phone Number</p>

                <p className="font-semibold">+880 1234-567890</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Mail />
              </div>

              <div>
                <p className="text-red-100 text-sm">Email</p>

                <p className="font-semibold">support@bloodhero.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <MapPin />
              </div>

              <div>
                <p className="text-red-100 text-sm">Location</p>

                <p className="font-semibold">Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white/10 rounded-xl p-5">
            <p className="text-sm leading-6 text-red-100">
              Every message helps us improve BloodHero and connect more donors
              with people in need.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

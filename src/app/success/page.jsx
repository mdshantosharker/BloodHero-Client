import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { createPayment } from "@/lib/api/payments/action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const sessionData = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const {
    status,
    customer_details: { email: customerEmail },
    amount_total,
  } = sessionData;

  if (status === "open") {
    return redirect("/");
  }

  const paidAmount = amount_total ? amount_total / 100 : 0;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (status === "complete") {
    await createPayment({
      userId: user?.id || null,
      email: customerEmail || user?.email,
      name: user?.name || "Anonymous Donor",
      amount: Number(paidAmount),
    });

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-50 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce">
                <CheckCircle size={44} className="stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xs">
                <HeartHandshake size={12} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Donation Successful! 🎉
            </h1>
            <p className="text-gray-500 text-sm font-medium leading-relaxed px-2">
              Thank you so much for your generosity. Your contribution is
              helping us save lives every single day.
            </p>
          </div>

          <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 text-sm space-y-3 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Payment Status</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Completed
              </span>
            </div>

            {paidAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">
                  Contributed Amount
                </span>
                <span className="font-black text-gray-900 text-base">
                  ৳{paidAmount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start gap-4 border-t border-gray-200/60 pt-3 mt-1">
              <span className="text-gray-500 font-medium shrink-0 flex items-center gap-1">
                <Mail size={14} className="text-gray-400" /> Donor Email
              </span>
              <span className="text-xs text-gray-700 font-bold truncate max-w-50">
                {customerEmail}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium px-4">
            A formal confirmation receipt has been sent to your email. For
            questions, contact{" "}
            <a
              href="mailto:support@bloodhero.com"
              className="text-red-500 hover:underline font-semibold"
            >
              support@bloodhero.com
            </a>
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="w-full py-3.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 active:bg-red-700 transition shadow-md shadow-red-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Go to Home</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

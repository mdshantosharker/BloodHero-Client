import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const UserSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = UserSession?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, email } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount input" },
        { status: 400 },
      );
    }

    const unitAmount = Math.round(parsedAmount * 100);

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email || email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: unitAmount,
            product_data: {
              name: "BloodHero Donation",
              description: "Support our platform to save lives",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        amount: parsedAmount,
        userId: user.id,
        userEmail: user.email,
        userName:user.name
      },
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Detailed Error:", err);

    return NextResponse.json(
      { error: err.raw?.message || err.message || "Stripe session failed" },
      { status: err.statusCode || 500 },
    );
  }
}

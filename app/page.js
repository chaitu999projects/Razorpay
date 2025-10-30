"use client";
import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "My Website",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response) => {
          const verify = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const result = await verify.json();
          alert(result.message);
        },
        prefill: {
          name: "Chaitanya",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb", // Tailwind blue-600
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Razorpay Payment
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Enter amount and pay securely using Razorpay
        </p>

        <input
          type="number"
          placeholder="Enter amount (₹)"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {loading ? "Processing..." : `Pay ₹${amount || 0}`}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Powered by <span className="text-blue-600 font-semibold">Razorpay</span>
        </p>
      </div>
    </div>
  );
}

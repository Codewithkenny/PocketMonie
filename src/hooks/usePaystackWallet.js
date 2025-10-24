import { useState } from "react";
import { toast } from "react-toastify";
import api from "../helper/api";

/**
 * Custom hook for initializing Paystack wallet deposits.
 * Handles payment flow, success verification, and UI feedback.
 */
export const usePaystackWallet = () => {
  const [loading, setLoading] = useState(false);

  // Initialize Paystack payment
  const initializePayment = async (amount, userEmail, onSuccessCallback) => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // 1️⃣ Initialize payment with backend (to get reference & auth)
      const { data } = await api.post(
        "/wallet/deposit/initialize",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { authorization_url, reference } = data;

      // 2️⃣ Open Paystack popup
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: amount * 100,
        ref: reference,
        onClose: () => {
          toast.info("Payment window closed.");
        },
        callback: async (response) => {
          toast.success("Payment successful! Verifying...");
          await verifyPayment(reference, onSuccessCallback);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Could not start deposit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the payment with backend
  const verifyPayment = async (reference, onSuccessCallback) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post(
        "/wallet/deposit/verify",
        { reference },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.status === "success") {
        toast.success("Wallet credited successfully!");
        if (onSuccessCallback) onSuccessCallback(data);
      } else {
        toast.error("Verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Could not verify deposit. Try again.");
    }
  };

  return { initializePayment, loading };
};

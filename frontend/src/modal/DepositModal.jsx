import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import api from "../../helper/api";
import { AuthContext } from "../context/AuthContext";

const DepositModal = ({ target, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [paystackReady, setPaystackReady] = useState(false);

    useEffect(() => {
        if (window.PaystackPop) {
            setPaystackReady(true);
        } else {
            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v1/inline.js";
            script.async = true;
            script.onload = () => setPaystackReady(true);
            document.body.appendChild(script);
        }
    }, []);

    const handleDeposit = async () => {
        if (!paystackReady) {
            alert("Payment service is loading. Please wait...");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");

            // Updated API URL to 'deposit' before wallet ID
            const res = await api.post(
                `/flex-wallet/deposit/${target.id}`,
                { amount: Number(target.targetAmount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { authorization_url, reference } = res.data;

            // Trigger Paystack popup with user's email from auth context
            const handler = window.PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                email: user?.email || "fallback@example.com",
                amount: Number(target.targetAmount) * 100, // amount in kobo
                ref: reference,
                onClose: () => alert("Payment window closed."),
                callback: async (response) => {
                    try {
                        await api.post(
                            `/flex-wallet/verify-deposit`,
                            { reference: response.reference, walletId: target.id },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert("Deposit successful!");
                        onClose();
                        onSuccess(); // expecting wallet refresh on parent
                    } catch (err) {
                        console.error("Verification failed:", err);
                        alert("Verification failed. Contact support.");
                    }
                },
            });

            handler.openIframe();
        } catch (err) {
            console.error("Payment failed:", err);
            alert("Payment initialization failed.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-8 rounded-2xl w-full max-w-md shadow-lg text-center">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">
                    Deposit to {target.title}
                </h2>
                <p className="text-gray-300 mb-6">
                    Amount: ₦{Number(target.targetAmount).toLocaleString()}
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeposit}
                        disabled={!paystackReady}
                        className={`px-6 py-2 rounded-md transition ${paystackReady
                            ? "bg-pink-500 hover:bg-pink-600 cursor-pointer"
                            : "bg-pink-300 cursor-not-allowed"
                            }`}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

DepositModal.propTypes = {
    target: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default DepositModal;

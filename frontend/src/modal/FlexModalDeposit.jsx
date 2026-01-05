import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../../helper/api";
import { toast } from "react-toastify";

export default function FlexDepositModal({ onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeposit = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }
        try {
            setLoading(true);
            // Call backend to initialise deposit (returns authorization_url or reference)
            const res = await api.post("/wallet/deposit/initiate", { amount: Number(amount) });
            const { authorization_url } = res.data;

            if (authorization_url) {
                // redirect to Paystack checkout
                window.location.href = authorization_url;
            } else {
                toast.error("Failed to initiate deposit");
            }
        } catch (err) {
            console.error("Deposit init error:", err);
            toast.error(err?.response?.data?.message || "Deposit initiation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        >
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-green-400">Deposit Funds</h2>

                <label className="block text-gray-300 text-sm mb-2">Amount (₦)</label>
                <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-lg outline-none mb-4 text-white"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg" disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={handleDeposit} className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-green-700" : "bg-green-500 hover:bg-green-600"}`} disabled={loading}>
                        {loading ? "Processing..." : "Proceed"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

FlexDepositModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

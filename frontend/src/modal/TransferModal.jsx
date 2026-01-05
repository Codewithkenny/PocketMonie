import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../helper/api";
import { toast } from "react-toastify";

export default function TransferModal({ onClose, onSuccess }) {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!recipient) {
            toast.error("Enter recipient email/username");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/wallet/transfer", { recipient, amount: Number(amount) });
            toast.success(res.data?.message || "Transfer successful");
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Transfer error:", err);
            toast.error(err?.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Transfer Funds</h2>

                <label className="block text-gray-300 text-sm mb-2">Recipient Email / Username</label>
                <input type="text" placeholder="Enter recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg outline-none mb-4 text-white" />

                <label className="block text-gray-300 text-sm mb-2">Amount (₦)</label>
                <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg outline-none mb-4 text-white" />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg" disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={handleTransfer} className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"}`} disabled={loading}>
                        {loading ? "Processing..." : "Transfer"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

TransferModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

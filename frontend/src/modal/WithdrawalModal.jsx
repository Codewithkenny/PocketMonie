import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import api from "../../helper/api";
import { toast } from "react-toastify";

export default function WithdrawModal({ wallet, onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch saved bank accounts - optional endpoint, fallback to sample
        const fetchBanks = async () => {
            try {
                const res = await api.get("/banks"); // implement in backend or ignore
                setBanks(res.data || []);
                if (res.data && res.data.length) setSelectedBank(res.data[0].id);
            } catch (err) {
                // fallback sample if endpoint not available
                setBanks([{ id: "sample-acc", label: "Access Bank •••• 1234" }]);
                setSelectedBank("sample-acc");
            }
        };
        fetchBanks();
    }, []);

    const handleWithdraw = async () => {
        if (!wallet) {
            toast.error("Wallet information is not available. Please try again later.");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }
        if (!selectedBank) {
            toast.error("Select a bank");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(`/wallet/withdraw/${wallet.id}`, {
                walletId: wallet.id,
                amount: Number(amount),
                bankId: selectedBank,
            });
            toast.success(res.data?.message || "Withdrawal initiated");
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Withdraw error:", err);
            toast.error(err?.response?.data?.message || "Withdrawal failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Withdraw Funds</h2>

                <label className="block text-gray-300 text-sm mb-2">Amount (₦)</label>
                <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg outline-none mb-4 text-white" />

                <label className="block text-gray-300 text-sm mb-2">Bank Account</label>
                <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-lg mb-4 text-white"
                >
                    {banks.map((b) => (
                        <option key={b.id} value={b.id} style={{ color: 'white', backgroundColor: '#1f2937' }}>
                            {b.name || b.label || b.account || b.bankName || "Unnamed Bank"}
                        </option>
                    ))}
                </select>


                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg" disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={handleWithdraw} className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-red-700" : "bg-red-500 hover:bg-red-600"}`} disabled={loading}>
                        {loading ? "Processing..." : "Withdraw"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

WithdrawModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

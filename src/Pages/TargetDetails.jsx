import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../helper/api";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ProgressBar from "../Components/ProgressBar";
import { ArrowLeft } from "lucide-react";

const TargetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [target, setTarget] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [transactions, setTransactions] = useState([]);

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    // 🔹 Fetch single target savings details
    const fetchTarget = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/savings/target/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTarget(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error loading target details");
        }
    };

    // 🔹 Fetch transactions related to target
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/transactions/target/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(res.data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTarget();
        fetchTransactions();
    }, [id]);

    if (!target) return <p className="text-center mt-6">Loading target details...</p>;

    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: target?.user?.email || "default@email.com",
        amount: parseFloat(amount || 0) * 100,
        publicKey,
    };

    // ✅ Handle Paystack success (with redirect + refresh)
    const handleSuccess = async (ref) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/savings/target/verify",
                {
                    reference: ref.reference,
                    targetId: id,
                    amount: amount,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchTarget();
            await fetchTransactions();
            setModalOpen(false);

            // 🔹 Only show redirect notification (Paystack already shows success)
            toast.info("Redirecting to your savings dashboard...");

            // 🔹 Delay redirect for 5 seconds
            setTimeout(() => {
                navigate("/savings");
            }, 3000);
        } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Could not verify payment. Please contact support.");
        }
    };

    // 🔹 Handle Paystack modal close
    const handleClose = () => {
        toast.info("Payment process cancelled or closed.");
    };

    const paystackButtonProps = {
        ...paystackConfig,
        text: "Confirm & Pay",
        onSuccess: handleSuccess,
        onClose: handleClose,
    };

    const progress = ((target.currentAmount || 0) / (target.targetAmount || 1)) * 100;

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 relative">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-blue-600"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <h1 className="text-3xl font-bold mb-4 text-gray-800">{target.title}</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-gray-500 text-sm">Goal</p>
                    <p className="text-lg font-semibold text-gray-800">
                        ₦{Number(target.targetAmount).toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Saved</p>
                    <p className="text-lg font-semibold text-green-600">
                        ₦{Number(target.currentAmount).toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="text-lg font-semibold text-blue-600">{target.status}</p>
                </div>
            </div>

            <ProgressBar progress={progress} />
            <p className="text-sm mt-2 text-gray-600">Progress: {Math.round(progress)}%</p>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Deposit
                </button>
            </div>

            {/* Deposit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white w-96 rounded-xl shadow-xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Deposit into {target.title}</h3>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring focus:ring-green-200 outline-none"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <PaystackButton
                                {...paystackButtonProps}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions */}
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-3">Recent Transactions</h2>
                {transactions.length === 0 ? (
                    <p className="text-gray-500">No transactions yet.</p>
                ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="bg-gray-50 p-3 rounded-lg flex justify-between border border-gray-100"
                            >
                                <div>
                                    <p className="font-medium">{tx.description || "Deposit"}</p>
                                    <p className="text-xs text-gray-500">
                                        {dayjs(tx.timestamp).format("MMM D, YYYY h:mm A")} •{" "}
                                        {dayjs(tx.timestamp).fromNow()}
                                    </p>
                                </div>
                                <p className="text-green-600 font-semibold">
                                    ₦{Number(tx.amount).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TargetDetails;

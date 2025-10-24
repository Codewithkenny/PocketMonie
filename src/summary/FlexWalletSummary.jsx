import { useEffect, useState } from "react";
import {
    Eye,
    EyeOff,
    PlusCircle,
    ArrowDownCircle,
    X,
    Shield,
    Banknote,
    CreditCard,
    Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../../helper/api";
import { toast, Toaster } from "react-hot-toast";

export default function FlexWalletSummary() {
    const { user, loading } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [banks, setBanks] = useState([]);

    // Withdraw form
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [bank, setBank] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);

    // Add Money form
    const [addAmount, setAddAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const fetchWallet = async () => {
        if (!user?.id) return;
        try {
            setFetching(true);
            const res = await api.get(`/flex-wallet/user/${user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const data = res.data || {};
            data.balance = Number(data.balance || 0);
            data.interest = Number(data.interest || 0);
            setWallet(data);
            setTransactions(data.transactions?.slice(0, 5) || []);
        } catch (err) {
            console.error("fetchWallet error:", err);
        } finally {
            setFetching(false);
        }
    };

    // Fetch banks from Paystack
    const fetchBanks = async () => {
        try {
            const res = await fetch("https://api.paystack.co/bank", {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
                },
            });
            const result = await res.json();
            setBanks(result.data || []);
        } catch (err) {
            console.error("Error fetching banks:", err);
        }
    };

    useEffect(() => {
        fetchWallet();
        fetchBanks();
    }, [user?.id]);

    // Format amount with commas
    const formatAmount = (value) => {
        const raw = value.replace(/,/g, "").replace(/\D/g, "");
        return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();

        try {
            const amount = Number(withdrawAmount.replace(/,/g, ""));
            if (!amount || amount <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }

            if (!wallet?.id) {
                toast.error("Wallet not found. Please refresh.");
                return;
            }

            if (!securityAnswer.trim()) {
                toast.error("Please provide your security answer");
                return;
            }

            setWithdrawing(true);

            const payload = { amount };
            const res = await api.post(`/flex-wallet/withdraw/${wallet.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.status === 200 || res.status === 201) {
                toast.success("Withdrawal successful 🎉");
                setWallet(res.data);
                setTransactions(res.data.transactions?.slice(0, 5) || []);
                setShowWithdrawModal(false);
                setWithdrawAmount("");
                setBank("");
                setSecurityAnswer("");
            } else {
                toast.error("Something went wrong. Try again.");
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            const msg =
                error.response?.data?.message ||
                "Error processing withdrawal. Please try again.";
            toast.error(msg);
        } finally {
            setWithdrawing(false);
        }
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();



        const cleanAmount = Number(addAmount.replace(/,/g, ''));
        if (isNaN(cleanAmount) || cleanAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await api.post(
                `/flex-wallet/deposit/${wallet.id}`,
                { amount: cleanAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Deposit successful 🎉');
            fetchWallet();
            setShowAddModal(false);
        } catch (e) {
            console.error('Deposit error:', e);
            toast.error('Failed to add money');
        }
    };


    if (loading || fetching)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
                Loading Flex Wallet...
            </div>
        );

    const balance = wallet?.balance || 0;
    const interestEarned = wallet?.interest || 0;
    const nextPayoutDate = (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toLocaleDateString();
    })();

    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
            <Toaster position="top-right" />
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        💳 Flex Wallet
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Manage your everyday savings and withdrawals.
                    </p>
                </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 relative mb-10 overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-3xl"></div>
                <div className="relative z-10">
                    <p className="text-sm text-gray-200">Available Balance</p>

                    <div className="flex items-center gap-2 mt-2">
                        <h2 className="text-4xl font-extrabold text-white">
                            {showBalance ? `₦${balance.toLocaleString()}` : "••••••"}
                        </h2>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-gray-200 hover:text-white transition"
                        >
                            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center mt-6 text-sm text-gray-200">
                        <p>
                            Interest Earned:{" "}
                            <span className="font-semibold text-green-300">
                                ₦{interestEarned.toLocaleString()}
                            </span>
                        </p>
                        <p>
                            Next Payout:{" "}
                            <span className="font-semibold text-yellow-300">
                                {nextPayoutDate}
                            </span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8 mx-auto max-w-xs">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition text-sm w-40"
                        >
                            <PlusCircle size={18} />
                            Add Money
                        </button>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="flex items-center justify-center gap-2 bg-blue-800 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition text-sm w-40"
                        >
                            <ArrowDownCircle size={18} />
                            Withdraw
                        </button>
                    </div>

                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-4 text-white">
                    Recent Transactions
                </h3>
                {transactions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No recent transactions</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx, idx) => (
                            <div
                                key={tx.id || idx}
                                className="flex justify-between items-center bg-gray-700/70 p-3 rounded-xl"
                            >
                                <div>
                                    <p className="capitalize font-medium text-gray-100">
                                        {tx.type}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(tx.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <p
                                    className={`font-bold ${tx.type?.toLowerCase() === "deposit"
                                        ? "text-green-400"
                                        : tx.type?.toLowerCase() === "withdraw"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                        }`}
                                >
                                    ₦{Number(tx.amount).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <WithdrawModal
                    onClose={() => setShowWithdrawModal(false)}
                    onSubmit={handleWithdraw}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    bank={bank}
                    setBank={setBank}
                    banks={banks}
                    securityAnswer={securityAnswer}
                    setSecurityAnswer={setSecurityAnswer}
                    formatAmount={formatAmount}
                    withdrawing={withdrawing}
                />
            )}

            {/* Add Money Modal */}
            {showAddModal && (
                <AddMoneyModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddMoney}
                    addAmount={addAmount}
                    setAddAmount={setAddAmount}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    formatAmount={formatAmount}
                />
            )}
        </div>
    );
}

/* ---------------- Withdraw Modal ---------------- */
function WithdrawModal({
    onClose,
    onSubmit,
    withdrawAmount,
    setWithdrawAmount,
    bank,
    setBank,
    banks,
    securityAnswer,
    setSecurityAnswer,
    formatAmount,
    withdrawing,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-6">
                    Withdraw from Flex
                </h2>
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Amount</label>
                        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
                            <span className="text-gray-400 mr-2">₦</span>
                            <input
                                type="text"
                                value={withdrawAmount}
                                onChange={(e) =>
                                    setWithdrawAmount(formatAmount(e.target.value))
                                }
                                placeholder="Enter amount"
                                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Bank */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Destination Bank
                        </label>
                        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
                            <Banknote size={18} className="text-gray-400 mr-2" />
                            <select
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                className="bg-transparent text-white w-full outline-none"
                                required
                            >
                                <option value="">Select Bank</option>
                                {banks.map((b) => (
                                    <option key={b.id} value={b.name} className="bg-gray-900">
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Security */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Security Answer
                        </label>
                        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
                            <Shield size={18} className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                placeholder="Enter your security answer"
                                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={withdrawing}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60"
                    >
                        {withdrawing ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            "Withdraw"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ---------------- Add Money Modal ---------------- */
function AddMoneyModal({
    onClose,
    onSubmit,
    addAmount,
    setAddAmount,
    paymentMethod,
    setPaymentMethod,
    formatAmount,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-6">
                    Top up your Flex Wallet
                </h2>
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Amount</label>
                        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
                            <span className="text-gray-400 mr-2">₦</span>
                            <input
                                type="text"
                                value={addAmount}
                                onChange={(e) => setAddAmount(formatAmount(e.target.value))}
                                placeholder="Enter amount"
                                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Payment Method
                        </label>
                        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
                            <CreditCard size={18} className="text-gray-400 mr-2" />
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="bg-transparent text-white w-full outline-none"
                                required
                            >
                                <option value="">Select method</option>
                                <option value="card" className="bg-gray-900">
                                    Card Payment
                                </option>
                                <option value="transfer" className="bg-gray-900">
                                    Bank Transfer
                                </option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold text-white transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}

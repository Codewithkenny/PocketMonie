import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DepositModal from "../modal/DepositModal";
import WithdrawModal from "../modal/WithdrawalModal";
import TransferModal from "../modal/TransferModal";
import { ArrowDownCircle, ArrowUpCircle, Repeat } from "lucide-react";
import api from "../../helper/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function FlexWalletDashboard() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);

    const fetchWallet = async () => {
        if (!user?.id) {
            console.log("No user ID found yet");
            return;
        }
        try {
            setLoading(true);
            const res = await api.get(`/wallet/${user.id}`);
            const data = res.data || {};


            // Ensure balance and interest are numbers
            data.balance = Number(data.balance || 0);
            data.interest = Number(data.interest || 0);

            setWallet(data);
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error("fetchWallet error:", err);
            toast.error("Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchWallet();
    }, [user?.id]);

    // Calculations
    const balance = wallet ? Number(wallet.balance || 0) : 0;
    const interestEarned = wallet ? Number(wallet.interest || 0) : 0;
    const monthlyInterest = wallet ? Number(wallet.monthlyInterest || 0) : 0;
    const totalInterest = wallet ? Number(wallet.interest || 0) + monthlyInterest : 0;

    const nextPayoutDate = wallet
        ? (() => {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        })()
        : "-";

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Flex Wallet</h1>
                    <p className="text-gray-400 text-sm">Manage your instant savings</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">Available Balance</p>
                    <h2 className="text-2xl font-bold text-green-400 mt-1">
                        ₦{balance.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* BALANCE CARD */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
            >
                {loading ? (
                    <p className="text-gray-400">Loading wallet...</p>
                ) : (
                    <>
                        <p className="text-gray-400">Available Balance</p>
                        <h2 className="text-4xl font-bold text-green-400 mt-2">
                            ₦{balance.toLocaleString()}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Interest Earned: ₦{Number(wallet?.interest || 0).toLocaleString()}
                        </p>

                    </>
                )}

                <div className="flex justify-center gap-4 mt-5 flex-wrap">
                    <button
                        onClick={() => setShowDeposit(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <ArrowDownCircle size={18} /> Deposit
                    </button>
                    <button
                        onClick={() => setShowTransfer(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Repeat size={18} /> Transfer
                    </button>
                    <button
                        onClick={() => setShowWithdraw(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <ArrowUpCircle size={18} /> Withdraw
                    </button>
                </div>
            </motion.div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Monthly Interest</p>
                    <h3 className="text-lg font-semibold">₦{monthlyInterest.toLocaleString()}</h3>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Total Interest</p>
                    <h3 className="text-lg font-semibold">₦{totalInterest.toLocaleString()}</h3>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Next Payout</p>
                    <h3 className="text-lg font-semibold">{nextPayoutDate}</h3>
                </div>
            </div>


            {/* TRANSACTION HISTORY */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
                {loading ? (
                    <p className="text-gray-400">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-400">No recent transactions</p>
                ) : (
                    <div className="space-y-2">
                        {transactions.map((tx, idx) => (
                            <div
                                key={tx.id || idx}
                                className="bg-gray-800 flex justify-between items-center px-4 py-3 rounded-lg"
                            >
                                <span className="capitalize">{tx.type}</span>

                                <span
                                    className={`${tx.type?.toLowerCase() === "deposit"
                                        ? "text-green-400"
                                        : tx.type?.toLowerCase() === "withdraw"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                        } font-semibold`}
                                >
                                    ₦{Number(tx.amount).toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showDeposit && (
                    <DepositModal wallet={wallet} onClose={() => setShowDeposit(false)} onSuccess={fetchWallet} />
                )}
                {showWithdraw && (
                    <WithdrawModal wallet={wallet} onClose={() => setShowWithdraw(false)} onSuccess={fetchWallet} />
                )}
                {showTransfer && (
                    <TransferModal wallet={wallet} onClose={() => setShowTransfer(false)} onSuccess={fetchWallet} />
                )}
            </AnimatePresence>
        </div>
    );
}

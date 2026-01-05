import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaPiggyBank,
    FaMoneyBill,
    FaCalendarAlt,
    FaGift,
    FaLock,
    FaUsers,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../../helper/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../Components/Modal";
import ProgressBar from "../Components/ProgressBar";
import FlexWalletSummary from "../summary/FlexWalletSummary";

dayjs.extend(relativeTime);

const Sidebar = () => {
    const navigate = useNavigate();
    const menu = [
        { label: "Home", icon: <FaHome />, path: "/", color: "text-gray-300" },
        { label: "Savings", icon: <FaPiggyBank />, path: "/savings", color: "text-pink-400" },
        { label: "Payments", icon: <FaMoneyBill />, path: "/payments", color: "text-green-400" },
    ];

    return (
        <aside className="w-60 bg-gray-800 min-h-screen p-5 flex flex-col gap-4 text-white">
            <h2 className="text-2xl font-bold mb-6">💰 PocketMoni</h2>
            {menu.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-left"
                >
                    <span className={`text-xl ${item.color}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </aside>
    );
};

const savingsFeatures = [
    { name: "Target Savings", icon: <FaPiggyBank className="text-pink-400" />, path: "target" },
    { name: "Flex Wallet", icon: <FaCalendarAlt className="text-blue-400" />, path: "flex" },
    { name: "Group Savings", icon: <FaUsers className="text-purple-400" />, path: "group" },
    { name: "Fixed Deposit", icon: <FaLock className="text-green-400" />, path: "fixed" },
    { name: "Rewards", icon: <FaGift className="text-yellow-400" />, path: "rewards" },
    { name: "Secure Lock", icon: <FaLock className="text-red-400" />, path: "lock" },
];

const numericFromPossibleFields = (t) => {
    const candidates = ["currentAmount", "current_balance", "savedAmount", "currentBalance", "collectedAmount", "amount", "balance"];
    for (const c of candidates) {
        const v = t[c];
        if (v !== undefined && v !== null && v !== "") {
            const num = parseFloat(String(v).replace(/,/g, ""));
            if (!Number.isNaN(num)) return num;
        }
    }
    return 0;
};

const SavingsDashboard = () => {
    const { user, loading } = useAuth();
    const [targets, setTargets] = useState([]);
    const [activities, setActivities] = useState([]);
    const [totalSavings, setTotalSavings] = useState(0);
    const [activeFeature, setActiveFeature] = useState(null);
    const navigate = useNavigate();

    const [targetPage, setTargetPage] = useState(1);
    const targetsPerPage = 6;

    const fetchTargets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await api.get("/savings/target", { headers: { Authorization: `Bearer ${token}` } });
            const mapped = res.data.map((t) => ({
                ...t,
                savedAmount: numericFromPossibleFields(t),
                targetAmount: parseFloat(String(t.targetAmount ?? t.amount ?? 0).replace(/,/g, "")) || 0,
                createdAt: t.createdAt ? new Date(t.createdAt) : null,
                maturityDate: t.maturityDate ? new Date(t.maturityDate) : null,
            }));
            setTargets(mapped);
        } catch (err) {
            console.error("fetchTargets:", err);
        }
    };

    const fetchTotals = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await api.get("/savings/totals", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const total = parseFloat(res.data.total || 0);

            setTotalSavings(total);


        } catch (err) {
            console.warn("fetchTotals failed, falling back to client sum", err);
            // fallback: sum targets if API fails
            const fallback = targets.reduce((acc, t) => acc + (t.savedAmount || 0), 0);
            setTotalSavings(fallback);
        }
    };


    useEffect(() => {
        if (user) fetchTotals();
    }, [user]);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await api.get("/savings/activities", { headers: { Authorization: `Bearer ${token}` } });
            setActivities(res.data);
        } catch (err) {
            console.error("fetchActivities:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTargets();
            fetchActivities();
        }
    }, [user]);

    useEffect(() => {
        fetchTotals();
    }, [targets]);

    const sortedTargets = [...targets].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt) : 0;
        const db = b.createdAt ? new Date(b.createdAt) : 0;
        return db - da;
    });

    const totalTargetPages = Math.max(1, Math.ceil(sortedTargets.length / targetsPerPage));
    const paginatedTargets = sortedTargets.slice((targetPage - 1) * targetsPerPage, targetPage * targetsPerPage);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
            Loading...
        </div>
    );
    if (!user) return (
        <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
            Please login
        </div>
    );

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Welcome back, {user.fullName?.split(" ")[0] || "friend"}! 👋
                        </h1>
                        <p className="text-white mt-2 text-sm">Manage your savings and reach your goals.</p>
                    </div>
                    <h2 className="text-3xl font-bold text-green-400">
                        ₦{Number((totalSavings || 0).toFixed(0)).toLocaleString()}
                    </h2>
                </div>

                {/* Feature Cards */}
                <h2 className="text-2xl font-bold mb-6 text-center">Savings Options</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                    {savingsFeatures.map((f, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (f.path === "target") setActiveFeature("target"); // keep modal for Target Savings
                                else navigate(`/savings/${f.path}-wallet-summary`); // navigate to individual pages
                            }}
                            className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center hover:bg-gray-700 transition cursor-pointer"
                        >
                            <div className="text-3xl mb-2">{f.icon}</div>
                            <div className="text-sm font-medium">{f.name}</div>
                        </div>
                    ))}
                </div>

                {/* Conditional rendering for Target modal only */}
                {activeFeature === "target" && (
                    <Modal isOpen={activeFeature === "target"} onClose={() => setActiveFeature(null)} title="Create Target Savings">
                        {/* Target savings form here */}
                    </Modal>
                )}

                {/* Your Targets list */}
                <h2 className="text-2xl font-bold text-center mb-6">🎯 Your Target Savings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {paginatedTargets.length === 0 ? (
                        <p className="text-gray-400 text-center col-span-full">No targets yet. Create one above!</p>
                    ) : (
                        paginatedTargets.map((t) => {
                            const progress = ((t.savedAmount || 0) / (t.targetAmount || 1)) * 100;
                            return (
                                <div
                                    key={t.id}
                                    onClick={() => navigate(`/savings/target/${t.id}`)}
                                    className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition cursor-pointer"
                                >
                                    <h3 className="text-xl font-semibold text-pink-400">{t.title}</h3>
                                    <p className="text-sm text-gray-300 mt-1">
                                        Goal: ₦{Number(t.targetAmount || 0).toLocaleString()}
                                    </p>
                                    <ProgressBar progress={progress} />
                                    <p className="text-gray-400 mt-2 text-sm">Progress: {Math.round(progress)}%</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Created: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"} • Maturity: {t.maturityDate ? new Date(t.maturityDate).toLocaleDateString() : "-"}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default SavingsDashboard;

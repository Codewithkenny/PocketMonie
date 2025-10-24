import { useState, useEffect } from "react";
import { FaPiggyBank } from "react-icons/fa";
import api from "../../../helper/api";
import useLocalStorageState from "../../hooks/useLocalStorageState";

const TargetSavings = () => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: "",
        targetAmount: "",
        frequency: "",
        preferredTime: "",
        durationMonths: "",
        method: "manual",
    });
    const [history, setHistory] = useLocalStorageState("targetSavings", []);
    const [activeTab, setActiveTab] = useState("Live");

    // Fetch target savings from backend
    const fetchTargets = async () => {
        try {
            const res = await api.get("/savings/target", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            // Keep original keys but convert necessary fields from strings to numbers
            const mapped = res.data.map((t) => ({
                ...t,
                targetAmount: Number(t.targetAmount),
                currentAmount: Number(t.currentAmount),
                collectedAmount: Number(t.collectedAmount),
                interestRate: Number(t.interestRate),
                durationMonths: Number(t.durationMonths),
            }));

            setHistory(mapped);
        } catch (err) {
            console.error("Failed to fetch target savings", err);
        }
    };

    useEffect(() => {
        fetchTargets();
    }, []);
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                "/savings/target",
                {
                    title: form.title,
                    targetAmount: Number(form.targetAmount),
                    frequency: form.frequency.toLowerCase(),
                    preferredTime: form.preferredTime,
                    durationMonths: Number(form.durationMonths),
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            // Refetch all targets
            await fetchTargets();
            setShowModal(false);

            setForm({
                title: "",
                targetAmount: "",
                frequency: "",
                preferredTime: "",
                durationMonths: "",
                method: "manual",
            });
        } catch (err) {
            console.error("Failed to create target saving", err);
            alert("Failed to create target. Try again.");
        }
    };

    const filteredHistory = history.filter((h) => h.status === activeTab);

    // Format date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <FaPiggyBank className="text-pink-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Target Savings</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Save towards specific goals with discipline. Lock funds until you reach
                    your target — vacation, school fees, or any personal goal.
                </p>
            </div>

            {/* Tabs and History */}
            <div className="w-full max-w-5xl mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Your Target Savings</h2>
                    <div className="flex gap-4">
                        {["Live", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab
                                    ? "bg-pink-500 text-white"
                                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <p className="text-dimWhite">No {activeTab.toLowerCase()} targets available.</p>
                ) : (
                    <div className="grid gap-4">
                        {filteredHistory.map((item) => {
                            const progressPercent =
                                item.currentAmount && item.targetAmount
                                    ? Math.min((item.currentAmount / item.targetAmount) * 100, 100)
                                    : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-slate-800 rounded-xl p-4 shadow-md flex flex-col gap-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold">{item.title}</h3>
                                            <p className="text-sm text-dimWhite">
                                                ₦{item.targetAmount} · {item.frequency} ·{" "}
                                                {item.method === "auto" ? "Auto" : "Manual"} · Matures:{" "}
                                                {formatDate(item.maturityDate)}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded text-sm ${item.status === "Live"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-500 text-white"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-pink-500 h-full"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-300">{progressPercent.toFixed(0)}% completed</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Target Button */}
            <div className="mt-6">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-pink-500 hover:bg-pink-600 px-8 py-3 rounded-lg text-lg font-semibold transition"
                >
                    Add New Target
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create a Target Savings Goal</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Goal Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full p-3 rounded bg-slate-800 border border-slate-700 placeholder-gray-400"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Target Amount (₦)"
                                value={form.targetAmount}
                                onChange={(e) =>
                                    setForm({ ...form, targetAmount: e.target.value })
                                }
                                className="w-full p-3 rounded bg-slate-800 border border-slate-700 placeholder-gray-400"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Duration (Months)"
                                value={form.durationMonths}
                                onChange={(e) =>
                                    setForm({ ...form, durationMonths: e.target.value })
                                }
                                className="w-full p-3 rounded bg-slate-800 border border-slate-700 placeholder-gray-400"
                                required
                            />
                            <select
                                value={form.frequency}
                                onChange={(e) =>
                                    setForm({ ...form, frequency: e.target.value })
                                }
                                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-gray-200"
                                required
                            >
                                <option value="" disabled>Select frequency</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            <select
                                value={form.preferredTime}
                                onChange={(e) =>
                                    setForm({ ...form, preferredTime: e.target.value })
                                }
                                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-gray-200"
                                required
                            >
                                <option value="" disabled>Select preferred time</option>
                                <option value="morning">Morning (8AM-10AM)</option>
                                <option value="afternoon">Afternoon (12PM-2PM)</option>
                                <option value="evening">Evening (6PM-8PM)</option>
                            </select>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TargetSavings;

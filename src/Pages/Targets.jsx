import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../../helper/api";

dayjs.extend(relativeTime);

const Targets = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [target, setTarget] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTargetDetail = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const [targetRes, transactionsRes] = await Promise.all([
                    api.get(`/savings/target/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/savings/target/${id}/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                setTarget(targetRes.data);
                setTransactions(transactionsRes.data);
            } catch (err) {
                console.error("fetchTargetDetail error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTargetDetail();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
    if (!target) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Target not found.</div>;

    const progress = ((parseFloat(target.savedAmount) || 0) / (parseFloat(target.targetAmount) || 1)) * 100;

    return (
        <div className="flex bg-gray-900 text-white min-h-screen p-8">
            <button onClick={() => navigate(-1)} className="mb-6 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition">← Back</button>
            <div className="max-w-4xl w-full mx-auto">
                <h1 className="text-4xl font-bold text-pink-400 mb-4">{target.title}</h1>
                <p className="mb-2">Goal: ₦{Number(target.targetAmount).toLocaleString()}</p>
                <p className="mb-2">Saved: ₦{Number(target.savedAmount).toLocaleString()}</p>
                <div className="w-full bg-gray-700 h-4 rounded-full mb-4">
                    <div className="bg-pink-400 h-4 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <p className="mb-6">Progress: {Math.round(progress)}%</p>
                <p className="mb-4">Created: {target.createdAt ? new Date(target.createdAt).toLocaleDateString() : "-"}</p>
                <p className="mb-8">Maturity Date: {target.maturityDate ? new Date(target.maturityDate).toLocaleDateString() : "-"}</p>

                <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
                {transactions.length === 0 ? (
                    <p className="text-gray-400">No transactions yet.</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="bg-gray-800 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <p>{tx.description || "Transaction"}</p>
                                    <p className="text-xs text-gray-500 mt-1">{dayjs(tx.timestamp).format("MMM D, YYYY h:mm A")} • {dayjs(tx.timestamp).fromNow()}</p>
                                </div>
                                {tx.amount > 0 && <div className="text-green-400 font-bold">₦{Number(tx.amount).toLocaleString()}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Targets;

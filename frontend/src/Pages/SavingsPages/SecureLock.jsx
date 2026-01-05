import { useEffect, useState } from "react";
import { FaLock, FaGift, FaCalendarAlt } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import api from "../../../helper/api";
import { toast } from "react-hot-toast";

/**
 * SecureLock component
 *
 * - Shows available secureLock balance (flexBalance - totalLocked)
 * - Create modal: title, amount (formatted as user types), payback date
 * - Funding source: selectable card (Flex Wallet)
 * - Preview modal shows computed interest (using bucket rules) and total payout
 * - Creates lock by calling POST /safelock/create/:userId with { amount, durationInDays }
 */

const DURATION_OPTIONS = [
    { id: "10-30", label: "10 - 30 days", min: 10, max: 30, rate: 14.0 },
    { id: "31-60", label: "31 - 60 days", min: 31, max: 60, rate: 14.5 },
    { id: "61-90", label: "61 - 90 days", min: 61, max: 90, rate: 15.0 },
    { id: "91-180", label: "91 - 180 days", min: 91, max: 180, rate: 15.5 },
    { id: "181-270", label: "181 - 270 days", min: 181, max: 270, rate: 16.0 },
    { id: "271-365", label: "271 - 365 days", min: 271, max: 365, rate: 16.5 },
    { id: "366-730", label: "1 - 2 years (366 - 730 days)", min: 366, max: 730, rate: 19.0 },
    { id: "731+", label: "> 2 years (731+ days)", min: 731, max: 10000, rate: 20.0 },
];

const currencyFormat = (n) =>
    Number(n).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 });

const daysBetween = (start, end) => Math.ceil((end - start) / (1000 * 60 * 60 * 24));

const computeEstimatedInterest = (principal, ratePercent, days) => {
    // interest = principal * (rate/100) * (days/365)
    return Number((principal * (ratePercent / 100) * (days / 365)).toFixed(2));
};

const SecureLock = () => {
    const { user, loading: authLoading } = useAuth();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [locks, setLocks] = useState([]);
    const [flexWallet, setFlexWallet] = useState(null); // contains balance
    const [totalLocked, setTotalLocked] = useState(0);
    const [availableBalanceVisible, setAvailableBalanceVisible] = useState(true);

    // form state
    const [title, setTitle] = useState("");
    const [amountInput, setAmountInput] = useState(""); // formatted string w/ commas
    const [paybackDate, setPaybackDate] = useState("");
    const [selectedFunding, setSelectedFunding] = useState("flex-wallet"); // only option for now

    // preview computed
    const [preview, setPreview] = useState(null);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [creating, setCreating] = useState(false);
    const [fetching, setFetching] = useState(false);

    // computed derived available secure lock balance:
    const availableSecureLockBalance = Math.max(0, (flexWallet?.balance || 0) - (totalLocked || 0));

    // load initial data
    useEffect(() => {
        if (!user?.id) return;
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const loadAll = async () => {
        setFetching(true);
        try {
            // 1) flex wallet
            const flexRes = await api.get(`/flex-wallet/user/${user.id}`);
            setFlexWallet(flexRes.data);

            // 2) safelock total locked
            // endpoint returns number (per your backend) — if it returns object adapt accordingly
            const totalRes = await api.get(`/safelock/total/${user.id}`);
            const total = typeof totalRes.data === "number" ? totalRes.data : Number(totalRes.data || 0);
            setTotalLocked(total);

            // 3) locks list
            const locksRes = await api.get(`/safelock/${user.id}`);
            // assume backend returns array of locks
            setLocks(Array.isArray(locksRes.data) ? locksRes.data : []);
        } catch (err) {
            console.error("Failed to load SecureLock data", err);
            toast.error("Failed to load SecureLock data. Check server.");
        } finally {
            setFetching(false);
        }
    };

    // amount input handler: keep formatted with commas
    const handleAmountChange = (raw) => {
        // remove non digits & non commas
        const digits = raw.toString().replace(/[^0-9]/g, "");
        if (digits === "") {
            setAmountInput("");
            return;
        }
        const num = Number(digits);
        setAmountInput(num.toLocaleString());
    };

    // helper to parse formatted amount -> number
    const parseAmount = (formatted) => {
        if (!formatted) return 0;
        return Number(formatted.toString().replace(/,/g, ""));
    };

    // compute rate by bucket based on days
    const findRateForDays = (days) => {
        for (const bucket of DURATION_OPTIONS) {
            if (days >= bucket.min && days <= bucket.max) return bucket.rate;
        }
        // fallback: highest
        return DURATION_OPTIONS[DURATION_OPTIONS.length - 1].rate;
    };

    // Review button -> compute preview
    const handleReview = (e) => {
        e?.preventDefault?.();

        const amount = parseAmount(amountInput);
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!paybackDate) {
            toast.error("Select a payback date");
            return;
        }

        const payback = new Date(paybackDate);
        const today = new Date();
        // zero out times for day granularity
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (payback <= start) {
            toast.error("Payback date must be in the future");
            return;
        }

        const days = daysBetween(start, payback);
        // check bucket validity: minimum 10 days per your rules
        if (days < 10) {
            toast.error("Minimum lock duration is 10 days");
            return;
        }

        // funding check: only flex wallet supported now
        if (selectedFunding === "flex-wallet") {
            if ((flexWallet?.balance || 0) < amount) {
                toast.error("Insufficient funds in Flex Wallet");
                return;
            }
            if (availableSecureLockBalance < amount) {
                // This checks flex balance minus existing locked - protects double-locking
                toast.error("Insufficient available balance to create this lock");
                return;
            }
        }

        const rate = findRateForDays(days);
        const estimatedInterest = computeEstimatedInterest(amount, rate, days);
        const totalPayout = Number((amount + estimatedInterest).toFixed(2));

        setPreview({
            title: title || "Secure Lock",
            amount,
            days,
            rate,
            estimatedInterest,
            totalPayout,
            paybackDate: payback.toISOString(),
            funding: selectedFunding,
        });

        setIsPreviewOpen(true);
        setIsCreateOpen(false);
    };

    // Confirm create -> call backend
    const handleConfirmCreate = async () => {
        if (!preview) return;
        if (!agreeChecked) {
            toast.error("You must acknowledge the lock terms to proceed");
            return;
        }
        setCreating(true);
        try {
            // call POST /safelock/create/:userId
            // backend expects duration in days and amount
            const res = await api.post(`/safelock/create/${user.id}`, {
                amount: preview.amount,
                duration: preview.days,
                // you may include a title / paybackDate if backend accepts them; adapt as needed
            });

            toast.success("SafeLock created successfully");
            // refresh data
            await loadAll();
            // reset form and preview
            setPreview(null);
            setAgreeChecked(false);
            setAmountInput("");
            setTitle("");
            setPaybackDate("");
            setIsPreviewOpen(false);
        } catch (err) {
            console.error("Create SafeLock failed", err);
            const msg = err.response?.data?.message || "Failed to create SafeLock";
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleCancelPreview = () => {
        setIsPreviewOpen(false);
        setPreview(null);
        setAgreeChecked(false);
    };

    // small client-side id for UI keys if necessary
    const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

    // UI
    if (authLoading || fetching) {
        return (
            <div className="flex items-center justify-center min-h-40">
                <p className="text-gray-400">Loading SecureLock...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            <div className="flex flex-col items-center mb-6">
                <FaLock className="text-red-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Secure Lock</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Lock funds securely to earn higher interest rates — interest depends on how long you lock funds.
                </p>
            </div>

            {/* Top cards */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
                {/* available balance card */}
                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Available SecureLock Balance</h3>
                        <p className="text-dimWhite text-sm">
                            {availableBalanceVisible ? currencyFormat(availableSecureLockBalance) : "Hidden"}
                        </p>
                    </div>
                    <button
                        onClick={() => setAvailableBalanceVisible((s) => !s)}
                        className="bg-gray-700 p-2 rounded"
                        aria-label="toggle balance"
                    >
                        {availableBalanceVisible ? <FaEye /> : <FaEyeSlash />}
                    </button>

                </div>

                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center space-x-3">
                    <FaGift className="text-yellow-400 text-2xl" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Rewards</h3>
                        <p className="text-dimWhite text-sm">Earn interest between 14% and 20% p.a depending on the lock duration.</p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center space-x-3">
                    <FaCalendarAlt className="text-green-400 text-2xl" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Durations</h3>
                        <p className="text-dimWhite text-sm">Pick a payback date — the duration bucket and interest are computed automatically.</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold transition"
                >
                    SafeLock Funds
                </button>
            </div>

            {/* Locks list */}
            <div className="w-full max-w-5xl">
                <h2 className="text-2xl font-bold mb-4">Your Active Locked Funds</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {locks.length === 0 ? (
                        <p className="text-dimWhite">No active locks yet. Start locking funds to see them here.</p>
                    ) : (
                        locks.map((lock) => (
                            <div
                                key={lock.id || uid("lock")}
                                className="bg-slate-800 rounded-xl p-4 shadow-md cursor-pointer hover:bg-slate-700 transition"
                            >
                                <p><strong>Amount:</strong> {currencyFormat(Number(lock.amount))}</p>
                                <p><strong>Duration (days):</strong> {lock.durationInDays ?? lock.durationDays ?? lock.days ?? "N/A"}</p>
                                <p><strong>Interest Rate:</strong> {lock.interestRate ?? lock.rate ?? "N/A"}% p.a</p>
                                <p><strong>Estimated Interest:</strong> {currencyFormat(Number(lock.interestEarned ?? lock.estimatedInterest ?? 0))}</p>
                                <p><strong>Status:</strong> {lock.status ?? "Active"}</p>
                                <p className="text-xs text-gray-400 mt-2">Created: {new Date(lock.createdAt ?? lock.startDate ?? lock.activatedAt ?? Date.now()).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create SecureLock</h2>
                        <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); handleReview(); }}>
                            <input
                                type="text"
                                placeholder="Title (optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Amount (NGN)"
                                value={amountInput}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            />

                            <label className="text-sm text-gray-300">Payback Date</label>
                            <input
                                type="date"
                                value={paybackDate}
                                onChange={(e) => setPaybackDate(e.target.value)}
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            />

                            <label className="text-sm text-gray-300">Funding Source</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div
                                    onClick={() => setSelectedFunding("flex-wallet")}
                                    className={`p-3 rounded-md cursor-pointer border ${selectedFunding === "flex-wallet" ? "border-blue-400 bg-slate-700" : "border-gray-700 bg-slate-800"}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Flex Wallet</p>
                                            <p className="text-xs text-gray-300">Use funds from your Flex Wallet (auto checked).</p>
                                        </div>
                                        <div className="text-sm text-gray-200">
                                            {currencyFormat(flexWallet?.balance ?? 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600">Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewOpen && preview && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Preview SecureLock</h2>

                        <p><strong>Title:</strong> {preview.title}</p>
                        <p><strong>Amount:</strong> {currencyFormat(preview.amount)}</p>
                        <p><strong>Duration:</strong> {preview.days} days</p>
                        <p><strong>Payback Date:</strong> {new Date(preview.paybackDate).toLocaleDateString()}</p>
                        <p><strong>Interest Rate:</strong> {preview.rate}% p.a</p>
                        <p><strong>Estimated Interest:</strong> {currencyFormat(preview.estimatedInterest)}</p>
                        <p><strong>Total Payout (principal + interest):</strong> {currencyFormat(preview.totalPayout)}</p>
                        <p className="text-sm text-gray-300 mt-2">Interest will be credited to your Flex Wallet.</p>

                        <div className="mt-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={agreeChecked} onChange={(e) => setAgreeChecked(e.target.checked)} />
                                <span className="text-sm">I acknowledge and authorize this SecureLock (interest paid to Flex Wallet)</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={handleCancelPreview} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700">Cancel</button>
                            <button
                                onClick={handleConfirmCreate}
                                disabled={!agreeChecked || creating}
                                className={`px-4 py-2 rounded-md ${!agreeChecked ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                            >
                                {creating ? "Creating..." : "Confirm & Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecureLock;

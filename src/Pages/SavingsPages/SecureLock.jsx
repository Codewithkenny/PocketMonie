import React, { useState } from "react";
import { FaLock, FaGift, FaCalendarAlt } from "react-icons/fa";

const SecureLock = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [activeLocks, setActiveLocks] = useState([]);
    const [selectedLock, setSelectedLock] = useState(null);

    // Form state
    const [lockAmount, setLockAmount] = useState("");
    const [duration, setDuration] = useState(1); // in months
    const [frequency, setFrequency] = useState("Monthly");

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedAmount = Number(lockAmount.replace(/,/g, ""));
        const interestRate = 0.12; // 12% per annum
        const estimatedInterest = ((formattedAmount * interestRate * duration) / 12).toFixed(2);

        const newLock = {
            amount: formattedAmount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
            duration,
            frequency,
            estimatedInterest: Number(estimatedInterest).toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
            status: "Active",
        };

        setSelectedLock(newLock);
        setIsModalOpen(false);
        setIsConfirmOpen(true);
    };

    const handleConfirmLock = () => {
        setActiveLocks([...activeLocks, selectedLock]);
        setSelectedLock(null);
        setIsConfirmOpen(false);
        setLockAmount("");
        setDuration(1);
        setFrequency("Monthly");
    };

    const openLockDetails = (lock) => {
        setSelectedLock(lock);
    };

    const closeLockDetails = () => setSelectedLock(null);

    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            {/* Title & Info Cards */}
            <div className="flex flex-col items-center mb-8">
                <FaLock className="text-red-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Secure Lock</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Lock funds securely to build discipline, earn better returns, and prevent impulsive spending.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center space-x-3">
                    <FaLock className="text-red-400 text-2xl" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Flexible Duration</h3>
                        <p className="text-dimWhite text-sm">Lock funds from 1 to 48 months safely.</p>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center space-x-3">
                    <FaGift className="text-yellow-400 text-2xl" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Rewards</h3>
                        <p className="text-dimWhite text-sm">Earn extra interest and rewards for keeping funds locked.</p>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md flex items-center space-x-3">
                    <FaCalendarAlt className="text-green-400 text-2xl" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Better Returns</h3>
                        <p className="text-dimWhite text-sm">Interest up to 12% per annum depending on lock duration.</p>
                    </div>
                </div>
            </div>

            {/* Button to open SafeLock Modal */}
            <div className="mb-10">
                <button
                    onClick={handleOpenModal}
                    className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold transition"
                >
                    SafeLock Funds
                </button>
            </div>

            {/* SafeLock Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Lock Your Funds</h2>
                        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Lock Amount (NGN)"
                                value={lockAmount}
                                onChange={(e) => setLockAmount(e.target.value)}
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            />
                            <input
                                type="number"
                                min="1"
                                max="48"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                placeholder="Duration (months)"
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            />
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
                            >
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600">
                                    Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {isConfirmOpen && selectedLock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Lock Details</h2>
                        <p><strong>Amount:</strong> {selectedLock.amount}</p>
                        <p><strong>Duration:</strong> {selectedLock.duration} months</p>
                        <p><strong>Frequency:</strong> {selectedLock.frequency}</p>
                        <p><strong>Estimated Interest:</strong> {selectedLock.estimatedInterest}</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLock}
                                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
                            >
                                Lock Funds
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Locked Funds Section */}
            <div className="mt-16 w-full max-w-5xl">
                <h2 className="text-2xl font-bold mb-6">Your Active Locked Funds</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {activeLocks.length === 0 ? (
                        <p className="text-dimWhite">No active locks yet. Start locking funds to see them here.</p>
                    ) : (
                        activeLocks.map((lock, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl p-4 shadow-md cursor-pointer hover:bg-slate-700 transition"
                                onClick={() => openLockDetails(lock)}
                            >
                                <p><strong>Amount:</strong> {lock.amount}</p>
                                <p><strong>Duration:</strong> {lock.duration} months</p>
                                <p><strong>Frequency:</strong> {lock.frequency}</p>
                                <p><strong>Estimated Interest:</strong> {lock.estimatedInterest}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Lock Details Modal */}
            {selectedLock && !isConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Locked Fund Details</h2>
                        <p><strong>Amount:</strong> {selectedLock.amount}</p>
                        <p><strong>Duration:</strong> {selectedLock.duration} months</p>
                        <p><strong>Frequency:</strong> {selectedLock.frequency}</p>
                        <p><strong>Estimated Interest:</strong> {selectedLock.estimatedInterest}</p>
                        <p><strong>Status:</strong> {selectedLock.status}</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeLockDetails}
                                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecureLock;

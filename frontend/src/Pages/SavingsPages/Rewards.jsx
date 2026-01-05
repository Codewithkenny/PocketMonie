// Rewards.jsx
import React from "react";
import { FaGift } from "react-icons/fa";

const Rewards = () => {
    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            <div className="flex flex-col items-center mb-8">
                <FaGift className="text-yellow-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Rewards</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Earn exciting rewards and bonuses as you save more. Turn savings into fun perks!
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Save & Earn</h3>
                    <p className="text-dimWhite">Get rewarded for reaching savings milestones.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Bonuses</h3>
                    <p className="text-dimWhite">Enjoy cashback and exclusive offers.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Gamified Savings</h3>
                    <p className="text-dimWhite">Turn savings into a rewarding experience.</p>
                </div>
            </div>

            <div className="mt-10">
                <button className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-lg text-lg font-semibold transition">
                    Start Earning Rewards
                </button>
            </div>
        </div>
    );
};

export default Rewards;

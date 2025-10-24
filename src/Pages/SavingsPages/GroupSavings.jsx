// GroupSavings.jsx
import React from "react";
import { FaUsers } from "react-icons/fa";

const GroupSavings = () => {
    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            <div className="flex flex-col items-center mb-8">
                <FaUsers className="text-purple-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Group Savings</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Save together with friends, family, or colleagues. Build accountability and achieve goals as a team.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Save Together</h3>
                    <p className="text-dimWhite">Contribute funds with your group members.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Accountability</h3>
                    <p className="text-dimWhite">Stay disciplined by saving in groups.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Shared Goals</h3>
                    <p className="text-dimWhite">Reach milestones faster together.</p>
                </div>
            </div>

            <div className="mt-10">
                <button className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-lg text-lg font-semibold transition">
                    Create Group Savings
                </button>
            </div>
        </div>
    );
};

export default GroupSavings;

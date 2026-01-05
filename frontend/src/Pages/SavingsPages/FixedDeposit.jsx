// FixedDeposit.jsx
import React from "react";
import { FaLock } from "react-icons/fa";

const FixedDeposit = () => {
    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            <div className="flex flex-col items-center mb-8">
                <FaLock className="text-green-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Fixed Deposit</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Lock your money for a fixed period and enjoy higher interest rates with guaranteed returns.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Guaranteed Returns</h3>
                    <p className="text-dimWhite">Earn more interest by fixing your funds for a duration.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Flexible Tenures</h3>
                    <p className="text-dimWhite">Choose from 3 months, 6 months, 1 year, or more.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Safe Investment</h3>
                    <p className="text-dimWhite">Secure your funds with zero risk of loss.</p>
                </div>
            </div>

            <div className="mt-10">
                <button className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition">
                    Start Fixed Deposit
                </button>
            </div>
        </div>
    );
};

export default FixedDeposit;

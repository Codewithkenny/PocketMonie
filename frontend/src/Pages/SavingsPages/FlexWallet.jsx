import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

const FlexWallet = () => {
    return (
        <div className="min-h-screen bg-primary text-white flex flex-col items-center py-12 px-6">
            <div className="flex flex-col items-center mb-8">
                <FaWallet className="text-blue-400 text-6xl mb-4" />
                <h1 className="text-4xl font-bold">Flex Wallet</h1>
                <p className="text-dimWhite mt-2 max-w-xl text-center">
                    Enjoy flexible savings that you can withdraw anytime. Earn interest while keeping your money liquid.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Flexible Access</h3>
                    <p className="text-dimWhite">Withdraw funds anytime without penalties.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Interest Earnings</h3>
                    <p className="text-dimWhite">Your balance grows with competitive interest rates.</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Zero Lock-In</h3>
                    <p className="text-dimWhite">Perfect for emergency funds or short-term savings.</p>
                </div>
            </div>

            <div className="mt-10">
                <Link to="/savings/flex-wallet-summary">
                    <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition">
                        Open Flex Wallet
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default FlexWallet;

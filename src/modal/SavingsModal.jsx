import { FiX } from "react-icons/fi";

const SavingsModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.id === "modal-backdrop") {
            onClose();
        }
    };

    return (
        <div
            id="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            {/* Modal Box */}
            <div
                className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                    <FiX size={20} />
                </button>

                {/* Title */}
                {title && (
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
                )}

                {/* Content */}
                <div className="text-gray-700">{children}</div>
            </div>
        </div>
    );
};

export default SavingsModal;

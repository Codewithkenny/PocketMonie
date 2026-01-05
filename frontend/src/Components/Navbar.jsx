import { useState } from "react";
import { close, pocket_monie_logo, menu } from "../assets";
import { navLinks } from "../constants";
import Modal from "./Modal";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  FaPiggyBank,
  FaWallet,
  FaCalendarAlt,
  FaGift,
  FaLock,
  FaUsers,
} from "react-icons/fa";
import api from "../../helper/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const navigate = useNavigate();

  let closeTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsFeaturesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsFeaturesOpen(false);
    }, 200);
  };

  const savingsFeatures = [
    {
      name: "Target Savings",
      path: "/savings/target",
      icon: <FaPiggyBank className="text-pink-400 text-xl" />,
    },
    {
      name: "Flex Wallet",
      path: "/savings/flex",
      icon: <FaWallet className="text-blue-400 text-xl" />,
    },
    {
      name: "Fixed Deposit",
      path: "/savings/fixed",
      icon: <FaCalendarAlt className="text-green-400 text-xl" />,
    },
    {
      name: "Rewards",
      path: "/savings/rewards",
      icon: <FaGift className="text-yellow-400 text-xl" />,
    },
    {
      name: "Secure Lock",
      path: "/savings/lock",
      icon: <FaLock className="text-red-400 text-xl" />,
    },
    {
      name: "Group Savings",
      path: "/savings/group",
      icon: <FaUsers className="text-purple-400 text-xl" />,
    },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/")
  };

  return (
    <>
      <nav className="w-full flex py-6 justify-between items-center navbar">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center">
            <img src={pocket_monie_logo} alt="PocketMoni" className="w-[120px] h-[70px]" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="list-none sm:flex hidden items-center space-x-10 ml-auto mr-8">
          {navLinks.map((nav) =>
            nav.title === "Features" ? (
              <li
                key={nav.id}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={`flex items-center cursor-pointer font-poppins font-medium text-[18px] ${active === nav.title ? "text-white" : "text-dimWhite"
                    }`}
                  onClick={() => setActive(nav.title)}
                >
                  <span>{nav.title}</span>
                  <FiChevronDown className="ml-1 text-white text-lg" />
                </div>

                {isFeaturesOpen && (
                  <div className="absolute top-12 left-0 w-[480px] bg-slate-800 shadow-lg rounded-lg p-5 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {savingsFeatures.map((feature, index) => (
                        <Link
                          to={feature.path}
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition"
                        >
                          {feature.icon}
                          <span className="text-white text-[16px]">
                            {feature.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[18px] ${active === nav.title ? "text-white" : "text-dimWhite"
                  }`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title === "Home" ? (
                  <Link to="/">{nav.title}</Link>
                ) : (
                  <a href={`#${nav.id}`}>{nav.title}</a>
                )}
              </li>
            )
          )}

          {/* Auth Buttons */}
          <li>
            {localStorage.getItem("token") ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-white border border-red-500 rounded-md hover:bg-red-500 transition text-[16px]"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="px-5 py-2 text-white bg-transparent border border-white rounded-md hover:bg-white hover:text-black transition text-[16px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="ml-3 px-5 py-2 bg-[#122231] text-white rounded-md hover:bg-blue-600 transition text-[16px]"
                >
                  Create Free Account
                </button>
              </>
            )}
          </li>
        </ul>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${!toggle ? "hidden" : "flex"
              } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[200px] rounded-xl sidebar flex-col`}
          >
            <ul className="list-none flex flex-col justify-start items-start flex-1 space-y-4">
              {navLinks.map((nav) =>
                nav.title === "Features" ? (
                  <li key={nav.id} className="w-full">
                    <button
                      className="flex items-center justify-between w-full font-poppins font-medium text-[18px] text-dimWhite"
                      onClick={() =>
                        setIsMobileFeaturesOpen(!isMobileFeaturesOpen)
                      }
                    >
                      {nav.title}
                      <FiChevronDown
                        className={`ml-2 transition-transform ${isMobileFeaturesOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isMobileFeaturesOpen && (
                      <div className="mt-3 bg-slate-800 rounded-lg p-4 grid grid-cols-2 gap-4">
                        {savingsFeatures.map((feature, index) => (
                          <Link
                            to={feature.path}
                            key={index}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition"
                            onClick={() => {
                              setIsMobileFeaturesOpen(false);
                              setToggle(false);
                            }}
                          >
                            {feature.icon}
                            <span className="text-white text-[15px]">
                              {feature.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[18px] ${active === nav.title ? "text-white" : "text-dimWhite"
                      }`}
                    onClick={() => setActive(nav.title)}
                  >
                    {nav.title === "Home" ? (
                      <Link to="/">{nav.title}</Link>
                    ) : (
                      <a href={`#${nav.id}`}>{nav.title}</a>
                    )}
                  </li>
                )
              )}

              {/* Auth Buttons (Mobile) */}
              {localStorage.getItem("token") ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white border border-red-500 rounded-md hover:bg-red-500 transition text-[16px]"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => setIsSignInOpen(true)}
                      className="w-full px-4 py-2 text-white bg-transparent border border-white rounded-md hover:bg-white hover:text-black transition text-[16px]"
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-[16px]"
                    >
                      Create Free Account
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Sign In Modal */}
      <Modal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        title="Sign In"
      >
        <form
          className="flex flex-col space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
              const res = await api.post("/auth/login", { email, password });
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              alert("Login successful!");
              setIsSignInOpen(false);
              window.location.href = "/savings";
            } catch (err) {
              console.error(err);
              alert("Login failed. Check your credentials.");
            }
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Create Free Account"
      >
        <form
          className="flex flex-col space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fullName = e.target.fullName.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
              await api.post("/auth/signup", {
                fullName,
                email,
                password,
              });
              alert("Account created successfully! You can now sign in.");
              setIsRegisterOpen(false);
            } catch (err) {
              console.error(err);
              alert("Registration failed. Try again.");
            }
          }}
        >
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create Account
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;

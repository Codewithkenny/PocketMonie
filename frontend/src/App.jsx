import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./style";

import {
  Navbar,
  Billing,
  CardDeal,
  Bussiness,
  Clients,
  CTA,
  Stats,
  Footar,
  Testimonials,
  Hero,
} from "./Components";

import SavingsDashboard from "./Components/SavingsDashboard";
import TargetSavings from "./Pages/SavingsPages/TargetSavings";
import FlexWallet from "./Pages/SavingsPages/FlexWallet";
import FixedDeposit from "./Pages/SavingsPages/FixedDeposit";
import Rewards from "./Pages/SavingsPages/Rewards";
import SecureLock from "./Pages/SavingsPages/SecureLock";
import GroupSavings from "./Pages/SavingsPages/GroupSavings";
import TargetDetails from "./Pages/TargetDetails";
// import Targets from "./Pages/Targets";

//
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import FlexWalletDashboard from "./Components/FlexWalletDashboard";
import FlexWalletSummary from "./summary/FlexWalletSummary";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-primary w-full overflow-hidden">
          {/* Navbar always visible */}
          <div className={`${styles.paddingsX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>

          {/* Main routes */}
          <Routes>
            {/* Public Landing Page */}
            <Route
              path="/"
              element={
                <>
                  <div className={`bg-primary ${styles.flexStart}`}>
                    <div className={`${styles.boxWidth}`}>
                      <Hero />
                    </div>
                  </div>
                  <div
                    className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}
                  >
                    <div className={`${styles.boxWidth}`}>
                      <Stats />
                      <Bussiness />
                      <Billing />
                      <CardDeal />
                      <Testimonials />
                      <Clients />
                      <CTA />
                      <Footar />
                    </div>
                  </div>
                </>
              }
            />


            {/* Protected Routes */}
            <Route
              path="/savings"
              element={
                <ProtectedRoute>
                  <SavingsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/target"
              element={
                <ProtectedRoute>
                  <TargetSavings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/target/:id"
              element={
                <ProtectedRoute>
                  <TargetDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/flex-wallet-dashboard"
              element={
                <ProtectedRoute>
                  <FlexWalletDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/savings/flex"
              element={
                <ProtectedRoute>
                  <FlexWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/fixed"
              element={
                <ProtectedRoute>
                  <FixedDeposit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/lock"
              element={
                <ProtectedRoute>
                  <SecureLock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/group"
              element={
                <ProtectedRoute>
                  <GroupSavings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings/flex-wallet-summary"
              element={
                <ProtectedRoute>
                  <FlexWalletSummary />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

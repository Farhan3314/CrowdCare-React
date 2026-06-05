import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/signUp";
import ForgotPassword from "../pages/forgotPassword";
import OTPVerification from "../pages/OTPVerification";
import ResetPassword from "../pages/resetPassword";
import ChangePassword from "../pages/changePassword";
import Logout from "../pages/logout";
import DeleteAccount from "../pages/deleteAccount";

import HomePage from "../pages/Home";
import CreateCampaign from "../pages/createCampaign";
import DonationHistory from "../pages/donationHistory";
import MyCampaigns from "../pages/myCampaigns";
import DashboardLayout from "../layouts/DashboardLayout";
import DonationReceipt from "../pages/DonationReceipt";
import FAQ from "../pages/settingFAQ";
import PrivacyPolicy from "../pages/settingPrivacyPolicy";
import TermsCondition from "../pages/settingTerms&Condition";
import Profile from "../pages/Profile";
import EditProfile from "../pages/editProfile";

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/dashboard/home" element={<HomePage />} />

        <Route path="/Campaign/CreateCampaign" element={<CreateCampaign />} />
        <Route path="/Donation/DonationHistory" element={<DonationHistory />} />
        <Route path="/myCampaigns" element={<MyCampaigns />} />

        <Route path="/donation/receipt" element={<DonationReceipt />} />

        <Route path="/dashboard/setting/FAQ" element={<FAQ />} />
        <Route path="/dashboard/setting/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/dashboard/setting/Terms_&_Condition" element={<TermsCondition />} />
        <Route path="/users/getAuthUserDetails" element={<Profile />} />
        <Route path="/users/updateAuthUserDetails" element={<EditProfile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/deleteAccount" element={<DeleteAccount />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<Signup />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/verifyOtp" element={<OTPVerification />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
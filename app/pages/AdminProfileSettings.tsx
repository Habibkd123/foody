import React, { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import InputField from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { EyeIcon, EyeCloseIcon } from "../icons";

const AdminProfileSettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: "Aminesh",
    lastName: "Verma",
    email: "admin@pedometer.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    avatar: "/images/user/user-01.jpg"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile updated:", profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password changed:", passwordData);
  };

  return (
    <>
      <PageMeta
        title="Profile Settings | Pedometer"
        description="Manage your admin profile settings"
      />
      <PageBreadcrumb pageTitle="Profile Settings" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              Profile Information
            </h3>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={profileData.avatar}
                  alt="Admin Avatar"
                  className="h-20 w-20 rounded-full border-4 border-orange-200 object-cover"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profileData.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <InputField
                    id="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <InputField
                    id="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <InputField
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <InputField
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="role">Role</Label>
                <InputField
                  id="role"
                  type="text"
                  value={profileData.role}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Role cannot be changed
                </p>
              </div>

              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-orange-500 hover:bg-orange-600 text-white">
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              Change Password
            </h3>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <InputField
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeCloseIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <InputField
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeCloseIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <InputField
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeCloseIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-orange-500 hover:bg-orange-600 text-white">
                Change Password
              </button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Password Requirements
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfileSettings; 
import { Link, useNavigate } from "react-router";
import FormInput from "../../components/FormInput.jsx";
import NimbleGlowLogo from "../../components/NimbleGlowLogo.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import userApi from "../../api/userApi.js";
import authStore from "../../stores/authStore.js";
import { schemaChangePassword } from "../../validator/schema.js";


function ChangePasswordPage() {
  const navigate = useNavigate();
  const token = authStore((state) => state.token);
  const actionLogout = authStore((state) => state.actionLogout);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaChangePassword),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const resp = await userApi.changeMyPassword(data, token);
      toast.success(resp.data.message || "Password changed successfully!");
      reset();
      actionLogout();
      navigate("/login");
    } catch (error) {
      console.error("Change password failed:", error);
      toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
    }
  };

  const handleLogout = () => {
    actionLogout();
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr2">
      <div className="relative hidden lg:block">
        <img
          src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_lbralc.jpg"
          alt="Skincare products background"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">

          <div className="w-full flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Change Password</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-800 text-white rounded-lg hover:bg-red-500 transition-colors font-semibold text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </button>
          </div>

          <div className="bg-bg-cr3 p-8 rounded-3xl shadow-lg space-y-4">
            <p className="text-gray-600 mb-4 text-center">Please enter your current and new password.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

              <FormInput
                label="Current Password"
                name="currentPassword"
                type="password"
                register={register}
                error={errors.currentPassword}
                placeholder="Enter current password"
              />

              <FormInput
                label="New Password"
                name="newPassword"
                type="password"
                register={register}
                error={errors.newPassword}
                placeholder="Enter new password"
              />

              <FormInput
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                register={register}
                error={errors.confirmNewPassword}
                placeholder="Confirm new password"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2 mt-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <BubblesIcon className="w-5 h-5 animate-spin" />
                    <p>Changing Password...</p>
                  </div>
                ) : (
                  <p>Change Password</p>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/profile" className="font-bold text-pri-gr1 hover:underline">
              Back to Profile
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormInput from "../../components/FormInput.jsx";
import authApi from "../../api/authApi.js";
import { schemaResetPassword } from "../../validator/schema.js";
import AuthLayout from "../../components/AuthLayout.jsx";
import AuthFormCard from "../../components/AuthFormCard.jsx";



function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaResetPassword),
    mode: 'onBlur'
  });

  if (!token) {
    toast.error("Invalid or missing reset token. Please request a new password reset link.");
    navigate("/forgot-password");
    return null;
  }


  const onSubmit = async (data) => {
    try {
      const resp = await authApi.resetPassword({ token, newPassword: data.newPassword });
      toast.success(resp.data.message || "Your password has been reset successfully!");
      reset();
      navigate("/login");
    } catch (error) {
      // console.error("Password reset failed:", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AuthLayout>
      <AuthFormCard
        title="Reset Your Password"
        subtitle="Enter your new password below."
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        buttonText="Reset Password"
        bottomText=""
        bottomLinkPath="/login"
        bottomLinkText="Back to Login"
      >

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

      </AuthFormCard>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormInput from "../../components/FormInput.jsx";
import authApi from "../../api/authApi.js";
import { schemaForgotPassword } from "../../validator/schema.js";
import AuthLayout from "../../components/AuthLayout.jsx";
import AuthFormCard from "../../components/AuthFormCard.jsx";


function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaForgotPassword),
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    try {
      const resp = await authApi.forgotPassword({ email: data.email });
      toast.success(resp.data.message || "Password reset link has been sent.");
      reset();
      navigate("/login");

    } catch (error) {
      // console.error("Forgot password failed:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <AuthLayout>
      <AuthFormCard
        title="Forgot Your Password?"
        subtitle="Enter your email to receive a password reset link."
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        buttonText="Send Reset Link"
        bottomText="Remembered your password?"
        bottomLinkPath="/login"
        bottomLinkText="Back to Login"
      >

        <FormInput
          label="Your Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="Enter Your Email"
        />

      </AuthFormCard>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
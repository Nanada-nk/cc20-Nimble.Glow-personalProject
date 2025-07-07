import { Link, useNavigate } from "react-router";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify"; 
import FormInput from "../../components/FormInput.jsx";
import { BubblesIcon } from 'lucide-react'; 
import authApi from "../../api/authApi.js";
import { schemaForgotPassword } from "../../validator/schema.js";
import NimbleGlowLogo from "../../components/NimbleGlowLogo.jsx";


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

      toast.success(resp.data.message || "Password reset link has been sent to your email. Please check your inbox."); 
      reset(); 

      navigate("/login");

    } catch (error) {
      console.error("Forgot password failed:", error);
      
      toast.error(error.response?.data?.message || "Failed to send reset link. Please check your email and try again.");
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr3">
     
      <div className="relative hidden lg:block">
        <img
          src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_lbralc.jpg"
          alt="Skincare products background"
          className="absolute w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Forgot Your Password?</h1>
            <p className="mt-2 text-gray-600">Enter your email to receive a password reset link.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-cr4 p-8 rounded-3xl shadow-lg space-y-6">
          
            <FormInput
              label="Your Email"
              name="email"
              type="email"
              register={register}
              error={errors.email} 
              placeholder="Enter Your Email"
            />

         
            <button
              type="submit"
              disabled={isSubmitting} 
              className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <BubblesIcon className="w-5 h-5 animate-spin" />
                  <p>Sending Link...</p>
                </div>
              ) : (
                <p>Send Reset Link</p>
              )}
            </button>
          </form>

         
          <p className="text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-pri-gr1 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
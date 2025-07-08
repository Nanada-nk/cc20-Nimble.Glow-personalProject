import { Link, useNavigate } from "react-router"
import NimbleGlowLogo from "../../components/NimbleGlowLogo.jsx"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaRegister } from "../../validator/schema.js";

import { toast } from "react-toastify";
import FormInput from "../../components/FormInput.jsx";
import { BubblesIcon } from 'lucide-react'
import authApi from "../../api/authApi.js";


function RegisterPage() {
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaRegister),
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
     const resp = await authApi.register(data);
      console.log('resp', resp);
      toast.success("Registration successful! Please log in.");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };


  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr3">
      <div className="relative hidden lg:block">
        <img
          src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_2_vlg6tn.jpg"
          alt="Skincare products background"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Welcome to</h1>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Nimble.Glow !</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-cr4 p-8 rounded-3xl shadow-lg space-y-4">

            <FormInput
              label="Your FirstName"
              name="firstName"
              register={register}
              error={errors.firstName}
              placeholder="Enter Your FirstName"
            />
            <FormInput
              label="Your LastName"
              name="lastName"
              register={register}
              error={errors.lastName}
              placeholder="Enter Your LastName"
            />
            <FormInput
              label="Your Mobile"
              name="mobile"
              register={register}
              error={errors.mobile}
              placeholder="Enter Your Mobile"
            />
            <FormInput
              label="Your Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter Your Email"
            />
            <FormInput
              label="Your Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="Enter Your Password"
              autoComplete="new-password"
            />
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              register={register}
              error={errors.confirmPassword}
              placeholder="Confirm Your Password"
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors mt-4 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <BubblesIcon className="w-5 h-5 animate-spin" />
                  <p>Loading...</p>
                </div>
              ) : (
                <p>Register</p>
              )}
            </button>
          </form>


          <p className="text-center text-sm text-gray-600">
            Already have an account ?{" "}
            <Link to="/login" className="font-bold text-pri-gr1 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

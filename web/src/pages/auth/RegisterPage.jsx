import { useNavigate } from "react-router"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaRegister } from "../../validator/schema.js";
import { toast } from "react-toastify";
import FormInput from "../../components/FormInput.jsx";
import authApi from "../../api/authApi.js";
import AuthLayout from "../../components/AuthLayout.jsx";
import AuthFormCard from "../../components/AuthFormCard.jsx";


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
      await authApi.register(data);
      // console.log('resp', resp);
      toast.success("Registration successful! Please log in.");
      reset();
      navigate("/login");
    } catch (error) {
      // console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };


  return (
    <AuthLayout>
      <AuthFormCard
        title={["Welcome to", "Nimble.Glow !"]}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        buttonText="Register"
        bottomText="Already have an account?"
        bottomLinkPath="/login"
        bottomLinkText="Login"
      >
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
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword}
          placeholder="Confirm Your Password"
        />

      </AuthFormCard>
    </AuthLayout>
  )
}

export default RegisterPage

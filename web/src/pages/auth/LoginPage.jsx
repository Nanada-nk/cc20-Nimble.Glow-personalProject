import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaLogin } from "../../validator/schema.js";
import { toast } from "react-toastify";
import FormInput from "../../components/FormInput.jsx";
import authStore from "../../stores/authStore.js";
import { useEffect } from "react";
import AuthLayout from "../../components/AuthLayout.jsx";
import AuthFormCard from "../../components/AuthFormCard.jsx";

function LoginPage() {
  const actionLogin = authStore((state) => state.actionLogin);
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const user = authStore((state) => state.user);
  const isLoading = authStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    if (!isLoading && isLoggedIn && user) {
      if (user.role === 'SUPERADMIN' || user.role === 'ADMIN') {
        navigate("/admin/users", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }


  useEffect(() => {
    handleLoginRedirect()
  }, [isLoggedIn, user, isLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaLogin),
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    try {
      await actionLogin(data);
      toast.success("Login successful!");
      reset();

    } catch (error) {
      // console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };


  return (
    <AuthLayout>
      <AuthFormCard
        title={["Welcome Back", "to Nimble.Glow !"]}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        buttonText="Login"
        bottomText="Don't have an account ?"
        bottomLinkPath="/register"
        bottomLinkText="Sign Up"
      >
        <FormInput
          label="Your Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
        />

        <FormInput
          label="Your Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
        />

        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-medium text-pri-gr1 hover:underline">
            Forgot password?
          </Link>
        </div>

      </AuthFormCard>
    </AuthLayout>
  )
}

export default LoginPage

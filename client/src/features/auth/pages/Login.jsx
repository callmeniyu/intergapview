import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useToast } from "../../toast/toast.context";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const { handleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(formData);

    if (result.ok) {
      showToast({ status: "success", message: result.message });
      navigate("/");
    } else {
      showToast({ status: "failed", message: result.error });
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your account" footerText="Don't have an account?" footerLinkText="Create one" footerLinkTo="/register">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField id="email" label="Email address" type="email" name="email" icon="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" required />
        <FormField id="password" label="Password" type="password" name="password" icon="lock" placeholder="••••••••" value={formData.password} onChange={handleChange} autoComplete="current-password" required />

        <button type="submit" className="btn-primary group">
          Sign in
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} aria-hidden="true" />
        </button>

        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default Login;

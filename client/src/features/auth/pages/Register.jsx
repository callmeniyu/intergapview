import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router";
import { useToast } from "../../toast/toast.context.jsx";
import { ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading)
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );

    try {
      const result = await handleRegister(formData);
      if (result.ok) {
        showToast({ status: "success", message: result.message });
        navigate("/");
      } else {
        showToast({ status: "failed", message: result.error });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join us and get started in minutes" footerText="Already have an account?" footerLinkText="Sign in" footerLinkTo="/login">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField id="username" label="Username" type="text" name="username" icon="user" placeholder="johndoe" value={formData.username} onChange={handleChange} autoComplete="username" required />
        <FormField id="email" label="Email address" type="email" name="email" icon="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" required />
        <FormField id="password" label="Password" type="password" name="password" icon="lock" placeholder="Create a password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />

        <button type="submit" className="btn-primary group">
          Create account
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} aria-hidden="true" />
        </button>

        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default Register;

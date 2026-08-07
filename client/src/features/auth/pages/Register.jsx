import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import SocialButtons from "../components/SocialButtons";
import { registerUser } from "../services/auth.api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading)
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );

    handleRegister(formData);
    navigate("/");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join us and get started in minutes" footerText="Already have an account?" footerLinkText="Sign in" footerLinkTo="/login">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField id="username" label="Username" type="text" name="username" icon="user" placeholder="johndoe" value={formData.username} onChange={handleChange} autoComplete="username" required />
        <FormField id="email" label="Email address" type="email" name="email" icon="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" required />
        <FormField id="password" label="Password" type="password" name="password" icon="lock" placeholder="Create a password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />

        <button type="submit" className="btn-primary group">
          Create account
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>

        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default Register;

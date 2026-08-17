import { User, Mail, Lock } from "lucide-react";

const ICONS = {
  user: User,
  email: Mail,
  lock: Lock,
};

const FormField = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon = "user",
  autoComplete,
  required = false,
}) => {
  const Icon = ICONS[icon];

  return (
    <div className="group">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center text-stone-500 transition-colors duration-200 group-focus-within:text-accent-400">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="input-field"
        />
      </div>
    </div>
  );
};

export default FormField;

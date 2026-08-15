import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.router";
import { AuthProvider } from "./features/auth/contexts/auth.context";
import { ToastProvider } from "./features/toast/toast.context.jsx";

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

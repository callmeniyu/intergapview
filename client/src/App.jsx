import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.router";
import { AuthProvider } from "./features/auth/contexts/auth.context.jsx";
import { ToastProvider } from "./features/toast/toast.context.jsx";
import { InterviewProvider } from "./features/interview/contexts/interview.context.jsx";

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router}></RouterProvider>
        </InterviewProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

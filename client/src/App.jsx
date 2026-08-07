import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.router";
import { AuthProvider } from "./features/auth/contexts/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
};

export default App;

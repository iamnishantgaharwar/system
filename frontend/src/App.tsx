import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import useAuthInit from "./hooks/useAuthInit";

import { useAppSelector } from "./store/hooks";
import ProtectedPage from "./pages/ProtectedPage";

function App() {
  const userLoading = useAppSelector((state) => state.user.loading);
  useAuthInit();
  return (
    <Routes>
      {!userLoading ? (
        <Route element={<Layout />}>
          <Route index element={<LoginPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedPage allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedPage>
            }
          />
        </Route>
      ) : (
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        />
      )}
    </Routes>
  );
}

export default App;

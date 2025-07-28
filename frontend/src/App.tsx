import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import Layout from "./pages/Layout/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;

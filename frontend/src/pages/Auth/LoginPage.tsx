import { useEffect } from "react";
import Login from "../../components/Auth/Login";
import axios from "axios";

const LoginPage = () => {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos/1")
  }, [])
  return (
    <div className="flex flex-col justify-center items-center mx-4 sm:mx-8">
      <Login />
    </div>
  );
};

export default LoginPage;

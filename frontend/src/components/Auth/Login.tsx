import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { loginRequest, type LoginRequestType } from "./schema/auth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/thunk/authService";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const loading = useAppSelector(state => state.user.loading)
  
  const loginForm = useForm<LoginRequestType>({
    resolver: zodResolver(loginRequest),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const handleLogin = async (data: LoginRequestType) => {
    console.log("Login form submitted with:", data); // <-- Is this printing?
    const response = await dispatch(loginUser(data))
    console.log("Response: ", response)
    if (response.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  }
  

  return (
    <div className="w-full sm:w-6/12 md:w-1/2 lg:w-1/3">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nishant@example.com" 
                        {...field} 
                        type="email" 
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="password"
                          type={showPassword ? "text" : "password"}
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 bottom-0 rounded-l-none"
                        type="button"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

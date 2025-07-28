import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const loginForm = useForm<LoginRequestType>({
    resolver: zodResolver(loginRequest),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log("Watch", loginForm.watch());

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    console.log("Login", loginForm.getValues());
  };

  return (
    <div className="w-full sm:w-6/12 md:w-1/2 lg:w-1/3">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              {/* Loop the fields */}
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nishant@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1 my-2">
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 bottom-0 rounded-l-none"
                        type="button"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

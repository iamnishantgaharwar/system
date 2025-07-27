import z from "zod";

export const loginRequest = z.object({
    email: z.email().min(1, 'Email Required'),
    password: z.string().min(1, 'Password Required')
})

export type LoginRequestType = z.infer<typeof loginRequest>
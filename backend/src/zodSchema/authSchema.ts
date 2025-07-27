import { z } from 'zod'
export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is requried"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    type: z.enum(['User', 'Student', 'Teacher'])
})

export const loginSchema = z.object({
    email: z.email('Invalid Email'), 
    password: z.string().min(8, 'Password must be at least 8 characters')
})

export const logoutSchema = z.object({
    refreshToken: z.string()
})

export const refreshSchema = z.object({
    refreshToken: z.string()
})

export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type LogoutRequest = z.infer<typeof logoutSchema>
export type refreshRequest = z.infer<typeof refreshSchema>

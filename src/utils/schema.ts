
import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().min(2).email(),
    password: z.string().min(6),

})

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(2).email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(["SuperAdmin", "Admin", "Manager", "User"]).optional(), // Optional for registration, mandatory for AddUser? 
    // Actually, checking AddUser logic, role is sent. Registration might default to User.
})
export const CreateRoomSchema = z.object({
    name: z.string().min(2),
    price: z.string(),
    discrption: z.string().min(6)

})
export const CreateBookingSchema = z.object({
    userId: z.string(),
    roomId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    method: z.string(),
    amount: z.string(),

})

export const createTodoSchema = z.object({
    userId: z.number({ message: "Must number", required_error: "User Id is required" }),
    title: z.string({ message: "title Must String", required_error: "title is required" }),
    discrption: z.string({ message: "discrption Must string", required_error: "discrption is required" }),

})
import { Role, TodoStatus } from "@prisma/client"

export interface LoginDto {
    email: string,
    password: string

}
export interface RegsiterDto {
    name: string,
    email: string,
    password: string
}
export interface addUserDto {
    name: string,
    email: string,
    password: string
    role: Role
}
export interface updateUserDto {
    name?: string,
    email?: string,
    role?: Role
}

export interface CreateBookingRequestDto {

    userId: number
    roomId: number
    checkIn: string
    checkOut: string

}

export interface CreateRoomDto {
    name: string;
    price: string | number;
    discrption: string
    imageUrls: string[]; // تخزين روابط الصور بعد رفعها إلى السحابة
}
export interface UpdateRoomDto {
    name?: string;
    price?: string | number;
    discrption: string

    imageUrls?: string[]; // تخزين روابط الصور بعد رفعها إلى السحابة
}

export interface CreateBooking {

    userId: number
    roomId: number
    checkIn: string
    checkOut: string
    method: string
    amount: string

}

export interface CreateTodoDto {
    title: string
    discrption: string
    userId: number
    status?: TodoStatus
}
export interface updatePasswordDto {
    old: string
    new: string
}


export interface FilterData {
    guest?: string

    checkIn?: string
    checkOut?: string
    type?: string

}

export interface SavedDto {

    userId: number
    roomId: number

}
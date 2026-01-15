import { Booking, BookingRequest, Comment, Room, RoomImage, User, Rating, Saved } from "@prisma/client";


export type OnlienUserType = {
    userId: string,
    socketId: string
}
export type JWTPaylod = {
    id: number;
    email: string;
    name: string;
    role: string;
}

export type RoomWithReltion = Room & {
    price: string,
    images: RoomImage[]
}
export type RoomWithReltionComment = Room & {
    price: string,
    images: RoomImage[]
    comments: Comment[]
}
export type RoomWithReltionAll = Room & {
    price: string,
    images: RoomImage[]
    comments: Comment[]
    Rating: Rating[],
    averageRating: number,
    totalRatings: number,

}
export type CommentWithUser = Comment & {
    user: User
}

export type BookingtWithRelations = Booking & {
    user: { name: string };
    room: { name: string };
    totalAmount: string
    paidAmount: string
    remainingAmount: string
};

export type BookingRequestWithRelations = BookingRequest & {
    user: { name: string };
    room: { name: string };
};
export type DataType = {
    users: User[],
    rooms: RoomWithReltion[], bookings: BookingtWithRelations[],
    bookingRequests: BookingRequestWithRelations[]
}

export interface SearchProps {
    searchParams: Promise<{ pageNumber: string, search: string, sort?: string, order?: string, filter?: string }>
}

export type BookingWithRelations = Booking & {
    user: { name: string };
    room: { name: string };
    totalAmount: string
    paidAmount: string
    remainingAmount: string
    pageNumber: string,
    count: number
};

export type tableProps = {
    action: boolean,
    count: number,
    pageNumber: number,
    showOtherTable: boolean
}

export interface RoomWithReltionAllAndPorps {


    room: RoomWithReltionAll & {
        bookingRequests: BookingRequest[]
        bookings: Booking[]
    }
    userId: number

}
export interface UserWithAll {
    Saved: Saved[]
    comments: Comment[]
    bookingRequests: BookingRequest[]
    Booking: Booking[]
}


export interface UserWithAllRoom {

    Saved: (Saved & {
        room: RoomWithReltionAll
    })[]
    comments: (Comment & {
        text: string
        room: RoomWithReltionAll
    })[]
    bookingRequests: (BookingRequest & {
        room: RoomWithReltionAll
    })[]
    Booking: (Booking & {
        room: RoomWithReltionAll
    })[]

}

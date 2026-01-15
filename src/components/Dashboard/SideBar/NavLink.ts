import { FaUsers, FaBed, FaMoneyBillWave, FaChartBar, FaUserPlus, FaClipboardList, FaHotel, FaCalendarCheck, FaFileSignature, FaUserCircle } from 'react-icons/fa';
import { MdOutlineRoomService } from 'react-icons/md';
import { FaEarthAmericas } from 'react-icons/fa6';
export const links = [
    // { href: "/", label: "Web Site", Icon: FaEarthAmericas, allowedRole: ["SuperAdmin", "Admin", "Manager"] },

    {
        href: "/dashboard/users?pageNumber=1", label: "Users Management", Icon: FaUsers, allowedRole: ["SuperAdmin", "Admin", "Manager"]
    },
    { href: "/dashboard/online-users", label: "Online Users", Icon: FaChartBar, allowedRole: ["SuperAdmin", "Admin", "Manager"] },
    { href: "/dashboard/users/adduser", label: "Add User", Icon: FaUserPlus, allowedRole: ["SuperAdmin", "Admin"] },

    { href: "/dashboard/rooms?pageNumber=1", label: "Rooms", Icon: MdOutlineRoomService, allowedRole: ["SuperAdmin", "Admin", "Manager"] },
    { href: "/dashboard/rooms/addroom", label: "Add Room", Icon: FaHotel, allowedRole: ["SuperAdmin", "Admin"] },

    { href: "/dashboard/booking-requests?pageNumber=1", label: "Booking Requests", Icon: FaClipboardList, allowedRole: ["SuperAdmin", "Admin", "Manager"] },
    { href: "/dashboard/booking-requests/addrequest", label: "Add Booking Request", Icon: FaFileSignature, allowedRole: ["SuperAdmin", "Admin", "Manager"] },

    { href: "/dashboard/bookings?pageNumber=1", label: "Bookings", Icon: FaBed, allowedRole: ["SuperAdmin", "Admin", "Manager"] },
    { href: "/dashboard/bookings/addBook", label: "Add Booking", Icon: FaCalendarCheck, allowedRole: ["SuperAdmin", "Admin", "Manager"] },

    { href: "/dashboard/payments?pageNumber=1", label: "Payments", Icon: FaMoneyBillWave, allowedRole: ["SuperAdmin", "Admin", "Manager"] },

    { href: "/dashboard/reports", label: "Analytics & Reports", Icon: FaChartBar, allowedRole: ["SuperAdmin"] },

    { href: "/dashboard/profile", label: "Profile", Icon: FaUserCircle, allowedRole: ["SuperAdmin", "Admin", "Manager"] },

    // { href: "/dashboard/calendar", label: "Calendar", Icon: FaCalendarAlt, allowedRole: ["SuperAdmin"] },

    // { href: "/dashboard/settings", label: "Settings", Icon: FaCog, allowedRole: ["SuperAdmin"] },

]

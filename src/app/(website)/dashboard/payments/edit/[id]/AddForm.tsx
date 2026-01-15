"use client"

import { DOMAIN } from "@/utils/consant";
import { Booking, Payment } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPaypal } from "react-icons/fa";
import { GrVisa } from "react-icons/gr";
import { IoIosCash } from "react-icons/io";
import { toast } from "react-toastify";

interface prpops {
    payment: Payment & {

        booking: Booking
    }
}
const PaymentForm = ({ payment }: prpops) => {

    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState(payment.method);
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [amount, setAmount] = useState("");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const paymentDetails = {
            method: paymentMethod,
            amount,

        };

        // if (paymentMethod === "visa") {
        //     paymentDetails = { ...paymentDetails, cardNumber, cvv };
        // } else if (paymentMethod === "paypal") {
        //     paymentDetails = { ...paymentDetails, paypalEmail };
        // }
        try {

            if (paymentMethod === "null") return toast.error("Choose Method")
            if (paymentMethod == "visa" && cardNumber.length !== 12) return toast.error("Card Number must be 12 number")
            if (paymentMethod == "visa" && cvv.length !== 3) return toast.error("cvv must be 3 number")
            if (paymentMethod == "paypal" && paypalEmail.length === 0) return toast.error("Enter Your Email")
            if (!amount) return toast.error("amount is required")
            await axios.put(`${DOMAIN}/api/payments/${payment.id}`, paymentDetails)

            router.push("/dashboard/payments?pageNumber=1")
            toast.success("Edit Payment Successfully")

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message)
            console.log(error);

        }
        // alert("Payment successful!");
    };

    return (


        <form onSubmit={handlePayment}>






            <div className="flex gap-3  flex-wrap items-center justify-center mb-7">
                <div onClick={() => setPaymentMethod("visa")} className={`shadow-lg px-3 py-2 flex text-lg md:text-xl lg:text-2xl border-2 border-gray-600 rounded-lg  items-center gap-3 hover:-translate-y-3 duration-500 transition-all cursor-pointer ${paymentMethod == "visa" && "border-green-500 text-green-500"}`}>
                    <GrVisa /> visa
                </div>
                <div onClick={() => setPaymentMethod("paypal")} className={`shadow-lg px-3 py-2 flex text-lg md:text-xl lg:text-2xl border-2 border-gray-600 rounded-lg  items-center gap-3 hover:-translate-y-3 duration-500 transition-all cursor-pointer ${paymentMethod == "paypal" && "border-blue-500 text-blue-500"}`}>
                    <FaPaypal />
                    Pay Pal
                </div>
                <div onClick={() => setPaymentMethod("cash")} className={`shadow-lg px-3 py-2 flex text-lg md:text-xl lg:text-2xl border-2 border-gray-600 rounded-lg  items-center gap-3 hover:-translate-y-3 duration-500 transition-all cursor-pointer ${paymentMethod == "cash" && "border-red-500 text-red-500"}`}>
                    <IoIosCash /> Cash
                </div>

            </div>
            <div className="transition-all">

                {/* Credit Card Fields */}
                {paymentMethod === "visa" && (
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 mb-2">Card Number</label>
                        <input
                            type="number"
                            value={cardNumber}
                            maxLength={12}
                            minLength={12}
                            min={12}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-4 focus:ring focus:ring-blue-300"
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                        />

                        <label className="block text-gray-600 dark:text-gray-300 mb-2">CVV</label>
                        <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-4 focus:ring focus:ring-blue-300"
                            placeholder="123"
                        />
                    </div>
                )}

                {/* PayPal Email Field */}
                {paymentMethod === "paypal" && (
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 mb-2">PayPal Email</label>
                        <input
                            type="email"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-4 focus:ring focus:ring-blue-300"
                            placeholder="example@paypal.com"
                        />
                    </div>
                )}

                {/* Payment Amount */}
                <label className="block text-gray-600 dark:text-gray-300 mb-2">Amount (USD)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-6 focus:ring focus:ring-blue-300"
                    placeholder="100"
                />
                <label className="block text-gray-600 dark:text-gray-300 mb-2">Tatal your amount (USD)</label>
                <input
                    type="number"
                    disabled

                    value={Number(payment.amount)}
                    className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-6 focus:ring focus:ring-blue-300"
                    placeholder="100"
                />
                <label className="block text-gray-600 dark:text-gray-300 mb-2">Full payment required (USD)</label>
                <input
                    disabled
                    type="number"
                    value={Number(payment.booking.totalAmount)}
                    className={`w-full p-3 border rounded-lg ${payment.status == "paid" ? "bg-green-600 text-white" : "bg-gray-100"} dark:bg-gray-700 text-gray-800 dark:text-white mb-6 focus:ring focus:ring-blue-300`}
                    placeholder="100"
                />

            </div>

            {/* Submit Button */}
            <button type="submit" disabled={payment.status === "paid" ? true : false} className=" bg-blue-500 disabled:bg-blue-200 disabled:cursor-not-allowed hover:bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold transition duration-300">
                Complete Payment
            </button>
            {
                payment.status == "paid"
                &&
                <p className="bg-green-500 p-1 text-white mt-4">
                    The amount has been paid in full.
                </p>
            }
        </form>


    );
};

export default PaymentForm;

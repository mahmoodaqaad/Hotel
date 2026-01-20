"use client"

import { DOMAIN } from "@/utils/consant";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaPaypal } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GrVisa } from "react-icons/gr";
import { IoIosCash } from "react-icons/io";
import { toast } from "react-toastify";
import { LoadingPage } from "@/app/loading";

const PaymentForm = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const paymentDetails = {
            method: paymentMethod,
            amount,
            userId: searchParams.get("userId"),
            roomId: searchParams.get("roomId"),
            checkIn: searchParams.get("checkIn"),
            checkOut: searchParams.get("checkOut"),
        };

        // if (paymentMethod === "visa") {
        //     paymentDetails = { ...paymentDetails, cardNumber, cvv };
        // } else if (paymentMethod === "paypal") {
        //     paymentDetails = { ...paymentDetails, paypalEmail };
        // }
        try {
            if (paymentMethod == "visa" && cardNumber.length !== 12) return toast.error("Card Number must be 12 number")
            if (paymentMethod == "visa" && cvv.length !== 3) return toast.error("cvv must be 3 number")
            if (!amount) return toast.error("amount is required")

            setLoading(true);
            await axios.post(`${DOMAIN}/api/bookings`, paymentDetails)

            toast.success("Add Book Successfully")
            router.push("/dashboard/bookings?pageNumber=1")

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add booking")
            console.log(error);

        } finally {
            setLoading(false);
        }
        // alert("Payment successful!");
    };

    return (
        <section className='vh-dash flex justify-center items-center '  >
            {loading && <LoadingPage />}
            <div
                className=" p-6 bg-white dark:bg-gray-800 shadow-lg border rounded-2xl w-full sm:w-10/12 md:w-7/12 lg:w-5/12">

                <form onSubmit={handlePayment}>
                    <div className="text-4xl cursor-pointer"
                        onClick={() => router.back()}>
                        <FaArrowLeftLong />                </div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white text-center">Choose Payment Method</h2>



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

                    </div>

                    {/* Submit Button */}
                    <button disabled={loading} type="submit" className=" bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold transition duration-300 disabled:bg-blue-400">
                        Complete Payment
                    </button>
                </form>
            </div>

        </section >
    );
};

export default PaymentForm;

"use client"

import { DOMAIN } from "@/utils/consant";
import axios from "axios";
import { useState } from "react";
import { FaPaypal } from "react-icons/fa";
import { GrVisa } from "react-icons/gr";
import { IoIosCash } from "react-icons/io";
import { toast } from "react-toastify";

const PaymentForm = () => {

    const [userId] = useState("")
    const [roomId] = useState("")
    const [bookId] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [amount, setAmount] = useState("");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const paymentDetails = {
            method: paymentMethod,
            amount,
            userId,
            roomId,
            bookId,

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
            await axios.post(`${DOMAIN}/api/payments`, paymentDetails)





            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message)
            console.log(error);

        }
        // alert("Payment successful!");
    };

    return (


        <form onSubmit={handlePayment}>

            {/* <div className='mt-6'>

                <input
                    type="number"
                    placeholder='user Id... '
                    className='px-2 py-3 w-full border-0 outline-0 dark:bg-gray-800'
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                />
            </div>
            <div className='mt-7'>

                <input
                    type="number"
                    placeholder='Room Id... '
                    className='px-2 py-3 w-full border-0 outline-0 dark:bg-gray-800'
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                />
            </div>
            <div className='mt-7'>

                <input
                    type="number"
                    placeholder='Booking Id... '
                    className='px-2 py-3 w-full border-0 outline-0 dark:bg-gray-800'
                    value={bookId}
                    onChange={e => setBookId(e.target.value)}
                />
            </div> */}


            <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white text-center mt-5 border-t border-gray-300">Choose Payment Method</h2>



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
            <button type="submit" className=" bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold transition duration-300">
                Complete Payment
            </button>
        </form>


    );
};

export default PaymentForm;

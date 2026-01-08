"use client"

import { DOMAIN } from "@/utils/consant";
import { Booking, Payment } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPaypal, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { HiCreditCard, HiCurrencyDollar, HiCheckCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LoadingPage } from "@/app/loading";

interface prpops {
    payment: Payment & {
        booking: Booking
    }
}
const EditForm = ({ payment }: prpops) => {
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState(payment.method);
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [amount, setAmount] = useState(payment.amount.toString()); // Initialize with existing amount
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (paymentMethod === "null" || !paymentMethod) return toast.error("Choose Payment Method")
            if (paymentMethod == "visa" && cardNumber.length !== 12) return toast.error("Card Number must be 12 digits")
            if (paymentMethod == "visa" && cvv.length !== 3) return toast.error("CVV must be 3 digits")
            if (paymentMethod == "paypal" && paypalEmail.length === 0) return toast.error("Enter Your PayPal Email")
            if (!amount) return toast.error("Amount is required")

            setLoading(true);

            const paymentDetails = {
                method: paymentMethod,
                amount,
            };

            await axios.put(`${DOMAIN}/api/payments/${payment.id}`, paymentDetails)

            toast.success("Payment Updated Successfully")
            router.push("/dashboard/payments?pageNumber=1")
            router.refresh()

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to update payment");
            } else {
                toast.error("An unexpected error occurred");
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {loading && <LoadingPage />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6 md:p-12 mb-8"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <HiCreditCard size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Payment</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Update payment details and status</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-8">

                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            Select Payment Method
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                onClick={() => setPaymentMethod("visa")}
                                className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${paymentMethod === "visa" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-600" : "border-slate-200 dark:border-white/10 text-slate-500"}`}
                            >
                                <FaCreditCard size={30} />
                                <span className="font-bold">Visa Card</span>
                            </div>
                            <div
                                onClick={() => setPaymentMethod("paypal")}
                                className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-600" : "border-slate-200 dark:border-white/10 text-slate-500"}`}
                            >
                                <FaPaypal size={30} />
                                <span className="font-bold">PayPal</span>
                            </div>
                            <div
                                onClick={() => setPaymentMethod("cash")}
                                className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${paymentMethod === "cash" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-600" : "border-slate-200 dark:border-white/10 text-slate-500"}`}
                            >
                                <FaMoneyBillWave size={30} />
                                <span className="font-bold">Cash</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields based on Method */}
                    <div className="space-y-6 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                        {paymentMethod === "visa" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Card Number</label>
                                    <input
                                        type="number"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="XXXX-XXXX-XXXX-XXXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">CVV</label>
                                    <input
                                        type="password"
                                        value={cvv}
                                        maxLength={3}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                        )}

                        {paymentMethod === "paypal" && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">PayPal Email</label>
                                <input
                                    type="email"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="your-email@example.com"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount Paid (USD)</label>
                                <div className="relative">
                                    <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 pl-10 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Booking Cost</label>
                                <div className="relative">
                                    <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        disabled
                                        type="number"
                                        value={Number(payment.booking.totalAmount)}
                                        className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 pl-10 font-medium opacity-70 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-end items-center">
                        {payment.status === "paid" && (
                            <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded-full">
                                <HiCheckCircle size={20} />
                                <span>Fully Paid</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={payment.status === "paid" || loading}
                            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-3"
                        >
                            <span>{payment.status === "paid" ? "Payment Completed" : "Update Payment"}</span>
                            <HiCheckCircle size={20} />
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default EditForm;

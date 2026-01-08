"use client"

import Link from "next/link"
interface ErrorPageProps {
    error: Error;
    reset: () => void
}

//  custom page Error هاد ايرور لكل الصفحات يعني اني ايررو بيصير في اي صفحة بيجي ع هاد اذا فش 

const error = ({ error, reset }: ErrorPageProps) => {
    return (
        <div className=" fix-height  pt-7 text-center">
            <div className="text-3xl text-red-600 font-semibold">Somthing  went wrong</div>
            <h1 className="text-gray-700 my-3 text-xl">Error Message: {error.message}</h1>
            <button onClick={() => reset()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full">Try Again</button>
            <Link className="text-xl underline text-blue-700 block mt-6" href={"/"}>Go to Home page</Link>
        </div>
    )
}

export default error

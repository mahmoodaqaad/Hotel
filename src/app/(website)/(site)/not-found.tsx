import Link from "next/link";

const DashboardNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-[140] h-[calc(100vh-140px)]   text-center">
            <h1 className="text-8xl font-bold text-red-600">404</h1>
            <p className="text-4xl text-gray-600 dark:text-gray-300 mt-2">
                The page you are looking for does not exist.
            </p>
            <Link href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Go back to Home
            </Link>
        </div>
    );

}
export default DashboardNotFound
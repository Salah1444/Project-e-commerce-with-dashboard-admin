import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="flex flex-col dark:bg-slate-900 items-center justify-center min-h-screen mt-20">
      <div className="bg-green-100 p-8 rounded-full mb-6">
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8">Thank you for your purchase. Your order is being processed.</p>
      <Link to="/" className="bg-amber-600 text-white px-8 py-3 rounded-md hover:bg-amber-500 transition-colors font-semibold shadow-md">
        Return to Home
      </Link>
    </div>
  );
}

export default Success;

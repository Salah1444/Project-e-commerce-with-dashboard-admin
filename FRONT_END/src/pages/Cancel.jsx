import { Link } from "react-router-dom";

function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-20">
      <div className="bg-red-100 p-8 rounded-full mb-6">
        <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </div>
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-8">Your payment was cancelled. No charges were made.</p>
      <Link to="/" className="bg-amber-600 text-white px-8 py-3 rounded-md hover:bg-amber-500 transition-colors font-semibold shadow-md">
        Return to Shop
      </Link>
    </div>
  );
}

export default Cancel;

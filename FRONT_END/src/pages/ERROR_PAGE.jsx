

function ERROR_PAGE({status,message,name}) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-700">
      
      <div className="text-center space-y-6 animate-fadeIn">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center animate-pulse">
            <span className="text-red-500 text-4xl font-bold">🚫</span>
          </div>
        </div>

        {/* 403 */}
        <h1 className="text-6xl font-bold text-white">{status}</h1>

        {/* Forbidden */}
        <h2 className="text-2xl font-semibold text-red-400 tracking-wide">
          {name}
        </h2>

        {/* Message */}
        <p className="text-gray-300">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ERROR_PAGE;
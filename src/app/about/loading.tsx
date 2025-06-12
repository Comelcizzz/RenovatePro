export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-700 rounded-md w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700 rounded-md w-2/3 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
      </div>

      <div className="text-center">
        <div className="h-8 bg-gray-700 rounded-md w-1/4 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-800 mb-4"></div>
            <div className="h-6 w-2/5 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-10 w-full bg-gray-700 rounded-md"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-800 mb-4"></div>
            <div className="h-6 w-2/5 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-10 w-full bg-gray-700 rounded-md"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-800 mb-4"></div>
            <div className="h-6 w-2/5 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-10 w-full bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

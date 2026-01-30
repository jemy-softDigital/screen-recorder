import { useNavigate } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <FaExclamationTriangle className="mx-auto mb-4 text-6xl text-yellow-500" />
        <h1 className="mb-2 text-3xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Button onClick={handleGoBack} size="lg">
          <IoIosArrowBack className="size-5" />
          Back
        </Button>
      </div>
    </div>
  );
}

export default NotFound;

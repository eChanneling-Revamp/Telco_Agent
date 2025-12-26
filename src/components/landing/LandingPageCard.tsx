import React from "react";
import { User, Settings } from "lucide-react";

interface LandingPageCardProps {
  type: "agent" | "admin";
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const LandingPageCard: React.FC<LandingPageCardProps> = ({
  type,
  title,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <div className="bg-blue-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        {type === "agent" ? (
          <User className="text-blue-800" size={24} />
        ) : (
          <Settings className="text-blue-800" size={24} />
        )}
      </div>
      <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
      <p className="text-gray-600 mb-6 text-sm">{description}</p>
      <button
        onClick={onClick}
        className="w-full py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors duration-300"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default LandingPageCard;

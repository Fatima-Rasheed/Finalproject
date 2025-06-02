import { FaUserPen } from "react-icons/fa6";
import { FaProjectDiagram } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";

interface StepCardProps {
  number?: number;
  title: string;
  description: string;
    label?: string;

  icon: string;
  onClick: () => void; // onClick handler passed as a prop
    count?: number; // Include count here

}

export default function StepCard({
  number,
  title,
  description,
  icon,
  onClick,
}: StepCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "user":
        return <FaUserPen className="h-5 w-5 text-[rgb(21,21,21)]" />;
      case "layout":
        return <FaProjectDiagram className="h-5 w-5 text-[rgb(21,21,21)]" />;
      case "list":
        return <FaListUl className="h-5 w-5 text-[rgb(29,27,27)]" />;
      default:
        return null;
    }
  };

  return (
    <div className="card-container" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="bg-white rounded-lg shadow-sm p-8 transform hover:scale-105 transition-transform duration-300 border-t-7 border-[rgb(21,21,21)]">
        {/* Card Content */}
        <div className="flex items-start gap-3">
          <div className="bg-slate-100 p-2 rounded-full">{getIcon()}</div> {/* Icon container */}
          <div className="w-full">
            {/* Step number and title */}
            <h2 className="font-bold text-slate-800 text-md">
              Step {number}:
            </h2>
            <h3 className="font-semibold text-slate-800 text-sm mt-1">{title}</h3>
            {/* Description */}
            <p className="text-gray-600 mt-2 text-sm text-left ml-0">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

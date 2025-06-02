import { FaUserPen } from "react-icons/fa6";
import { FaProjectDiagram} from "react-icons/fa";
import { ImUserTie } from "react-icons/im";

interface StepCardProps {
  title: string;
  description: string;
  icon: string;
  count: number;
  label: string;
  onClick?: () => void;
}

export default function StepCard({
  title,
  description,
  icon,
  count,
  label,
  onClick,
}: StepCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "user":
        return <FaUserPen className="h-5 w-5 text-[rgb(21,21,21)]" />;
      case "layout":
        return <ImUserTie className="h-5 w-5 text-[rgb(21,21,21)]" />;
      case "list":
        return < FaProjectDiagram className="h-5 w-5 text-[rgb(29,27,27)]" />;
      default:
        return null;
    }
  };

  return (
    <div className="card-container" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="bg-white rounded-lg shadow-sm p-8 transform hover:scale-105 transition-transform duration-300 border-t-7 border-[rgb(21,21,21)]">
        <div className="flex items-start gap-3">
          <div className="bg-slate-100 p-2 rounded-full">{getIcon()}</div>
          <div className="w-full">
            <h3 className="font-bold text-slate-800 text-sm mt-1">{title}</h3>
            <p className="text-gray-600 mt-2  text-sm text-left ml-0">{description}</p>
            <h2 className="font-semibold text-slate-800 text-md mt-4">
              {label}: {count}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

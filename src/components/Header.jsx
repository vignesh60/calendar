import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
import logo from "../assets/logo.png";

export default function Header({
  view,
  onViewChange,
  currentDate,
  onNavigate,
  onCreate,
}) {
  const formatHeaderDate = () => {
    const options = {
      month: "long",
      year: "numeric",
    };

    if (view === "day") {
      options.day = "numeric";
      options.weekday = "long";
    }

    return currentDate.toLocaleDateString("en-US", options);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-45" />
          </div>

          <button
            onClick={() => onNavigate("today")}
            className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-3 py-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition"
          >
            Today
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate("prev")}
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-3 py-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-3 py-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-medium text-gray-900">
            {formatHeaderDate()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-white border-2 border-blue-500 rounded-lg p-1">
            {["month", "week", "day"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange(viewType)}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 py-2 cursor-pointer transition capitalize ${
                  view === viewType
                    ? "bg-gradient-to-br from-purple-600 to-blue-700 text-white"
                    : "hover:bg-blue-400 hover:text-white"
                }`}
              >
                {viewType}
              </button>
            ))}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 p-3 cursor-pointer transition"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </button>
        </div>
      </div>
    </header>
  );
}

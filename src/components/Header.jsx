import {
  ChevronLeft,
  ChevronRight,
  Plus,
  AlignJustify,
  FileText,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Header({
  view,
  onViewChange,
  currentDate,
  onNavigate,
  onCreate,
  onSidebarToggle,
  onGenerateReport,
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
            <AlignJustify
              className="w-8 h-8 text-gray-900 bar-icon cursor-pointer hover:text-orange-500 transition"
              onClick={onSidebarToggle}
            />
            <img src={logo} alt="logo" className="w-45 calendar-logo" />
          </div>

          <button
            onClick={() => onNavigate("today")}
            className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-3 py-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition today-btn"
          >
            Today
          </button>

          <div className="flex items-center space-x-1 prev-next-btn">
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

          <h2 className="text-xl font-medium text-gray-900 header-date">
            {formatHeaderDate()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onGenerateReport}
            className="px-5 py-3 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-500 hover:to-red-700 flex items-center shadow-md hover:shadow-lg transition-all duration-200 font-medium cursor-pointer text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Generate Report</span>
            <span className="lg:hidden">GR</span>
          </button>

          <div className="flex bg-white border-2 border-blue-500 rounded-2xl p-1 view-selector">
            {["month", "week", "day"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange(viewType)}
                className={`px-3 py-2.5 rounded-xl flex items-center transition-all duration-200 font-medium cursor-pointer text-sm ${
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
            className="px-5 py-3 bg-gradient-to-br from-blue-800 to-black text-white rounded-xl hover:from-purple-700 hover:to-black flex items-center shadow-md hover:shadow-lg transition-all duration-200 font-medium cursor-pointer text-sm"
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

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar({
  currentDate,
  onDateSelect,
  events,
  onEventsDelete,
}) {
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteScope, setDeleteScope] = useState(null);
  const [targetDate, setTargetDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMiniCalendar = (direction) => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setMiniCalendarDate(newDate);
  };

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(miniCalendarDate);
    const firstDay = getFirstDayOfMonth(miniCalendarDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        miniCalendarDate.getFullYear(),
        miniCalendarDate.getMonth(),
        day
      );
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === currentDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`h-8 w-8 text-sm rounded-full hover:bg-blue-100 transition-colors ${
            isToday
              ? "bg-gradient-to-br from-purple-600 to-blue-700 text-white border-2 border-white shadow-lg"
              : ""
          } ${
            isSelected && !isToday
              ? "bg-gradient-to-br from-orange-600 to-orange-200 text-white border-2 border-white shadow-lg"
              : ""
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleDeleteClick = (scope, date = null) => {
    setDeleteScope(scope);
    setTargetDate(date || currentDate);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    let filteredEvents = [...events];

    switch (deleteScope) {
      case "day":
        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate).toDateString();
          return eventDate !== targetDate.toDateString();
        });
        break;
      case "week":
        const weekStart = new Date(targetDate);
        weekStart.setDate(targetDate.getDate() - targetDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate < weekStart || eventDate > weekEnd;
        });
        break;
      case "month":
        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return (
            eventDate.getMonth() !== targetDate.getMonth() ||
            eventDate.getFullYear() !== targetDate.getFullYear()
          );
        });
        break;
      case "year":
        filteredEvents = events.filter((event) => {
          return (
            new Date(event.startDate).getFullYear() !== targetDate.getFullYear()
          );
        });
        break;
      case "all":
        filteredEvents = [];
        break;
      default:
        return;
    }

    onEventsDelete(filteredEvents);
    setShowConfirmModal(false);
  };

  const getScopeDescription = () => {
    switch (deleteScope) {
      case "day":
        return `all events on ${targetDate.toLocaleDateString()}`;
      case "week":
        const weekStart = new Date(targetDate);
        weekStart.setDate(targetDate.getDate() - targetDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `all events from ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`;
      case "month":
        return `all events in ${targetDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}`;
      case "year":
        return `all events in ${targetDate.getFullYear()}`;
      case "all":
        return "ALL events in the calendar";
      default:
        return "";
    }
  };

  return (
    <aside className="w-64 lg:h-auto md:h-auto h-screen bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Mini Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              {miniCalendarDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateMiniCalendar("prev")}
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold h-9 p-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateMiniCalendar("next")}
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold h-9 p-2 border-2 border-blue-200 hover:bg-gradient-to-br from-purple-600 to-blue-700 hover:text-white hover:border-white cursor-pointer transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={index}
                className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {renderMiniCalendar()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </h3>

          <div className="space-y-2 bg-gray-50 p-1 rounded-lg">
            {/* Today's Events */}
            <div className="group relative">
              <button
                onClick={() => handleDeleteClick("day")}
                className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm cursor-pointer hover:text-red-800 hover:bg-red-200 transition"
              >
                <span>Delete today's events</span>
                <Trash2 className="h-6 w-6 rounded-md shadow-lg text-red-500 border p-1" />
              </button>
              <div className="absolute left-0 mt-1 w-full px-2 py-1 bg-blue-500 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* This Week's Events */}
            <div className="group relative">
              <button
                onClick={() => handleDeleteClick("week")}
                className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm cursor-pointer hover:text-red-800 hover:bg-red-200 transition"
              >
                <span>Delete this week's events</span>
                <Trash2 className="h-6 w-6 rounded-md shadow-lg text-red-500 border p-1" />
              </button>
              <div className="absolute left-0 mt-1 w-full px-2 py-1 bg-blue-500 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {(() => {
                  const weekStart = new Date(currentDate);
                  weekStart.setDate(
                    currentDate.getDate() - currentDate.getDay()
                  );
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
                })()}
              </div>
            </div>

            {/* This Month's Events */}
            <div className="group relative">
              <button
                onClick={() => handleDeleteClick("month")}
                className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm cursor-pointer hover:text-red-800 hover:bg-red-200 transition"
              >
                <span>Delete this month's events</span>
                <Trash2 className="h-6 w-6 rounded-md shadow-lg text-red-500 border p-1" />
              </button>
              <div className="absolute left-0 mt-1 w-full px-2 py-1 bg-blue-500 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* This Year's Events */}
            <div className="group relative">
              <button
                onClick={() => handleDeleteClick("year")}
                className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm cursor-pointer hover:text-red-800 hover:bg-red-200 transition"
              >
                <span>Delete this year's events</span>
                <Trash2 className="h-6 w-6 rounded-md shadow-lg text-red-500 border p-1" />
              </button>
              <div className="absolute left-0 mt-1 w-full px-2 py-1 bg-blue-500 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {currentDate.getFullYear()}
              </div>
            </div>

            {/* All Events */}
            <div className="group relative">
              <button
                onClick={() => handleDeleteClick("all")}
                className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm text-sm cursor-pointer hover:text-red-800 hover:bg-red-200 transition"
              >
                <span>Delete ALL events</span>
                <Trash2 className="h-6 w-6 rounded-md shadow-lg text-red-500 border p-1" />
              </button>
              <div className="absolute left-0 mt-1 w-full px-2 py-1 bg-blue-500 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Entire calendar history
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-pop-in">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Deletion
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete {getScopeDescription()}?
                  </p>
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="text-xs flex border-l-3 border-orange-500 p-1 bg-orange-50 mt-2">
        Developer : Vignesh G
      </p>
    </aside>
  );
}

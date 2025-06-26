import { useState } from "react";
import EventMenu from "./EventMenu";

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  onEventDelete,
}) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventPosition = (event) => {
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate.getHours();
    const endMinute = event.endDate.getMinutes();

    const startPosition = startHour * 60 + startMinute;
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

    return {
      top: `${startPosition}px`,
      height: `${duration}px`,
    };
  };

  const handleEventHover = (event, e) => {
    setHoveredEvent(event);
    setPopupPosition({
      top: e.clientY + 10,
      left: e.clientX + 10,
    });
  };

  const timeSlots = [];
  for (let hour = 0; hour <= 23; hour++) {
    timeSlots.push(hour);
  }

  const weekDays = getWeekDays();

  return (
    <div className="h-full flex flex-col">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 border-r border-gray-200"></div>
        {weekDays.map((day, index) => {
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <div
              key={index}
              className="p-4 text-center border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm text-gray-500">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isToday ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 relative">
          {/* Time column */}
          <div className="border-r border-gray-200">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-200 p-2 text-sm text-gray-500"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="border-r border-gray-200 last:border-r-0 relative"
            >
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    const clickedDate = new Date(day);
                    clickedDate.setHours(hour, 0, 0, 0);
                    onDateClick(clickedDate);
                  }}
                />
              ))}

              {/* Events for this day */}
              {getEventsForDate(day).map((event) => {
                const position = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 ${event.color} text-white text-xs p-2 rounded-lg cursor-pointer hover:opacity-80 z-10 border border-white/20 shadow-sm`}
                    style={position}
                    onClick={() => onEventClick(event)}
                    onMouseEnter={(e) => handleEventHover(event, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-xs opacity-90">
                          {event.startDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {event.endDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <EventMenu
                        event={event}
                        onEdit={onEventClick}
                        onDelete={(eventId) => {
                          if (onEventDelete) onEventDelete(eventId);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Popup container */}
      {hoveredEvent && (
        <div
          className="fixed bg-white rounded-lg border-2 border-blue-200 shadow-xl p-4 z-50 max-w-xs transition-opacity duration-200"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          onMouseEnter={() => setHoveredEvent(hoveredEvent)}
          onMouseLeave={() => setHoveredEvent(null)}
        >
          <div className="font-semibold text-lg mb-1">{hoveredEvent.title}</div>
          <div className="text-sm text-gray-600 mb-2">
            {hoveredEvent.startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {hoveredEvent.endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          {hoveredEvent.description && (
            <div className="text-sm text-gray-700">
              {hoveredEvent.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

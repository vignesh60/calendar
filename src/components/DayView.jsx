import { useState } from 'react';

export default function DayView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  
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
      left: e.clientX + 10
    });
  };

  const timeSlots = [];
  for (let hour = 0; hour <= 23; hour++) {
    timeSlots.push(hour);
  }

  const dayEvents = getEventsForDate(currentDate);
  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="h-full flex flex-col">
      {/* Day header */}
      <div className="border-b border-gray-200 p-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">
            {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div
            className={`text-3xl font-bold ${
              isToday ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-gray-500">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 relative">
          {/* Time column */}
          <div className="border-r border-gray-200">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-14 border-b border-gray-200 p-4 text-sm text-gray-500"
                style={{ minHeight: "60px" }}
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

          <div className="relative col-span-6">
            <div className="absolute inset-0 grid grid-cols-1">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  style={{ height: "60px" }}
                  onClick={() => {
                    const clickedDate = new Date(currentDate);
                    clickedDate.setHours(hour, 0, 0, 0);
                    onDateClick(clickedDate);
                  }}
                />
              ))}
            </div>

            {/* Events for this day */}
            {dayEvents.map((event) => {
              const position = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 ${event.color} text-white text-sm p-3 rounded-lg cursor-pointer z-10 transition border border-white/20 shadow-md`}
                  style={position}
                  onClick={() => onEventClick(event)}
                  onMouseEnter={(e) => handleEventHover(event, e)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <div className="flex items-start justify-between relative">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base truncate">
                        {event.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs opacity-90 mb-1">
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
              );
            })}
          </div>
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
            <div className="text-sm text-gray-700">{hoveredEvent.description}</div>
          )}
        </div>
      )}
    </div>
  );
}
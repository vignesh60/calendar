import EventMenu from "./EventMenu"

export default function MonthView({ currentDate, events, onEventClick, onDateClick, onEventDelete }) {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
      days.push(
        <div
          key={`prev-${day}`}
          className="min-h-[120px] p-2 border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => onDateClick(date)}
        >
          <span className="text-gray-400 text-sm">{day}</span>
        </div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className="min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onDateClick(date)}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded-md text-white cursor-pointer hover:opacity-80 transition-opacity relative group ${event.color} border border-white/20`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(event)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {event.startDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: false,
                      })}{" "}
                      {event.title}
                    </div>
                  </div>
                  <EventMenu
                    event={event}
                    onEdit={onEventClick}
                    onDelete={(eventId) => {
                      if (onEventDelete) onEventDelete(eventId)
                    }}
                  />
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      )
    }

    const totalCells = 42
    const remainingCells = totalCells - days.length

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
      days.push(
        <div
          key={`next-${day}`}
          className="min-h-[120px] p-2 border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => onDateClick(date)}
        >
          <span className="text-gray-400 text-sm">{day}</span>
        </div>
      )
    }

    return days
  }

  return (
    <div className="h-full flex flex-col">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
          <div key={day} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">{renderCalendarGrid()}</div>
    </div>
  )
}
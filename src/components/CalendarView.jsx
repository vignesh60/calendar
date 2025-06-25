import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

export default function CalendarView({
  view,
  currentDate,
  events,
  onEventClick,
  onDateClick,
  onEventDelete,
}) {
  switch (view) {
    case "month":
      return (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
          onEventDelete={onEventDelete}
        />
      );
    case "week":
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
          onEventDelete={onEventDelete}
        />
      );
    case "day":
      return (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
          onEventDelete={onEventDelete}
        />
      );
    default:
      return null;
  }
}

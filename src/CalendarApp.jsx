import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import EventModal from "./components/EventModal";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const STORAGE_KEY = "calendarEvents_v1";

const initialEvents = [
  {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    startDate: new Date(2025, 5, 3, 1, 0),
    endDate: new Date(2025, 5, 3, 3, 0),
    color: "bg-orange-500",
  },
  {
    id: "2",
    title: "Design Review",
    description: "UI/UX updates discussion",
    startDate: new Date(2025, 5, 14, 7, 30),
    endDate: new Date(2025, 5, 14, 10, 30),
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Project Review",
    description: "Monthly project review",
    startDate: new Date(2025, 5, 25, 11, 0),
    endDate: new Date(2025, 5, 25, 12, 0),
    color: "bg-green-500",
  },
  {
    id: "4",
    title: "Meeting 1",
    description: "Discussion on task distribution",
    startDate: new Date(2025, 5, 5, 9, 0),
    endDate: new Date(2025, 5, 5, 12, 0),
    color: "bg-red-500",
  },
  {
    id: "5",
    title: "Meeting 2",
    description: "Backend architecture deep dive",
    startDate: new Date(2025, 5, 5, 13, 0),
    endDate: new Date(2025, 5, 5, 17, 0),
    color: "bg-purple-500",
  },
  {
    id: "6",
    title: "Meeting 3",
    description: "Frontend component review",
    startDate: new Date(2025, 5, 5, 18, 0),
    endDate: new Date(2025, 5, 5, 20, 0),
    color: "bg-pink-500",
  },
  {
    id: "7",
    title: "Meeting 4",
    description: "Deployment checklist",
    startDate: new Date(2025, 5, 5, 21, 0),
    endDate: new Date(2025, 5, 5, 23, 0),
    color: "bg-yellow-500",
  },
  {
    id: "8",
    title: "Meeting 5",
    description: "Weekly QA sync",
    startDate: new Date(2025, 5, 5, 6, 0),
    endDate: new Date(2025, 5, 5, 9, 0),
    color: "bg-cyan-500",
  },
  {
    id: "9",
    title: "Meeting 1",
    description: "Client feedback session",
    startDate: new Date(2025, 5, 10, 10, 0),
    endDate: new Date(2025, 5, 5, 11, 0),
    color: "bg-teal-500",
  },
  {
    id: "10",
    title: "Meeting 2",
    description: "Sprint planning",
    startDate: new Date(2025, 5, 10, 12, 0),
    endDate: new Date(2025, 5, 10, 14, 0),
    color: "bg-indigo-500",
  },
];


const isValidEvent = (event) => {
  return (
    event.id &&
    event.title &&
    !isNaN(new Date(event.startDate).getTime()) &&
    !isNaN(new Date(event.endDate).getTime())
  );
};

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          const restoredEvents = parsedEvents
            .map((event) => ({
              ...event,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
            }))
            .filter(isValidEvent);

          setEvents(restoredEvents.length > 0 ? restoredEvents : initialEvents);
        } catch (error) {
          console.error("Failed to parse saved events", error);
          setEvents(initialEvents);
        }
      } else {
        setEvents(initialEvents);
      }
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const eventsToStore = events.map((event) => ({
        ...event,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToStore));
    }
  }, [events, isLoading]);

  const checkTimeConflict = (newEvent, excludeId = null) => {
    return events.some((event) => {
      if (excludeId && event.id === excludeId) return false;

      const newStart = newEvent.startDate.getTime();
      const newEnd = newEvent.endDate.getTime();
      const existingStart = event.startDate.getTime();
      const existingEnd = event.endDate.getTime();

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    const startDate =
      eventData.startDate instanceof Date
        ? eventData.startDate
        : new Date(eventData.startDate);
    const endDate =
      eventData.endDate instanceof Date
        ? eventData.endDate
        : new Date(eventData.endDate);

    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }

    const eventToSave = {
      ...eventData,
      startDate,
      endDate,
    };

    if (checkTimeConflict(eventToSave, selectedEvent?.id)) {
      toast.error(
        "This time slot is already booked. Please choose another time."
      );
      return;
    }

    if (selectedEvent) {
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id
            ? { ...eventToSave, id: selectedEvent.id }
            : event
        )
      );
      toast.success("Event updated successfully!");
    } else {
      setEvents([
        ...events,
        {
          ...eventToSave,
          id: Date.now().toString(),
        },
      ]);
      toast.success("Event created successfully!");
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
    toast.success("Event deleted successfully!");
  };

  const handleEventsDelete = (filteredEvents) => {
    setEvents(filteredEvents);
    toast.success("Events deleted successfully!");
  };

  const handleEventClickWithNavigation = (event) => {
    if (view !== "day") {
      setCurrentDate(new Date(event.startDate));
      setView("day");
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);

    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }

    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
    }

    setCurrentDate(newDate);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onNavigate={navigateDate}
        onCreate={handleCreateEvent}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
          <Sidebar
            currentDate={currentDate}
            onDateSelect={setCurrentDate}
            events={events}
            onEventsDelete={handleEventsDelete}
          />
        </div>

        <main className="flex-1 overflow-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <CalendarView
              view={view}
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClickWithNavigation}
              onDateClick={handleDateClick}
              onEventDelete={handleDeleteEvent}
            />
          )}
        </main>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        onDelete={
          selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined
        }
      />
    </div>
  );
}

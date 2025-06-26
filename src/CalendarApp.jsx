import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import EventModal from "./components/EventModal";
import { toast } from "react-toastify";
import { CalendarDays, FileText, Loader, X } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./assets/logo.png";

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportRange, setReportRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

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

  const generatePDFReport = () => {
    const filteredEvents = events.filter((event) => {
      const eventStart = event.startDate.getTime();
      const rangeStart = reportRange.startDate.getTime();
      const rangeEnd = reportRange.endDate.getTime();
      return eventStart >= rangeStart && eventStart <= rangeEnd;
    });

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    });

    const logoWidth = 40;
    const logoHeight = 12;
    doc.addImage(logo, "PNG", 10, 10, logoWidth, logoHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("Calendar Events Report", doc.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(81, 81, 81);
    doc.text(
      `Report Period: ${reportRange.startDate.toLocaleDateString()} - ${reportRange.endDate.toLocaleDateString()}`,
      doc.internal.pageSize.width / 2,
      30,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.width - 20,
      15,
      { align: "right" }
    );

    const tableData = filteredEvents.map((event) => [
      event.title,
      event.description || "-",
      event.startDate.toLocaleString(),
      event.endDate.toLocaleString(),
    ]);

    autoTable(doc, {
      head: [
        [
          { content: "Title", styles: { fontStyle: "bold" } },
          { content: "Description", styles: { fontStyle: "bold" } },
          { content: "Start Date", styles: { fontStyle: "bold" } },
          { content: "End Date", styles: { fontStyle: "bold" } },
        ],
      ],
      body: tableData,
      startY: 40,
      theme: "grid",
      headStyles: {
        fillColor: [13, 71, 161],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [33, 33, 33],
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 40, left: 10, right: 10 },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: "auto", fontStyle: "bold" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`calendar-report-${new Date().toISOString().slice(0, 10)}.pdf`);

    toast.success(`Generated PDF report with ${filteredEvents.length} events`, {
      autoClose: 2000,
    });
    setIsReportModalOpen(false);
  };

  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
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
        onGenerateReport={handleGenerateReport}
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

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-500">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-orange-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Generate Report
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mt-1"></div>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={reportRange.startDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setReportRange({
                        ...reportRange,
                        startDate: new Date(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border-2 p-3 pl-10 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                  />
                  <CalendarDays className="absolute left-3 top-3.5 h-5 w-5 text-orange-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={reportRange.endDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const endDate = new Date(e.target.value);
                      if (endDate < reportRange.startDate) {
                        toast.error("End date cannot be before start date");
                        return;
                      }
                      setReportRange({
                        ...reportRange,
                        endDate: endDate,
                      });
                    }}
                    className="w-full rounded-xl border-2 p-3 pl-10 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                  />
                  <CalendarDays className="absolute left-3 top-3.5 h-5 w-5 text-orange-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Events in range:</span>
                <span className="font-medium text-orange-600">
                  {
                    events.filter(
                      (e) =>
                        e.startDate >= reportRange.startDate &&
                        e.startDate <= reportRange.endDate
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Date range:</span>
                <span className="font-medium">
                  {reportRange.startDate.toLocaleDateString()} -{" "}
                  {reportRange.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium flex items-center cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={generatePDFReport}
                className="px-5 py-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center shadow-md hover:shadow-lg transition-all duration-200 font-medium cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

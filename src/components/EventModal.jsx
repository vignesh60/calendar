import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"

const colorOptions = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
]

export default function EventModal({ isOpen, onClose, event, selectedDate, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("bg-blue-500");


  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const formatTimeForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStartDate(formatDateForInput(event.startDate));
      setStartTime(formatTimeForInput(event.startDate));
      setEndDate(formatDateForInput(event.endDate));
      setEndTime(formatTimeForInput(event.endDate));
      setColor(event.color);
    } else if (selectedDate) {
      const date = formatDateForInput(selectedDate);
      const time = formatTimeForInput(selectedDate);
      setTitle("");
      setDescription("");
      setStartDate(date);
      setStartTime(time);
      setEndDate(date);

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endDateTime.getHours() + 1);
      setEndTime(formatTimeForInput(endDateTime));
      setColor("bg-blue-500");
    }
  }, [event, selectedDate]);




  const handleSubmit = (e) => {
    e.preventDefault()

    const startDateTime = new Date(`${startDate}T${startTime}`)
    const endDateTime = new Date(`${endDate}T${endTime}`)

    const eventData = {
      title,
      description,
      startDate: startDateTime,
      endDate: endDateTime,
      color,
    }

    onSave(eventData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-purple-50">
          <h2 className="text-xl font-bold text-gray-900">{event ? "Edit Event" : "Create New Event"}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-900 hover:text-white hover:bg-red-500 cursor-pointer p-1 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Event Color</label>
            <div className="flex space-x-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-10 h-10 rounded-lg ${option.value} transition-all duration-200 ${
                    color === option.value ? "ring-4 ring-gray-300 ring-offset-2 scale-110" : "hover:scale-105"
                  }`}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            {event && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center bg-red-100 rounded-md text-sm font-medium text-red-500 h-10 px-4 py-2 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center border-2 border-gray-900 rounded-md text-sm font-medium h-10 px-4 py-2 cursor-pointer hover:bg-gray-900 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 cursor-pointer transition"
              >
                {event ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
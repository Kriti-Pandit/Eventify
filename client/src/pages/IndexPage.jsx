/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

// Helper function for date formatting
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/events", {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle like functionality
  const handleLike = async (eventId) => {
    try {
      await axios.post(`http://localhost:4000/events/${eventId}/like`);
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? { ...event, likes: (event.likes || 0) + 1 }
            : event
        )
      );
    } catch (err) {
      console.error("Error liking event:", err);
    }
  };

  // Filter upcoming events
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    const currentDate = new Date();
    return eventDate >= currentDate || 
           eventDate.toDateString() === currentDate.toDateString();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#00004B]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-cyan-400 bg-[#00004B] min-h-screen">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-4 py-2 bg-cyan-500 text-[#00004B] rounded hover:bg-cyan-400 font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-1 flex flex-col bg-[#00004B] text-[#00ffff] min-h-screen">
      {/* Hero Section */}
      <div className="hidden sm:block relative">
        <img 
          src="../src/assets/hero.jpeg" 
          alt="Event banner" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-[#00004B] bg-opacity-70 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-cyan-400 text-center px-4">
            Discover Amazing Events Nearby
          </h1>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mx-4 sm:mx-10 my-5 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div 
              className="bg-[#000033] rounded-xl shadow-lg overflow-hidden hover:shadow-cyan-500/20 hover:translate-y-[-4px] transition-all duration-300 border border-cyan-500/20" 
              key={event._id}
            >
              {/* Event Image */}
              <div className="relative h-48">
                {event.image ? (
                  <img
                    src={`${events.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '../src/assets/hero.jpeg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#00004B] flex items-center justify-center">
                    <span className="text-cyan-300">No Image Available</span>
                  </div>
                )}
                
                {/* Like Button */}
                <button 
                  onClick={() => handleLike(event._id)}
                  className="absolute bottom-4 right-4 bg-[#00004B] p-2 rounded-full shadow-md hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                  aria-label="Like this event"
                >
                  <BiLike className="w-6 h-6 text-cyan-400 hover:text-cyan-300" />
                </button>

                {/* Event Date Badge */}
                <div className="absolute top-4 left-4 bg-cyan-500/90 text-[#00004B] px-3 py-1 rounded-full text-xs font-bold">
                  {formatDate(event.eventDate)}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold text-lg truncate text-cyan-400 hover:text-cyan-300 transition-colors">
                    {event.title.toUpperCase()}
                  </h2>
                  <div className="flex items-center text-cyan-400 bg-[#00004B] px-2 py-1 rounded-full">
                    <BiLike className="mr-1" />
                    <span className="text-sm font-bold">{event.likes || 0}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-cyan-300 font-semibold mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.eventTime}
                  </div>
                  <div className="bg-cyan-500/20 px-2 py-1 rounded text-cyan-400 font-bold">
                    {event.ticketPrice === 0 ? 'FREE ENTRY' : `₹${event.ticketPrice}`}
                  </div>
                </div>

                <p className="text-sm text-cyan-200 line-clamp-2 mb-4">
                  {event.description}
                </p>

                <div className="flex justify-between text-xs text-cyan-300 mb-4">
                  <div>
                    <span className="block font-semibold text-cyan-400">Organized By:</span>
                    <span>{event.organizedBy}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-semibold text-cyan-400">Created By:</span>
                    <span>{event.owner?.name?.toUpperCase() || 'Unknown'}</span>
                  </div>
                </div>

                <Link 
                  to={`/event/${event._id}`} 
                  className="block w-full text-center py-2 bg-cyan-500 text-[#00004B] rounded-lg hover:bg-cyan-400 transition-colors font-bold shadow-md hover:shadow-cyan-500/30"
                >
                  <div className="flex items-center justify-center gap-1">
                    Book Ticket <BsArrowRightShort className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-[#000033] rounded-xl mx-4 sm:mx-0">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">
              No Upcoming Events Found
            </h3>
            <p className="text-cyan-300 mb-6 max-w-lg mx-auto">
              It looks like there aren't any events scheduled right now. Check back later or be the first to create an exciting event!
            </p>
            <Link
              to="/create-event"
              className="inline-flex items-center px-6 py-3 bg-cyan-500 text-[#00004B] rounded-lg hover:bg-cyan-400 transition-colors font-bold shadow-md hover:shadow-cyan-500/30"
            >
              Create New Event
              <BsArrowRightShort className="w-6 h-6 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
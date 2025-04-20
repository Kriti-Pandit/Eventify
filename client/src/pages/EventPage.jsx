import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import videoBg from '../assets/videos/210824_small.mp4';

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
    window.open(facebookShareUrl);
  };

  const handleBookTicket = () => {
    navigate(`/event/${id}/ordersummary`);
  };

  if (loading) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={videoBg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={videoBg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-6 bg-[#000033]/90 rounded-lg shadow-lg max-w-md mx-4">
            <h2 className="text-xl font-bold mb-2 text-cyan-400">Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Link 
              to="/"
              className="px-6 py-2 rounded-md transition-all duration-300 hover:bg-opacity-90"
              style={{
                backgroundColor: '#00ffff',
                color: '#00004B'
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={videoBg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-6 bg-[#000033]/90 rounded-lg shadow-lg max-w-md mx-4">
            <h2 className="text-xl font-bold mb-2 text-cyan-400">Event Not Found</h2>
            <p className="text-gray-300 mb-4">The requested event could not be loaded.</p>
            <Link 
              to="/"
              className="px-6 py-2 rounded-md transition-all duration-300 hover:bg-opacity-90"
              style={{
                backgroundColor: '#00ffff',
                color: '#00004B'
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Video Background (unchanged) */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 pb-10">
        {/* Event Image */}
        <div className="bg-[#000033]/90 rounded-lg p-4 shadow-lg">
          {event.image ? (
            <img 
              src={`http://localhost:4000/${event.image}`} 
              alt={event.title} 
              className="w-full h-auto max-h-[500px] rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-[#000044] rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="bg-[#000033]/90 rounded-lg p-6 mt-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              <h2 className="text-xl font-semibold mt-2 text-cyan-400">
                {event.ticketPrice === 0 ? 'Free' : `LKR ${event.ticketPrice}`}
              </h2>
            </div>
            <button 
              onClick={handleBookTicket}
              className="px-6 py-3 rounded-md font-bold transition-all duration-300 hover:bg-opacity-90"
              style={{
                backgroundColor: '#00ffff',
                color: '#00004B'
              }}
            >
              Book Ticket
            </button>
          </div>

          <div className="mt-6 text-gray-300">
            <p>{event.description}</p>
          </div>

          <div className="mt-4 text-lg font-semibold text-cyan-400">
            Organized By: {event.organizedBy}
          </div>
        </div>

        {/* Event Date and Location */}
        <div className="bg-[#000033]/90 rounded-lg p-6 mt-6 shadow-lg">
          <h1 className="text-xl font-bold mb-6 text-cyan-400">When and Where</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <AiFillCalendar className="w-6 h-6 text-cyan-400 mt-1"/>
              <div>
                <h2 className="text-lg font-semibold text-white">Date and Time</h2>
                <p className="text-gray-300">
                  {new Date(event.eventDate).toLocaleDateString()}, {event.eventTime}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MdLocationPin className="w-6 h-6 text-cyan-400 mt-1"/>
              <div>
                <h2 className="text-lg font-semibold text-white">Location</h2>
                <p className="text-gray-300">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-[#000033]/90 rounded-lg p-6 mt-6 shadow-lg">
          <h1 className="text-xl font-bold mb-4 text-cyan-400">Share with friends</h1>
          <div className="flex justify-center gap-8">
            <button 
              onClick={handleCopyLink}
              className="p-3 rounded-full transition-colors duration-300 hover:bg-[#000044]"
              aria-label="Copy link"
            >
              <FaCopy className="w-6 h-6 text-cyan-400 hover:text-cyan-300" />
            </button>

            <button 
              onClick={handleWhatsAppShare}
              className="p-3 rounded-full transition-colors duration-300 hover:bg-[#000044]"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsappSquare className="w-6 h-6 text-cyan-400 hover:text-cyan-300" />
            </button>

            <button 
              onClick={handleFacebookShare}
              className="p-3 rounded-full transition-colors duration-300 hover:bg-[#000044]"
              aria-label="Share on Facebook"
            >
              <FaFacebook className="w-6 h-6 text-cyan-400 hover:text-cyan-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
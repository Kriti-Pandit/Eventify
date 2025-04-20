import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TicketPage() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tickets/user/${user._id}`);
      setUserTickets(response.data);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      await axios.delete(`/tickets/${ticketId}`);
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTicketDetails = (ticket) => {
    if (ticket.ticketDetails) {
      return {
        eventName: ticket.ticketDetails.eventname || ticket.ticketDetails.eventName,
        eventDate: ticket.ticketDetails.eventdate || ticket.ticketDetails.eventDate,
        eventTime: ticket.ticketDetails.eventtime || ticket.ticketDetails.eventTime,
        ticketPrice: ticket.ticketDetails.ticketprice || ticket.ticketDetails.ticketPrice,
        location: ticket.ticketDetails.location,
        name: ticket.ticketDetails.name,
        email: ticket.ticketDetails.email
      };
    } else if (ticket.eventId) {
      return {
        eventName: ticket.eventId.title,
        eventDate: ticket.eventId.eventDate,
        eventTime: ticket.eventId.eventTime,
        ticketPrice: ticket.eventId.ticketPrice,
        location: ticket.eventId.location,
        name: user?.name || 'Not available',
        email: user?.email || 'Not available'
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00002a]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-cyan-400">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00002a]">
        <div className="text-center p-6 bg-[#000033] rounded-lg shadow-lg max-w-md mx-4 border border-cyan-500/20">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchTickets}
            className="px-6 py-2 rounded-md transition-all duration-300 hover:bg-opacity-90"
            style={{
              backgroundColor: '#00ffff',
              color: '#00002a'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow p-6 bg-[#00002a] min-h-screen">
      <div className="mb-8">
        <Link to='/' className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
          <IoMdArrowBack className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <h1 className="text-3xl font-bold text-cyan-400 mt-4">My Tickets</h1>
      </div>

      {userTickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-400 mb-4">You haven't purchased any tickets yet</p>
          <Link 
            to="/events" 
            className="px-6 py-2 rounded-lg inline-block transition-all duration-300 hover:bg-opacity-90"
            style={{
              backgroundColor: '#00ffff',
              color: '#00002a'
            }}
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTickets.map(ticket => {
            const details = getTicketDetails(ticket);
            
            if (!details) {
              return (
                <div key={ticket._id} className="bg-[#000033] rounded-xl shadow-md overflow-hidden border border-gray-700 p-5">
                  <p className="text-red-400">Ticket data incomplete</p>
                  <button 
                    onClick={() => deleteTicket(ticket._id)}
                    className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              );
            }

            return (
              <div key={ticket._id} className="bg-[#000033] rounded-xl shadow-md overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all">
                <div className="p-5 relative">
                  <button 
                    onClick={() => deleteTicket(ticket._id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Ticket"
                  >
                    <RiDeleteBinLine className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-start gap-4">
                    {/* QR Code Placeholder */}
                    <div className="bg-[#000044] p-3 rounded-lg flex items-center justify-center border border-cyan-500/20">
  <img 
    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket._id}`}
    alt="QR Code"
    className="w-20 h-20 object-contain"
  />
</div>

                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-cyan-400 mb-1">
                        {details.eventName}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {formatDate(details.eventDate)}, {details.eventTime}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Name:</p>
                          <p className="font-medium text-gray-300">{details.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price:</p>
                          <p className="font-medium text-cyan-400">Rs. {details.ticketPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email:</p>
                          <p className="font-medium text-gray-300">{details.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Ticket ID:</p>
                          <p className="font-medium text-xs text-gray-400">{ticket._id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location:</p>
                          <p className="font-medium text-gray-300">{details.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity:</p>
                          <p className="font-medium text-cyan-400">{ticket.quantity || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function OrderSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [maxTickets, setMaxTickets] = useState(5);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        if (!response.data) {
          throw new Error('Event not found');
        }
        setEvent(response.data);
        setMaxTickets(Math.min(response.data.availableTickets, 5));
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.response?.data?.message || err.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleProceedToPayment = () => {
    if (!isCheckboxChecked) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (!event || ticketCount > event.availableTickets) {
      setError("Invalid ticket quantity");
      return;
    }

    navigate(`/event/${id}/ordersummary/paymentsummary`, {
      state: {
        event,
        ticketCount,
        totalAmount: event.ticketPrice * ticketCount
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00002a]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00002a]">
        <div className="text-center p-6 bg-[#000033] rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
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

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00002a]">
        <div className="text-center p-6 bg-[#000033] rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Event Not Found</h2>
          <p className="text-gray-300 mb-4">The requested event could not be loaded.</p>
          <Link 
            to="/"
            className="px-6 py-2 rounded-md transition-all duration-300 hover:bg-opacity-90"
            style={{
              backgroundColor: '#00ffff',
              color: '#00002a'
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00002a]">
      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Back Button */}
        <Link to={`/event/${id}`}>
          <button 
            className="relative inline-flex mt-12 gap-2 p-3 ml-4 items-center font-bold rounded-md transition-all duration-300 group overflow-hidden"
            style={{ 
              backgroundColor: '#00002a',
              color: '#00ffff',
              border: '1px solid #00ffff'
            }}
          >
            {/* Glow effect layer */}
            <span className="absolute inset-0 rounded-md bg-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            
            {/* Pulsing ring effect */}
            <span className="absolute inset-0 rounded-md border border-cyan-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring transition-all duration-300"></span>
            
            {/* Button content */}
            <IoMdArrowBack className="relative z-10 font-bold w-6 h-6 group-hover:scale-110 transition-transform duration-300" style={{ color: '#00ffff' }} /> 
            <span className="relative z-10 group-hover:text-cyan-300 transition-colors duration-300">Back</span>
          </button>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Terms & Conditions */}
          <div className="lg:w-3/4 p-6 bg-[#000033] rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Terms & Conditions</h2>
            
            <ul className="space-y-4 list-disc pl-5 text-gray-300">
              <li>Refunds will be provided for ticket cancellations made up to 14 days before the event date.</li>
              <li>Tickets will be delivered to your registered email address as e-tickets.</li>
              <li>Maximum of 5 tickets per person for this event.</li>
              <li>Attendees will be notified via email for cancellations or postponements.</li>
              <li>Tickets for postponed events will be valid for the new date.</li>
              <li>Your privacy is protected according to our privacy policy.</li>
              <li>Please review and accept our terms before proceeding.</li>
            </ul>
          </div>

          {/* Booking Summary */}
          <div className="lg:w-1/4 p-6 bg-[#000033] rounded-lg shadow-lg h-fit sticky top-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Booking Summary</h2>
            
            <div className="space-y-4 text-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">{event.title}</span>
                <span>LKR. {event.ticketPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="ticketCount" className="font-medium">Quantity:</label>
                <select
                  id="ticketCount"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(parseInt(e.target.value))}
                  className="border border-gray-600 rounded p-1 bg-[#00002a] text-white"
                >
                  {Array.from({ length: maxTickets }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-cyan-300">
                {event.availableTickets} tickets remaining
              </div>

              <hr className="my-2 border-gray-700" />

              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>LKR. {(event.ticketPrice * ticketCount).toFixed(2)}</span>
              </div>

              <div className="flex items-start mt-4 space-x-2">
                <input
                  id="termsCheckbox"
                  type="checkbox"
                  className="mt-1 accent-cyan-500"
                  checked={isCheckboxChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="termsCheckbox" className="text-sm text-gray-300">
                  I verify the event details and accept the terms & conditions
                </label>
              </div>

              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}

              <button
                onClick={handleProceedToPayment}
                disabled={!isCheckboxChecked}
                className={`w-full mt-4 py-3 px-4 rounded-md text-[#00002a] font-bold transition-all duration-300 ${
                  isCheckboxChecked 
                    ? 'bg-cyan-500 hover:bg-cyan-400' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
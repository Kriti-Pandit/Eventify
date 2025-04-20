import { useLocation, Link } from 'react-router-dom';
import videoBg from '../assets/videos/210824_small.mp4'; // Import your video file
//import { QRCode } from "qrcode.react";
export default function BookingConfirmation() {
  const { state } = useLocation();
  const event = state?.event;

  if (!event) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Video Background */}
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
            <h2 className="text-xl font-bold mb-2 text-cyan-400">Booking Information Not Found</h2>
            <p className="text-gray-300 mb-4">We couldn't retrieve your booking details.</p>
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
      {/* Video Background */}
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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-[#000033]/90 p-8 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            {/* Confirmation Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <svg 
                  className="mx-auto h-16 w-16 text-cyan-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-0 animate-ping"></div>
              </div>
              <h1 className="text-2xl font-bold mt-4 text-cyan-400">Booking Confirmed!</h1>
              <p className="text-gray-300 mt-2">Your payment was successful and your tickets are reserved.</p>
            </div>

            {/* Event Details */}
            <div className="border-t border-b border-gray-700 py-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Event Details</h2>
              <div className="space-y-2">
                <p className="font-medium text-white">{event.title}</p>
                <p className="text-gray-300">
                  {new Date(event.eventDate).toLocaleDateString()}, {event.eventTime}
                </p>
                <p className="text-gray-300">{event.location}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-300">
                <span>Ticket (1)</span>
                <span>LKR {event.ticketPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Total Paid</span>
                <span>LKR {event.ticketPrice}</span>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="text-center">
              <Link 
                to="/" 
                className="relative inline-block px-6 py-3 rounded-lg overflow-hidden transition-all duration-300 group"
                style={{
                  backgroundColor: '#00004B',
                  color: '#00ffff',
                  border: '1px solid #00ffff'
                }}
              >
                {/* Hover effects */}
                <span className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute inset-0 border border-cyan-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring transition-all duration-300"></span>
                
                {/* Button text */}
                <span className="relative z-10 group-hover:text-cyan-300 transition-colors duration-300">
                  Back to Home
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function PaymentSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const { state } = location;
  const ticketCount = state?.ticketCount || 1;
  const totalAmount = state?.totalAmount || 0;

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
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (!state?.event) {
      fetchEvent();
    } else {
      setEvent(state.event);
      setLoading(false);
    }
  }, [id, state]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCard = () => {
    // Basic validation - consider using a library like credit-card-validator in production
    if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
      setError("Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      setError("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      setError("Please enter a valid CVV (3 or 4 digits)");
      return false;
    }
    if (!cardDetails.name) {
      setError("Please enter the name on card");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create ticket in backend
      const response = await axios.post('/tickets', {
        eventId: id,
        quantity: ticketCount,
        paymentMethod
      });

      // Navigate to confirmation page with ticket details
      navigate(`/booking-confirmation/${response.data._id}`, {
        state: { 
          event: event || state.event,
          ticket: response.data,
          paymentDetails: {
            amount: totalAmount,
            method: paymentMethod,
            lastFour: paymentMethod === 'card' ? cardDetails.number.slice(-4) : null
          }
        }
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00004B]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00004B]">
        <div className="text-center p-6 bg-[#000033] rounded-lg shadow-lg max-w-md mx-4 border border-red-500/30">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
            >
              Try Again
            </button>
            <Link
              to={`/event/${id}/ordersummary`}
              className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event && !state?.event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#00004B]">
        <div className="text-center p-6 bg-[#000033] rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Event Not Found</h2>
          <p className="text-gray-300 mb-4">The requested event could not be loaded.</p>
          <Link 
            to="/"
            className="px-6 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const currentEvent = event || state.event;

  return (
    <div className="min-h-screen bg-[#00004B] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to={`/event/${id}/ordersummary`}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <IoMdArrowBack className="w-5 h-5" />
            <span>Back to Order Summary</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment Form */}
          <div className="lg:w-2/3 bg-[#000033] p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-cyan-400">Payment Details</h1>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-300">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Payment Method</h2>
                <div className="flex gap-4 mb-4 border-b border-gray-700 pb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`px-4 py-2 rounded-t-lg transition-colors ${
                      paymentMethod === 'card' 
                        ? 'bg-[#000044] border-b-2 border-cyan-500 text-cyan-400' 
                        : 'bg-[#000033] text-gray-400 hover:text-white'
                    }`}
                  >
                    Credit/Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`px-4 py-2 rounded-t-lg transition-colors ${
                      paymentMethod === 'paypal' 
                        ? 'bg-[#000044] border-b-2 border-cyan-500 text-cyan-400' 
                        : 'bg-[#000033] text-gray-400 hover:text-white'
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="p-4 border border-gray-700 rounded bg-[#000022]">
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-gray-300">Name on Card</label>
                        <input
                          type="text"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-gray-300">Card Number</label>
                        <input
                          type="text"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 text-gray-300">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-300">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className="w-full p-3 bg-[#000044] border border-gray-700 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[#000022] rounded-lg border border-gray-700 text-center">
                    <div className="max-w-md mx-auto">
                      <p className="text-gray-300 mb-6">You will be redirected to PayPal to complete your payment</p>
                      <button
                        type="button"
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-[#00186A] font-bold rounded-lg transition-colors"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Redirecting...' : 'Pay with PayPal'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {paymentMethod === 'card' && (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-md text-[#00004B] font-bold transition-all duration-300 relative overflow-hidden ${
                    isProcessing ? 'bg-cyan-400' : 'bg-cyan-500 hover:bg-cyan-400'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00004B]"></span>
                      </span>
                      <span className="opacity-0">Processing Payment...</span>
                    </>
                  ) : (
                    `Pay LKR ${totalAmount.toFixed(2)}`
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#000033] p-6 rounded-lg shadow-lg sticky top-4 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-white">
                  <span className="font-medium">{currentEvent.title}</span>
                  <span>{ticketCount} {ticketCount > 1 ? 'Tickets' : 'Ticket'}</span>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>{new Date(currentEvent.eventDate).toLocaleDateString()}, {currentEvent.eventTime}</p>
                  <p>{currentEvent.location}</p>
                </div>
                
                <hr className="my-4 border-gray-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span>LKR {(currentEvent.ticketPrice * ticketCount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service Fee:</span>
                    <span>LKR 0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-lg mt-2">
                    <span>Total:</span>
                    <span>LKR {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
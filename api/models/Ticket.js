const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true, min: 1 },
  ticketDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    location: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
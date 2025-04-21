const mongoose = require('mongoose');
const Event = require('../../models/Event');
const User = require('../../models/User');

describe('Event Model', () => {
  let testUser;

  beforeAll(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword'
    });
  });

  test('should create and save event successfully', async () => {
    const validEvent = new Event({
      owner: testUser._id,
      title: 'Tech Conference',
      description: 'Annual technology conference',
      organizedBy: 'Tech Org',
      eventDate: new Date('2023-12-15'),
      eventTime: '10:00 AM',
      location: 'Virtual',
      maxParticipants: 100,
      ticketPrice: 50,
      availableTickets: 100
    });

    const savedEvent = await validEvent.save();
    
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.title).toBe('Tech Conference');
    expect(savedEvent.currentParticipants).toBe(0);
    expect(savedEvent.likes).toBe(0);
    expect(savedEvent.comments).toEqual([]);
    expect(savedEvent.createdAt).toBeInstanceOf(Date);
  });

  test('should fail when required fields are missing', async () => {
    const eventWithoutRequiredFields = new Event({
      owner: testUser._id,
      // Missing title, description, etc.
    });

    let error;
    try {
      await eventWithoutRequiredFields.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.title).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.organizedBy).toBeDefined();
    expect(error.errors.eventDate).toBeDefined();
    expect(error.errors.eventTime).toBeDefined();
    expect(error.errors.location).toBeDefined();
    expect(error.errors.maxParticipants).toBeDefined();
    expect(error.errors.ticketPrice).toBeDefined();
    expect(error.errors.availableTickets).toBeDefined();
  });

  test('should fail when ticket price is negative', async () => {
    const invalidEvent = new Event({
      owner: testUser._id,
      title: 'Invalid Event',
      description: 'Test',
      organizedBy: 'Test',
      eventDate: new Date(),
      eventTime: '10:00 AM',
      location: 'Virtual',
      maxParticipants: 100,
      ticketPrice: -50, // Invalid
      availableTickets: 100
    });

    let error;
    try {
      await invalidEvent.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.ticketPrice).toBeDefined();
  });
});
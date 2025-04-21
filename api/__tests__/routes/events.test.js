const request = require('supertest');
const app = require('../../index');
const Event = require('../../models/Event');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');

describe('Event Routes', () => {
  let testUser;
  let authToken;
  let testEvent;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'hashedpassword' });
    
    authToken = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  afterEach(async () => {
    // Clean up uploaded files
    const uploadDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach(file => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }
  });

  describe('POST /createEvent', () => {
    test('should create event with valid data', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Event description',
        organizedBy: 'Test Org',
        eventDate: '2023-12-20',
        eventTime: '14:00',
        location: 'Test Location',
        maxParticipants: 50,
        ticketPrice: 25,
        availableTickets: 50
      };

      const res = await request(app)
        .post('/createEvent')
        .set('Cookie', [`token=${authToken}`])
        .field('title', eventData.title)
        .field('description', eventData.description)
        .field('organizedBy', eventData.organizedBy)
        .field('eventDate', eventData.eventDate)
        .field('eventTime', eventData.eventTime)
        .field('location', eventData.location)
        .field('maxParticipants', eventData.maxParticipants)
        .field('ticketPrice', eventData.ticketPrice)
        .field('availableTickets', eventData.availableTickets)
        .attach('image', path.join(__dirname, '../fixtures/test-image.jpg'));

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(eventData.title);
      expect(res.body.owner).toBe(testUser._id.toString());
      expect(res.body.image).toBeDefined();

      // Verify event exists in DB
      const dbEvent = await Event.findById(res.body._id);
      expect(dbEvent).toBeTruthy();
    });

    test('should reject event creation without authentication', async () => {
      const res = await request(app)
        .post('/createEvent')
        .send({ title: 'Unauthorized Event' });

      expect(res.statusCode).toBe(401);
    });

    test('should reject event creation with invalid data', async () => {
      const res = await request(app)
        .post('/createEvent')
        .set('Cookie', [`token=${authToken}`])
        .send({ title: '' }); // Missing required fields

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /events', () => {
    beforeEach(async () => {
      // Create test events
      testEvent = await Event.create({
        owner: testUser._id,
        title: 'Test Event',
        description: 'Test Description',
        organizedBy: 'Test Org',
        eventDate: new Date(),
        eventTime: '10:00 AM',
        location: 'Test Location',
        maxParticipants: 100,
        ticketPrice: 50,
        availableTickets: 100
      });
    });

    test('should fetch all events', async () => {
      const res = await request(app).get('/events');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('owner');
      expect(res.body[0].owner).toHaveProperty('name');
      expect(res.body[0].owner).toHaveProperty('email');
    });

    test('should fetch single event by ID', async () => {
      const res = await request(app).get(`/events/${testEvent._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(testEvent._id.toString());
      expect(res.body.title).toBe(testEvent.title);
      expect(res.body.owner).toHaveProperty('name');
    });

    test('should return 404 for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/events/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
const request = require('supertest');
const app = require('../src/index');

describe('Health Check', () => {
  test('GET /health should return OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

describe('Authentication', () => {
  test('POST /api/auth/register should create new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123!',
      fullName: 'Test User',
      documentId: 'DOC123456'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login should authenticate user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('Property Management', () => {
  let token;

  beforeAll(async () => {
    // Setup: Register and login user
    const user = {
      username: 'propertyuser',
      email: 'property@example.com',
      password: 'PropPass123!',
      fullName: 'Property User',
      documentId: 'DOC789012'
    };

    await request(app).post('/api/auth/register').send(user);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    token = loginResponse.body.data.token;
  });

  test('POST /api/properties should register property', async () => {
    const property = {
      propertyId: 'PROP-TEST-001',
      owner: 'Property Owner',
      location: '123 Test St, Test City',
      area: 5000,
      metadata: { bedrooms: 4, bathrooms: 2 }
    };

    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(property);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/properties should return all properties', async () => {
    const response = await request(app)
      .get('/api/properties');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

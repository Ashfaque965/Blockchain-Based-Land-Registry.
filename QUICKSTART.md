# Blockchain-Based Land Registry - Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Prerequisites
- Node.js v16+
- MongoDB
- Docker (optional)

### 2. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install chaincode dependencies
cd ../chaincode/landRegistry
npm install
```

### 3. Configure Environment
```bash
cd ../../backend
cp .env.example .env
# Edit .env with your settings
```

### 4. Start Services
```bash
# Terminal 1: Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Terminal 2: Start backend server
npm run dev
```

### 5. Verify Installation
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## First Steps

### Create User Account
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "fullName": "Test User",
    "documentId": "ID123456"
  }'
```

Save the returned `token` for next steps.

### Register Property
```bash
TOKEN="your-token-here"

curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "propertyId": "PROP-001",
    "owner": "Test Owner",
    "location": "123 Test St, City",
    "area": 5000,
    "metadata": {"bedrooms": 4}
  }'
```

### Transfer Property
```bash
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "propertyId": "PROP-001",
    "newOwner": "New Owner",
    "transferDetails": {"price": 500000}
  }'
```

### Verify Ownership
```bash
curl -X POST http://localhost:3000/api/verify/ownership \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROP-001",
    "owner": "Test Owner"
  }'
```

---

## Docker Deployment

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Check logs
docker-compose -f docker/docker-compose.yml logs -f backend

# Stop services
docker-compose -f docker/docker-compose.yml down
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Create user account |
| POST | /api/auth/login | User login |
| POST | /api/properties | Register property |
| GET | /api/properties/:propertyId | Get property details |
| POST | /api/transfers | Transfer property |
| POST | /api/verify/ownership | Verify ownership |

---

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000

Solution:
lsof -i :3000  # Find process
kill -9 <PID>  # Kill process
```

### JWT Authentication Failed
```
Error: Invalid or expired token

Solution:
- Get new token from /api/auth/login
- Include in Authorization header: Bearer <token>
```

---

## Next Steps

1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development guidelines
3. Review [network/SETUP.md](./network/SETUP.md) for blockchain setup
4. Explore [tests/](./backend/tests/) for code examples

---

## Support

- GitHub Issues: Report bugs and request features
- Documentation: See README.md and markdown files
- Examples: Check tests/ directory for usage examples

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Guide](https://docs.mongodb.com/)
- [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/)
- [REST API Best Practices](https://restfulapi.net/)

Happy coding! 🚀

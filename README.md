# Blockchain-Based Land Registry

A decentralized land registry system built with Hyperledger Fabric, Node.js, and MongoDB. This solution ensures immutable ownership records and transparent transaction history for land properties.

## Features

- **Digital Ownership Certificates**: Blockchain-verified ownership certificates for properties
- **Immutable Record Keeping**: All property records and transfers stored on Hyperledger Fabric
- **Transaction History Tracking**: Complete audit trail of all ownership transfers
- **Smart Contract-Based Transfers**: Automated ownership transfer via smart contracts
- **User Authentication**: Secure JWT-based authentication
- **Ownership Verification**: Real-time verification of property ownership
- **Audit Trail**: Comprehensive audit logs with date range filtering
- **REST API**: Complete REST API for all operations

## Tech Stack

- **Blockchain**: Hyperledger Fabric 2.5
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

## Project Structure

```
blockchain-based-land-registry/
├── chaincode/                  # Hyperledger Fabric Smart Contracts
│   └── landRegistry/
│       ├── landRegistry.js     # Main contract logic
│       └── package.json
├── backend/                    # Node.js Backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   ├── utils/              # Utility functions
│   │   └── index.js            # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker/                     # Docker configuration
│   └── docker-compose.yml
└── README.md
```

## Installation

### Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 4.4
- Docker & Docker Compose (optional)
- Hyperledger Fabric Network (for production)

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/land-registry-blockchain.git
   cd land-registry-blockchain
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install chaincode dependencies**:
   ```bash
   cd ../chaincode/landRegistry
   npm install
   ```

4. **Configure environment variables**:
   ```bash
   cd ../../backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Or using local installation
   mongod
   ```

6. **Start the backend server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Docker Setup

1. **Build and start containers**:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

2. **Check logs**:
   ```bash
   docker-compose -f docker/docker-compose.yml logs -f backend
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

### Properties

- `POST /api/properties` - Register new property
- `GET /api/properties` - Get all properties
- `GET /api/properties/:propertyId` - Get specific property
- `GET /api/properties/owner/:owner` - Get properties by owner
- `PUT /api/properties/:propertyId` - Update property metadata

### Transfers

- `POST /api/transfers` - Transfer property ownership
- `GET /api/transfers/property/:propertyId` - Get property transaction history
- `GET /api/transfers/owner/:owner` - Get owner's transactions
- `GET /api/transfers/:transactionId` - Get transaction details

### Verification

- `POST /api/verify/ownership` - Verify property ownership
- `GET /api/verify/history/:propertyId` - Verify transaction history
- `GET /api/verify/audit/:propertyId` - Get audit trail
- `GET /api/verify/certificate/:propertyId` - Generate digital certificate

## Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "documentId": "ID123456",
    "phoneNumber": "+1234567890"
  }'
```

### Register Property

```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "propertyId": "PROP-001",
    "owner": "John Doe",
    "location": "123 Main St, City, State",
    "area": 5000,
    "coordinates": {"latitude": 40.7128, "longitude": -74.0060},
    "metadata": {"bedrooms": 4, "bathrooms": 2}
  }'
```

### Transfer Property

```bash
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "propertyId": "PROP-001",
    "newOwner": "Jane Smith",
    "transferDetails": {
      "price": 500000,
      "currency": "USD",
      "description": "Ownership transfer"
    }
  }'
```

### Verify Ownership

```bash
curl -X POST http://localhost:3000/api/verify/ownership \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROP-001",
    "owner": "John Doe"
  }'
```

## Smart Contracts

The Hyperledger Fabric chaincode implements the following functions:

### registerProperty
Registers a new property on the blockchain.

**Parameters**:
- `propertyId`: Unique property identifier
- `owner`: Owner's name/ID
- `location`: Property location
- `area`: Property area in sq. ft
- `metadata`: Additional property details (JSON string)

### transferOwnership
Transfers property ownership and records the transaction.

**Parameters**:
- `propertyId`: Property identifier
- `newOwner`: New owner's name/ID
- `transferDetails`: Transfer details (JSON string)

### getProperty
Retrieves property details from the blockchain.

**Parameters**:
- `propertyId`: Property identifier

### verifyOwnership
Verifies if a person owns a specific property.

**Parameters**:
- `propertyId`: Property identifier
- `owner`: Owner to verify

### getTransferHistory
Retrieves complete transfer history for a property.

**Parameters**:
- `propertyId`: Property identifier

## Security Considerations

- All sensitive data is encrypted in transit using HTTPS/TLS
- JWT tokens expire after 24 hours
- Passwords are hashed using bcryptjs
- MongoDB uses authentication
- API requests are validated and sanitized
- CORS is configured securely
- Helmet.js is used for HTTP security headers

## Testing

Run tests using:

```bash
cd backend
npm test
```

## Database Schema

### Property Collection
```javascript
{
  propertyId: String (unique, indexed),
  owner: String (indexed),
  location: String,
  area: Number,
  coordinates: { latitude: Number, longitude: Number },
  metadata: Object,
  registrationDate: Date,
  lastUpdated: Date,
  status: String,
  blockchainHash: String (unique),
  transactionHistory: Array,
  documents: Array
}
```

### User Collection
```javascript
{
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  role: String,
  documentId: String,
  properties: Array (references),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Collection
```javascript
{
  transactionId: String (unique, indexed),
  propertyId: String (indexed),
  fromOwner: String,
  toOwner: String,
  type: String,
  status: String,
  blockchainHash: String,
  details: Object,
  timestamp: Date (indexed),
  verificationDate: Date
}
```

## Deployment

### Production Deployment

1. **Configure environment variables** for production
2. **Use managed database services** (e.g., MongoDB Atlas)
3. **Enable HTTPS** with valid certificates
4. **Set up proper monitoring and logging**
5. **Use environment-specific secrets management**
6. **Implement rate limiting**
7. **Set up automated backups**

### Hyperledger Fabric Network Setup

Refer to the [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/) for setting up a production blockchain network.

## Troubleshooting

### Connection Issues
- Verify MongoDB is running on port 27017
- Check Hyperledger Fabric network connectivity
- Ensure correct environment variables are set

### Authentication Errors
- Verify JWT_SECRET is properly configured
- Check token expiration and refresh logic
- Validate user credentials in database

### Transaction Failures
- Verify property exists before transferring
- Check for sufficient permissions
- Review blockchain network logs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Contact

For questions and support, please contact the development team or open an issue on GitHub.

## References

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## Changelog

### Version 1.0.0 (2026-01-21)
- Initial release
- Core features: property registration, ownership transfer, verification
- REST API implementation
- MongoDB integration
- Hyperledger Fabric chaincode

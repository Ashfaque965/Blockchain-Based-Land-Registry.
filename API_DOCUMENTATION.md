# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All authenticated endpoints require an Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "documentId": "ID123456",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get User Profile
**GET** `/auth/profile`

Retrieve authenticated user's profile.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "properties": []
  }
}
```

---

### Update User Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phoneNumber": "+1987654321",
  "address": "456 Oak Ave, City"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Smith",
    "phoneNumber": "+1987654321",
    "address": "456 Oak Ave, City"
  }
}
```

---

## Property Management Endpoints

### Register Property
**POST** `/properties`

Register a new property on the blockchain.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "propertyId": "PROP-001",
  "owner": "John Doe",
  "location": "123 Main St, Springfield, IL 62701",
  "area": 5000,
  "coordinates": {
    "latitude": 39.7817,
    "longitude": -89.6501
  },
  "metadata": {
    "bedrooms": 4,
    "bathrooms": 2,
    "yearBuilt": 2015,
    "propertyType": "residential"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "propertyId": "PROP-001",
    "owner": "John Doe",
    "location": "123 Main St, Springfield, IL 62701",
    "area": 5000,
    "status": "registered",
    "registrationDate": "2026-01-21T10:30:00.000Z",
    "blockchainHash": "0x123abc..."
  }
}
```

---

### Get All Properties
**GET** `/properties`

Retrieve all registered properties with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (registered, transferred, disputed, archived)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "location": "123 Main St, Springfield, IL 62701",
      "area": 5000,
      "status": "registered"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### Get Property Details
**GET** `/properties/:propertyId`

Retrieve details of a specific property.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "offChain": {
      "_id": "507f1f77bcf86cd799439012",
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "location": "123 Main St, Springfield, IL 62701",
      "area": 5000
    },
    "onChain": {
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "location": "123 Main St, Springfield, IL 62701"
    }
  }
}
```

---

### Get Properties by Owner
**GET** `/properties/owner/:owner`

Retrieve all properties owned by a specific owner.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "location": "123 Main St, Springfield, IL 62701",
      "area": 5000
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### Update Property Metadata
**PUT** `/properties/:propertyId`

Update property metadata.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "metadata": {
    "bedrooms": 5,
    "bathrooms": 3,
    "renovated": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property metadata updated successfully",
  "data": {
    "propertyId": "PROP-001",
    "metadata": {
      "bedrooms": 5,
      "bathrooms": 3,
      "renovated": true
    },
    "lastUpdated": "2026-01-21T10:35:00.000Z"
  }
}
```

---

## Transfer Endpoints

### Transfer Property
**POST** `/transfers`

Initiate property ownership transfer.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "propertyId": "PROP-001",
  "newOwner": "Jane Smith",
  "transferDetails": {
    "price": 500000,
    "currency": "USD",
    "description": "Sale agreement dated January 21, 2026"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property transferred successfully",
  "data": {
    "transaction": {
      "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
      "propertyId": "PROP-001",
      "fromOwner": "John Doe",
      "toOwner": "Jane Smith",
      "type": "transfer",
      "status": "confirmed",
      "timestamp": "2026-01-21T10:40:00.000Z"
    },
    "property": {
      "propertyId": "PROP-001",
      "owner": "Jane Smith",
      "status": "transferred"
    }
  }
}
```

---

### Get Transaction History
**GET** `/transfers/property/:propertyId`

Retrieve transaction history for a property.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
      "propertyId": "PROP-001",
      "fromOwner": "John Doe",
      "toOwner": "Jane Smith",
      "type": "transfer",
      "status": "confirmed",
      "timestamp": "2026-01-21T10:40:00.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### Get Owner's Transactions
**GET** `/transfers/owner/:owner`

Retrieve all transactions for an owner (as buyer or seller).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): Filter by type (transfer, registration, update, dispute)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
      "propertyId": "PROP-001",
      "fromOwner": "John Doe",
      "toOwner": "Jane Smith",
      "type": "transfer",
      "status": "confirmed"
    }
  ]
}
```

---

## Verification Endpoints

### Verify Ownership
**POST** `/verify/ownership`

Verify if a person owns a specific property.

**Request Body:**
```json
{
  "propertyId": "PROP-001",
  "owner": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onChain": {
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "isOwner": true,
      "currentOwner": "John Doe"
    },
    "offChain": {
      "propertyId": "PROP-001",
      "owner": "John Doe",
      "isOwner": true
    },
    "isVerified": true
  }
}
```

---

### Verify Transaction History
**GET** `/verify/history/:propertyId`

Verify consistency of transaction history between blockchain and database.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "propertyId": "PROP-001",
    "onChain": [
      {
        "from": "John Doe",
        "to": "Jane Smith",
        "timestamp": "2026-01-21T10:40:00.000Z"
      }
    ],
    "offChain": [
      {
        "from": "John Doe",
        "to": "Jane Smith",
        "timestamp": "2026-01-21T10:40:00.000Z"
      }
    ],
    "isConsistent": true
  }
}
```

---

### Get Audit Trail
**GET** `/verify/audit/:propertyId`

Retrieve complete audit trail for a property.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "propertyId": "PROP-001",
    "totalTransactions": 3,
    "auditTrail": [
      {
        "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
        "type": "transfer",
        "from": "John Doe",
        "to": "Jane Smith",
        "timestamp": "2026-01-21T10:40:00.000Z",
        "details": {
          "price": 500000,
          "currency": "USD"
        }
      }
    ]
  }
}
```

---

### Generate Digital Certificate
**GET** `/verify/certificate/:propertyId`

Generate a digital ownership certificate for a property.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Digital ownership certificate generated",
  "data": {
    "certificateId": "CERT-PROP-001-1642746600000",
    "propertyId": "PROP-001",
    "owner": "John Doe",
    "location": "123 Main St, Springfield, IL 62701",
    "area": 5000,
    "registrationDate": "2026-01-20T10:30:00.000Z",
    "issuanceDate": "2026-01-21T10:45:00.000Z",
    "expiryDate": "2027-01-21T10:45:00.000Z",
    "status": "valid"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields",
  "errors": [
    {
      "param": "propertyId",
      "msg": "Invalid value"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Property not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error registering property",
  "error": "Error details"
}
```

---

## Rate Limiting

Current rate limits per IP address:
- General endpoints: 100 requests/hour
- Authentication: 10 requests/hour
- Transfer endpoints: 20 requests/hour

---

## Changelog

### v1.0.0 (2026-01-21)
- Initial API release
- Authentication system
- Property registration
- Ownership transfer
- Verification endpoints

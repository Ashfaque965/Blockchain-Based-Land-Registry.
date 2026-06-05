# Development Guidelines

## Project Structure Best Practices

### Controllers
- Handle request/response logic
- Validate input using middleware
- Delegate business logic to services/models
- Always return consistent JSON responses

### Models
- Define MongoDB schemas with proper validation
- Use indexes for frequently queried fields
- Implement methods for common operations
- Keep model logic separate from controller logic

### Routes
- Keep route definitions clean and DRY
- Group related routes together
- Apply middleware at appropriate levels
- Use descriptive route names

### Middleware
- Keep middleware functions focused and reusable
- Use for cross-cutting concerns (auth, validation, logging)
- Maintain order: auth → validation → processing

## Code Style

### Variables and Functions
```javascript
// Good
const userEmail = 'user@example.com';
const getUserById = (id) => { ... };

// Avoid
const ue = 'user@example.com';
const get_user_by_id = (id) => { ... };
```

### Error Handling
```javascript
try {
  // Operation
} catch (error) {
  logger.error(`Operation failed: ${error.message}`);
  res.status(500).json({
    success: false,
    message: 'Error message',
    error: error.message
  });
}
```

### Async/Await
```javascript
// Preferred over then/catch chains
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Testing Guidelines

### Unit Tests
- Test individual functions in isolation
- Mock external dependencies
- Aim for 80%+ code coverage

### Integration Tests
- Test API endpoints with actual database
- Verify blockchain interactions
- Test error scenarios

### Running Tests
```bash
npm test                  # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage report
```

## Git Workflow

### Branch Naming
```
feature/add-verification-api    # New feature
bugfix/property-transfer-error  # Bug fix
docs/api-documentation          # Documentation
```

### Commit Messages
```
feat: Add ownership verification endpoint
fix: Resolve property transfer transaction issue
docs: Update API documentation
refactor: Improve error handling in controllers
test: Add unit tests for auth middleware
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups in place
- [ ] SSL/TLS certificates installed
- [ ] Logging and monitoring enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database indexes created
- [ ] All tests passing
- [ ] Documentation updated

## Performance Optimization

### Database Queries
```javascript
// Good: Use projections to limit fields
const properties = await Property.find({ owner })
  .select('propertyId owner location area')
  .limit(10);

// Avoid: Fetching all fields
const properties = await Property.find({ owner }).limit(10);
```

### Caching
- Cache frequently accessed data
- Use Redis for distributed caching
- Implement cache invalidation strategies

### Pagination
- Always use pagination for large datasets
- Default limit: 20 items
- Maximum limit: 100 items

## Security Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate and sanitize all inputs
- Use parameterized queries (Mongoose)
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated
- Use secure password hashing (bcryptjs)
- Implement CSRF protection
- Use security headers (Helmet.js)

## Logging Standards

```javascript
const logger = require('../config/logger');

logger.info('User registered: john@example.com');
logger.warn('Deprecated API endpoint used');
logger.error('Database connection failed: connection timeout');
```

Log levels: error, warn, info, debug

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Create/update model in `src/models/`
4. Add validation middleware if needed
5. Write tests in `tests/`
6. Update API documentation

### Adding Database Model

1. Define schema in `src/models/`
2. Add indexes for frequently queried fields
3. Add schema methods if needed
4. Update MongoDB documentation
5. Create migration if needed

### Integrating with Blockchain

1. Use `fabricClient.submitTransaction()` for write operations
2. Use `fabricClient.evaluateTransaction()` for read operations
3. Handle blockchain errors appropriately
4. Log all blockchain interactions
5. Verify transactions on-chain

## Troubleshooting

### Common Issues

**MongoDB connection failed**
```javascript
// Check connection string in .env
// Ensure MongoDB is running
// Verify network connectivity
```

**JWT token errors**
```javascript
// Verify JWT_SECRET is set
// Check token expiration
// Ensure bearer token format: "Bearer <token>"
```

**Blockchain transaction failed**
```javascript
// Verify network connectivity
// Check chaincode deployment
// Review transaction arguments
// Check user permissions
```

## Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-best-practices/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/)

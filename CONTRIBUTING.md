# Contributing to Blockchain-Based Land Registry

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on ideas, not individuals
- Help others learn and grow

## Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 4.4
- Docker (optional)
- Git

### Fork and Clone
```bash
git clone https://github.com/yourusername/land-registry-blockchain.git
cd land-registry-blockchain
```

### Set Up Development Environment
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

## Making Changes

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Code Style
- Use 2-space indentation
- Use meaningful variable names
- Write self-documenting code
- Add comments for complex logic
- Follow existing code patterns

### Commits
- Make small, focused commits
- Write clear commit messages
- Reference issues when applicable
- Example: `git commit -m "feat: Add property search filter"`

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/api.test.js

# With coverage
npm test -- --coverage
```

- Write tests for new features
- Update tests for modified code
- Aim for >80% code coverage

## Submitting Changes

### Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Visit GitHub and create a pull request with:
- Clear title describing the change
- Detailed description of what changed and why
- Reference to related issues
- Screenshots if applicable (UI changes)

### Pull Request Guidelines
- One feature per PR
- Keep PRs focused and manageable
- Ensure all tests pass
- Update documentation if needed
- Add meaningful commit history
- No merge conflicts

### Code Review
- Address reviewer comments
- Rebase if needed
- Update PR with additional commits
- Maintain conversational tone

## Documentation

- Update README.md for major changes
- Add inline code comments for complex logic
- Update API documentation for endpoint changes
- Keep DEVELOPMENT.md current

## Reporting Issues

### Bug Reports
Include:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)
- Error messages/logs
- Screenshots if applicable

### Feature Requests
Include:
- Clear description of the feature
- Use cases and benefits
- Proposed implementation (optional)
- Potential alternatives

## Development Workflow

### Example: Adding a New Feature

1. **Create issue** for discussion
2. **Fork repository**
3. **Create feature branch**: `git checkout -b feature/user-notifications`
4. **Make changes** with meaningful commits
5. **Write/update tests**
6. **Update documentation**
7. **Push and create PR**
8. **Address review comments**
9. **Merge when approved**

## Project Areas

### Blockchain/Chaincode
- Smart contract improvements
- Security enhancements
- Performance optimizations
- New contract functions

### Backend API
- New endpoints
- Error handling improvements
- Performance optimization
- Security enhancements

### Database
- Schema improvements
- Index optimization
- Migration tools
- Query optimization

### Documentation
- API documentation
- Setup guides
- Architecture diagrams
- Examples and tutorials

## Building and Deploying

### Local Build
```bash
npm run build
npm start
```

### Testing in Production-like Environment
```bash
docker-compose -f docker/docker-compose.yml up
```

### Deployment
- Follows deployment checklist (see DEVELOPMENT.md)
- Staged rollout preferred
- Maintain backwards compatibility
- Document breaking changes

## Release Process

1. **Version bump**: Update package.json
2. **Update CHANGELOG**
3. **Create release commit**: `git commit -m "Release v1.1.0"`
4. **Tag release**: `git tag v1.1.0`
5. **Push**: `git push origin main && git push origin v1.1.0`
6. **Create GitHub release** with notes

## Questions?

- Check existing issues and documentation
- Open a new issue for questions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- Project README
- CONTRIBUTORS file
- Release notes
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

---

**Happy contributing!** 🚀

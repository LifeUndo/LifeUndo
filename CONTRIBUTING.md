# Contributing to GetLifeUndo

Thank you for your interest in contributing to GetLifeUndo! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

1. **Bug Reports**: Use GitHub Issues with the `bug` label
2. **Feature Requests**: Use GitHub Issues with the `enhancement` label
3. **Security Issues**: See [SECURITY.md](SECURITY.md) for responsible disclosure

### Code Contributions

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/LifeUndo/LifeUndo.git
cd LifeUndo

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Extension Development
```bash
# Build Firefox extension
npm run build:firefox

# Build Chrome extension  
npm run build:chrome

# Test extensions
npm run test:extensions
```

## Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable and function names

### React Components
- Use functional components with hooks
- Prefer `'use client'` directive for client components
- Use proper TypeScript interfaces
- Follow Next.js App Router conventions

### CSS/Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use semantic class names
- Avoid inline styles

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] Documentation updated if needed

### PR Description
- Clear description of changes
- Reference related issues
- Include screenshots for UI changes
- List any breaking changes

### Review Process
- All PRs require review
- Address feedback promptly
- Keep PRs focused and small
- Update documentation as needed

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── config/             # Configuration files
└── types/              # TypeScript type definitions

extension/              # Chrome extension
extension_firefox/      # Firefox extension
public/                 # Static assets
docs/                   # Documentation
```

## Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Extension tests
npm run test:extensions
```

### Test Guidelines
- Write tests for new features
- Maintain test coverage
- Use descriptive test names
- Mock external dependencies

## Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Include examples for complex APIs
- Document configuration options
- Keep README files updated

### User Documentation
- Update user-facing documentation
- Include screenshots for UI changes
- Maintain changelog entries
- Keep API documentation current

## Release Process

### Version Numbering
- Follow semantic versioning (semver)
- Update version in `package.json`
- Update extension manifests
- Tag releases in Git

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] Extensions built and tested

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Follow GitHub's community guidelines

### Communication
- Use GitHub Issues for discussions
- Keep conversations focused
- Be patient with responses
- Help others learn and grow

## License

By contributing to GetLifeUndo, you agree that your contributions will be licensed under the same proprietary license as the project.

## Questions?

- **GitHub Issues**: For bug reports and feature requests
- **Telegram**: [@GetLifeUndoSupport](https://t.me/GetLifeUndoSupport)
- **Email**: support@getlifeundo.com

Thank you for contributing to GetLifeUndo! 🚀

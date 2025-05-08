# Contributing Guide

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please follow our code of conduct in all your interactions with the project.

## How to Contribute

1. **Fork the Repository**

   - Fork the mi-polsri repository on GitHub
   - Clone your fork locally
   - Add the original repository as upstream

2. **Set Up Development Environment**
   - Follow the [Getting Started](./getting-started.md) guide
   - Ensure all tests pass in your environment
   - Set up pre-commit hooks

## Development Process

1. **Create a Branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

2. **Make Your Changes**

   - Write clear, concise commit messages
   - Follow the coding standards
   - Add/update tests as needed
   - Update documentation

3. **Test Your Changes**

   - Run the test suite
   - Perform manual testing
   - Check for TypeScript errors
   - Verify changes in both languages (id/en)

4. **Create Pull Request**
   - Push your changes to your fork
   - Create a pull request against main
   - Fill out the PR template
   - Request review from maintainers

## Coding Standards

### TypeScript

- Use strict mode
- Properly type all variables and functions
- Avoid any type unless absolutely necessary
- Use interfaces for object shapes

### React

- Use functional components
- Implement proper error boundaries
- Follow React hooks rules
- Keep components focused and small

### Component Structure

```tsx
// ComponentName.tsx
import { type ComponentProps } from './ComponentName.types'

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Implementation
}

// ComponentName.types.ts
export interface ComponentProps {
  prop1: string
  prop2: number
}

// ComponentName.test.tsx
import { ComponentName } from './ComponentName'
// Tests...
```

### Styling

- Use Tailwind CSS utilities
- Follow component variant patterns
- Keep styles modular and reusable
- Use CSS variables for theming

## Testing Guidelines

1. **Unit Tests**

   - Test component rendering
   - Test component interactions
   - Test utility functions
   - Mock external dependencies

2. **Integration Tests**

   - Test component integration
   - Test data flow
   - Test routing

3. **E2E Tests**
   - Test critical user paths
   - Test form submissions
   - Test authentication flows

## Documentation

1. **Code Documentation**

   - Document complex functions
   - Add JSDoc comments
   - Document props and types
   - Explain non-obvious code

2. **Component Documentation**

   - Document component usage
   - List props and their types
   - Provide usage examples
   - Document side effects

3. **Feature Documentation**
   - Document new features
   - Update existing docs
   - Add migration guides
   - Document breaking changes

## Commit Message Format

```
type(scope): subject

body

footer
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example:

```
feat(news): add pagination to news list

- Implement infinite scroll
- Add load more button
- Handle loading states

Closes #123
```

## Pull Request Process

1. **PR Title**

   - Clear and descriptive
   - Include type (feat/fix/etc)
   - Reference issue number

2. **PR Description**

   - Explain the changes
   - List breaking changes
   - Include testing steps
   - Add screenshots if relevant

3. **Review Process**

   - Address review comments
   - Keep discussion focused
   - Update PR as needed
   - Request re-review

4. **Merge Requirements**
   - All tests passing
   - Code review approved
   - Documentation updated
   - No merge conflicts

## Release Process

1. **Version Bump**

   - Update version in package.json
   - Update CHANGELOG.md
   - Create release commit

2. **Testing**

   - Run full test suite
   - Test in staging environment
   - Verify documentation

3. **Release**
   - Create GitHub release
   - Tag version
   - Deploy to production
   - Monitor for issues

## Reporting Issues

1. **Bug Reports**

   - Clear description
   - Reproduction steps
   - Expected vs actual
   - System information

2. **Feature Requests**

   - Use case description
   - Proposed solution
   - Alternative approaches
   - Implementation ideas

3. **Security Issues**
   - Report privately
   - Include all details
   - Avoid public disclosure
   - Wait for patch

## Getting Help

- Join our Discord server
- Check GitHub discussions
- Review existing issues
- Contact maintainers

## Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Thanked in communications

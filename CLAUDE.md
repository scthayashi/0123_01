# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with this repository.

## Repository Overview

**Repository**: scthayashi/0123_01
**Status**: New repository (currently empty)
**Purpose**: [To be defined as project develops]

This is a new repository that is ready for initial development. As the project grows, this document should be updated to reflect the actual codebase structure and conventions.

## Codebase Structure

Currently, the repository is empty. As the project develops, update this section with:

```
/
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── config/        # Configuration files
└── [other dirs]   # Project-specific directories
```

### Expected Structure Guidelines

When adding files to this repository, follow these conventions:
- **Source code**: Organize in `src/` or equivalent directory
- **Tests**: Colocate tests near source or in dedicated `tests/` directory
- **Configuration**: Keep config files at root or in `config/` directory
- **Documentation**: Store in `docs/` or as markdown files at root

## Development Workflows

### Git Workflow

**Branch Naming Convention**:
- Feature branches: `claude/claude-md-<session-id>` (auto-generated)
- Other branches: `feature/`, `fix/`, `refactor/` prefixes

**Commit Message Guidelines**:
- Use clear, descriptive commit messages
- Focus on the "why" rather than the "what"
- Include session URL at the end of commit messages
- Format: `<type>: <description>\n\nhttps://claude.ai/code/session_<id>`

**Pushing Changes**:
- Always use: `git push -u origin <branch-name>`
- Branch must start with `claude/` and end with session ID
- Retry on network errors with exponential backoff (2s, 4s, 8s, 16s)

### Code Quality Standards

When code is added to this repository, maintain:
- **Consistency**: Follow existing patterns and conventions
- **Simplicity**: Avoid over-engineering; make only necessary changes
- **Security**: Watch for vulnerabilities (XSS, SQL injection, command injection, etc.)
- **Testing**: Write tests for new functionality
- **Documentation**: Document complex logic and public APIs

### Development Practices

**Reading Before Writing**:
- Always read existing code before modifying
- Understand context and patterns before suggesting changes

**Minimal Changes**:
- Don't add unrequested features or refactoring
- Keep solutions focused on the specific request
- Avoid adding comments, docstrings, or types to unchanged code

**Error Handling**:
- Only add error handling for realistic scenarios
- Trust internal code and framework guarantees
- Validate at system boundaries (user input, external APIs)

**Abstractions**:
- Don't create abstractions for one-time operations
- Three similar lines are better than premature abstraction
- Design for current requirements, not hypothetical futures

## Technology Stack

To be determined as project develops. Update this section with:
- Programming language(s)
- Framework(s)
- Build tools
- Testing frameworks
- Dependencies

## Testing Strategy

### Test Organization
- Colocate tests with source code OR organize in dedicated test directory
- Name test files clearly (e.g., `*.test.ts`, `*.spec.ts`, `*_test.py`)

### Running Tests
```bash
# Update with actual test commands as project develops
# Example: npm test, pytest, cargo test, etc.
```

### Test Coverage
- Aim for comprehensive coverage of critical paths
- Test edge cases and error conditions
- Mock external dependencies appropriately

## Build and Deployment

### Build Process
```bash
# Update with actual build commands as project develops
```

### Deployment
- Document deployment process as it's established
- Include environment-specific configurations
- Note any CI/CD pipelines

## Key Conventions for AI Assistants

### File Operations
1. **Always read before editing**: Use Read tool before Edit/Write
2. **Prefer editing over creating**: Modify existing files when possible
3. **Verify paths**: Check parent directories exist before creating files
4. **Use proper tools**:
   - Read tool for reading (not cat/head/tail)
   - Edit tool for modifications (not sed/awk)
   - Write tool for new files (not echo/heredoc)

### Git Operations
1. **Never skip hooks**: Don't use --no-verify unless explicitly requested
2. **Stage specific files**: Prefer `git add <file>` over `git add .`
3. **Create new commits**: Don't amend unless explicitly requested
4. **Never force push to main/master**: Warn user if requested
5. **Avoid destructive operations**: Never run git reset --hard, checkout ., etc. without explicit permission

### Code Safety
1. **Security first**: Watch for OWASP Top 10 vulnerabilities
2. **No backwards-compatibility hacks**: Delete unused code completely
3. **Proper quoting**: Quote paths with spaces in bash commands
4. **Validate assumptions**: Don't guess - read code to understand

### Task Management
1. **Use TodoWrite**: Track complex multi-step tasks
2. **Mark progress**: Update task status as you work
3. **Complete immediately**: Mark tasks done right after finishing
4. **One task in progress**: Limit to one in_progress task at a time

### Communication
1. **Be concise**: Short, focused responses for CLI display
2. **No emojis**: Unless explicitly requested
3. **Text output**: Use response text, not bash echo or comments
4. **Code references**: Include `file_path:line_number` when referencing code
5. **No time estimates**: Never predict how long tasks will take

### Parallel Operations
1. **Independent tools**: Call multiple tools in single message when independent
2. **Sequential dependencies**: Wait for results when one call depends on another
3. **Never use placeholders**: Don't guess missing parameters

## Project-Specific Guidelines

As this project develops, document:
- Code style preferences (formatting, naming conventions)
- Architecture patterns and principles
- Domain-specific terminology
- Common pitfalls to avoid
- External service integrations
- Environment setup requirements

## Contributing Guidelines

### Before Making Changes
1. Read relevant existing code
2. Understand the existing patterns
3. Plan complex changes with TodoWrite
4. Consider security implications

### Making Changes
1. Follow existing code style
2. Make minimal, focused changes
3. Write tests for new functionality
4. Update documentation if needed

### After Making Changes
1. Review your changes for security issues
2. Ensure tests pass (when testing is set up)
3. Commit with clear messages
4. Push to the correct branch

## Resources and References

### Internal Documentation
- [To be added as project grows]

### External Resources
- [Add relevant documentation links]
- [Add API documentation]
- [Add tool/framework documentation]

## Maintenance Notes

**Last Updated**: 2026-01-23
**Repository Status**: New/Empty
**Next Steps**:
- Define project purpose and scope
- Set up initial project structure
- Choose technology stack
- Configure development tools
- Update this document with project-specific details

---

**Note**: This is a living document. Update it as the project evolves, conventions are established, and new patterns emerge. Keep it current to ensure AI assistants have accurate, relevant guidance.

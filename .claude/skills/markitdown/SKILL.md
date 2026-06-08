```markdown
# markitdown Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `markitdown` JavaScript codebase. You'll learn how to structure files, write imports and exports, and follow the project's coding style. The guide also covers how to write and run tests, and provides suggested commands for common workflows.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `parseMarkdown.js`, `renderHtml.js`

### Imports
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { parseMarkdown } from './parseMarkdown';
    ```

### Exports
- Use **named exports**.
  - Example:
    ```javascript
    // In parseMarkdown.js
    export function parseMarkdown(text) { ... }
    ```

### Commit Messages
- Freeform style, no strict prefixes.
- Average length: ~58 characters.
  - Example:  
    ```
    Add support for tables in markdown parser
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new functionality  
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Write your function(s) and export them using named exports.
3. Import any dependencies using relative paths.
4. Write or update corresponding test files (`*.test.js`).
5. Commit changes with a clear, descriptive message.

### Fixing a Bug
**Trigger:** When resolving a reported issue  
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Make necessary code changes.
3. Update or add tests to cover the bug fix.
4. Commit with a descriptive message explaining the fix.

### Writing Tests
**Trigger:** When adding or updating tests  
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.js`.
2. Write tests for your functions or modules.
3. Run tests using the project's test runner (framework is unknown; check project docs or package.json).

## Testing Patterns

- Test files follow the pattern: `*.test.js`
- The specific testing framework is unknown; check for clues in the project documentation or `package.json`.
- Example test file:
  ```javascript
  import { parseMarkdown } from './parseMarkdown';

  test('parses bold text', () => {
    expect(parseMarkdown('**bold**')).toContain('<strong>bold</strong>');
  });
  ```

## Commands
| Command      | Purpose                                      |
|--------------|----------------------------------------------|
| /add-feature | Start the workflow for adding a new feature  |
| /fix-bug     | Start the workflow for fixing a bug          |
| /write-test  | Start the workflow for writing or updating tests |
```

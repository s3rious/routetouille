# Debug Test Issues

Debug and fix test issues for: $ARGUMENTS

Debugging approach:
1. Run the failing test in isolation:
   - `jest --config=jest.unit-tests.config.js --testNamePattern="$ARGUMENTS"`
   - `jest --config=jest.component-tests.config.js --testNamePattern="$ARGUMENTS"`
2. Analyze the test output and error messages
3. Check for common issues:
   - Missing mocks for external dependencies
   - Async operations not properly awaited
   - Component rendering issues
   - State management problems
   - Type errors in test code
4. Review test setup and teardown
5. Verify test isolation (no shared state between tests)
6. Check that tests follow project patterns
7. Fix issues and verify all tests pass
8. Run full test suite to ensure no regressions

Common fixes:
- Add proper mocks for API calls
- Use React Testing Library best practices
- Handle async operations correctly
- Mock Effector stores and effects
- Fix TypeScript type issues in tests
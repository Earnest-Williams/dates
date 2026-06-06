#!/bin/bash
set -e

echo "Running tests..."
TEST_FILES=$(find test test/balance -name "*.test.js" -type f | sort)

echo "Found $(echo "$TEST_FILES" | wc -l) test files"

FAILED=0
for file in $TEST_FILES; do
  echo ""
  echo "=== Running $file ==="
  if NODE_OPTIONS="--max-old-space-size=4096" node --test "$file"; then
    echo "✅ Test passed: $file"
  else
    echo "❌ Test failed: $file"
    FAILED=1
  fi
done

if [ $FAILED -eq 0 ]; then
  echo ""
  echo "✅ All tests passed!"
  exit 0
else
  echo ""
  echo "❌ Some tests failed"
  exit 1
fi

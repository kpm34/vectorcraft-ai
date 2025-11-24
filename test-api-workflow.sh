#!/bin/bash

# VectorCraft AI - API Workflow Test Script
# Tests both Vector Studio and Texture Studio endpoints

set -e  # Exit on error

echo "🧪 VectorCraft AI - API Workflow Test"
echo "======================================"
echo ""

# Configuration
API_URL="${VECTORCRAFT_API_URL:-http://localhost:3001}"
API_KEY="${GEMINI_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY environment variable not set"
  exit 1
fi

echo "📍 API URL: $API_URL"
echo "🔑 API Key: ${API_KEY:0:10}..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoints
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4

  echo -n "Testing $name... "

  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $API_KEY" \
      -d "$data" \
      "$API_URL$endpoint")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    echo "Response: $body"
    ((TESTS_FAILED++))
    return 1
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏥 Health & Status Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Health Check" "GET" "/health" ""
test_endpoint "API Status" "GET" "/api/status" ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Vector Studio Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create a simple test image (1x1 red pixel PNG in base64)
TEST_IMAGE_BASE64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

# Test Vector Studio - SVG Conversion
VECTOR_PAYLOAD='{
  "image": "'$TEST_IMAGE_BASE64'",
  "mimeType": "image/png",
  "mode": "logo-clean",
  "complexity": "low",
  "quality": "medium",
  "maxColors": 8
}'

test_endpoint "Vector Convert (Logo Mode)" "POST" "/api/vector/convert" "$VECTOR_PAYLOAD"

# Test with different mode
VECTOR_PAYLOAD_ICON='{
  "image": "'$TEST_IMAGE_BASE64'",
  "mimeType": "image/png",
  "mode": "icon",
  "complexity": "low",
  "quality": "high",
  "maxColors": 4
}'

test_endpoint "Vector Convert (Icon Mode)" "POST" "/api/vector/convert" "$VECTOR_PAYLOAD_ICON"

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  Texture Studio Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Texture Studio - MatCap Generation
TEXTURE_MATCAP_PAYLOAD='{
  "prompt": "brushed steel with blue tint",
  "mode": "MATCAP",
  "quality": "FAST",
  "resolution": "1K"
}'

test_endpoint "Texture Generate (MatCap Mode)" "POST" "/api/texture/generate" "$TEXTURE_MATCAP_PAYLOAD"

# Test Texture Studio - PBR Generation
TEXTURE_PBR_PAYLOAD='{
  "prompt": "rough concrete with moss",
  "mode": "PBR",
  "quality": "FAST",
  "resolution": "1K"
}'

test_endpoint "Texture Generate (PBR Mode)" "POST" "/api/texture/generate" "$TEXTURE_PBR_PAYLOAD"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Passed:${NC} $TESTS_PASSED"
echo -e "${RED}✗ Failed:${NC} $TESTS_FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi

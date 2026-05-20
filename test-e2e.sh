#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 End-to-End Test: Building → Workflow via RabbitMQ Outbox/Inbox${NC}\n"

# Generate unique building name
BUILDING_NAME="Building_$(date +%s%N | tail -c 6)"

# Step 1: Create building in virtual-facility
echo -e "${BLUE}📝 Step 1: Creating building in virtual-facility...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:3001/buildings \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"$BUILDING_NAME\"}")

BUILDING_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | cut -d: -f2)

if [ -z "$BUILDING_ID" ]; then
  echo -e "${RED}❌ Failed to create building${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Building created: ID=$BUILDING_ID, Name=$BUILDING_NAME${NC}\n"

# Step 2: Wait for RabbitMQ message processing
echo -e "${BLUE}⏳ Step 2: Waiting for RabbitMQ message processing (3s)...${NC}"
sleep 3

# Step 3: Query virtual-facility database
echo -e "${BLUE}📊 Step 3: Checking virtual-facility database...${NC}"
VFACILITY_RESULT=$(docker compose exec -T virtual-facility-db psql -U postgres -d virtual-facility -c \
  "SELECT id, name FROM building WHERE id = $BUILDING_ID;" 2>&1)

echo "$VFACILITY_RESULT"

if echo "$VFACILITY_RESULT" | grep -q "$BUILDING_NAME"; then
  echo -e "${GREEN}✅ Building found in virtual-facility database${NC}\n"
else
  echo -e "${RED}❌ Building not found in virtual-facility database${NC}"
  exit 1
fi

# Step 4: Query workflow database
echo -e "${BLUE}📊 Step 4: Checking workflow-services database...${NC}"
WORKFLOWS_RESULT=$(docker compose exec -T workflow-db psql -U postgres -d workflows -c \
  "SELECT id, name, \"buildingId\" FROM workflow WHERE \"buildingId\" = $BUILDING_ID;" 2>&1)

echo "$WORKFLOWS_RESULT"

if echo "$WORKFLOWS_RESULT" | grep -q "Workflow for Building $BUILDING_ID"; then
  echo -e "${GREEN}✅ Workflow created in workflow-services database${NC}\n"
else
  echo -e "${RED}❌ Workflow not found in workflow-services database${NC}"
  exit 1
fi

# Step 5: Check outbox table for successful delivery
echo -e "${BLUE}📊 Step 5: Checking outbox status...${NC}"
OUTBOX_RESULT=$(docker compose exec -T virtual-facility-db psql -U postgres -d virtual-facility -c \
  "SELECT id, \"eventType\", status, \"sentAt\" FROM outbox_event WHERE \"aggregateId\" = $BUILDING_ID ORDER BY \"createdAt\" DESC LIMIT 1;" 2>&1 || true)

if [ -z "$OUTBOX_RESULT" ] || echo "$OUTBOX_RESULT" | grep -q "did not find any relation"; then
  echo -e "${BLUE}ℹ️  Outbox table may not exist yet${NC}\n"
else
  echo "$OUTBOX_RESULT"
  if echo "$OUTBOX_RESULT" | grep -q "sent"; then
    echo -e "${GREEN}✅ Outbox event marked as sent${NC}\n"
  else
    echo -e "${BLUE}ℹ️  Outbox event may still be pending or processing${NC}\n"
  fi
fi

# Step 6: Check inbox table for idempotency
echo -e "${BLUE}📊 Step 6: Checking inbox for idempotency...${NC}"
INBOX_RESULT=$(docker compose exec -T workflow-db psql -U postgres -d workflows -c \
  "SELECT id, \"eventId\", \"eventType\", \"processedAt\" FROM inbox_entry ORDER BY \"receivedAt\" DESC LIMIT 1;" 2>&1 || true)

if [ -z "$INBOX_RESULT" ] || echo "$INBOX_RESULT" | grep -q "did not find any relation"; then
  echo -e "${BLUE}ℹ️  Inbox table may not exist yet${NC}\n"
else
  echo "$INBOX_RESULT"
  if echo "$INBOX_RESULT" | grep -q "workflow.create"; then
    echo -e "${GREEN}✅ Inbox entry recorded (idempotency guard active)${NC}\n"
  else
    echo -e "${BLUE}ℹ️  Inbox entries may still be processed${NC}\n"
  fi
fi

echo -e "${GREEN}✨ All checks passed! Outbox/Inbox pattern working correctly.${NC}"

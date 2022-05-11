#!/bin/bash
set -e

THREADS=${1:-5}
RAMP_UP=${2:-15}
LOOP_COUNT=${3:-100}

echo "Start performance tests on EHRbase:"
echo "Threads: $THREADS"
echo "Ramp up: $RAMP_UP"
echo "Loop count: $LOOP_COUNT"

EXECUTION_ID=$(curl -X POST \
  -f -s -S \
  -u webtester:Dctm1234 \
  -H 'Content-Type: application/json' \
  -d "{\"host\":\"ehrbase-service.default.svc.cluster.local\",\"threads\":$THREADS,\"rampUp\":$RAMP_UP,\"loopCount\":$LOOP_COUNT}" \
  "http://localhost:30902/webtester/rest/jmeter/test-plans/ehrbase_horizontal_scaling/start")

until [ "$(curl -s -u webtester:Dctm1234 "http://localhost:30902/webtester/rest/jmeter" | jq '.active')" == "false" ]; do
  echo "Performance tests are running..."
  sleep 1m
done

echo "Performance tests completed!"
echo "$EXECUTION_ID"

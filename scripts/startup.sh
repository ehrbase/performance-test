#!/bin/bash
set -e

helm install ehrbase-load-test-deployment ~/ehrbase-helm-chart-hetzner/
KUBE_IP="$(minikube ip)"
until [ $(curl -s -o /dev/null -w "%{http_code}" "http://$KUBE_IP:30901/ehrbase/rest/status") == 200 ] &&
  [ $(curl -s -u webtester:Dctm1234 "http://$KUBE_IP:30902/webtester/actuator/health" | jq '.status') == "\"UP\"" ]; do
  echo "Installing EHRbase and WebTester..."
  sleep 30
done

echo "EHRbase and WebTester are ready for testing!"

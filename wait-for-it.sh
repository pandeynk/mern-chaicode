#!/bin/bash
# wait-for-it.sh -- Wait for a service to become available
set -e

host="$1"
port="$2"
shift 2
cmd="$@"

while ! timeout 1 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; do
  echo "Waiting for $host:$port to become available..."
  sleep 2
done

echo "$host:$port is available, starting the application..."
exec $cmd

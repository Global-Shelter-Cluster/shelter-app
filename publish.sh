#!/usr/bin/env bash

if [[ $1 =~ ^(local|dev|stage|prod)$ ]]; then
  exp publish --release-channel $1
else
  echo "Usage: ./publish.sh [local|dev|stage|prod]"
fi

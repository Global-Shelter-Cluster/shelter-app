#!/usr/bin/env bash

if [[ $1 =~ ^(local|dev|stage|prod)$ ]]; then
  if [[ $1 == prod ]]; then
    exp publish --release-channel default
  else
    exp publish --release-channel $1
  fi
else
  echo "Usage: ./publish.sh [local|dev|stage|prod]"
fi

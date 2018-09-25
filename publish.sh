#!/usr/bin/env bash

if [[ $1 =~ ^(dev|stage|prod)$ ]]; then
  if [[ $1 == prod ]]; then
    expo publish --release-channel default
  else
    expo publish --release-channel $1
  fi
else
  echo "Usage: ./publish.sh [dev|stage|prod]"
fi

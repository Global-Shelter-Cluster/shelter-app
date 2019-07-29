#!/usr/bin/env bash

if [[ $1 =~ ^(dev|stage|prod)$ ]]; then
  if [[ $1 == prod ]]; then
    expo publish --release-channel prod`cat PROD_RELEASE_CHANNEL.json`
  else
    expo publish --release-channel $1
  fi
else
  echo "Usage: ./publish.sh [dev|stage|prod]"
fi

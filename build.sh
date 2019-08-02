#!/usr/bin/env bash

if [[ $1 =~ ^(ios|android)$ ]]; then
  if [[ $1 == ios ]]; then
    expo build:ios --release-channel prod-v`cat PROD_RELEASE_CHANNEL.json`
  else
    expo build:android -t app-bundle --release-channel prod-v`cat PROD_RELEASE_CHANNEL.json`
  fi
else
  echo "Usage: ./build.sh [ios|android]"
fi

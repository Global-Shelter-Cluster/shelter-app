#!/usr/bin/env bash

if [[ $1 =~ ^(ios|android)$ ]]; then
  expo build:$1 --release-channel prod`cat PROD_RELEASE_CHANNEL.json`
else
  echo "Usage: ./build.sh [ios|android]"
fi

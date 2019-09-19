#!/usr/bin/env bash

if [[ $1 == ios ]]; then
  expo build:ios --release-channel prod-v`cat PROD_RELEASE_CHANNEL.json`
elif [[ $1 == android-apk ]]; then # not to be used for publishing on the Play Store
  expo build:android --release-channel prod-v`cat PROD_RELEASE_CHANNEL.json`
elif [[ $1 == android ]]; then
  expo build:android -t app-bundle --release-channel prod-v`cat PROD_RELEASE_CHANNEL.json`
else
  echo "Usage: ./build.sh [ios|android]"
fi

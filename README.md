# Shelter Cluster mobile app

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Deployments

Use `build.sh` to create .ipa or .apk files suitable to upload to the app stores.

Use the `publish.sh` script to deploy to the dev/stage/prod release channels.

The production channel changes with each Expo SDK change, to prevent problems for existing users.
A change in the SDK means we have to do new builds and publish them through the app stores.

When this happens, we should increment the number in the `PROD_RELEASE_CHANNEL` file, which gets picked
up by `src/config.js`, `publish.sh`, and `build.sh`.

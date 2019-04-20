# shipahoy

|Branch | Build status |
|-------|--------------|
|develop|[![CircleCI](https://circleci.com/gh/maritime-datasystems/shipahoy/tree/develop.svg?style=svg&circle-token=a516ccc959f272c5fe992147ca0f5d426126a286)](https://circleci.com/gh/maritime-datasystems/shipahoy/tree/develop)|
|master|[![CircleCI](https://circleci.com/gh/maritime-datasystems/shipahoy/tree/master.svg?style=svg&circle-token=a516ccc959f272c5fe992147ca0f5d426126a286)](https://circleci.com/gh/maritime-datasystems/shipahoy/tree/master)|

# Shipahoy

## Configuration

Create a `.env` file at `app/config` and add
`SIMULATOR_SERVICE` with the URL and PORT to the simulator API on the gateway to it:

```bash
echo 'SIMULATOR_SERVICE=http://<URL>:<PORT>/simulator' > app/config/.env
```

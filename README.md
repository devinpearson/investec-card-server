# Programmable Card Code Emulator HTTP Server

Execute programmable card code in a safe environment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

While exploring Programmable Banking Cards, I found it difficult to test my code. I wanted to be able to write code and test it in a safe environment. I also wanted to be able to share my code with others. This project is an attempt to solve these problems.

### Requirements

Node.js 22 or newer. The emulator uses the native `isolated-vm` addon, which ships prebuilt binaries for Node 22 and 24 on common platforms.

### Installation

If running from source, install the dependencies with:

```
npm i
```

### Usage

```
npm run dev     # watch mode
npm run build && npm start
npm test
```

Settings are read from `.env` if present (see `.env.sample`); `PORT` defaults to `3010`.

### API

`POST /simulate` with a JSON body:

```json
{
  "code": "<URI-encoded card code>",
  "transaction": {
    "currencyCode": "zar",
    "centsAmount": 10000,
    "merchantCode": "0000",
    "merchantName": "The Bakery",
    "merchantCity": "Cape Town",
    "merchantCountry": "ZA"
  },
  "environmentVariables": {}
}
```

Every `transaction` field is optional and falls back to the values shown. The response is the emulator's two execution items (`before_transaction`, then `after_transaction` or `after_decline`) with their logs. A missing or malformed `code` returns `400`.

> **For local development only.** Card code runs in an isolated V8 sandbox with a 5 second timeout per phase, but its `fetch` is unrestricted and can reach localhost and your local network, and CORS is open to any origin. Don't deploy this server or expose it publicly.

If you want to run the emulator in a docker container, run the following commands:

```
docker build -t card-server .
docker run -it -p 3010:3010 card-server
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

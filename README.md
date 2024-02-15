# Programmable Card Code Emulator HTTP Server

Execute programmable card code in a safe environment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

While exploring Programmable Banking Cards, I found it difficult to test my code. I wanted to be able to write code and test it in a safe environment. I also wanted to be able to share my code with others. This project is an attempt to solve these problems.

### Installation

If running from source, install the dependencies with:

```
npm i
```

### Usage

```
npm run dev
```

If you want to run the emulator in a docker container, run the following commands:

```
docker build -t card-server .
docker run -it -p 3010:3010 card-server
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

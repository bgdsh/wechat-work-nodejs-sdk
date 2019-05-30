# Wechat work node.js SDK

[![Build Status](https://travis-ci.org/bgdsh/wechat-work-nodejs-sdk.svg?branch=master)](https://travis-ci.org/bgdsh/wechat-work-nodejs-sdk) [![Greenkeeper badge](https://badges.greenkeeper.io/bgdsh/wechat-work-nodejs-sdk.svg)](https://greenkeeper.io/)

## Get Started

```typescript
import { Commander, IConfig } from "wechat-work";
const config = {`Your config`} as IConfig;
const commander = new Commander(config)
const accessToken = await commander.getAccessToken()
```

## Notice

This project is under heavy development. Please do not use it in production.

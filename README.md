# Wechat work node.js SDK

## Get Started

```typescript
import { Commander, IConfig } from "wechat-work";
const config = {`Your config`} as IConfig;
const commander = new Commander(config)
const accessToken = await commander.getAccessToken()
```

## Notice

This project is under heavy development. Please do not use it in production.

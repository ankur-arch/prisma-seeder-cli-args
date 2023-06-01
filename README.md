# Introduction

This repository demonstrates the [**Support for custom arguments for `prisma db seed`**](https://github.com/prisma/prisma/releases/tag/4.15.0#:~:text=Support%20for%20custom%20arguments%20for%20prisma%20db%20seed)

## Getting started

|:warning: Nodejs Version |
|---|
| >= v16.17.0 to support [`parseArgs`](https://nodejs.org/api/util.html#utilparseargsconfig)  |

Install dependencies

```bash
yarn
yarn prisma migrate dev
```

Afterwards, you can seed the database for *different* environments using

- npx

  ```bash
  # test
  npx prisma db seed -- --environment test

  # dev
  npx prisma db seed -- --environment development

  # prod
  npx prisma db seed -- --environment production
  ```

- yarn

  ```bash
  # test
  yarn ts-node prisma/seed.ts -- --environment test

  # dev
  yarn ts-node prisma/seed.ts -- --environment development

  # prod
  yarn ts-node prisma/seed.ts -- --environment production
  ```

Some additional scripts are:

```bash
yarn studio # to open up prisma studio 
yarn reset:db # to reset your database 
```

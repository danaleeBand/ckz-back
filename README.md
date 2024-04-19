# ckz-back

## Description

Checkuiz Backend Repository

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Migration

```bash
# migration 파일 생성
$ yarn typeorm migration:create src/migrations/{파일명}

# 실행
$ yarn typeorm:migration -d ormconfig.ts
```


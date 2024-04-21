# ckz-back

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

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
$ yarn typeorm migration:run -d ormconfig.ts

# 되돌리기
$ yarn typeorm migration:revert -d ormconfig.ts
```


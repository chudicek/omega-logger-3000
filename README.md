# construction diary

## Getting started

### setup

```bash
cd my-turborepo
npm i
cd apps/backend && npx prisma generate && cd ../..
```

### run

~~rename `.env.example` to `.env` in both /frontend and /backend~~

Apparently Planetscale does not like when i share connection strings

To get the .env files, please contact me via email

(following command is to be executed in the `my-turborepo` directory)

```bash
npx turbo dev
```

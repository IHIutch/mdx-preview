# mdx-preview

A live MDX preview editor built with TanStack Start, deployed to **Cloudflare Workers**.

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19, bundled by Vite with [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/)
- Prisma (`runtime = "cloudflare"`) talking to Postgres through [Prisma Accelerate](https://www.prisma.io/accelerate)
- CodeMirror editor, USWDS styles

## Development

```sh
pnpm install
pnpm dev
```

`pnpm dev` runs Vite with the Cloudflare plugin, so the server code executes in `workerd` — the same runtime as production.

### Environment variables

Server-side secrets are read from `process.env` (enabled by the `nodejs_compat` flag in `wrangler.jsonc`).

- **Local:** put them in `.dev.vars` (gitignored). At minimum:

  ```sh
  DATABASE_URL="prisma+postgres://..."   # Prisma Accelerate connection string
  ```

- **Production:** upload them as Worker secrets:

  ```sh
  pnpm exec wrangler secret put DATABASE_URL
  ```

`.env` is only used by the Prisma CLI (`prisma/prisma.config.ts` loads it via dotenv) for migrations and `prisma generate`.

## Database

```sh
pnpm prisma migrate dev     # create/apply a migration
pnpm prisma generate        # regenerate the client into ./generated/prisma
pnpm db-tunnel              # local tunnel to Prisma Postgres
```

## Deploying

```sh
pnpm deploy                 # vite build && wrangler deploy
```

Other useful commands:

```sh
pnpm build                  # build client + Worker into ./dist
pnpm typecheck              # tsc --noEmit
pnpm cf-typegen             # regenerate worker-configuration.d.ts from wrangler.jsonc
pnpm exec wrangler deploy --dry-run   # verify the bundle without publishing
```

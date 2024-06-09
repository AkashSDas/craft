# Backend

## Notes

Don't use Typescript keyword `type` because even if they're used as types in that file, they're not compiled to actual objects. For example, in case of DTO, if importated as type and assigned as type of an argument, that DTO won't resolve to actual validation; and because of this I was getting Module dependency injection issues (not resolved and all).

## How to add a new block?

In BE:

- Add the block in `content-block.schema.ts`
- Add validation in `update-article-content.dto.ts`

In FE:

- Create zod schema and update article zod schema `services/articles.ts`
- Create a block for editor and add it in `DisplayBlock` (for editor)
- Create a block display and add it in `DisplayBlock` (for displaying)
- Add the block in `Sidebar.tsx`
- Add handler to manage updating the block in `editor/slice.ts`

## Commands

```bash
# create new module
pnpx @nestjs/cli@latest g module <name>

# create new controller
pnpx @nestjs/cli@latest g controller <name>

# create new service
pnpx @nestjs/cli@latest g service <name>

# create new provider
pnpx @nestjs/cli@latest g provider <name>
```

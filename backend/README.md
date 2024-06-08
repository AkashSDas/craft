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

# Backend

## Notes

Don't use Typescript keyword `type` because even if they're used as types in that file, they're not compiled to actual objects. For example, in case of DTO, if importated as type and assigned as type of an argument, that DTO won't resolve to actual validation; and because of this I was getting Module dependency injection issues (not resolved and all).

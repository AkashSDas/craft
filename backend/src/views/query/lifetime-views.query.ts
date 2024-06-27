import { IsEnum } from "class-validator";

/**
 * Keys will fields from article collection
 */
export const LIFETIME_VIEW_FILTER_PROPERTY = {
    LAST_UPDATED_AT: "lastUpdatedAt",
    VIEW_COUNT: "viewCount",
    READ_COUNT: "readCount",
} as const;

export const LIFETIME_VIEW_ORDER = {
    ASC: "ASC",
    DESC: "DESC",
} as const;

export class LifetimeViewsQuery {
    @IsEnum(Object.values(LIFETIME_VIEW_FILTER_PROPERTY))
    filterProperty: (typeof LIFETIME_VIEW_FILTER_PROPERTY)[keyof typeof LIFETIME_VIEW_FILTER_PROPERTY];

    @IsEnum(Object.values(LIFETIME_VIEW_ORDER))
    order: (typeof LIFETIME_VIEW_ORDER)[keyof typeof LIFETIME_VIEW_ORDER];
}

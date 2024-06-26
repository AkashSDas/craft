import { IsNotEmpty } from "class-validator";
import { IsAfter, IsTimestamp } from "../validator";

export class MonthlyViewsQuery {
    @IsNotEmpty()
    @IsTimestamp({ message: "startTimestampInMs must be a valid timestamp" })
    startTimestampInMs: number;

    @IsNotEmpty()
    @IsTimestamp({ message: "endTimestampInMs must be a valid timestamp" })
    @IsAfter("startTimestampInMs", {
        message: "endTimestampInMs must be after startTimestampInMs",
    })
    endTimestampInMs: number;
}

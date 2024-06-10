import { Heading as HeadingBlk } from "@app/services/articles";
import { Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

type Props = {
    block: HeadingBlk;
};

export function HeadingBlock({ block }: Props): React.JSX.Element {
    const fontSize = useMemo(function () {
        if (block.value.variant === "h1")
            return {
                base: "30.81px",
                sm: "36.81px",
            };
        if (block.value.variant === "h2")
            return {
                base: "24.65px",
                sm: "30.65px",
            };
        return {
            base: "18.53px",
            sm: "24.53px",
        };
    }, []);

    return (
        <Heading variant={block.value.variant} fontSize={fontSize}>
            {block.value.text}
        </Heading>
    );
}

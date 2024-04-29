import { monaSansCondensed, monasansExpanded } from "@app/lib/chakra";
import { Text } from "@chakra-ui/react";

type Props = {
    variant?: "light" | "dark";
};

export function Logo({ variant = "light" }: Props) {
    return (
        <Text
            color={variant === "light" ? "gray.900" : "white"}
            fontSize="24px"
        >
            <Text
                as="span"
                fontFamily={monasansExpanded.style.fontFamily}
                fontStyle="italic"
                fontWeight="800"
            >
                C
            </Text>
            <Text
                as="span"
                fontFamily={monaSansCondensed.style.fontFamily}
                fontWeight="500"
            >
                R
            </Text>
            <Text as="span" fontWeight="700">
                A
            </Text>
            <Text
                as="span"
                fontFamily={monasansExpanded.style.fontFamily}
                fontStyle="italic"
                fontWeight="300"
            >
                F
            </Text>
            <Text as="span" fontWeight="700">
                T
            </Text>
        </Text>
    );
}

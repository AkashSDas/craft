import { monaSansCondensed, monasansExpanded } from "@app/lib/chakra";
import { Text } from "@chakra-ui/react";

type Props = {
    variant?: "light" | "dark";
};

export function Logo({ variant = "light" }: Props) {
    return (
        <Text
            role="group"
            color={variant === "light" ? "gray.900" : "white"}
            fontSize="24px"
        >
            <Text
                as="span"
                fontFamily={monasansExpanded.style.fontFamily}
                fontStyle="italic"
                fontWeight="800"
                transition="font-weight 0.3s ease"
                _groupHover={{ fontWeight: "300" }}
                _groupActive={{ fontWeight: "700" }}
            >
                C
            </Text>
            <Text
                as="span"
                fontFamily={monaSansCondensed.style.fontFamily}
                fontWeight="500"
                transition="font-weight 0.3s ease, fontStyle 0.3s ease"
                _groupHover={{ fontWeight: "600" }}
                _hover={{ fontStyle: "italic" }}
                _groupActive={{ fontWeight: "700" }}
            >
                R
            </Text>
            <Text
                as="span"
                fontWeight="700"
                transition="font-weight 0.3s ease"
                _groupHover={{ fontWeight: "400" }}
                _hover={{ fontStyle: "italic" }}
                _groupActive={{ fontWeight: "300" }}
            >
                A
            </Text>
            <Text
                as="span"
                fontFamily={monasansExpanded.style.fontFamily}
                fontStyle="italic"
                fontWeight="300"
                transition="font-weight 0.3s ease"
                _groupHover={{ fontWeight: "700" }}
                _groupActive={{ fontWeight: "600" }}
            >
                F
            </Text>
            <Text
                as="span"
                fontWeight="700"
                transition="font-weight 0.3s ease"
                _groupHover={{ fontWeight: "400" }}
                _hover={{ fontStyle: "italic" }}
                _groupActive={{ fontWeight: "300" }}
            >
                T
            </Text>
        </Text>
    );
}

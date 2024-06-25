import { fontStyles } from "@app/utils/fonts";
import { Heading, Text } from "@chakra-ui/react";

export function EmptyHeading() {
    return (
        <Heading as="h3" color="white" fontSize={{ base: "36px", sm: "40px" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                E
            </Text>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                m
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                p
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                t
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                y
            </Text>
        </Heading>
    );
}

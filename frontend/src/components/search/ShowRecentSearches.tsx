import { useRecentSearch } from "@app/hooks/search";
import { fontStyles } from "@app/utils/fonts";
import { DeleteIcon } from "@chakra-ui/icons";
import {
    VStack,
    Heading,
    Divider,
    HStack,
    IconButton,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";

export function ShowRecentSearches() {
    const { history, removeHistory } = useRecentSearch();

    return (
        <VStack gap="1rem" alignItems="start" w="100%">
            <Heading variant="h3">
                <RecentSearchesHeading />
            </Heading>

            {history.length === 0 ? (
                <Text textAlign="center" color="gray.500" fontWeight="500">
                    No recent searches
                </Text>
            ) : (
                <VStack gap="0px" w="100%" divider={<Divider />}>
                    {history.map((item) => {
                        const params = new URLSearchParams({ q: item });

                        return (
                            <HStack
                                w="100%"
                                key={item}
                                h="48px"
                                borderRadius="4px"
                                as={Link}
                                href={`/search?${params.toString()}`}
                                _hover={{ bgColor: "gray.100" }}
                                transition="transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7)"
                                transformOrigin="center"
                                _active={{
                                    bgColor: "gray.200",
                                    transform: "scale(0.98)",
                                }}
                                px="12px"
                            >
                                <Text
                                    flexGrow={1}
                                    fontWeight="500"
                                    fontSize="18px"
                                    color="gray.500"
                                >
                                    {item}
                                </Text>

                                <IconButton
                                    aria-label="Delete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeHistory(item);
                                    }}
                                    variant="tab"
                                    h="38px"
                                    transition="all 0.2s ease-in-out"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </HStack>
                        );
                    })}
                </VStack>
            )}
        </VStack>
    );
}

function RecentSearchesHeading() {
    return (
        <Text as="span" fontSize={{ base: "24px", sm: "30px" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                Re
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                c
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                e
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                n
            </Text>
            <Text as="span" {...fontStyles["expandedBold"]} mr="6px">
                t
            </Text>

            <Text as="span" {...fontStyles["condensedMedium"]}>
                S
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                ea
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                r
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                c
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                he
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                s
            </Text>
        </Text>
    );
}

import {
    VStack,
    Heading,
    Divider,
    Text,
    HStack,
    SkeletonText,
    SkeletonCircle,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { useGetTrendingAuthors } from "@app/hooks/user";

export function TrendingAuthors() {
    const { isLoading, isError, authors } = useGetTrendingAuthors();
    const isLoaded = useMemo(
        function () {
            return !isLoading && !isError;
        },
        [isLoading, isError]
    );

    console.log({ authors, isLoading, isError });

    return (
        <VStack w="100%" alignItems="start" gap="14px">
            <Heading variant="h3" fontSize="24px">
                Rising Authors
            </Heading>

            <Divider />

            {!isLoaded ? <AuthorSkeletons isLoaded={isLoaded} /> : null}

            {authors.map((author) => {
                return (
                    <HStack
                        w="100%"
                        p="4px"
                        gap="12px"
                        as={Link}
                        href={`/authors/${author.userId}`}
                        key={author.userId}
                        transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                        _hover={{
                            bgColor: "gray.100",
                        }}
                        _active={{
                            transform: "scale(0.98)",
                            bgColor: "gray.200",
                        }}
                        borderRadius="4px"
                    >
                        <Image
                            src={author.profilePic?.URL ?? "/mascot.png"}
                            alt="Profile pic"
                            height={48}
                            width={48}
                            style={{
                                objectFit: "cover",
                                minWidth: "48px",
                                minHeight: "48px",
                                borderRadius: "50%",
                            }}
                        />

                        <VStack
                            w="100%"
                            alignItems="start"
                            flexGrow={1}
                            gap="12px"
                        >
                            <Text
                                noOfLines={2}
                                fontWeight="600"
                                color="gray.700"
                                fontSize="16px"
                            >
                                {author.username}
                            </Text>
                        </VStack>
                    </HStack>
                );
            })}
        </VStack>
    );
}

function AuthorSkeletons(props: { isLoaded: boolean }) {
    return (
        <>
            {[1, 2, 3].map((item) => {
                return (
                    <HStack w="100%" p="2px" gap="12px" alignItems="start">
                        <SkeletonCircle
                            isLoaded={props.isLoaded}
                            h="48px"
                            w="48px"
                            minH="48px"
                            minW="48px"
                            startColor="gray.100"
                            endColor="gray.300"
                            fadeDuration={0.5}
                        />

                        <VStack
                            w="100%"
                            alignItems="start"
                            flexGrow={1}
                            gap="12px"
                        >
                            <SkeletonText
                                isLoaded={props.isLoaded}
                                noOfLines={2}
                                skeletonHeight="3"
                                w="100%"
                                borderRadius="4px"
                                startColor="gray.100"
                                endColor="gray.300"
                                fadeDuration={0.5}
                            />
                        </VStack>
                    </HStack>
                );
            })}
        </>
    );
}

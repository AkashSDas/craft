import { EditArticleCard } from "@app/components/studio/EditArticleCard";
import { useUser } from "@app/hooks/auth";
import { useCreateArticle } from "@app/hooks/editor";
import {
    Article,
    Image as ImageBlock,
    getUserArticles,
} from "@app/services/articles";
import { fontStyles } from "@app/utils/fonts";
import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    IconButton,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function UserArticlesPage() {
    const [tab, setTab] = useState<"draft" | "public">("draft");
    const { isLoggedIn, status } = useUser();
    const { isLoading, data, isError } = useQuery({
        queryKey: ["my-articles", tab],
        queryFn: () => getUserArticles(tab),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: isLoggedIn && status === "success",
    });
    const { mutation } = useCreateArticle();
    const router = useRouter();

    function changeTab(tab: "draft" | "public") {
        setTab(tab);
    }

    if (status !== "success") {
        return (
            <VStack>
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    } else if (!isLoggedIn) {
        router.push("/auth/login");
        return (
            <VStack>
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    }

    return (
        <VStack
            as="main"
            my={{ base: "2rem", sm: "4rem" }}
            mt={{ base: "calc(1rem + 70px)", sm: "calc(4rem + 70px)" }}
            w="100%"
            justifyContent="center"
        >
            <VStack
                maxWidth="700px"
                w="100%"
                px="1rem"
                alignItems="start"
                gap="16px"
            >
                <StudioHeading />
                <HStack gap="1rem">
                    <Button
                        variant="tab"
                        isActive={tab === "draft"}
                        onClick={() => changeTab("draft")}
                    >
                        Draft
                    </Button>
                    <Button
                        variant="tab"
                        isActive={tab === "public"}
                        onClick={() => changeTab("public")}
                    >
                        Published
                    </Button>
                </HStack>

                <Divider my="1rem" borderColor="gray.300" />

                <VStack justifyContent="center" w="100%">
                    {isLoading || isError ? (
                        <Spinner size="xl" thickness="3px" mt="4rem" />
                    ) : (
                        data?.articles?.map((article) => (
                            <EditArticleCard
                                key={article.articleId}
                                article={article}
                            />
                        ))
                    )}
                </VStack>

                {!isLoading && !isError && data?.articles?.length === 0 && (
                    <HStack
                        h="280px"
                        w="100%"
                        borderRadius="4px"
                        bgColor="black"
                        justifyContent="center"
                        gap="2rem"
                    >
                        <EmptyHeading />
                        <Button
                            px="18px"
                            onClick={() => mutation.mutateAsync()}
                            leftIcon={
                                mutation.isPending ? (
                                    <Spinner size="xs" />
                                ) : (
                                    <AddIcon />
                                )
                            }
                        >
                            Write One
                        </Button>
                    </HStack>
                )}
            </VStack>
        </VStack>
    );
}

function EmptyHeading() {
    return (
        <Heading as="h3" color="white" fontSize={{ base: "24px", sm: "40px" }}>
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

function StudioHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                S
            </Text>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                t
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                u
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                d
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                i
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                o
            </Text>
        </Heading>
    );
}

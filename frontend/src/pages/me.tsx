import { Layout } from "@app/components/shared/layout/Layout";
import { EditArticleCard } from "@app/components/studio/EditArticleCard";
import { useUser } from "@app/hooks/auth";
import { useCreateArticle } from "@app/hooks/editor";
import { getUserArticles } from "@app/services/articles";
import { fontStyles } from "@app/utils/fonts";
import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    HStack,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserArticlesPage() {
    const [tab, setTab] = useState<"draft" | "public">("draft");
    const { isLoggedIn, status } = useUser();
    const { isLoading, data, isError } = useQuery({
        queryKey: ["myArticles", tab],
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
        <Layout>
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

            <VStack justifyContent="center" w="100%" gap="1rem">
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
                    h={{ base: "200px", sm: "280px" }}
                    w="100%"
                    borderRadius="4px"
                    bgColor="black"
                    justifyContent="center"
                    gap={{ base: "1rem", sm: "2rem" }}
                    flexDirection={{ base: "column", sm: "row" }}
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
        </Layout>
    );
}

function EmptyHeading() {
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

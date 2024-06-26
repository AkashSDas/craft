import { MonthlyAnalytics } from "@app/components/analytics/MonthlyAnalytics";
import { EmptyHeading } from "@app/components/shared/headings/EmptyHeading";
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
    const { isLoggedIn, status } = useUser();
    const router = useRouter();

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
        <Layout hideSidebar fullWidth>
            <AnalyticsHeading />
            <Divider my="1rem" borderColor="gray.300" />

            <MonthlyAnalytics />
        </Layout>
    );
}

function AnalyticsHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                A
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                na
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                ly
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                ti
            </Text>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                c
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                s
            </Text>
        </Heading>
    );
}

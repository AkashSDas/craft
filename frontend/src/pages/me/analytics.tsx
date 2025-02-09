import { LifetimeAnalytics } from "@app/components/analytics/LifetimeAnalytics";
import { MonthlyAnalytics } from "@app/components/analytics/MonthlyAnalytics";
import { Layout } from "@app/components/shared/layout/Layout";
import { useUser } from "@app/hooks/auth";
import { fontStyles } from "@app/utils/fonts";
import {
    Divider,
    Heading,
    Spacer,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

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
            <Divider my="1rem" borderColor="gray.300" />

            <LifetimeAnalytics />

            <Spacer my="2rem" />
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

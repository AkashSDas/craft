import { fontStyles } from "@app/utils/fonts";
import {
    Button,
    Divider,
    HStack,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function UserArticlesPage() {
    const [tab, setTab] = useState<"draft" | "public">("draft");

    function changeTab(tab: "draft" | "public") {
        setTab(tab);
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
                        DRAFT
                    </Button>
                    <Button
                        variant="tab"
                        isActive={tab === "public"}
                        onClick={() => changeTab("public")}
                    >
                        PUBLISHED
                    </Button>
                </HStack>

                <Divider my="1rem" />
            </VStack>
        </VStack>
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

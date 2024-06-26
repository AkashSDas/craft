import { useGetTrendingArticles } from "@app/hooks/articles";
import { Divider, HStack, Heading, Show, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { TrendingArticles } from "./TrendingArticles";
import { TrendingAuthors } from "./TrendingAuthors";

type Props = PropsWithChildren<{
    mainClassName?: string;
    hideSidebar?: boolean;
    fullWidth?: boolean;
}>;

export function Layout(props: Props) {
    return (
        <HStack
            as="main"
            mb={{ base: "2rem", sm: "4rem" }}
            mt={{ base: "calc(1rem + 70px)", sm: "calc(2rem + 70px)" }}
            w="100%"
            justifyContent="space-between"
            px={{ base: "1rem", sm: "2rem" }}
            alignItems="start"
            pos="relative"
        >
            <VStack
                w="100%"
                mr={{ base: 0, lg: props.hideSidebar ? 0 : "484px" }}
            >
                <VStack
                    maxWidth={props.fullWidth ? "1000px" : "700px"}
                    w="100%"
                    alignItems="start"
                    gap="16px"
                    className={props.mainClassName}
                >
                    {props.children}
                </VStack>
            </VStack>

            {props.hideSidebar ? null : (
                <Show above="lg">
                    <VStack
                        w="484px"
                        h="calc(100vh - 102px)"
                        alignItems="start"
                        borderLeft="1px solid"
                        borderLeftColor="gray.200"
                        pr="2rem"
                        pl="2rem"
                        pos="fixed"
                        right={0}
                        overflow="auto"
                        gap="2rem"
                        pb="4rem"
                    >
                        <TrendingArticles />
                        <TrendingAuthors />
                    </VStack>
                </Show>
            )}
        </HStack>
    );
}

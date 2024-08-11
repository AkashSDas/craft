import { Layout } from "@app/components/shared/layout/Layout";
import { fontStyles } from "@app/utils/fonts";
import { Text } from "@chakra-ui/react";
import Head from "next/head";
//
export default function NotFoundPage() {
    return (
        <>
            <Head>
                <title>Not Found</title>
                <meta name="description" content="Resource not found" />
            </Head>

            <Layout>
                <Text
                    data-testid="not-found-page-text"
                    fontWeight="500"
                    color="gray.600"
                    fontSize="20px"
                    fontFamily={fontStyles["expandedBoldItalic"].fontFamily}
                >
                    Resource not found
                </Text>
            </Layout>
        </>
    );
}

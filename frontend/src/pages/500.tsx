import { Layout } from "@app/components/shared/layout/Layout";
import { fontStyles } from "@app/utils/fonts";
import { Text } from "@chakra-ui/react";
import Head from "next/head";

export default function InternalServerErrorPage() {
    return (
        <>
            <Head>
                <title>Internal Server Error</title>
                <meta name="description" content="Internal Server Error" />
            </Head>

            <Layout>
                <Text
                    data-testid="internal-server-error-page-text"
                    fontWeight="500"
                    color="gray.600"
                    fontSize="20px"
                    fontFamily={fontStyles["expandedBoldItalic"].fontFamily}
                >
                    Internal Server Error
                </Text>
            </Layout>
        </>
    );
}

import { Layout } from "@app/components/shared/layout/Layout";
import { fontStyles } from "@app/utils/fonts";
import { Text } from "@chakra-ui/react";

export default function NotFoundPage() {
    return (
        <Layout>
            <Text
                fontWeight="500"
                color="gray.600"
                fontSize="20px"
                fontFamily={fontStyles["expandedBoldItalic"].fontFamily}
            >
                Resource not found
            </Text>
        </Layout>
    );
}

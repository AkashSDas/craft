import { Editor } from "@app/components/editor/Editor";
import { useEditArticle } from "@app/hooks/editor";
import { Spinner, Stack, Text } from "@chakra-ui/react";

export default function EditArticle() {
    const { article, isOwner, isLoading } = useEditArticle();

    if (isLoading) {
        return (
            <Stack justifyContent="center" alignItems="center" mt="32px">
                <Spinner size="xl" thickness="4px" />
            </Stack>
        );
    } else if (!article) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                mt="64px"
                px={{ base: "16px", md: "2rem" }}
            >
                <Text fontSize="2xl">Article not found</Text>
            </Stack>
        );
    } else if (!isOwner) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                mt="64px"
                px={{ base: "16px", md: "2rem" }}
            >
                <Text fontSize="2xl">
                    You {`don't`} have
                    <Text
                        as="span"
                        color="brand.600"
                        fontWeight="600"
                        fontStyle="italic"
                    >
                        {` permission `}
                    </Text>
                    to edit this article
                </Text>
            </Stack>
        );
    }

    return <Editor />;
}

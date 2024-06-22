import { Editor } from "@app/components/editor/Editor";
import { useEditArticle } from "@app/hooks/editor";
import { fontStyles } from "@app/utils/fonts";
import {
    Show,
    Spinner,
    Stack,
    Text,
    useMediaQuery,
    useQuery,
} from "@chakra-ui/react";

export default function EditArticle() {
    const { article, isOwner, isLoading } = useEditArticle();
    const query = useQuery({ above: "md" });
    const [isAboveSm] = useMediaQuery(query, {
        ssr: true,
        fallback: false,
    });

    if (isLoading) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                mt="calc(70px + 32px)"
            >
                <Spinner size="xl" thickness="4px" />
            </Stack>
        );
    } else if (!article) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                mt="calc(70px + 64px)"
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
                mt="calc(70px + 64px)"
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

    if (isAboveSm) {
        return <Editor />;
    } else {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                mt="calc(70px + 64px)"
                px={{ base: "16px", md: "2rem" }}
            >
                <Text
                    fontWeight="500"
                    color="gray.600"
                    fontSize="20px"
                    fontFamily={fontStyles["expandedBoldItalic"].fontFamily}
                >
                    Do edit on a tablet/desktop
                </Text>
            </Stack>
        );
    }
}

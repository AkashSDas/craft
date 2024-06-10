import {
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { CommentInput } from "./CommentInput";
import { useCommentsManager } from "@app/hooks/comments";
import { CommentCard } from "./CommentCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    articleId: string;
};

export function CommentsDrawer(props: Props): React.JSX.Element {
    const { commentsQuery } = useCommentsManager(props.articleId);

    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            placement="bottom"
        >
            <DrawerOverlay />
            <DrawerContent minH="600px" alignItems="center" py="3rem">
                <DrawerCloseButton
                    as={Button}
                    variant="paleSolid"
                    sx={{
                        _active: { bgColor: "white" },
                        _hover: { bgColor: "white" },
                    }}
                />

                <CommentInput
                    articleId={props.articleId}
                    closeDrawer={props.onClose}
                />

                <VStack gap="1rem" w="100%" maxW="700px" px="1rem" mt="2rem">
                    {commentsQuery.isLoading ? (
                        <Spinner size="lg" thickness="3px" />
                    ) : (
                        commentsQuery.data?.comments?.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))
                    )}
                </VStack>
            </DrawerContent>
        </Drawer>
    );
}

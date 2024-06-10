import {
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
} from "@chakra-ui/react";
import { CommentInput } from "./CommentInput";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    articleId: string;
};

export function CommentsDrawer(props: Props): React.JSX.Element {
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
            </DrawerContent>
        </Drawer>
    );
}

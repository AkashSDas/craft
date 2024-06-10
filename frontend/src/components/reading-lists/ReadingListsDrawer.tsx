import {
    Button,
    Divider,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    VStack,
} from "@chakra-ui/react";
import { ReadingListInput } from "./ReadingListInput";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    articleId: string;
};

export function ReadingListsDrawer(props: Props): React.JSX.Element {
    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            placement="bottom"
        >
            <DrawerOverlay />
            <DrawerContent minH="5 200px" alignItems="center" py="3rem">
                <DrawerCloseButton
                    as={Button}
                    variant="paleSolid"
                    sx={{
                        _active: { bgColor: "white" },
                        _hover: { bgColor: "white" },
                    }}
                />

                <VStack
                    gap="8px"
                    w="100%"
                    maxW="700px"
                    px="1rem"
                    mt="2rem"
                    divider={<Divider />}
                >
                    <ReadingListInput
                        articleId={props.articleId}
                        closeDrawer={props.onClose}
                    />
                </VStack>
            </DrawerContent>
        </Drawer>
    );
}

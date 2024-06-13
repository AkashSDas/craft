import {
    Button,
    Divider,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    VStack,
} from "@chakra-ui/react";
import {
    ReadingListUpdateInput,
    UpdateReadingListInputsType,
} from "./ReadingListUpdateInput";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    readingListId: string;
    defaultValues: UpdateReadingListInputsType;
};

export function ReadingListUpdateDrawer(props: Props): React.JSX.Element {
    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={() => {
                props.onClose();
            }}
            placement="bottom"
        >
            <DrawerOverlay />
            <DrawerContent
                minH="500px"
                maxHeight="500px"
                alignItems="center"
                py="3rem"
                overflowY="auto"
            >
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
                    <ReadingListUpdateInput
                        readingListId={props.readingListId}
                        closeDrawer={props.onClose}
                        defaultValues={props.defaultValues}
                    />
                </VStack>
            </DrawerContent>
        </Drawer>
    );
}

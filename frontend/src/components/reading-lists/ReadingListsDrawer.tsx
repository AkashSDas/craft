import {
    Button,
    Divider,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { ReadingListInput } from "./ReadingListInput";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { useReadingListsManager } from "@app/hooks/reading-lists";
import { ReadingListCard } from "./ReadingListCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    articleId: string;
};

export function ReadingListsDrawer(props: Props): React.JSX.Element {
    const [showForm, setShowForm] = useState(false);
    const { readingListsQuery } = useReadingListsManager();

    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={() => {
                props.onClose();
                setShowForm(false);
            }}
            placement="bottom"
        >
            <DrawerOverlay />
            <DrawerContent minH="500px" alignItems="center" py="3rem">
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
                    {showForm ? (
                        <ReadingListInput
                            articleId={props.articleId}
                            closeDrawer={props.onClose}
                            goBack={() => setShowForm(false)}
                        />
                    ) : (
                        <>
                            <Button
                                w="100%"
                                leftIcon={<AddIcon />}
                                variant="solid"
                                onClick={() => setShowForm(true)}
                            >
                                Create Reading List
                            </Button>

                            <HStack my="1.5rem">
                                <Divider />
                                <Text fontStyle="italic">OR</Text>
                                <Divider />
                            </HStack>

                            {readingListsQuery?.isLoading ? (
                                <VStack w="100%">
                                    <Spinner size="md" thickness="2px" />
                                </VStack>
                            ) : (
                                <VStack w="100%">
                                    {readingListsQuery.data?.readingLists?.map(
                                        (list) => {
                                            return (
                                                <ReadingListCard
                                                    key={list._id}
                                                    onClick={() => {}}
                                                    readingList={list}
                                                />
                                            );
                                        }
                                    )}
                                </VStack>
                            )}
                        </>
                    )}
                </VStack>
            </DrawerContent>
        </Drawer>
    );
}

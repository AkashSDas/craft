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
import { useEffect, useState } from "react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import { useReadingListsManager } from "@app/hooks/reading-lists";
import { ReadingListCard } from "./ReadingListCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    articleId: string;
};

export function ReadingListsDrawer(props: Props): React.JSX.Element {
    const [showForm, setShowForm] = useState(false);
    const { readingListsQuery, addArticleToReadingListMutation } =
        useReadingListsManager();
    const [selectedLists, setSelectedLists] = useState<string[]>([]);

    useEffect(
        function updateSelectedListsWithArticleReadingLists() {
            if (readingListsQuery.data?.readingLists) {
                const articleReadingLists =
                    readingListsQuery.data.readingLists.filter((list) => {
                        return list.articleIds.includes(props.articleId);
                    });

                setSelectedLists(articleReadingLists.map((list) => list._id));
            }
        },
        [readingListsQuery.data, props.articleId]
    );

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

                            {readingListsQuery.data?.readingLists &&
                            readingListsQuery.data.readingLists.length !== 0 ? (
                                <HStack my="1.5rem">
                                    <Divider />
                                    <Text fontStyle="italic">OR</Text>
                                    <Divider />
                                </HStack>
                            ) : null}

                            {readingListsQuery?.isLoading ? (
                                <VStack w="100%">
                                    <Spinner size="md" thickness="2px" />
                                </VStack>
                            ) : (
                                <VStack w="100%">
                                    {readingListsQuery.data?.readingLists?.map(
                                        (list) => {
                                            const isSelected =
                                                selectedLists.includes(
                                                    list._id
                                                );

                                            return (
                                                <ReadingListCard
                                                    key={list._id}
                                                    isActive={isSelected}
                                                    isReadingLater={
                                                        list.isReadLater
                                                    }
                                                    actionItems={
                                                        isSelected ? (
                                                            <CheckIcon fontSize="larger" />
                                                        ) : null
                                                    }
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedLists(
                                                                selectedLists.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        list._id
                                                                )
                                                            );
                                                        } else {
                                                            setSelectedLists([
                                                                ...selectedLists,
                                                                list._id,
                                                            ]);
                                                        }
                                                    }}
                                                    readingList={list}
                                                />
                                            );
                                        }
                                    )}

                                    {readingListsQuery.data?.readingLists &&
                                    readingListsQuery.data.readingLists
                                        .length !== 0 ? (
                                        <Button
                                            w="100%"
                                            leftIcon={<AddIcon />}
                                            variant="solid"
                                            mt="1rem"
                                            disabled={
                                                selectedLists.length === 0 ||
                                                addArticleToReadingListMutation.isPending
                                            }
                                            onClick={async () => {
                                                await addArticleToReadingListMutation.mutateAsync(
                                                    {
                                                        articleId:
                                                            props.articleId,
                                                        readingListIds:
                                                            selectedLists,
                                                    }
                                                );
                                            }}
                                            isLoading={
                                                addArticleToReadingListMutation.isPending
                                            }
                                        >
                                            Save
                                        </Button>
                                    ) : null}
                                </VStack>
                            )}
                        </>
                    )}
                </VStack>
            </DrawerContent>
        </Drawer>
    );
}

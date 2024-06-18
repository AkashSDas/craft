import { Spinner, Text, VStack } from "@chakra-ui/react";
import { useGetAuthorReadingList } from "@app/hooks/reading-lists";
import { ReadingListCard } from "../reading-lists/ReadingListCard";

type Props = {
    authorId: string;
};

export function AuthorReadingListTabContent(props: Props) {
    const { authorId } = props;
    const { readingLists, isError, isLoading } =
        useGetAuthorReadingList(authorId);

    if (isLoading) {
        return (
            <VStack w="100%" gap="20px">
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    } else if (isError) {
        return (
            <VStack w="100%" gap="20px">
                <Text>There was an error</Text>
            </VStack>
        );
    }

    return (
        <VStack w="100%" gap="20px">
            {readingLists.map((list) => {
                return (
                    <ReadingListCard
                        readingList={list}
                        isReadingLater={false}
                        onClick={() => {}}
                        actionItems={null}
                    />
                );
            })}
        </VStack>
    );
}

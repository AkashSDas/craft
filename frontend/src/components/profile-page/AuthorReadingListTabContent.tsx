import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useGetAuthorReadingList } from "@app/hooks/reading-lists";
import { ReadingListCard } from "../reading-lists/ReadingListCard";
import Link from "next/link";
import { EmptyHeading } from "../shared/headings/EmptyHeading";

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
            {readingLists.length === 0 ? (
                <HStack
                    h={{ base: "200px", sm: "280px" }}
                    w="100%"
                    borderRadius="4px"
                    bgColor="black"
                    justifyContent="center"
                    gap={{ base: "1rem", sm: "2rem" }}
                    flexDirection={{ base: "column", sm: "row" }}
                >
                    <EmptyHeading />
                </HStack>
            ) : null}

            {readingLists.map((list) => {
                return (
                    <Link
                        href={`/authors/${authorId}/lists/${list._id}`}
                        style={{ width: "100%" }}
                    >
                        <ReadingListCard
                            readingList={list}
                            isReadingLater={false}
                            onClick={() => {}}
                            actionItems={null}
                        />
                    </Link>
                );
            })}
        </VStack>
    );
}

import { AuthorArticlesTabContent } from "@app/components/profile-page/AuthorArticlesTabContent";
import { ProfileHeader } from "@app/components/profile-page/ProfileHeader";
import { useGetAuthorPageProfile } from "@app/hooks/user";
import {
    Button,
    Divider,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";

function Wrapper({ children }: PropsWithChildren<unknown>) {
    return (
        <VStack mt="calc(70px + 4rem)" mx="1rem" mb="2rem">
            {children}
        </VStack>
    );
}

export default function AuthorProfilePage() {
    const [tab, setTab] = useState<"posts" | "readingLists">("posts");
    const { author, notFound, isLoading, isError, followersCount } =
        useGetAuthorPageProfile();

    if (isLoading) {
        return (
            <Wrapper>
                <Spinner size="xl" thickness="3px" />
            </Wrapper>
        );
    } else if (notFound || isError || !author) {
        return (
            <Wrapper>
                <Text>Author not found</Text>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <VStack maxW="700px" w="100%" gap="24px">
                <ProfileHeader
                    followersCount={followersCount ?? 0}
                    username={author.username}
                    profilePicURL={author.profilePic?.URL}
                    userId={author.userId}
                />

                <HStack gap="1rem" alignItems="start" w="100%">
                    <Button
                        variant="tab"
                        isActive={tab === "posts"}
                        onClick={() => setTab("posts")}
                    >
                        Articles
                    </Button>
                    <Button
                        variant="tab"
                        isActive={tab === "readingLists"}
                        onClick={() => setTab("readingLists")}
                    >
                        Reading Lists
                    </Button>
                </HStack>

                <Divider borderColor="gray.200" />

                {tab === "posts" ? (
                    <AuthorArticlesTabContent authorId={author.userId} />
                ) : null}
            </VStack>
        </Wrapper>
    );
}

import { ProfileHeader } from "@app/components/profile-page/ProfileHeader";
import { useGetAuthorPageProfile } from "@app/hooks/user";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

function Wrapper({ children }: PropsWithChildren<unknown>) {
    return (
        <VStack mt="calc(70px + 4rem)" mx="1rem" mb="2rem">
            {children}
        </VStack>
    );
}

export default function AuthorProfilePage() {
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
            </VStack>
        </Wrapper>
    );
}

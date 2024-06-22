import { useGetAuthorPageProfile } from "@app/hooks/user";
import {
    Button,
    Divider,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ProfileHeader } from "./ProfileHeader";
import Link from "next/link";
import { Layout } from "../shared/layout/Layout";

type Props = PropsWithChildren<{
    tab: "posts" | "readingLists";
    authorId?: string | null;
}>;

export function AuthorProfileLayout(props: Props) {
    const { tab, authorId, children } = props;
    const { author, notFound, isLoading, isError, followersCount } =
        useGetAuthorPageProfile();

    if (isLoading) {
        return (
            <Layout>
                <Spinner size="xl" thickness="3px" />
            </Layout>
        );
    } else if (notFound || isError || !author) {
        return (
            <Layout>
                <Text>Author not found</Text>
            </Layout>
        );
    }

    return (
        <Layout>
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
                    as={Link}
                    href={`/authors/${authorId}`}
                >
                    Articles
                </Button>
                <Button
                    variant="tab"
                    isActive={tab === "readingLists"}
                    as={Link}
                    href={`/authors/${authorId}/lists`}
                >
                    Reading Lists
                </Button>
            </HStack>

            <Divider borderColor="gray.200" />

            {children}
        </Layout>
    );
}

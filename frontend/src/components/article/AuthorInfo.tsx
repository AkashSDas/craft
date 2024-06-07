import { Article } from "@app/services/articles";
import { HStack, VStack, Button, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

type AuthorInfoProps = {
    author: Article["authorIds"][number];
    lastUpdatedAt: Article["lastUpdatedAt"];
};

export function AuthorInfo({ author, lastUpdatedAt }: AuthorInfoProps) {
    return (
        <HStack justifyContent="space-between" w="100%" mt="1rem">
            <HStack gap="12px">
                <Link href={`/authors/${author.userId}`}>
                    <Image
                        src={author.profilePic?.URL ?? "/mascot.png"}
                        alt={`Author ${author.username}`}
                        height={48}
                        width={48}
                        style={{
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "3px solid #d67844",
                        }}
                    />
                </Link>

                <VStack alignItems="start" gap="0px">
                    <Link href={`/authors/${author.userId}`}>
                        <Text fontWeight="600">{author.username}</Text>
                    </Link>

                    <Text fontSize="14px" color="gray">
                        {new Date(lastUpdatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </VStack>
            </HStack>

            <Button px="24px">Follow</Button>
        </HStack>
    );
}

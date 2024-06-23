import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
    alt: string;
    avatarURL?: string | null;
    username: string;
    userId: string;
};

export function UserChip(props: Props): React.JSX.Element {
    const { alt, avatarURL, username } = props;

    return (
        <HStack
            bgColor="gray.100"
            borderRadius="50px"
            py="2px"
            pl="3px"
            pr="12px"
            as={Link}
            href={`/authors/${props.userId}`}
        >
            <Image
                src={avatarURL ?? "/mascot.png"}
                alt={alt}
                height={24}
                width={24}
                style={{
                    height: "24px",
                    width: "24px",
                    border: "2px solid",
                    borderColor: "#B36439",
                    objectFit: "cover",
                    borderRadius: "50%",
                }}
            />

            <Text fontSize="13px" fontWeight="medium" color="gray.400">
                {username}
            </Text>
        </HStack>
    );
}

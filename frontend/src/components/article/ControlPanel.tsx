import { HStack, Button } from "@chakra-ui/react";
import Image from "next/image";

type Props = {
    likeCount: number;
};

export function ControlPanel(props: Props) {
    const { likeCount } = props;

    return (
        <HStack
            justifyContent="space-between"
            mt="1.5rem"
            py="8px"
            w="100%"
            borderY="1px solid"
            borderColor="gray.300"
        >
            <HStack>
                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/play.png"
                        alt="Play audio"
                        width={24}
                        height={24}
                    />
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/open-book.png"
                        alt="Get summary"
                        width={20}
                        height={20}
                    />
                </Button>
            </HStack>

            <HStack>
                <Button
                    h="38px"
                    variant="tab"
                    leftIcon={
                        <Image
                            src="/icons/love.png"
                            alt="Like"
                            width={20}
                            height={20}
                        />
                    }
                >
                    {likeCount}
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/chat.png"
                        alt="Comments"
                        width={20}
                        height={20}
                    />
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/bookmark.png"
                        alt="Save"
                        width={20}
                        height={20}
                    />
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/share.png"
                        alt="Share"
                        width={20}
                        height={20}
                    />
                </Button>
            </HStack>
        </HStack>
    );
}

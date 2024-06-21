import { VStack, Text } from "@chakra-ui/react";

export default function InternalServerErrorPage() {
    return (
        <VStack
            as="main"
            my={{ base: "2rem", sm: "4rem" }}
            mt={{ base: "calc(1rem + 70px)", sm: "calc(4rem + 70px)" }}
            w="100%"
            justifyContent="center"
        >
            <VStack
                maxWidth="700px"
                w="100%"
                px="1rem"
                alignItems="start"
                gap="16px"
            >
                <Text fontWeight="500" color="gray.600">
                    Internal Server Error
                </Text>
            </VStack>
        </VStack>
    );
}

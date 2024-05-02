import { SignupSection } from "@app/components/auth/signup-section";
import { VStack } from "@chakra-ui/react";

export default function Signup() {
    return (
        <VStack as="main" my="4rem" w="100%" justifyContent="center">
            <SignupSection />
        </VStack>
    );
}

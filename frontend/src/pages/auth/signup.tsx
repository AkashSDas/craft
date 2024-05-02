import { SignupSection } from "@app/components/auth/signup-section";
import { useCreateOAuthSession, useUser } from "@app/hooks/auth";
import { VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Signup() {
    useCreateOAuthSession();
    const { isSignupCompleted } = useUser();
    const router = useRouter();

    useEffect(
        function redirectUser() {
            if (isSignupCompleted) router.replace("/");
        },
        [isSignupCompleted]
    );

    return (
        <VStack
            as="main"
            my={{ base: "2rem", sm: "4rem" }}
            w="100%"
            justifyContent="center"
        >
            <SignupSection />
        </VStack>
    );
}

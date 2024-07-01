import { SignupSection } from "@app/components/auth/signup-section";
import { useCreateOAuthSession, useUser } from "@app/hooks/auth";
import { VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Signup() {
    useCreateOAuthSession();
    const { isSignupCompleted } = useUser();
    const router = useRouter();
    const { redirectUrl = "" } = router.query as { redirectUrl: string };
    useEffect(
        function redirectUser() {
            if (isSignupCompleted) router.replace(
                redirectUrl || "/"
            );
        },
        [isSignupCompleted]
    );

    return (
        <VStack
            as="main"
            my={{ base: "2rem", sm: "4rem" }}
            mt={{ base: "calc(1rem + 70px)", sm: "calc(4rem + 70px)" }}
            w="100%"
            justifyContent="center"
        >
            <SignupSection />
        </VStack>
    );
}

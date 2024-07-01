import { LoginSection } from "@app/components/auth/login-section/LoginSection";
import { useUser } from "@app/hooks/auth";
import { VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const toast = useToast();
    const { isSignupCompleted } = useUser();
    const { redirectUrl = "" } = router.query as { redirectUrl: string };
    useEffect(
        function checkInvalidOAuthSignup() {
            if (router.query?.info === "signup-invalid") {
                toast({
                    title: "Signup is incomplete",
                    description: "You're signup process is incomplete",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });

                router.push(`/auth/signup?${redirectUrl ?
                    `redirectUrl=${redirectUrl}`
                    : ""}`, undefined, { shallow: true });
            }
        },
        [router.query?.info]
    );

    useEffect(
        function redirectUser() {
            if (isSignupCompleted) {
                router.replace(
                    redirectUrl || "/"
                );
            }
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
            <LoginSection />
        </VStack>
    );
}

import { fontStyles } from "@app/utils/fonts";
import { Button, Heading, Show, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "../email-signup-form/EmailSignupForm";
import { useUser } from "@app/hooks/auth";
import { CancelOAuthSignup } from "../cancel-oauth-signup/CancelOAuthSignup";
import { CompleteOAuthSignupForm } from "../complete-oauth-signup-form/CompleteOAuthSignupForm";

function openSignupWindow(): void {
    window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-signup`,
        "_self"
    );
}

export function SignupSection(): React.JSX.Element {
    const { isLoggedIn } = useUser();

    return (
        <VStack
            maxWidth="480px"
            w="100%"
            bgColor={{ base: "transparent", sm: "gray.50" }}
            borderRadius="4px"
            px={{ base: "1rem", sm: "2rem" }}
            py={{ base: "1rem", sm: "2rem" }}
            border={{ base: "none", sm: "1px solid" }}
            borderColor={{ base: "transparent", sm: "gray.300" }}
            alignItems="start"
            gap="2rem"
        >
            <VStack gap="0.5rem" w="100%" alignItems="start">
                <SignupHeading />
                {!isLoggedIn ? <SignupMessage /> : null}
                <CancelOAuthSignup />
            </VStack>

            {!isLoggedIn ? (
                <Button
                    onClick={openSignupWindow}
                    variant="paleSolid"
                    aria-label="Signup with Google"
                    leftIcon={
                        <Image
                            src="/icons/google.png"
                            width={20}
                            height={20}
                            alt="Google signup button"
                        />
                    }
                    sx={{
                        h: "48px",
                        w: "100%",
                        fontSize: { base: "14px", sm: "16px" },
                        fontWeight: "semibold",
                    }}
                >
                    Signup with Google
                </Button>
            ) : null}

            {!isLoggedIn ? (
                <Text
                    fontSize={{ base: "13px", sm: "14px" }}
                    color="gray.600"
                    textAlign="center"
                    w="100%"
                >
                    <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                        OR
                    </Text>{" "}
                    create an account with email
                </Text>
            ) : null}

            {!isLoggedIn ? <EmailSignupForm /> : <CompleteOAuthSignupForm />}

            <Text
                fontSize={{ base: "13px", sm: "14px" }}
                color="gray.600"
                textAlign="center"
                w="100%"
            >
                Already have an account?{" "}
                <Text
                    as={Link}
                    href="/auth/login"
                    color="blue.700"
                    fontWeight="medium"
                    textDecor="underline"
                >
                    Login
                </Text>
            </Text>
        </VStack>
    );
}

function SignupHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                S
            </Text>
            <Text as="span" {...fontStyles["condensedMediumItalic"]}>
                i
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                g
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                n
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                u
            </Text>
            <Text as="span" {...fontStyles["expandedBold"]}>
                p
            </Text>
        </Heading>
    );
}

function SignupMessage() {
    return (
        <Text fontSize={{ base: "20px", sm: "24px" }}>
            <Text as="span" {...fontStyles["bold"]}>
                Home{" "}
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                for{" "}
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                an{" "}
            </Text>
            <Text
                as="span"
                {...fontStyles["serifSemiboldItalic"]}
                color="brand.600"
            >
                Artist{" "}
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                like{" "}
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                you
            </Text>
        </Text>
    );
}

import { fontStyles } from "@app/utils/fonts";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "../email-signup-form/EmailSignupForm";

function openSignupWindow(): void {
    window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-signup`,
        "_self"
    );
}

export function SignupSection(): React.JSX.Element {
    return (
        <VStack
            maxWidth="480px"
            w="100%"
            bgColor="gray.50"
            borderRadius="4px"
            p="2rem"
            border="1px solid"
            borderColor="gray.300"
            alignItems="start"
            gap="2rem"
        >
            <VStack gap="0.5rem" w="100%" alignItems="start">
                <SignupHeading />
                <SignupMessage />
            </VStack>

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
                    fontSize: "1rem",
                    fontWeight: "semibold",
                }}
            >
                Signup with Google
            </Button>

            <Text fontSize="14px" color="gray.600" textAlign="center" w="100%">
                <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                    OR
                </Text>{" "}
                create an account with email
            </Text>

            <EmailSignupForm />

            <Text fontSize="14px" color="gray.600" textAlign="center" w="100%">
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
        <Heading as="h1" fontSize="4rem">
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
        <Text fontSize="24px">
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

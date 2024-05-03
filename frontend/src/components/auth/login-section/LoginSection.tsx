import { useMagicLinkLogin } from "@app/hooks/auth";
import { emailLogin } from "@app/services/auth";
import { fontStyles } from "@app/utils/fonts";
import {
    Button,
    Heading,
    VStack,
    useToast,
    Text,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Spinner,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "zod";
import Image from "next/image";
import Link from "next/link";

function openLoginWindow(): void {
    window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`,
        "_self"
    );
}

export type EmailLoginInputs = {
    email: string;
};

const defaultValues: EmailLoginInputs = {
    email: "",
};

const schema = object({
    email: string().email({ message: "Invalid" }),
});

export function LoginSection() {
    useMagicLinkLogin();
    const toast = useToast();
    const [showEmailSentMsg, setShowEmailSentMsg] = useState(false);
    const form = useForm<EmailLoginInputs>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: emailLogin,
        async onSuccess(data, _variables, _context) {
            if (data.success) {
                setShowEmailSentMsg(true);
                toast({
                    title: "Success",
                    description: data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        onError(error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
    });

    const sendMagicLink = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

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
                <LoginHeading />
                <LoginMessage />
            </VStack>

            <Button
                onClick={openLoginWindow}
                variant="paleSolid"
                aria-label="Signup with Google"
                leftIcon={
                    <Image
                        src="/icons/google.png"
                        width={20}
                        height={20}
                        alt="Google login button"
                    />
                }
                sx={{
                    h: "48px",
                    w: "100%",
                    fontSize: { base: "14px", sm: "16px" },
                    fontWeight: "semibold",
                }}
            >
                Login with Google
            </Button>

            <Text
                fontSize={{ base: "13px", sm: "14px" }}
                color="gray.600"
                textAlign="center"
                w="100%"
                {...fontStyles["expandedBoldItalic"]}
            >
                OR
            </Text>

            {/* Login email form */}
            <VStack as="form" gap="1rem" w="100%" onSubmit={sendMagicLink}>
                <FormControl
                    isInvalid={form.formState.errors.email ? true : false}
                    mb="0.5rem"
                    isRequired
                >
                    <FormLabel fontSize="14px">Email</FormLabel>
                    <Input variant="outline" {...form.register("email")} />
                    <FormErrorMessage>
                        {form.formState.errors.email?.message}
                    </FormErrorMessage>
                </FormControl>

                <Button
                    variant="solid"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    sx={{
                        w: "100%",
                        h: "48px",
                        fontSize: { base: "14px", sm: "16px" },
                    }}
                >
                    {form.formState.isSubmitting ? (
                        <Spinner />
                    ) : showEmailSentMsg ? (
                        "Resend"
                    ) : (
                        "Login"
                    )}
                </Button>

                {showEmailSentMsg ? (
                    <Alert
                        status="success"
                        variant="subtle"
                        mt="2rem"
                        bgColor="blue.200"
                        color="blue.800"
                        fontSize="14px"
                        fontWeight="medium"
                        borderRadius="4px"
                    >
                        <AlertIcon color="blue.800" />
                        Login link is sent to your email. Please check your
                        inbox.
                    </Alert>
                ) : null}
            </VStack>

            <Text
                fontSize={{ base: "13px", sm: "14px" }}
                color="gray.600"
                textAlign="center"
                w="100%"
            >
                {`Don't`} have an account?{" "}
                <Text
                    as={Link}
                    href="/auth/signup"
                    color="blue.700"
                    fontWeight="medium"
                    textDecor="underline"
                >
                    Signup
                </Text>
            </Text>
        </VStack>
    );
}

function LoginHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                L
            </Text>
            <Text as="span" {...fontStyles["condensedMediumItalic"]}>
                o
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                g
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                i
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                n
            </Text>
        </Heading>
    );
}

function LoginMessage() {
    return (
        <Text fontSize={{ base: "20px", sm: "24px" }}>
            <Text as="span" {...fontStyles["bold"]}>
                Welcome{" "}
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                back{" "}
            </Text>
            <Text
                as="span"
                {...fontStyles["serifSemiboldItalic"]}
                color="brand.600"
            >
                Artist{" "}
            </Text>
        </Text>
    );
}

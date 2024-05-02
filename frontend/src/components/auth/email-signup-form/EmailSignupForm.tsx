import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Spinner,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useMutation } from "@tanstack/react-query";
import { emailSignup } from "@app/services/auth";
import { queryClient } from "@app/lib/react-query";
import { useRouter } from "next/router";

export type EmailSignupInputs = {
    email: string;
    username: string;
};

const defaultValues: EmailSignupInputs = {
    email: "",
    username: "",
};

const schema = object({
    email: string({ required_error: "Required" }).email({ message: "Invalid" }),
    username: string({ required_error: "Required" })
        .min(3, { message: "Too short" })
        .max(20, { message: "Too long" }),
});

export function EmailSignupForm() {
    const toast = useToast();
    const router = useRouter();
    const form = useForm<EmailSignupInputs>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: emailSignup,
        async onSuccess(data, _variables, _context) {
            if (data.success) {
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                form.reset();
                await router.push("/");

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

    const createAccount = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    return (
        <VStack as="form" gap="1rem" w="100%" onSubmit={createAccount}>
            <FormControl
                isInvalid={form.formState.errors.username ? true : false}
                mb="0.5rem"
            >
                <FormLabel fontSize="14px">Username</FormLabel>
                <Input variant="outline" {...form.register("username")} />
                <FormErrorMessage>
                    {form.formState.errors.username?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl
                isInvalid={form.formState.errors.email ? true : false}
                mb="0.5rem"
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
                sx={{ w: "100%", h: "48px" }}
            >
                {form.formState.isSubmitting ? (
                    <Spinner />
                ) : (
                    "Signup with email"
                )}
            </Button>
        </VStack>
    );
}

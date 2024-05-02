import { useUser } from "@app/hooks/auth";
import { queryClient } from "@app/lib/react-query";
import { completeOAuthSignup } from "@app/services/auth";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { object, string } from "zod";

export type CompleteOAuthInputs = {
    email: string;
    username: string;
};

const schema = object({
    email: string().email({ message: "Invalid" }),
    username: string()
        .min(3, { message: "Too short" })
        .max(20, { message: "Too long" }),
});

export function CompleteOAuthSignupForm() {
    const toast = useToast();
    const { user } = useUser();
    const router = useRouter();
    const form = useForm<CompleteOAuthInputs>({
        defaultValues: { username: "", email: user?.email },
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (payload: CompleteOAuthInputs) => {
            return completeOAuthSignup(payload);
        },
        onSuccess: async (data, _variables, _context) => {
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

    const signup = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    return (
        <VStack as="form" gap="1rem" w="100%" onSubmit={signup}>
            <FormControl
                isInvalid={form.formState.errors.username ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Username</FormLabel>
                <Input variant="outline" {...form.register("username")} />
                <FormErrorMessage variant="solid">
                    {form.formState.errors.username?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl
                isInvalid={form.formState.errors.email ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Email</FormLabel>
                <Input variant="outline" {...form.register("email")} disabled />
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
                {form.formState.isSubmitting ? <Spinner /> : "Complete Signup"}
            </Button>
        </VStack>
    );
}

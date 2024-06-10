import { addComment } from "@app/services/comments";
import { AddIcon } from "@chakra-ui/icons";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    articleId: string;
    closeDrawer: () => void;
};

type CommentInputs = {
    text: string;
};

const defaultValues: CommentInputs = {
    text: "",
};

const schema = z.object({
    text: z.string().min(3, { message: "Too short" }),
});

export function CommentInput(props: Props): React.JSX.Element {
    const toast = useToast();
    const form = useForm<CommentInputs>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (text: string) => addComment(props.articleId, text),
        async onSuccess(data, _variables, _context) {
            if (data.success) {
                form.reset();
                props.closeDrawer();

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

    const createComment = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data.text)
    );

    return (
        <HStack
            as="form"
            gap="1rem"
            w="100%"
            onSubmit={createComment}
            px="1rem"
            maxW="700px"
            alignItems="center"
        >
            <FormControl
                isInvalid={form.formState.errors.text ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Comment</FormLabel>

                <InputGroup>
                    <Input
                        _focusVisible={{ outline: "none" }}
                        sx={{
                            "&::placeholder": {
                                color: "gray.300",
                            },
                            _focus: {
                                border: "1.5px solid",
                                borderColor: "black",
                            },
                        }}
                        variant="outline"
                        {...form.register("text")}
                    />

                    <InputRightElement>
                        <IconButton
                            variant="solid"
                            type="submit"
                            aria-label="Add comment"
                            disabled={form.formState.isSubmitting}
                            style={{
                                width: "44px !important",
                                height: "44px !important",
                            }}
                            sx={{
                                fontSize: { base: "14px", sm: "16px" },
                            }}
                            isLoading={form.formState.isSubmitting}
                        >
                            <AddIcon />
                        </IconButton>
                    </InputRightElement>
                </InputGroup>

                <FormErrorMessage variant="solid">
                    {form.formState.errors.text?.message}
                </FormErrorMessage>
            </FormControl>
        </HStack>
    );
}

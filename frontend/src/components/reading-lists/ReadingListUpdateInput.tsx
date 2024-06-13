import { useReadingListsManager } from "@app/hooks/reading-lists";
import {
    createReadingList,
    updateReadingList,
} from "@app/services/reading-lists";
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    Spinner,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ReadingListInputs = {
    name: string;
    isPrivate: boolean;
};

const schema = z.object({
    name: z.string().min(3, { message: "Too short" }),
    isPrivate: z.boolean().default(false).optional(),
});

export type UpdateReadingListInputsType = z.infer<typeof schema>;

type Props = {
    readingListId: string;
    closeDrawer: () => void;
    defaultValues: UpdateReadingListInputsType;
};

export function ReadingListUpdateInput(props: Props): React.JSX.Element {
    const toast = useToast();
    const form = useForm<ReadingListInputs>({
        defaultValues: props.defaultValues,
        resolver: zodResolver(schema),
    });
    const { readingListsQuery } = useReadingListsManager();

    const mutation = useMutation({
        mutationFn: (payload: UpdateReadingListInputsType) => {
            return updateReadingList(props.readingListId, payload);
        },
        async onSuccess(data, _variables, _context) {
            if (data.success) {
                form.reset();
                props.closeDrawer();
                readingListsQuery.refetch();
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

    const updateList = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    return (
        <VStack
            as="form"
            gap="1rem"
            w="100%"
            onSubmit={updateList}
            px="1rem"
            maxW="700px"
            alignItems="start"
        >
            <Heading size="md" mb="1rem">
                Update reading list
            </Heading>

            <FormControl
                isInvalid={form.formState.errors.name ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Name</FormLabel>

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
                        {...form.register("name")}
                    />
                </InputGroup>

                <FormErrorMessage variant="solid">
                    {form.formState.errors.name?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl
                isInvalid={form.formState.errors.isPrivate ? true : false}
                mb="0.5rem"
            >
                <FormLabel fontSize="14px">Is private?</FormLabel>

                <Checkbox
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
                    type="checkbox"
                    {...form.register("isPrivate")}
                />

                <FormErrorMessage variant="solid">
                    {form.formState.errors.isPrivate?.message}
                </FormErrorMessage>
            </FormControl>

            <Divider mb="1rem" />

            <HStack
                w="100%"
                gap={{ base: "24px", sm: "16px" }}
                flexDirection={{ base: "column-reverse", sm: "row" }}
            >
                <Button
                    variant="paleSolid"
                    type="button"
                    disabled={form.formState.isSubmitting}
                    style={{
                        width: "44px !important",
                        height: "44px !important",
                    }}
                    sx={{
                        w: "100%",
                        fontSize: { base: "14px", sm: "16px" },
                    }}
                    onClick={props.closeDrawer}
                >
                    Cancel
                </Button>

                <Button
                    variant="solid"
                    type="submit"
                    aria-label="Add comment"
                    disabled={form.formState.isSubmitting}
                    style={{
                        width: "44px !important",
                        height: "44px !important",
                    }}
                    sx={{
                        w: "100%",
                        fontSize: { base: "14px", sm: "16px" },
                    }}
                    isLoading={form.formState.isSubmitting}
                >
                    Save
                </Button>
            </HStack>
        </VStack>
    );
}

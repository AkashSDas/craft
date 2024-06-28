import { Layout } from "@app/components/shared/layout/Layout";
import { useUser } from "@app/hooks/auth";
import { updateProfile } from "@app/services/user";
import { fontStyles } from "@app/utils/fonts";
import { EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    IconButton,
    Input,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type ProfileInputs = {
    username: string;
    email: string;
};

const defaultValues: ProfileInputs = {
    username: "",
    email: "",
};

const schema = z.object({
    username: z.string().min(3, { message: "Too short" }).optional(),
    email: z.string().email({ message: "Invalid" }).optional(),
});

export default function SettingsPage() {
    const router = useRouter();
    const toast = useToast();
    const { user, isLoggedIn, status } = useUser();
    const form = useForm<ProfileInputs>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const imgRef = useRef<HTMLInputElement | null>(null);
    const [profilePic, setProfilePic] = useState<File | null>(null);

    const update = useMutation({
        mutationFn: (payload: ProfileInputs) => {
            const formData = new FormData();
            formData.append("username", payload.username);
            formData.append("email", payload.email);
            formData.append("profilePic", profilePic as any);
            return updateProfile(formData);
        },
        onSuccess(data, variables, context) {
            if (data.success) {
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
        onError(error, variables, context) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
    });

    const formSubmit = form.handleSubmit(
        async (data) => await update.mutateAsync(data)
    );

    const isEmailDisabled = useMemo(
        function () {
            if (
                user &&
                "oAuthProviders" in user &&
                Array.isArray(user.oAuthProviders)
            ) {
                // user logged in with oauth provider can't change email
                return user.oAuthProviders.length > 0;
            }

            return false;
        },
        [user]
    );

    useEffect(
        function initUpdateProfile() {
            if (status === "success") {
                if (!isLoggedIn) {
                    router.replace("/login");
                } else {
                    form.setValue("username", user?.username ?? "");
                    form.setValue("email", user?.email ?? "");
                }
            }
        },
        [status]
    );

    return (
        <Layout>
            <SettingsHeading />
            <Divider borderColor="gray.200" />

            {status !== "success" ? (
                <HStack w="100%" my="4rem" justifyContent="center">
                    <Spinner thickness="4px" size="xl" />
                </HStack>
            ) : (
                <VStack
                    as="form"
                    gap="1rem"
                    w="100%"
                    onSubmit={formSubmit}
                    alignItems="start"
                >
                    <Heading
                        variant="h2"
                        fontFamily={fontStyles.condensedMedium.fontFamily}
                    >
                        Profile
                    </Heading>

                    <Box pos="relative">
                        <Image
                            src={
                                (profilePic &&
                                    URL.createObjectURL(profilePic)) ??
                                user?.profilePic?.URL ??
                                "/mascot.png"
                            }
                            alt="Profile Picture"
                            width={200}
                            height={200}
                            style={{
                                height: "200px",
                                width: "200px",
                                cursor: "pointer",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "2px solid black",
                            }}
                            onClick={() => imgRef.current?.click()}
                        />

                        <IconButton
                            aria-label="Edit profile pic"
                            variant="paleSolid"
                            h="38px"
                            pos="absolute"
                            bottom="6px"
                            right="6px"
                            pointerEvents="none"
                        >
                            <EditIcon fontSize="16px" />
                        </IconButton>

                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={imgRef}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setProfilePic(e.target.files[0]!);
                                }
                            }}
                        />
                    </Box>

                    <FormControl
                        isInvalid={form.formState.errors.email ? true : false}
                        mb="0.5rem"
                        isRequired
                    >
                        <FormLabel fontSize="14px">Username</FormLabel>
                        <Input
                            variant="outline"
                            {...form.register("username")}
                        />
                        <FormErrorMessage>
                            {form.formState.errors.username?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isInvalid={form.formState.errors.email ? true : false}
                        mb="0.5rem"
                        isRequired
                    >
                        <FormLabel fontSize="14px">Email</FormLabel>
                        <Input
                            variant="outline"
                            {...form.register("email")}
                            disabled={isEmailDisabled}
                        />
                        <FormErrorMessage>
                            {form.formState.errors.email?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Button
                        variant="solid"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        sx={{
                            mt: "1rem",
                            w: "100%",
                            maxW: "200px",
                            h: "44px",
                            fontSize: { base: "14px", sm: "16px" },
                        }}
                    >
                        {form.formState.isSubmitting ? <Spinner /> : "Save"}
                    </Button>
                </VStack>
            )}
        </Layout>
    );
}

function SettingsHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                Se
            </Text>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                t
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                t
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                i
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                ng
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                s
            </Text>
        </Heading>
    );
}

import {
    Show,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    VStack,
    HStack,
    Divider,
    Spinner,
    useDisclosure,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";
import Image from "next/image";
import { useRef } from "react";
import { useLogout, useUser } from "@app/hooks/auth";
import { useCreateArticle } from "@app/hooks/editor";

function ForwardIcon(): React.JSX.Element {
    return (
        <Image
            src={"/icons/direction-right.png"}
            alt="Move forward"
            height={28}
            width={28}
        />
    );
}

export function MobileNav() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    const { isPending, logoutUser } = useLogout();
    const { isLoggedIn } = useUser();
    const { mutation } = useCreateArticle();

    return (
        <Show below="sm">
            <Button
                ref={menuBtnRef}
                variant="navPrimary"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                px="8px"
                onClick={onOpen}
            >
                <Image
                    src={isOpen ? "/icons/remove.png" : "/icons/menu.png"}
                    alt={isOpen ? "Close menu" : "Open menu"}
                    height={28}
                    width={28}
                />
            </Button>

            {/* Mobile menu drawer */}

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="md"
                finalFocusRef={menuBtnRef}
            >
                <DrawerOverlay />

                <DrawerContent>
                    <DrawerCloseButton
                        as={Button}
                        variant="paleSolid"
                        sx={{
                            _active: { bgColor: "white" },
                            _hover: { bgColor: "white" },
                        }}
                    />

                    <DrawerHeader>
                        <Logo variant="light" />
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack gap="0.5rem">
                            {isLoggedIn ? (
                                <>
                                    <HStack
                                        w="100%"
                                        px="8px"
                                        py="12px"
                                        justifyContent="space-between"
                                        borderRadius="4px"
                                        cursor="pointer"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{ bgColor: "gray.200" }}
                                        onClick={onClose}
                                    >
                                        <Text
                                            fontWeight="600"
                                            fontSize="24px"
                                            color="gray.700"
                                        >
                                            Profile
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <HStack
                                        w="100%"
                                        px="8px"
                                        py="12px"
                                        justifyContent="space-between"
                                        borderRadius="4px"
                                        cursor="pointer"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{ bgColor: "gray.200" }}
                                        onClick={onClose}
                                    >
                                        <Text
                                            fontWeight="600"
                                            fontSize="24px"
                                            color="gray.700"
                                        >
                                            Library
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <HStack
                                        w="100%"
                                        px="8px"
                                        py="12px"
                                        justifyContent="space-between"
                                        borderRadius="4px"
                                        cursor="pointer"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{ bgColor: "gray.200" }}
                                        onClick={onClose}
                                        as={Link}
                                        href="/me"
                                    >
                                        <Text
                                            fontWeight="600"
                                            fontSize="24px"
                                            color="gray.700"
                                        >
                                            Studio
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <HStack
                                        w="100%"
                                        variant="none"
                                        h="60px"
                                        px="8px"
                                        py="12px"
                                        justifyContent="space-between"
                                        borderRadius="4px"
                                        cursor="pointer"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{ bgColor: "gray.200" }}
                                        as={Button}
                                        onClick={() => {
                                            onClose();
                                            mutation.mutateAsync();
                                        }}
                                        disabled={mutation.isPending}
                                        leftIcon={
                                            mutation.isPending ? (
                                                <Spinner size="md" />
                                            ) : undefined
                                        }
                                    >
                                        <Text
                                            flexGrow={1}
                                            fontWeight="600"
                                            fontSize="24px"
                                            color="gray.700"
                                            textAlign="start"
                                        >
                                            Write
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <Button
                                        variant="paleSolid"
                                        onClick={logoutUser}
                                        disabled={isPending}
                                        isDisabled={isPending}
                                        fontSize="1rem"
                                        w="100%"
                                        mt="1rem"
                                    >
                                        {isPending ? (
                                            <Spinner size="xs" />
                                        ) : (
                                            "Logout"
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <HStack
                                        w="100%"
                                        px="8px"
                                        py="12px"
                                        justifyContent="space-between"
                                        borderRadius="4px"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{
                                            bgColor: "gray.200",
                                        }}
                                        as={Link}
                                        href="/auth/login"
                                        onClick={onClose}
                                    >
                                        <Text
                                            fontWeight="600"
                                            fontSize="24px"
                                            color="gray.700"
                                        >
                                            Login
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <Divider />

                                    <Button
                                        variant="solid"
                                        w="100%"
                                        mt="1rem"
                                        as={Link}
                                        href="/auth/signup"
                                        onClick={onClose}
                                        fontSize="1rem"
                                    >
                                        Signup
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Show>
    );
}

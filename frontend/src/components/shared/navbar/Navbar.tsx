import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Show,
    Spinner,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";
import Image from "next/image";
import { useRef } from "react";
import { useLogout, useUser } from "@app/hooks/auth";

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

export function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    const { isPending, logoutUser } = useLogout();
    const { isLoggedIn } = useUser();

    return (
        <HStack
            as="nav"
            justifyContent="space-between"
            px="2rem"
            bgColor="gray.900"
            h="70px"
        >
            <Link href="/">
                <Logo variant="dark" />
            </Link>

            <HStack gap="24px">
                {/* Large screen nav */}

                <Show above="sm">
                    <Button variant="navItem">Write</Button>

                    {isLoggedIn ? (
                        <Button
                            variant="navItem"
                            onClick={logoutUser}
                            disabled={isPending}
                            isDisabled={isPending}
                        >
                            {isPending ? <Spinner size="xs" /> : "Logout"}
                        </Button>
                    ) : (
                        <>
                            <Button
                                as={Link}
                                href="/auth/login"
                                variant="navItem"
                            >
                                Login
                            </Button>

                            <Button
                                as={Link}
                                href="/auth/signup"
                                variant="navPrimary"
                            >
                                Get Started
                            </Button>
                        </>
                    )}
                </Show>

                {/* Mobile menu */}

                <Show below="sm">
                    <Button
                        ref={menuBtnRef}
                        variant="navPrimary"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        px="8px"
                        onClick={onOpen}
                    >
                        <Image
                            src={
                                isOpen ? "/icons/remove.png" : "/icons/menu.png"
                            }
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
                                            About
                                        </Text>
                                        <ForwardIcon />
                                    </HStack>

                                    <Divider />

                                    {isLoggedIn ? (
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
            </HStack>
        </HStack>
    );
}

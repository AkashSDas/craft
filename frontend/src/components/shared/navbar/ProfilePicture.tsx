import { useUser, useLogout } from "@app/hooks/auth";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Spinner,
    Box,
} from "@chakra-ui/react";
import Image from "next/image";

export function ProfilePicture() {
    const { user } = useUser();
    const { isPending, logoutUser } = useLogout();

    return (
        <Menu>
            <MenuButton
                as={Box}
                w="40px"
                h="40px"
                borderRadius="full"
                overflow="hidden"
                border="2px solid"
                borderColor="brand.700"
                objectFit="cover"
                pos="relative"
                cursor="pointer"
                transition="background-color .3s ease-out, transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                transformOrigin="center"
                _hover={{ bgColor: "gray.50", transform: "scale(0.96)" }}
                _active={{ bgColor: "gray.100", transform: "scale(0.9)" }}
            >
                <Image
                    src={user?.profilePic?.URL ?? "/mascot.png"}
                    alt={user?.username ?? "Profile Picture"}
                    fill
                />
            </MenuButton>

            <MenuList
                bgColor="white"
                border="1.5px solid"
                mt="12px"
                p="8px"
                borderColor="gray.300"
                borderRadius="4px"
                boxShadow="0px 4px 8px rgba(57, 57, 57, 0.25)"
            >
                <MenuItem
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.96)" }}
                >
                    Profile
                </MenuItem>

                <MenuItem
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.96)" }}
                >
                    Library
                </MenuItem>

                <Divider my="12px" />
                <MenuItem
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.96)" }}
                    onClick={logoutUser}
                    disabled={isPending}
                    isDisabled={isPending}
                >
                    {isPending ? <Spinner size="sm" mx="auto" /> : "Logout"}
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

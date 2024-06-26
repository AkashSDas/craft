import { useUser, useLogout } from "@app/hooks/auth";
import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Spinner,
    Box,
    MenuIcon,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export function ProfilePicture() {
    const { user } = useUser();
    const { isPending, logoutUser } = useLogout();

    return (
        <Menu>
            <MenuButton
                as={Box}
                w="40px"
                h="40px"
                minH="40px"
                minW="40px"
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
                    style={{ objectFit: "cover" }}
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
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    as={Link}
                    href={`/authors/${user?.userId}`}
                    icon={
                        <Image
                            src="/icons/user.png"
                            alt="Profile"
                            width={18}
                            height={18}
                        />
                    }
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
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    as={Link}
                    href="/library"
                    icon={
                        <Image
                            src="/icons/library.png"
                            alt="Profile"
                            width={18}
                            height={18}
                        />
                    }
                >
                    Library
                </MenuItem>

                <MenuItem
                    as={Link}
                    href="/me"
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    icon={
                        <Image
                            src="/icons/pen.png"
                            alt="Profile"
                            width={18}
                            height={18}
                        />
                    }
                >
                    Studio
                </MenuItem>

                <MenuItem
                    as={Link}
                    href="/me/analytics"
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    icon={
                        <Image
                            src="/icons/chart.png"
                            alt="Analytics"
                            width={18}
                            height={18}
                        />
                    }
                >
                    Analytics
                </MenuItem>

                <MenuItem
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    as={Link}
                    href="/settings"
                    icon={
                        <Image
                            src="/icons/cog.png"
                            alt="Settings"
                            width={18}
                            height={18}
                        />
                    }
                >
                    Settings
                </MenuItem>

                <Divider my="12px" />
                <MenuItem
                    h="36px"
                    borderRadius="4px"
                    transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                    transformOrigin="center"
                    fontWeight="500"
                    _hover={{ bgColor: "gray.100" }}
                    _active={{ bgColor: "gray.200", transform: "scale(0.98)" }}
                    onClick={logoutUser}
                    disabled={isPending}
                    isDisabled={isPending}
                    icon={
                        <Image
                            src="/icons/logout.png"
                            alt="Profile"
                            width={18}
                            height={18}
                        />
                    }
                >
                    {isPending ? <Spinner size="sm" mx="auto" /> : "Logout"}
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

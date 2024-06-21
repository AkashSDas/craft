import { Button, HStack, IconButton, Show, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";
import { useUser } from "@app/hooks/auth";
import { MobileNav } from "./MobileNav";
import { useCreateArticle } from "@app/hooks/editor";
import { ProfilePicture } from "./ProfilePicture";
import Image from "next/image";
import { SearchButton } from "../../search/SearchButton";

export function Navbar() {
    const { isLoggedIn } = useUser();

    return (
        <HStack
            as="nav"
            justifyContent="space-between"
            px="2rem"
            bgColor="gray.900"
            pos="fixed"
            top="0"
            width="100%"
            zIndex="100"
            h="70px"
            gap="1rem"
        >
            <Link href="/">
                <Logo variant="dark" />
            </Link>

            <HStack gap="24px">
                <SearchButton />

                <Show above="sm">
                    {isLoggedIn ? <LoggedInItems /> : <LoggOutItems />}
                </Show>

                <MobileNav />
            </HStack>
        </HStack>
    );
}

function LoggedInItems() {
    const { mutation } = useCreateArticle();

    return (
        <>
            <Button
                variant="navItem"
                disabled={mutation.isPending}
                minW="fit-content"
                onClick={() => mutation.mutateAsync()}
                leftIcon={
                    mutation.isPending ? <Spinner size="xs" /> : undefined
                }
            >
                Write
            </Button>

            <ProfilePicture />
        </>
    );
}

function LoggOutItems() {
    return (
        <>
            <>
                <Button
                    as={Link}
                    href="/auth/login"
                    variant="navItem"
                    minW="fit-content"
                >
                    Login
                </Button>

                <Button
                    as={Link}
                    href="/auth/signup"
                    variant="navPrimary"
                    minW="fit-content"
                >
                    Get Started
                </Button>
            </>
        </>
    );
}

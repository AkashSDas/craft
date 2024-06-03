import { Button, HStack, Show, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";
import { useUser } from "@app/hooks/auth";
import { MobileNav } from "./MobileNav";
import { useCreateArticle } from "@app/hooks/editor";
import { ProfilePicture } from "./ProfilePicture";

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
        >
            <Link href="/">
                <Logo variant="dark" />
            </Link>

            <HStack gap="24px">
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
                <Button as={Link} href="/auth/login" variant="navItem">
                    Login
                </Button>

                <Button as={Link} href="/auth/signup" variant="navPrimary">
                    Get Started
                </Button>
            </>
        </>
    );
}

import { Button, HStack, Show, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";
import { useLogout, useUser } from "@app/hooks/auth";
import { MobileNav } from "./MobileNav";

export function Navbar() {
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
                <Show above="sm">
                    {isLoggedIn ? <LoggedInItems /> : <LoggOutItems />}
                </Show>

                <MobileNav />
            </HStack>
        </HStack>
    );
}

function LoggedInItems() {
    const { isPending, logoutUser } = useLogout();

    return (
        <>
            <Button variant="navItem" as={Link} href="/editor">
                Write
            </Button>

            <Button
                variant="navItem"
                onClick={logoutUser}
                disabled={isPending}
                isDisabled={isPending}
            >
                {isPending ? <Spinner size="xs" /> : "Logout"}
            </Button>
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

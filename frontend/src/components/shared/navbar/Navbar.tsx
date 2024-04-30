import { Button, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { Logo } from "../logo";

export function Navbar() {
    return (
        <HStack
            justifyContent="space-between"
            px="2rem"
            bgColor="gray.900"
            h="70px"
        >
            <Link href="/">
                <Logo variant="dark" />
            </Link>

            <HStack gap="24px">
                <Button variant="navItem">Write</Button>

                <Button as={Link} href="/auth/login" variant="navItem">
                    Login
                </Button>

                <Button as={Link} href="/auth/signup" variant="navPrimary">
                    Get Started
                </Button>
            </HStack>
        </HStack>
    );
}

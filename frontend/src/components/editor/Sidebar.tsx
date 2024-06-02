import { Stack } from "@chakra-ui/react";

export function Sidebar() {
    return (
        <Stack
            w="300px"
            borderRight="1px solid"
            borderColor="gray.200"
            pos="fixed"
            height={{ base: "calc(100vh - 64px)", md: "calc(100vh - 80px)" }}
            display={{ base: "none", md: "block" }}
        >
            Sidebar
        </Stack>
    );
}

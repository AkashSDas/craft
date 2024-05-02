import { useUser } from "@app/hooks/auth";
import { queryClient } from "@app/lib/react-query";
import { cancelOAuthSignup } from "@app/services/auth";
import { Button, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

export function CancelOAuthSignup(): React.JSX.Element | null {
    const { isLoggedIn, user } = useUser();
    const toast = useToast();

    const mutation = useMutation({
        mutationFn: cancelOAuthSignup,
        async onSuccess(data, _variables, _context) {
            if (!data.success) {
                toast({
                    title: "Failed to cancel oauth signup",
                    description: data.message,
                    status: "error",
                    isClosable: true,
                });
            } else {
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                localStorage.removeItem("accessToken");

                toast({
                    title: "Oauth signup is cancelled",
                    description: data.message,
                    status: "success",
                    isClosable: true,
                });
            }
        },
    });

    const cancel = async () => await mutation.mutateAsync();

    if (!isLoggedIn) {
        return null;
    } else {
        return (
            <Text fontSize="14px">
                Your Google account{" "}
                <Text as="span" fontWeight="bold">
                    {user?.email}{" "}
                </Text>
                is be connected to your new Craft account. Wrong identity?{" "}
                <Button
                    display="inline-block"
                    h="28px"
                    variant="paleSolid"
                    ml="0.5rem"
                    fontSize="14px"
                >
                    Start over
                </Button>
            </Text>
        );
    }
}

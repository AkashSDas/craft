import { Navbar } from "@app/components/shared/navbar";
import { theme } from "@app/lib/chakra";
import { queryClient } from "@app/lib/react-query";
import { store } from "@app/store";
import "@app/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ReduxProvider store={store}>
                    <Navbar />
                    <Component {...pageProps} />
                </ReduxProvider>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

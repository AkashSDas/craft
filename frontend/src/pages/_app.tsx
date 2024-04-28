import { queryClient } from "@app/lib/react-query";
import { store } from "@app/store";
import "@app/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ReduxProvider store={store}>
                <Component {...pageProps} />
            </ReduxProvider>
        </QueryClientProvider>
    );
}

import { useRecentSearch } from "@app/hooks/search";
import {
    useQuery,
    useMediaQuery,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, FormEvent, useEffect } from "react";

export function SearchInput() {
    const query = useQuery({ above: "md" });
    const [isAboveSm] = useMediaQuery(query, {
        ssr: true,
        fallback: false,
    });
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const { addHistory } = useRecentSearch();

    function handleSubmit(e: FormEvent<HTMLDivElement>) {
        e.preventDefault();
        router.push({
            pathname: "/search",
            query: { q: searchText },
        });

        if (searchText) {
            addHistory(searchText);
        }
    }

    useEffect(
        function () {
            if (router.isReady) {
                setSearchText((router.query.q as string) ?? "");
            }
        },
        [router.isReady]
    );

    if (!isAboveSm) {
        return (
            <InputGroup as="form" onSubmit={handleSubmit}>
                <Input
                    placeholder="Search"
                    variant="outline"
                    _focusVisible={{ outline: "none" }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{
                        h: "48px",
                        borderColor: "gray.600",
                        fontWeight: "500",
                        "&::placeholder": {
                            fontWeight: "500",
                        },
                        _focus: {
                            border: "1.5px solid",
                            borderColor: "gray.400",
                        },
                        _hover: {
                            border: "1.5px solid",
                            borderColor: "gray.500",
                        },
                    }}
                />

                <InputRightElement maxH="48px">
                    <IconButton
                        type="submit"
                        aria-label="Search"
                        variant="tab"
                        sx={{
                            maxH: "48px !important",
                        }}
                    >
                        <Image
                            src="/icons/search.png"
                            alt="Search"
                            width={16}
                            height={16}
                        />
                    </IconButton>
                </InputRightElement>
            </InputGroup>
        );
    } else {
        return null;
    }
}

import { useRecentSearch } from "@app/hooks/search";
import {
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useMediaQuery,
    useQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export function SearchButton() {
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

    if (isAboveSm) {
        return (
            <InputGroup as="form" onSubmit={handleSubmit}>
                <Input
                    placeholder="Search"
                    variant="outline"
                    _focusVisible={{ outline: "none" }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{
                        h: "38px",
                        borderColor: "gray.600",
                        color: "gray.200",
                        fontWeight: "500",
                        "&::placeholder": {
                            color: "gray.500",
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

                <InputRightElement maxH="38px">
                    <IconButton
                        type="submit"
                        aria-label="Search"
                        variant="navItem"
                        sx={{
                            maxH: "30px !important",
                        }}
                    >
                        <Image
                            src="/icons/search-light.png"
                            alt="Search"
                            width={16}
                            height={16}
                        />
                    </IconButton>
                </InputRightElement>
            </InputGroup>
        );
    } else {
        return (
            <IconButton
                as={Link}
                href="/search"
                aria-label="Search"
                variant="navItem"
            >
                <Image
                    src="/icons/search-light.png"
                    alt="Search"
                    width={20}
                    height={20}
                />
            </IconButton>
        );
    }
}

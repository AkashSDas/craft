import { useRecentSearch } from "@app/hooks/search";
import { DeleteIcon } from "@chakra-ui/icons";
import {
    Box,
    Divider,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    VStack,
    useMediaQuery,
    useOutsideClick,
    useQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";

export function SearchButton() {
    const query = useQuery({ above: "md" });
    const [isAboveSm] = useMediaQuery(query, {
        ssr: true,
        fallback: false,
    });
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const { addHistory, history, removeHistory } = useRecentSearch();
    const [showHistory, setShowHistory] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick({
        ref: ref,
        handler: () => setShowHistory(false),
    });

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
            <Box pos="relative" ref={ref}>
                <InputGroup as="form" onSubmit={handleSubmit}>
                    <Input
                        placeholder="Search"
                        variant="outline"
                        _focusVisible={{ outline: "none" }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => setShowHistory(true)}
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
                            sx={{ maxH: "30px !important" }}
                            onClick={() => {
                                setShowHistory(false);
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

                {showHistory && history.length > 0 ? (
                    <VStack
                        w="400px"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="4px"
                        bgColor="gray.50"
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        pos="absolute"
                        top="44px"
                        right="0"
                        py="8px"
                        px="8px"
                        alignItems="start"
                    >
                        <Text
                            fontSize="14px"
                            color="gray.500"
                            fontWeight="500"
                            pl="8px"
                        >
                            Recent Searches
                        </Text>

                        <Divider borderColor="gray.200" />

                        {history.map((item) => {
                            const params = new URLSearchParams({ q: item });

                            return (
                                <HStack
                                    w="100%"
                                    key={item}
                                    h="40px"
                                    borderRadius="4px"
                                    as={Link}
                                    onClick={() => {
                                        setSearchText(item);
                                        setShowHistory(false);
                                    }}
                                    href={`/search?${params.toString()}`}
                                    _hover={{ bgColor: "gray.100" }}
                                    transition="transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7)"
                                    transformOrigin="center"
                                    _active={{
                                        bgColor: "gray.200",
                                        transform: "scale(0.98)",
                                    }}
                                    px="12px"
                                >
                                    <Text
                                        flexGrow={1}
                                        fontSize="14px"
                                        color="gray.600"
                                        fontWeight="500"
                                        noOfLines={1}
                                    >
                                        {item}
                                    </Text>

                                    <IconButton
                                        aria-label="Delete"
                                        variant="tab"
                                        h="28px"
                                        transition="all 0.2s ease-in-out"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeHistory(item);
                                            setShowHistory(false);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </HStack>
                            );
                        })}
                    </VStack>
                ) : null}
            </Box>
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

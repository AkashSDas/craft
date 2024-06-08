import { useAppDispatch } from "@app/hooks/store";
import { addBlock } from "@app/store/editor/slice";
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Kbd,
    Stack,
    Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const blocks = [
    {
        type: "paragraph" as const,
        image: "/block-images/paragraph.png",
        label: "Paragraph",
        description: "Plain text",
    },
    {
        type: "heading" as const,
        additionalData: {
            variant: "h1",
        },
        image: "/block-images/h1.png",
        label: "Heading 1",
        description: "Big section heading",
    },
    {
        type: "heading" as const,
        additionalData: {
            variant: "h2",
        },
        image: "/block-images/h2.png",
        label: "Heading 2",
        description: "Medium section heading",
    },
    {
        type: "heading" as const,
        additionalData: {
            variant: "h3",
        },
        image: "/block-images/h3.png",
        label: "Heading 3",
        description: "Small section heading",
    },
    {
        type: "quote" as const,
        image: "/block-images/quote.png",
        label: "Quote",
        description: "Capture a quote",
    },
    {
        type: "divider" as const,
        image: "/block-images/divider.png",
        label: "Divider",
        description: "Visually divide block",
    },
    {
        type: "image" as const,
        image: "/block-images/image.png",
        label: "Image",
        description: "Upload or embed with a link",
    },
];

export function Sidebar() {
    const [input, setInput] = useState<string>("");
    const [matchingBlocks, setMatchingBlocks] = useState(blocks);
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(
        null
    );
    const dispatch = useAppDispatch();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        setActiveBlockIndex(null);

        if (e.target.value === "") {
            setMatchingBlocks(blocks);
            return;
        }
        setMatchingBlocks(
            blocks.filter(function (block) {
                return block.type.includes(e.target.value.toLowerCase());
            })
        );
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "b") {
                event.preventDefault();
                inputRef.current?.focus();
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveBlockIndex((prevIndex) => {
                    if (prevIndex === null) {
                        return matchingBlocks.length - 1;
                    }
                    return Math.max(prevIndex - 1, 0);
                });
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveBlockIndex((prevIndex) => {
                    console.log("inn", prevIndex);
                    if (prevIndex === null) {
                        return 0;
                    }
                    return Math.min(prevIndex + 1, matchingBlocks.length - 1);
                });
            }

            if (event.key === "Enter") {
                event.preventDefault();
                if (activeBlockIndex === null) {
                    return;
                }
                const activeBlock = matchingBlocks[activeBlockIndex];
                dispatch(
                    addBlock({
                        blockType: activeBlock.type,
                        additionalData: activeBlock.additionalData,
                    })
                );
            }

            if (event.key === "Escape") {
                event.preventDefault();
                setActiveBlockIndex(null);
                setInput("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [matchingBlocks.length, activeBlockIndex]);

    return (
        <Stack
            w="300px"
            borderRight="1px solid"
            borderColor="gray.200"
            pos="fixed"
            px="8px"
            py="1rem"
            height={{ base: "calc(100vh - 64px)", md: "calc(100vh - 80px)" }}
            display={{ base: "none", md: "block" }}
        >
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Image
                        src="/icons/block.png"
                        alt="search"
                        width={20}
                        height={20}
                    />
                </InputLeftElement>

                <Input
                    _focusVisible={{ outline: "none" }}
                    sx={{
                        "&::placeholder": {
                            color: "gray.300",
                        },
                        _focus: {
                            border: "1.5px solid",
                            borderColor: "black",
                        },
                    }}
                    variant="outline"
                    placeholder="Search blocks"
                    value={input}
                    onChange={handleChange}
                    ref={inputRef}
                />

                <InputRightElement pointerEvents="none">
                    <Kbd
                        style={{
                            backgroundColor: "#f8f9fa",
                            color: "#495057",
                            padding: "2px 4px",
                            borderRadius: "3px",
                            border: "1px solid #ced4da",
                            fontSize: "0.875em",
                            fontFamily:
                                'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
                        }}
                    >
                        ⌘+b
                    </Kbd>
                </InputRightElement>
            </InputGroup>

            <Stack mt="1rem">
                {matchingBlocks.map(function (block, index) {
                    return (
                        <Stack
                            key={block.label}
                            flexDir="row"
                            px="4px"
                            h="50px"
                            cursor="pointer"
                            transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                            transformOrigin="center"
                            alignItems="center"
                            borderRadius="4px"
                            gap="12px"
                            bgColor={
                                index === activeBlockIndex
                                    ? "gray.100"
                                    : undefined
                            }
                            _hover={{
                                bgColor: "gray.100",
                            }}
                            _active={{
                                bgColor: "gray.200",
                                transform: "scale(0.96)",
                            }}
                            onClick={() => {
                                dispatch(
                                    addBlock({
                                        blockType: block.type,
                                        additionalData: block.additionalData,
                                    })
                                );
                            }}
                        >
                            <Image
                                src={block.image}
                                alt={block.label}
                                width={35}
                                height={33}
                                style={{
                                    objectFit: "cover",
                                    height: "33px",
                                    width: "35px",
                                }}
                            />

                            <Stack w="100%" gap="2px">
                                <Text fontSize="14px" fontWeight="500">
                                    {block.label}
                                </Text>
                                <Text fontSize="12px" color="gray">
                                    {block.description}
                                </Text>
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
}

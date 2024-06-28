import { useUser } from "@app/hooks/auth";
import { getLifetimeAnalytics } from "@app/services/views";
import { OVERALL_MONTHS } from "@app/utils/datetime";
import { fontStyles } from "@app/utils/fonts";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    VStack,
    HStack,
    Heading,
    Divider,
    Menu,
    MenuButton,
    Button,
    MenuList,
    MenuItem,
    Text,
    Skeleton,
    Box,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FILTER_PROPERTY = {
    LAST_UPDATED_AT: "lastUpdatedAt",
    VIEW_COUNT: "viewCount",
    READ_COUNT: "readCount",
} as const;

const ORDER = {
    ASC: "ASC",
    DESC: "DESC",
} as const;

const MENU_LABELS = {
    Latest: {
        order: ORDER.DESC,
        filter: FILTER_PROPERTY.LAST_UPDATED_AT,
    },
    Oldest: {
        order: ORDER.ASC,
        filter: FILTER_PROPERTY.LAST_UPDATED_AT,
    },
    "Most viewed": {
        order: ORDER.DESC,
        filter: FILTER_PROPERTY.VIEW_COUNT,
    },
    "Least viewed": {
        order: ORDER.ASC,
        filter: FILTER_PROPERTY.VIEW_COUNT,
    },
    "Most read": {
        order: ORDER.DESC,
        filter: FILTER_PROPERTY.READ_COUNT,
    },
    "Least read": {
        order: ORDER.ASC,
        filter: FILTER_PROPERTY.READ_COUNT,
    },
};

export function LifetimeAnalytics() {
    const { user, isLoggedIn } = useUser();
    const [selectedMenu, setSelectedMenu] = useState(() => {
        return Object.keys(MENU_LABELS)[0] as keyof typeof MENU_LABELS;
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: [user?._id, "lifetimeAnalytics", selectedMenu],
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        enabled: isLoggedIn,
        async queryFn() {
            const config = MENU_LABELS[selectedMenu];
            return getLifetimeAnalytics(config.filter, config.order);
        },
    });

    return (
        <VStack gap="24px" w="100%">
            <HStack
                w="100%"
                justifyContent="space-between"
                gap={{ base: "18px", sm: "12px" }}
                flexDirection={{ base: "column", sm: "row" }}
            >
                <VStack flexGrow={1} w="100%" alignItems="start">
                    <Heading
                        variant="h2"
                        fontFamily={fontStyles.condensedMedium.fontFamily}
                    >
                        Lifetime
                    </Heading>
                    <HStack
                        divider={
                            <Divider
                                borderColor="gray.300"
                                orientation="vertical"
                                w={"1px"}
                                h="16px"
                            />
                        }
                    >
                        <Text color="gray.500" fontSize="14px">
                            Till today
                        </Text>
                        <Text color="gray.500" fontSize="14px">
                            Updated daily
                        </Text>
                    </HStack>
                </VStack>

                <Menu>
                    <MenuButton
                        as={Button}
                        variant="paleSolid"
                        w={{ base: "100%", sm: "190px" }}
                        rightIcon={<ChevronDownIcon fontSize="20px" />}
                    >
                        {selectedMenu}
                    </MenuButton>

                    <MenuList
                        bgColor="white"
                        border="1.5px solid"
                        py="8px"
                        px="0px"
                        borderColor="gray.300"
                        borderRadius="4px"
                        boxShadow="0px 4px 8px rgba(57, 57, 57, 0.25)"
                    >
                        {(
                            Object.keys(
                                MENU_LABELS
                            ) as (keyof typeof MENU_LABELS)[]
                        ).map((opt, idx) => {
                            if (
                                (idx + 1) % 2 === 0 &&
                                Object.keys(MENU_LABELS).length - 1 !== idx
                            ) {
                                return (
                                    <>
                                        <MenuItem
                                            key={opt}
                                            onClick={() => setSelectedMenu(opt)}
                                            h="36px"
                                            borderRadius="4px"
                                            fontSize="14px"
                                            color="gray.400"
                                            fontWeight="medium"
                                            _hover={{ bgColor: "gray.100" }}
                                            _active={{ bgColor: "gray.200" }}
                                        >
                                            {opt}
                                        </MenuItem>

                                        <Divider
                                            borderColor="gray.200"
                                            my="12px"
                                        />
                                    </>
                                );
                            } else {
                                return (
                                    <MenuItem
                                        key={opt}
                                        onClick={() => setSelectedMenu(opt)}
                                        h="36px"
                                        borderRadius="4px"
                                        fontSize="14px"
                                        color="gray.400"
                                        fontWeight="medium"
                                        _hover={{ bgColor: "gray.100" }}
                                        _active={{ bgColor: "gray.200" }}
                                    >
                                        {opt}
                                    </MenuItem>
                                );
                            }
                        })}
                    </MenuList>
                </Menu>
            </HStack>

            <VStack
                gap="12px"
                w="100%"
                divider={<Divider borderColor="gray.200" />}
            >
                {isLoading || isError
                    ? [1, 2, 3].map((item) => {
                          return (
                              <Skeleton
                                  key={item.toString()}
                                  minH="102px"
                                  w="100%"
                                  borderRadius="4px"
                                  startColor="gray.100"
                                  endColor="gray.300"
                                  fadeDuration={0.5}
                              />
                          );
                      })
                    : data?.views?.map((view) => {
                          const date = new Date(view.lastUpdatedAt);
                          const dateStr = `${date.getDate()} ${
                              OVERALL_MONTHS[date.getMonth() - 1]
                          }, ${date.getFullYear()}`;

                          return (
                              <HStack
                                  key={view._id}
                                  py="4px"
                                  gap={{ base: "4px", sm: "12px" }}
                                  w="100%"
                                  flexDirection={{ base: "column", md: "row" }}
                                  alignItems={{ base: "start", md: "center" }}
                              >
                                  <Text
                                      fontSize="14px"
                                      color="gray.400"
                                      fontWeight="medium"
                                      minW="fit-content"
                                  >
                                      {dateStr}
                                  </Text>

                                  <Box
                                      pos="relative"
                                      height={{
                                          base: "180px",
                                          sm: "240px",
                                          md: "94px",
                                      }}
                                      w="100%"
                                      maxW={{ base: "100%", md: "160px" }}
                                  >
                                      <Image
                                          src={
                                              view.coverImage.URL ??
                                              "/default-cover.png"
                                          }
                                          alt="Cover image"
                                          layout="fill"
                                          style={{
                                              objectFit: "cover",
                                              borderRadius: "4px",
                                          }}
                                      />
                                  </Box>

                                  <VStack w="100%" alignItems="start">
                                      <Text
                                          fontWeight="700"
                                          fontSize="1rem"
                                          noOfLines={2}
                                          flexGrow={1}
                                      >
                                          {view.headline}
                                      </Text>

                                      <HStack
                                          gap="4px"
                                          px="8px"
                                          py="4px"
                                          border="1.5px solid"
                                          borderColor="gray.200"
                                          borderRadius="4px"
                                          divider={
                                              <Divider
                                                  orientation="vertical"
                                                  h="20px"
                                                  w="1px"
                                                  borderColor="gray.200"
                                              />
                                          }
                                      >
                                          <HStack h="28px">
                                              <Image
                                                  src="/icons/love-solid.png"
                                                  alt="Likes"
                                                  width={20}
                                                  height={20}
                                              />

                                              <Text
                                                  fontSize="14px"
                                                  color="gray.400"
                                                  fontWeight="medium"
                                              >
                                                  {view.likeCount}
                                              </Text>
                                          </HStack>

                                          <HStack h="28px" gap="4px">
                                              <Image
                                                  src="/icons/chat.png"
                                                  alt="Comments"
                                                  width={20}
                                                  height={20}
                                              />

                                              <Text
                                                  fontSize="14px"
                                                  color="gray.400"
                                                  fontWeight="medium"
                                              >
                                                  {view.commentCount}
                                              </Text>
                                          </HStack>

                                          <HStack h="28px" gap="4px">
                                              <Image
                                                  src="/icons/watch.png"
                                                  alt="Read time"
                                                  width={20}
                                                  height={20}
                                              />

                                              <Text
                                                  fontSize="14px"
                                                  color="gray.400"
                                                  fontWeight="medium"
                                              >
                                                  {Math.round(
                                                      view.totalReadTimeInMs /
                                                          (1000 * 60)
                                                  )}{" "}
                                                  min
                                              </Text>
                                          </HStack>

                                          <HStack
                                              h="28px"
                                              gap="4px"
                                              as={Link}
                                              href={`/articles/${view.articleId}`}
                                              target="_blank"
                                          >
                                              <Text
                                                  fontSize="14px"
                                                  color="gray.400"
                                                  fontWeight="medium"
                                              >
                                                  View article
                                              </Text>

                                              <Image
                                                  src="/icons/maximize.png"
                                                  alt="Read time"
                                                  width={20}
                                                  height={20}
                                              />
                                          </HStack>
                                      </HStack>
                                  </VStack>

                                  <HStack
                                      gap="4px"
                                      px="8px"
                                      py="4px"
                                      border="1.5px solid"
                                      borderColor="gray.200"
                                      borderRadius="4px"
                                      divider={
                                          <Divider
                                              orientation="vertical"
                                              h="20px"
                                              w="1px"
                                              borderColor="gray.200"
                                          />
                                      }
                                  >
                                      <HStack h="28px" gap="4px">
                                          <Text
                                              fontFamily={
                                                  fontStyles["expandedBold"]
                                                      .fontFamily
                                              }
                                              fontWeight="700"
                                              fontSize="18px"
                                          >
                                              {view.totalViews}
                                          </Text>

                                          <Text
                                              fontFamily={
                                                  fontStyles["condensedMedium"]
                                                      .fontFamily
                                              }
                                              fontWeight="500"
                                              fontSize="14px"
                                          >
                                              Views
                                          </Text>
                                      </HStack>

                                      <HStack h="28px" gap="4px">
                                          <Text
                                              fontFamily={
                                                  fontStyles["expandedBold"]
                                                      .fontFamily
                                              }
                                              fontWeight="700"
                                              fontSize="18px"
                                          >
                                              {view.totalReads}
                                          </Text>

                                          <Text
                                              fontFamily={
                                                  fontStyles["condensedMedium"]
                                                      .fontFamily
                                              }
                                              fontWeight="500"
                                              fontSize="14px"
                                          >
                                              Reads
                                          </Text>
                                      </HStack>
                                  </HStack>
                              </HStack>
                          );
                      })}
            </VStack>
        </VStack>
    );
}

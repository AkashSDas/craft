import { useUser } from "@app/hooks/auth";
import { getUserArticlesMonthlyViews } from "@app/services/views";
import { OVERALL_MONTHS, getMonthsInRange } from "@app/utils/datetime";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Skeleton,
    Text,
    VStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
    MonthlyAnalyticsChart,
    MonthlyAnalyticsChartProps,
} from "./MonthlyAnalyticsChart";
import { isPending } from "@reduxjs/toolkit";
import { monaSansCondensed, monasansExpanded } from "@app/lib/chakra";
import { fontStyles } from "@app/utils/fonts";

export function MonthlyAnalytics() {
    const isSm = useBreakpointValue({ base: true, sm: false });
    const { user, isLoggedIn } = useUser();
    const months = useMemo(
        function () {
            return getMonthsInRange(
                user?.createdAt ?? new Date().toISOString()
            );
        },
        [user?.createdAt]
    );
    const [selectedMonth, setSelectedMonth] = useState(months[0]);

    const [startDate, endDate, month, year]: [Date, Date, string, number] =
        useMemo(
            function () {
                const [month, year] = selectedMonth.split(" ");
                const startDate = new Date(
                    Number(year),
                    OVERALL_MONTHS.indexOf(month),
                    1
                );
                let endDate = new Date(
                    Number(year),
                    OVERALL_MONTHS.indexOf(month) + 1,
                    0
                );

                if (startDate.getMonth() === new Date().getMonth()) {
                    endDate = new Date();
                }

                const monthText = OVERALL_MONTHS[startDate.getMonth()];
                const yearText = startDate.getFullYear();

                return [startDate, endDate, monthText, yearText];
            },
            [selectedMonth]
        );

    const monthRangeText = useMemo(
        /**
         * Selected month format is "Apr 2024"
         * return 1 Apr - 30 Apr 2024
         */
        function () {
            return `${startDate.getDate()} ${month} - ${endDate.getDate()} ${month} ${year}`;
        },
        [selectedMonth]
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: [user?._id, "monthlyAnalyitcs", selectedMonth],
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
        enabled: isLoggedIn,
        async queryFn() {
            return getUserArticlesMonthlyViews(
                startDate.getTime(),
                endDate.getTime()
            );
        },
    });

    const views: MonthlyAnalyticsChartProps["views"] = useMemo(
        function () {
            const map =
                data?.views?.map((view) => {
                    const [year, month, day] = view.date.split("-");

                    return {
                        totalViews: view.totalViews,
                        totalReads: view.totalReads,
                        day: `${day} ${
                            OVERALL_MONTHS[Number(month) - 1]
                        }, ${year}`,
                    };
                }) ?? [];

            // Padding missing days with 0 reads and 0 views
            const numOfDays = endDate.getDate() - startDate.getDate() + 1;

            const results: MonthlyAnalyticsChartProps["views"] = [];
            for (let i = 0; i < numOfDays; i++) {
                const date = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + i
                );

                const day = `${date.getDate()} ${
                    OVERALL_MONTHS[date.getMonth()]
                }, ${date.getFullYear()}`;

                const existing = map.find((view) => view.day === day);
                if (existing) {
                    results.push(existing);
                } else {
                    results.push({
                        day,
                        totalReads: 0,
                        totalViews: 0,
                    });
                }
            }

            return results;
        },
        [data, isPending, isError, selectedMonth]
    );

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
                        Monthly
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
                            {monthRangeText}
                        </Text>
                        <Text color="gray.500" fontSize="14px">
                            Updated hourly
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
                        {selectedMonth}
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
                        {months.map((month) => (
                            <MenuItem
                                key={month}
                                onClick={() => setSelectedMonth(month)}
                                h="36px"
                                borderRadius="4px"
                                fontSize="14px"
                                color="gray.400"
                                fontWeight="medium"
                                _hover={{ bgColor: "gray.100" }}
                                _active={{ bgColor: "gray.200" }}
                            >
                                {month}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </HStack>

            <HStack
                gap="24px"
                w="100%"
                justifyContent="start"
                alignItems="start"
            >
                <Skeleton
                    h="46px"
                    minW="36px"
                    borderRadius="4px"
                    isLoaded={!(isLoading || isError)}
                    startColor="gray.100"
                    endColor="gray.300"
                    fadeDuration={0.5}
                >
                    <VStack gap="0px">
                        <Text
                            fontFamily={monasansExpanded.style.fontFamily}
                            fontSize="24px"
                            fontWeight="800"
                        >
                            {views.reduce(
                                (acc, curr) => acc + curr.totalViews,
                                0
                            )}
                        </Text>

                        <Text
                            fontFamily={monaSansCondensed.style.fontFamily}
                            fontSize="14px"
                            fontWeight="500"
                        >
                            Views
                        </Text>
                    </VStack>
                </Skeleton>

                <Skeleton
                    h="46px"
                    minW="36px"
                    borderRadius="4px"
                    isLoaded={!(isLoading || isError)}
                    startColor="gray.100"
                    endColor="gray.300"
                    fadeDuration={0.5}
                >
                    <VStack gap="0px">
                        <Text
                            fontFamily={monasansExpanded.style.fontFamily}
                            fontSize="24px"
                            fontWeight="800"
                        >
                            {views.reduce(
                                (acc, curr) => acc + curr.totalReads,
                                0
                            )}
                        </Text>

                        <Text
                            fontFamily={monaSansCondensed.style.fontFamily}
                            fontSize="14px"
                            fontWeight="500"
                        >
                            Reads
                        </Text>
                    </VStack>
                </Skeleton>
            </HStack>

            <Skeleton
                h={isSm ? "200px" : "300px"}
                w="100%"
                borderRadius="4px"
                isLoaded={!(isLoading || isError)}
                startColor="gray.100"
                endColor="gray.300"
                fadeDuration={0.5}
            >
                <Box
                    w="100%"
                    h={isSm ? "200px" : "295px"}
                    p="4px"
                    borderRadius="4px"
                    border="2px solid"
                    borderColor="gray.900"
                >
                    <MonthlyAnalyticsChart
                        views={views}
                        numOfDays={endDate.getDate() - startDate.getDate() + 1}
                    />
                </Box>
            </Skeleton>
        </VStack>
    );
}

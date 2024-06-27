import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import {
    AreaChart,
    ResponsiveContainer,
    XAxis,
    CartesianGrid,
    YAxis,
    Tooltip,
    Area,
    Legend,
} from "recharts";

export type MonthlyAnalyticsChartProps = {
    views: { day: string; totalReads: number; totalViews: number }[];
    numOfDays: number;
};

export function MonthlyAnalyticsChart(props: MonthlyAnalyticsChartProps) {
    return (
        <ResponsiveContainer>
            <AreaChart data={props.views} margin={{ top: 12, right: 32 }}>
                <CartesianGrid
                    horizontal={false}
                    stroke="#000"
                    strokeWidth={1.2}
                    strokeOpacity={0.1}
                />

                <XAxis
                    dataKey="day"
                    style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "gray",
                    }}
                    tickFormatter={(v, idx) => {
                        if (idx % 5 !== 0) return "";
                        if (typeof v !== "string") return v;
                        const result = v.split(",")[0]?.trim();
                        return result ?? v;
                    }}
                />
                <YAxis
                    type="number"
                    domain={[0, "dataMax + 5"]}
                    style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "gray",
                    }}
                />

                <Tooltip
                    content={renderTooltip}
                    cursor={{
                        stroke: "#000",
                        strokeWidth: 1.2,
                    }}
                />

                <Legend content={renderLegend} align="right" />

                <Area
                    isAnimationActive={false}
                    type="linear"
                    dataKey="totalViews"
                    stackId="2"
                    stroke="rgb(187, 219, 186)"
                    strokeWidth="2px"
                    fill="rgb(232, 243, 232)"
                    fillOpacity={1}
                    dot={<TotalViewsDot />}
                    activeDot={{
                        stroke: "rgba(0,0,0,0.2)",
                        strokeWidth: 8,
                        r: 4,
                        fill: "rgb(0,0,0)",
                        fillOpacity: 1,
                    }}
                />

                <Area
                    isAnimationActive={false}
                    type="linear"
                    dataKey="totalReads"
                    stackId="1"
                    stroke="rgb(21, 109, 18)"
                    strokeWidth="2px"
                    fill="rgb(132, 192, 130)"
                    fillOpacity={1}
                    dot={<TotalReadsDot />}
                    activeDot={{
                        stroke: "rgba(0,0,0,0.2)",
                        strokeWidth: 8,
                        r: 4,
                        fill: "rgb(0,0,0)",
                        fillOpacity: 1,
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    function renderTooltip(content: Record<string, any>) {
        const { payload, label } = content;
        const views = payload[0]?.value ?? 0;
        const totalRead = payload[1]?.value ?? 0;

        return (
            <VStack
                alignItems="start"
                gap="8px"
                bgColor="white"
                border="1.5px solid"
                py="8px"
                px="12px"
                borderColor="gray.300"
                borderRadius="4px"
                boxShadow="0px 4px 8px rgba(57, 57, 57, 0.25)"
                w="140px"
            >
                <Text fontSize="13px" color="gray.400" fontWeight="500">
                    {label}
                </Text>

                <VStack alignItems="start" w="100%" gap="4px">
                    <HStack justifyContent="space-between" w="100%">
                        <HStack>
                            <Box
                                w="8px"
                                h="8px"
                                borderRadius="50%"
                                border="1.5px solid rgb(187, 219, 186)"
                                bgColor="rgb(232, 243, 232)"
                            />

                            <Text
                                fontSize="15px"
                                color="gray.600"
                                fontWeight="500"
                            >
                                Views
                            </Text>
                        </HStack>

                        <Text fontSize="15px" color="gray.600" fontWeight="500">
                            {views}
                        </Text>
                    </HStack>

                    <HStack justifyContent="space-between" w="100%">
                        <HStack>
                            <Box
                                w="8px"
                                h="8px"
                                borderRadius="50%"
                                border="1.5px solid rgb(21, 109, 18)"
                                bgColor="rgb(132, 192, 130)"
                            />

                            <Text
                                fontSize="15px"
                                color="gray.600"
                                fontWeight="500"
                            >
                                Reads
                            </Text>
                        </HStack>

                        <Text fontSize="15px" color="gray.600" fontWeight="500">
                            {totalRead}
                        </Text>
                    </HStack>
                </VStack>
            </VStack>
        );
    }

    function renderLegend(content: Record<string, any>) {
        return (
            <VStack alignItems="end" gap="8px" py="8px" px="12px" w="100%">
                <HStack alignItems="flex-end" gap="12px">
                    <HStack justifyContent="start" w="100%">
                        <HStack>
                            <Box
                                w="8px"
                                h="8px"
                                borderRadius="50%"
                                border="1.5px solid rgb(187, 219, 186)"
                                bgColor="rgb(232, 243, 232)"
                            />

                            <Text fontSize="13px" color="gray.400">
                                Views
                            </Text>
                        </HStack>
                    </HStack>

                    <HStack justifyContent="space-between" w="100%">
                        <HStack justifyContent="start" w="100%">
                            <Box
                                w="8px"
                                h="8px"
                                borderRadius="50%"
                                border="1.5px solid rgb(21, 109, 18)"
                                bgColor="rgb(132, 192, 130)"
                            />

                            <Text fontSize="13px" color="gray.400">
                                Reads
                            </Text>
                        </HStack>
                    </HStack>
                </HStack>
            </VStack>
        );
    }
}

function TotalViewsDot(props: Record<string, any>) {
    const { cx, cy, payload, dataKey } = props;
    const value = payload[dataKey] ?? 0;
    if (value === 0) return;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={3.5}
            stroke="rgb(187, 219, 186)"
            strokeWidth={2}
            fill="rgb(232, 243, 232)"
            fillOpacity={1}
        />
    );
}

function TotalReadsDot(props: Record<string, any>) {
    const { cx, cy, payload, dataKey } = props;
    const value = payload[dataKey] ?? 0;
    if (value === 0) return;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={3.5}
            stroke="rgb(21, 109, 18)"
            strokeWidth={2}
            fill="rgb(132, 192, 130)"
            fillOpacity={1}
        />
    );
}

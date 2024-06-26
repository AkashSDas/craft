import { useUser } from "@app/hooks/auth";
import { OVERALL_MONTHS, getMonthsInRange } from "@app/utils/datetime";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    HStack,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

export function MonthlyAnalytics() {
    const { user } = useUser();
    const months = useMemo(
        function () {
            return getMonthsInRange(
                user?.createdAt ?? new Date().toISOString()
            );
        },
        [user?.createdAt]
    );
    const [selectedMonth, setSelectedMonth] = useState(months[0]);
    const monthRangeText = useMemo(
        /**
         * Selected month format is "Apr 2024"
         * return 1 Apr - 30 Apr 2024
         */
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
            console.log({ startDate, endDate, selectedMonth });
            if (startDate.getMonth() === new Date().getMonth()) {
                endDate = new Date();
            }

            return `${startDate.getDate()} ${month} - ${endDate.getDate()} ${month} ${year}`;
        },
        [selectedMonth]
    );

    return (
        <VStack gap="24px" w="100%">
            <HStack w="100%" justifyContent="space-between" gap="12px">
                <VStack flexGrow={1} w="100%" alignItems="start">
                    <Heading variant="h2">Monthly</Heading>
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
                        w="190px"
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
        </VStack>
    );
}

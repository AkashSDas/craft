export const OVERALL_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function getMonthsInRange(startDateStr: string) {
    const startDate = new Date(startDateStr);
    const currentDate = new Date();

    const months = [];
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (current <= currentDate) {
        const monthYear = current.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
        months.push(monthYear);
        current.setMonth(current.getMonth() + 1);
    }

    return months.reverse();
}

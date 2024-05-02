import {
    monasansExpanded,
    monaSansCondensed,
    sourceSerif4,
} from "@app/lib/chakra";

export const fontStyles = {
    expandedBoldItalic: {
        fontFamily: monasansExpanded.style.fontFamily,
        fontWeight: "800",
        fontStyle: "italic",
    },
    expandedBold: {
        fontFamily: monasansExpanded.style.fontFamily,
        fontWeight: "800",
    },
    condensedMedium: {
        fontFamily: monaSansCondensed.style.fontFamily,
        fontWeight: "500",
    },
    condensedMediumItalic: {
        fontFamily: monaSansCondensed.style.fontFamily,
        fontWeight: "500",
        fontStyle: "italic",
    },
    bold: {
        fontWeight: "700",
    },
    expandedLight: {
        fontFamily: monasansExpanded.style.fontFamily,
        fontWeight: "300",
    },
    expandedLightItalic: {
        fontFamily: monasansExpanded.style.fontFamily,
        fontWeight: "300",
        fontStyle: "italic",
    },
    serif: {
        fontFamily: sourceSerif4.style.fontFamily,
    },
    serifSemiboldItalic: {
        fontFamily: sourceSerif4.style.fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
    },
};

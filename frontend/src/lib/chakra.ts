import { StyleFunctionProps, extendTheme, keyframes } from "@chakra-ui/react";
import localFont from "next/font/local";
import { Source_Serif_4, Ubuntu_Mono } from "next/font/google";

// ==================================================
// TYPOGRAPHY
// ==================================================

// const fontTypes = [
//     ["Black", "900", "normal"],
//     ["BlackItalic", "900", "italic"],
//     ["Bold", "700", "normal"],
//     ["BoldItalic", "700", "italic"],
//     ["ExtraBold", "800", "normal"],
//     ["ExtraBoldItalic", "800", "italic"],
//     ["ExtraLight", "200", "normal"],
//     ["ExtraLightItalic", "200", "italic"],
//     ["Italic", "400", "italic"],
//     ["Light", "300", "normal"],
//     ["LightItalic", "300", "italic"],
//     ["Medium", "500", "normal"],
//     ["MediumItalic", "500", "italic"],
//     ["Regular", "400", "normal"],
//     ["SemiBold", "600", "normal"],
//     ["SemiBoldItalic", "600", "italic"],
// ];

export const monaSansCondensed = localFont({
    src: [
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-BlackItalic.ttf",
            weight: "900",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-ExtraLightItalic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-condensed/MonaSansCondensed-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
    ],
    fallback: ["sans-serif"],
});

export const monasans = localFont({
    src: [
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-BlackItalic.ttf",
            weight: "900",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-ExtraLightItalic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans/MonaSans-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
    ],
    fallback: ["sans-serif"],
});

export const monasansExpanded = localFont({
    src: [
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-BlackItalic.ttf",
            weight: "900",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-ExtraLightItalic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts-ttf/monasans-expanded/MonaSansExpanded-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
    ],
    fallback: ["sans-serif"],
});

export const sourceSerif4 = Source_Serif_4({
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
    fallback: ["serif"],
    subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({
    weight: ["400", "700"],
    style: ["normal"],
    fallback: ["monospace"],
    subsets: ["latin"],
});

// ==================================================
// BUTTON ANIMATION
// ==================================================

const maxTop = "7.5px"; // on hover init
const top = "6.5px"; // on hover end
const down = "3.5px"; // on active

const btnHoverEffect = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100);
        transform: translateY(0px);
    }
    50% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100), 0px ${maxTop} 0px 0px rgba(0, 0, 0, 100);
        transform: translateY(-4px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100), 0px ${top} 0px 0px rgba(0, 0, 0, 100);
        transform: translateY(-1.25px);
    }
`;

const btnActiveEffect = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100), 0px ${top} 0px 0px rgba(0, 0, 0, 100);
        transform: translateY(-1.25px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100), 0px ${down} 0px 0px rgba(0, 0, 0, 100);
        transform: translateY(-0.75px);
    }
`;

const btnLeaveEffect = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100), 0px ${top} 0px 0px rgba(0, 0, 0, 100);
        transform: translateY(-1.25px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 100);
        transform: translateY(0px);
    }
`;

const navPrimaryBtnLightColor = "white";
const navPrimaryBtnDarkColor = "#080606";

const navPrimaryBtnHoverEffectLight = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor};
        transform: translateY(0px);
    }
    50% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor}, 5px ${maxTop} 0px 0px ${navPrimaryBtnLightColor};
        transform: translateY(-4px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor}, 3px ${top} 0px 0px ${navPrimaryBtnLightColor};
        transform: translateY(-1.25px);
    }
`;

const navPrimaryBtnActiveEffectLight = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor}, 3px ${top} 0px 0px ${navPrimaryBtnLightColor};
        transform: translateY(-1.25px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor}, 2px ${down} 0px 0px ${navPrimaryBtnLightColor};
        transform: translateY(-0.75px);
    }
`;

const navPrimaryBtnLeaveEffectLight = keyframes`
    0% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor}, 3px ${top} 0px 0px ${navPrimaryBtnLightColor};
        transform: translateY(-1.25px);
    }
    100% {
        box-shadow: 0px 0px 0px 1.5px ${navPrimaryBtnDarkColor};
        transform: translateY(0px);
    }
`;

// ==================================================
// CHAKRA THEME
// ==================================================

export const theme = extendTheme({
    components: {
        Input: {
            variants: {
                outline: {
                    field: {
                        height: "48px",
                        border: "1.5px solid",
                        borderColor: "gray.300",
                    },
                },
            },
        },
        Button: {
            baseStyle: {
                fontFamily: "body",
                fontWeight: "600",
                borderRadius: "4px",
                height: "40px",
            },
            variants: {
                tab: {
                    color: "gray.600",
                    bgColor: "white",
                    borderRadius: "4px",
                    height: "40px",
                    border: "1.5px solid",
                    borderColor: "gray.200",
                    transition:
                        "transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7)",
                    _hover: {
                        filter: "brightness(0.95)",
                        bgColor: "white",
                    },
                    _active: {
                        filter: "brightness(0.9)",
                        bgColor: "white",
                        transform: "scale(0.96)",
                    },
                },
                navItem: {
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    transition:
                        "background-color .3s ease-out, transform 0.3s cubic-bezier(.5,2.5,.7,.7)",
                    transformOrigin: "center",
                    _hover: {
                        bgColor: "gray.700",
                        transform: "scale(0.96)",
                    },
                    _active: {
                        bgColor: "gray.800",
                        transform: "scale(0.9)",
                    },
                },
                navPrimary: {
                    color: "black",
                    bgColor: "brand.500",
                    borderBottom: "1.5px solid",
                    borderBottomColor: "gray.900",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    animation: `${navPrimaryBtnLeaveEffectLight} 0.3s forwards`,
                    transition:
                        "transform .3s cubic-bezier(.5,2.5,.7,.7),box-shadow .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-box-shadow .3s cubic-bezier(.5,2.5,.7,.7)",
                    _hover: {
                        filter: "brightness(0.95)",
                        bgColor: "brand.500",
                        animation: `${navPrimaryBtnHoverEffectLight} 0.3s forwards`,
                    },
                    _active: {
                        filter: "brightness(0.9)",
                        bgColor: "brand.500",
                        animation: `${navPrimaryBtnActiveEffectLight} 0.3s forwards`,
                    },
                    "@media screen and (max-width: 30em)": {
                        animation: `${navPrimaryBtnHoverEffectLight} 0.3s forwards`,
                    },
                },
                paleSolid: {
                    fontSize: "14px",
                    fontWeight: "600",
                    bgColor: "white",
                    animation: `${btnLeaveEffect} 0.3s forwards`,
                    transition:
                        "transform .3s cubic-bezier(.5,2.5,.7,.7),box-shadow .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-box-shadow .3s cubic-bezier(.5,2.5,.7,.7)",
                    _hover: {
                        filter: "brightness(0.95)",
                        bgColor: "white",
                        animation: `${btnHoverEffect} 0.3s forwards`,
                    },
                    _active: {
                        filter: "brightness(0.9)",
                        bgColor: "white",
                        animation: `${btnActiveEffect} 0.3s forwards`,
                    },
                    "@media screen and (max-width: 30em)": {
                        animation: `${btnHoverEffect} 0.3s forwards`,
                    },
                },
                solid: {
                    fontSize: "14px",
                    fontWeight: "600",
                    bgColor: "brand.500",
                    animation: `${btnLeaveEffect} 0.3s forwards`,
                    transition:
                        "transform .3s cubic-bezier(.5,2.5,.7,.7),box-shadow .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-box-shadow .3s cubic-bezier(.5,2.5,.7,.7)",
                    _hover: {
                        filter: "brightness(0.95)",
                        bgColor: "brand.500",
                        animation: `${btnHoverEffect} 0.3s forwards`,
                    },
                    _active: {
                        bgColor: "brand.500",
                        filter: "brightness(0.9)",
                        animation: `${btnActiveEffect} 0.3s forwards`,
                    },
                    "@media screen and (max-width: 30em)": {
                        animation: `${btnHoverEffect} 0.3s forwards`,
                    },
                },
            },
        },
    },
    keyframes: {},
    fonts: {
        heading: monasans.style.fontFamily,
        body: monasans.style.fontFamily,
        body2: monasans.style.fontFamily,
        mono: ubuntuMono.style.fontFamily,
        serif: sourceSerif4.style.fontFamily,
        wide: monasansExpanded.style.fontFamily,
        condensed: monaSansCondensed.style.fontFamily,
    },
    colors: {
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        brand: {
            50: "#fff4ee",
            100: "#fee4d5",
            200: "#feceb4",
            300: "#fdb791",
            400: "#fda270",
            500: "#fc8d50",
            600: "#d67844",
            700: "#b36439",
            800: "#90502e",
            900: "#713f24",
        },
        gray: {
            50: "#fdfdfd",
            100: "#f6f6f6",
            200: "#f1f1f1",
            300: "#dddcdc",
            400: "#6a6766",
            500: "#575453",
            600: "#3c3837",
            700: "#353130",
            800: "#2b2827",
            900: "#080606",
        },
        green: {
            50: "#eefbef",
            100: "#d5f6d9",
            200: "#b5eebb",
            300: "#92e69b",
            400: "#71df7d",
            500: "#52d861",
            600: "#46b852",
            700: "#3a9945",
            800: "#2f7b37",
            900: "#25612c",
        },
        red: {
            50: "#fbeeee",
            100: "#f6d5d5",
            200: "#eeb5b5",
            300: "#e69292",
            400: "#df7171",
            500: "#d85252",
            600: "#b84646",
            700: "#993a3a",
            800: "#7b2f2f",
            900: "#612525",
        },
        blue: {
            50: "#eff5fb",
            100: "#d8e8f6",
            200: "#bad6ef",
            300: "#9ac3e8",
            400: "#7bb0e1",
            500: "#5e9fda",
            600: "#5087b9",
            700: "#43719b",
            800: "#365b7c",
            900: "#2a4862",
        },
    },
});

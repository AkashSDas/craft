import { Highlight } from "@chakra-ui/react";

type Props = {
    query?: string | string[];
    children: string;
};

export function HightlightWrapper(props: Props) {
    if (!props.query) {
        return props.children ?? null;
    }

    let finalQuery: string[] = [];
    if (Array.isArray(props.query)) {
        finalQuery = props.query;
    } else {
        finalQuery = props.query.split(" ");
    }

    return (
        <Highlight query={finalQuery} styles={{ bgColor: "brand.200" }}>
            {props.children}
        </Highlight>
    );
}

import { Image as ImageBlk } from "@app/services/articles";
import { Box } from "@chakra-ui/react";
import NextImage from "next/image";

type Props = {
    block: ImageBlk;
};

export function ImageBlock({ block }: Props): React.JSX.Element {
    return (
        <Box pos="relative" height="300px" width="100%">
            <NextImage
                src={block.value.URL ?? ""}
                alt="Image"
                layout="fill"
                style={{
                    borderRadius: "4px",
                    objectFit: "cover",
                    border: "1.5px solid black",
                }}
            />
        </Box>
    );
}

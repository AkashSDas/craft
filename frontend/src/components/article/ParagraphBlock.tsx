import { Paragraph } from "@app/services/articles";
import { Text } from "@chakra-ui/react";

type Props = {
    block: Paragraph;
};

export function ParagraphBlock({ block }: Props): React.JSX.Element {
    return (
        <Text
            fontFamily="serif"
            fontSize={{ base: "16px", sm: "18px" }}
            lineHeight="150%"
        >
            {block.value.text}
        </Text>
    );
}

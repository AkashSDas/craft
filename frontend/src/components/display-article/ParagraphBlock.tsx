import { Paragraph } from "@app/services/articles";
import { Text } from "@chakra-ui/react";

type Props = {
    block: Paragraph;
};

export function ParagraphBlock({ block }: Props): React.JSX.Element {
    return (
        <Text
            data-testid="paragraph-block"
            fontFamily="serif"
            fontSize={{ base: "18px", sm: "20px" }}
            lineHeight="150%"
            mb="12px"
            sx={{ lineHeight: "32px", letterSpacing: "-0.003em" }}
        >
            {block.value.text}
        </Text>
    );
}

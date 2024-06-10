import { Quote } from "@app/services/articles";
import { Text } from "@chakra-ui/react";

type Props = {
    block: Quote;
};

export function QuoteBlock({ block }: Props): React.JSX.Element {
    return (
        <Text
            fontFamily="serif"
            fontSize={{ base: "18px", sm: "20px" }}
            px={{ base: 4, sm: 8 }}
            color="gray"
            lineHeight="150%"
            fontStyle="italic"
            my="1rem"
        >
            {block.value.text}
        </Text>
    );
}

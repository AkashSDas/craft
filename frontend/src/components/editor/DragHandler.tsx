import { IconButtonProps, IconButton } from "@chakra-ui/react";

export function DragHandler(props: IconButtonProps & { isDragging: boolean }) {
    const { opacity, isDragging } = props;

    return (
        <IconButton
            {...props}
            as="span"
            opacity={isDragging ? 1 : opacity}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                "& span": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                },
            }}
        >
            {props.children}
        </IconButton>
    );
}

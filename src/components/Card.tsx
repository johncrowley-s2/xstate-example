import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface CardProps {
  heading: string;
  subHeading: string;
  body: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function Card({ heading, subHeading, body, onClick }: CardProps) {
  return (
    <Box p={4} display={{ md: "flex" }} width="100%" borderWidth={1} margin={2}>
      <Stack
        align={{ base: "center", md: "stretch" }}
        textAlign={{ base: "center", md: "left" }}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
      >
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="lg"
          letterSpacing="wide"
          color="teal.600"
        >
          {heading}
        </Text>
        <Text
          my={1}
          display="block"
          fontSize="md"
          lineHeight="normal"
          fontWeight="semibold"
        >
          {subHeading}
        </Text>
        <Text my={2} color="gray.500">
          {body}
        </Text>
        <Button maxWidth="100px" my={2} onClick={onClick}>
          Read More!
        </Button>
      </Stack>
    </Box>
  );
}

import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  theme,
  VStack,
} from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Card } from "./components/Card";
import { blogMachine } from "./state/blogMachine";

export const App = () => {
  const [current, send] = useMachine(blogMachine);

  return (
    <ChakraProvider theme={theme}>
      <Flex
        justify="space-between"
        padding="1rem"
        borderBottom="1px solid gray"
      >
        <Flex alignItems="center">
          <Heading size="2xl">XState Blog App</Heading>
          {!current.matches("idle") && (
            <Button size="md" marginStart="2rem" onClick={() => send("RESET")}>
              RESET THE MACHINE!
            </Button>
          )}
        </Flex>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
      <Box textAlign="center" fontSize="xl" marginTop="2rem">
        <Grid p={3}>
          <VStack spacing={8}>
            {current.matches("idle") && (
              <>
                <Text>Welcome, my son.</Text>
                <Text>
                  Welcome to the <b>MACHINE.</b>
                </Text>
                <Text>
                  The machine is currently in the idle state. Click below to
                  start 'er up.
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => send("FETCH")}
                >
                  Fetch Posts
                </Button>
              </>
            )}
            {(current.matches("loading") ||
              current.matches("success.loading")) && (
              <>
                <Spinner />
                <Text>Loading...</Text>
              </>
            )}
            {current.matches("success") && (
              <>
                {current.matches("success.posts") && (
                  <>
                    <Heading>All Posts:</Heading>
                    {current.context.posts.map((p, i) => (
                      <Card
                        key={p.id}
                        heading={p.title}
                        subHeading={"by " + p.author}
                        body={p.snippet}
                        onClick={() =>
                          send({ type: "POST.CLICK", payload: p.id })
                        }
                      />
                    ))}
                  </>
                )}
                {current.matches("success.post") && (
                  <>
                    <Button onClick={() => send("BACK")}>Back to List</Button>
                    <Heading>{current.context.post?.title}</Heading>
                    <Text fontWeight="bold">
                      by {current.context.post?.author}
                    </Text>
                    <Text align="left">{current.context.post?.body}</Text>
                  </>
                )}
              </>
            )}
            {(current.matches("error") || current.matches("success.error")) && (
              <>
                <Text color="red">Error :/</Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => send("RETRY")}
                >
                  Retry
                </Button>
              </>
            )}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

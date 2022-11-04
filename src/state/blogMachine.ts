import { assign, createMachine } from "xstate";
import { getPost, getPosts } from "../api";
import { Post } from "../types";

export const blogMachine = createMachine(
  {
    context: { posts: [], post: undefined },
    schema: {
      context: {} as { posts: Post[]; post: Post | undefined },
      events: {} as
        | { type: "FETCH" }
        | { type: "RETRY" }
        | { type: "RETRY" }
        | { type: "RESET" }
        | { type: "POST.CLICK"; payload: number }
        | { type: "BACK" },
    },
    predictableActionArguments: true,
    id: "blogMachine",
    initial: "idle",
    on: {
      RESET: {
        target: ".idle",
        internal: false,
      },
    },
    states: {
      idle: {
        on: {
          FETCH: {
            target: "loading",
          },
        },
      },
      loading: {
        invoke: {
          src: "getPosts",
          id: "getPosts",
          onDone: [
            {
              target: "success",
              actions: "assignPosts",
            },
          ],
          onError: [
            {
              target: "error",
            },
          ],
        },
      },
      success: {
        initial: "posts",
        states: {
          posts: {
            on: {
              "POST.CLICK": {
                target: "loading",
              },
            },
          },
          loading: {
            invoke: {
              src: "getPost",
              id: "getPost",
              onDone: [
                {
                  target: "post",
                  actions: "assignPost",
                },
              ],
              onError: [
                {
                  target: "#blogMachine.error",
                },
              ],
            },
            on: {
              BACK: {
                target: "posts",
              },
            },
          },
          post: {
            on: {
              BACK: {
                target: "posts",
              },
            },
          },
          error: {
            on: {
              RETRY: {
                target: "loading",
                actions: "assignPost",
              },
            },
          },
        },
      },
      error: {
        on: {
          RETRY: {
            target: "loading",
          },
        },
      },
    },
  },
  {
    services: {
      getPosts: () => getPosts(),
      getPost: (_, event: any) => getPost(event.payload),
    },
    actions: {
      assignPosts: assign({
        posts: (_, event: any) => event.data,
      }),
      assignPost: assign({ post: (_, event: any) => event.data }),
    },
  }
);

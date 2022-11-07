import { assign, createMachine } from "xstate";
import { getPost, getPosts } from "../api";
import { Post } from "../types";

const successStates = {
  initial: "posts",
  states: {
    posts: {
      on: {
        "POST.CLICK": {
          target: "loadingSinglePost",
        },
      },
    },
    loadingSinglePost: {
      tags: "loading",
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
          target: "loadingSinglePost",
          actions: "assignPost",
        },
      },
    },
  },
};

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
        target: "idle",
      },
    },
    states: {
      idle: {
        on: {
          FETCH: {
            target: "loadingAllPosts",
          },
        },
      },
      loadingAllPosts: {
        tags: "loading",
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
        ...successStates,
      },
      error: {
        on: {
          RETRY: {
            target: "loadingAllPosts",
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

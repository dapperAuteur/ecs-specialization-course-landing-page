import "next-auth";

/**
 * By using module augmentation, we can add the `role` property to the
 * `User` and `Session` interfaces from `next-auth`. This is the recommended
 * approach for adding custom properties to the session.
 */
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: User;
  }
}

export type { Session as CustomSession } from "next-auth";


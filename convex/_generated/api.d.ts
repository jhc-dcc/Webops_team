/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clRegistrations from "../clRegistrations.js";
import type * as contact from "../contact.js";
import type * as ewaste from "../ewaste.js";
import type * as newsletter from "../newsletter.js";
import type * as polls from "../polls.js";
import type * as popups from "../popups.js";
import type * as registration from "../registration.js";
import type * as sonyRegistrations from "../sonyRegistrations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clRegistrations: typeof clRegistrations;
  contact: typeof contact;
  ewaste: typeof ewaste;
  newsletter: typeof newsletter;
  polls: typeof polls;
  popups: typeof popups;
  registration: typeof registration;
  sonyRegistrations: typeof sonyRegistrations;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};

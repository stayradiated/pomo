import type { UserSession } from '#lib/server/types.js'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: UserSession | undefined
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

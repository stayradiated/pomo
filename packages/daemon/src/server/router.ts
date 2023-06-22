import { z } from 'zod'
import * as pomoDoc from '@stayradiated/pomo-doc'
import type { Point, Stream } from '@stayradiated/pomo-core'
import { publicProcedure, router } from './trpc.js'
import { getDoc, setDoc } from './doc.js'

const appRouter = router({
  getPointById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }): Promise<Point | undefined> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.getPointById({ doc, ...input })
    }),

  getPointStartedAtByRef: publicProcedure
    .input(
      z.object({
        ref: z.string(),
      }),
    )
    .query(async ({ input }): Promise<number | undefined> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.getPointStartedAtByRef({ doc, ...input })
    }),

  getStreamIdByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }): Promise<string | undefined> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.getStreamIdByName({ doc, ...input })
    }),

  getStreamNameById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }): Promise<string | undefined> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.getStreamNameById({ doc, ...input })
    }),

  getUserTimeZone: publicProcedure
    .query(async (): Promise<string> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }
      return pomoDoc.getUserTimeZone({ doc })
    }),

  upsertPoint: publicProcedure
    .input(
      z.object({
        streamId: z.string(),
        value: z.string(),
        startedAt: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      await setDoc(pomoDoc.upsertPoint({ doc, ...input }))
    }),

  retrieveAllPointList: publicProcedure.query(async (): Promise<Point[]> => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    return pomoDoc.retrieveAllPointList({ doc })
  }),

  retrieveCurrentPoint: publicProcedure
    .input(
      z.object({
        streamId: z.string(),
        currentTime: z.number(),
      }),
    )
    .query(async ({ input }): Promise<Point | undefined> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.retrieveCurrentPoint({ doc, ...input })
    }),

  retrievePointList: publicProcedure
    .input(
      z.object({
        since: z.number(),
        filter: z.object({
          streamId: z.string().optional(),
        }),
      }),
    )
    .query(async ({ input }): Promise<Point[]> => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      return pomoDoc.retrievePointList({ doc, ...input })
    }),

  retrieveStreamList: publicProcedure.query(async (): Promise<Stream[]> => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    return pomoDoc.retrieveStreamList({ doc })
  }),

  setUserTimeZone: publicProcedure
    .input(
      z.object({
        timeZone: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      await setDoc(pomoDoc.setUserTimeZone({ doc, ...input }))
    }),

  updatePointStartedAt: publicProcedure
    .input(
      z.object({
        pointIdList: z.array(z.string()),
        startedAt: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      await setDoc(pomoDoc.updatePointStartedAt({ doc, ...input }))
    }),

  updatePointValue: publicProcedure
    .input(
      z.object({
        pointId: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      await setDoc(pomoDoc.updatePointValue({ doc, ...input }))
    }),

  upsertStream: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const doc = await getDoc()
      if (doc instanceof Error) {
        throw doc
      }

      await setDoc(pomoDoc.upsertStream({ doc, ...input }))
    }),
})

type AppRouter = typeof appRouter

export { appRouter }
export type { AppRouter }

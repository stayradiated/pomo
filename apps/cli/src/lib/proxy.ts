import * as pomoDoc from '@stayradiated/pomo-doc'
import { getDoc } from './doc.js'

type FnWithoutDoc<T extends (options: any) => any> = (
  options: Omit<Parameters<T>[0], 'doc'>,
) => Promise<ReturnType<T> | Error>

const proxyFn = <T extends (options: any) => any>(fn: T): FnWithoutDoc<T> => {
  return async (input) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      return doc
    }

    console.time(fn.name)
    const result = fn({
      ...input,
      doc,
    })
    console.timeEnd(fn.name)

    return result
  }
}

const proxy = {
  getPointStartedAtByRef: proxyFn(pomoDoc.getPointStartedAtByRef),
  getStreamIdByName: proxyFn(pomoDoc.getStreamIdByName),
  getUserTimeZone: proxyFn(pomoDoc.getUserTimeZone),
  retrieveCurrentPoint: proxyFn(pomoDoc.retrieveCurrentPoint),
  retrievePointList: proxyFn(pomoDoc.retrievePointList),
  retrieveStreamList: proxyFn(pomoDoc.retrieveStreamList),

  upsertStream: proxyFn(pomoDoc.upsertStream),
  updatePointValue: proxyFn(pomoDoc.updatePointValue),
  upsertPoint: proxyFn(pomoDoc.upsertPoint),
}

export { proxy }

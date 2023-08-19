/* fork of https://github.com/yjs/y-indexeddb */

import * as idb from 'lib0/indexeddb'
import * as promise from 'lib0/promise'
import { Observable } from 'lib0/observable'
import * as Y from 'yjs'

const customStoreName = 'custom'
const updatesStoreName = 'updates'

export const PREFERRED_TRIM_SIZE = 500

type BeforeApplyUpdatesCallback = (updatesStore: IDBObjectStore) => void
type AfterApplyUpdatesCallback = (updatesStore: IDBObjectStore) => void

export const fetchUpdates = async (
  idbPersistence: IndexeddbPersistence,
  beforeApplyUpdatesCallback: BeforeApplyUpdatesCallback = () => {},
  afterApplyUpdatesCallback: AfterApplyUpdatesCallback = () => {}
) => {
  if (!idbPersistence.db) {
    throw new Error('IndexeddbPersistence not initialized!')
  }

  const [updatesStore] = idb.transact(idbPersistence.db, [updatesStoreName]) // , 'readonly')
  const updates = await idb.getAll(updatesStore, idb.createIDBKeyRangeLowerBound(idbPersistence.dbref, false))

  if (!idbPersistence.destroyed) {
    beforeApplyUpdatesCallback(updatesStore)
    Y.transact(idbPersistence.doc, () => {
      updates.forEach(val => {
        Y.applyUpdate(idbPersistence.doc, val)
      })
    }, idbPersistence, false)
    afterApplyUpdatesCallback(updatesStore)
  }

  const lastKey = await idb.getLastKey(updatesStore)
  idbPersistence.dbref = lastKey + 1
  idbPersistence.dbsize = await idb.count(updatesStore)

  return updatesStore
}

export const storeState = async (idbPersistence: IndexeddbPersistence, forceStore: boolean = true) => {
  const updatesStore = await fetchUpdates(idbPersistence)
  if (forceStore || idbPersistence.dbsize >= PREFERRED_TRIM_SIZE) {
    await idb.addAutoKey(updatesStore, Y.encodeStateAsUpdate(idbPersistence.doc))
    idb.del(updatesStore, idb.createIDBKeyRangeUpperBound(idbPersistence.dbref, true))

    idbPersistence.dbsize = await idb.count(updatesStore)
  }
}

export const clearDocument = (name: string) => idb.deleteDB(name)

export class IndexeddbPersistence extends Observable<string> {
  public readonly doc: Y.Doc
  public readonly name: string
  public db: IDBDatabase|null
  public synced: boolean
  public readonly whenSynced: Promise<IndexeddbPersistence>
  public dbref: number
  public dbsize: number
  public destroyed: boolean

  private _dbPromise: Promise<IDBDatabase>
  private _storeTimeout: number
  private _storeTimeoutId: any
  private _storeUpdate: (update: Uint8Array, origin: any) => void

  constructor (name: string, doc: Y.Doc) {
    super()

    this.doc = doc
    this.name = name
    this.dbref = 0
    this.dbsize = 0
    this.destroyed = false

    this.db = null
    this.synced = false
    this._dbPromise = idb.openDB(name, db =>
      idb.createStores(db, [
        ['updates', { autoIncrement: true }],
        ['custom']
      ])
    )
    this.whenSynced = promise.create(resolve => this.on('synced', () => resolve(this)))

    this._dbPromise.then(db => {
      this.db = db
      const beforeApplyUpdatesCallback = (updatesStore: IDBObjectStore) => idb.addAutoKey(updatesStore, Y.encodeStateAsUpdate(doc))
      const afterApplyUpdatesCallback = () => {
        if (this.destroyed) return this
        this.synced = true
        this.emit('synced', [this])
      }
      fetchUpdates(this, beforeApplyUpdatesCallback, afterApplyUpdatesCallback)
    })

    // Timeout in ms untill data is merged and persisted in idb.
    this._storeTimeout = 1000
    this._storeTimeoutId = null

    this._storeUpdate = (update: Uint8Array, origin: any) => {
      if (this.db && origin !== this) {
        const [updatesStore] = idb.transact(this.db, [updatesStoreName])
        idb.addAutoKey(updatesStore, update)
        if (++this.dbsize >= PREFERRED_TRIM_SIZE) {
          // debounce store call
          if (this._storeTimeoutId !== null) {
            clearTimeout(this._storeTimeoutId)
          }
          this._storeTimeoutId = setTimeout(() => {
            storeState(this, false)
            this._storeTimeoutId = null
          }, this._storeTimeout)
        }
      }
    }
    doc.on('update', this._storeUpdate)
    this.destroy = this.destroy.bind(this)
    doc.on('destroy', this.destroy)
  }

  async destroy (): Promise<void> {
    if (this._storeTimeoutId) {
      clearTimeout(this._storeTimeoutId)
    }
    this.doc.off('update', this._storeUpdate)
    this.doc.off('destroy', this.destroy)
    this.destroyed = true
    const db = await this._dbPromise
    db.close()
  }

  // Destroys this instance and removes all data from indexeddb.
  async clearData (): Promise<void> {
    await this.destroy()
    idb.deleteDB(this.name)
  }

  async get (key: string|number|ArrayBuffer|Date): Promise<string|number|ArrayBuffer|Date> {
    const db = await this._dbPromise
    const [custom] = idb.transact(db, [customStoreName], 'readonly')
    return idb.get(custom, key) as Promise<string|number|ArrayBuffer|Date>
  }

  async set (key: string|number|ArrayBuffer|Date, value: string|number|ArrayBuffer|Date): Promise<string|number|ArrayBuffer|Date> {
    const db = await this._dbPromise
    const [custom] = idb.transact(db, [customStoreName])
    return idb.put(custom, value, key)
  }

  async del (key: string | number | ArrayBuffer | Date): Promise<undefined> {
    const db = await this._dbPromise
    const [custom] = idb.transact(db, [customStoreName])
    return idb.del(custom, key)
  }
}

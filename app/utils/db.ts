import type { EntityTable } from 'dexie'
import Dexie from 'dexie'

interface Post {
  id: number
  content: string
  publicId: string
}

const db = new Dexie('PostDatabase') as Dexie & {
  posts: EntityTable<
    Post,
    'id'
  >
}

// Schema declaration:
db.version(1).stores({
  posts: '++id, &publicId', // primary key "id" (for the runtime!)
})

export {
  db as dexieDb,
}

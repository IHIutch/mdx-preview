import Dexie, { type EntityTable } from 'dexie';

interface Post {
  id: number;
  content: string;
  publicId: string;
}

const db = new Dexie('PostDatabase') as Dexie & {
  posts: EntityTable<
    Post,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  posts: '++id, &publicId' // primary key "id" (for the runtime!)
});

export type { Post };
export { db };
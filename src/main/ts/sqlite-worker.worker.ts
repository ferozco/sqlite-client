import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite-async.mjs";
import { OPFSAdaptiveVFS } from "wa-sqlite/src/examples/OPFSAdaptiveVFS.js";
import * as SQLite from "wa-sqlite";
import * as Comlink from "comlink";
import { Database, Result } from "./db";

let context: { db: number; sqllite: SQLiteAPI } | null = null;
let module: unknown | null = null;

const SQLiteDatabase: Database = {
  init: async (fileName: string) => {
    if (module == null) {
      module = await SQLiteESMFactory();
    }

    const vfs = await OPFSAdaptiveVFS.create(fileName, module);
    const sqlite = SQLite.Factory(module);
    sqlite.vfs_register(vfs, true);
    const db = await sqlite.open_v2(fileName);
    context = { sqllite: sqlite, db: db };
  },
  extend: async (fileName: string, table_name: string) => {
    if (context == null) {
      throw new Error();
    }

    const query =
      `ATTACH ${fileName} as new_db; ` +
      `BEGIN; INSERT INTO ${table_name} select * from new_db.${table_name}; COMMIT; ` +
      `DETACH new_db`;
    console.log(query);
    await context.sqllite.exec(context.db, query);
  },
  execute: async (query: string) => {
    if (context == null) {
      throw new Error();
    }
    let results: Result | null = null;

    await context.sqllite.exec(
      context.db,
      query,
      (row: Array<SQLiteCompatibleType | null>, columns: string[]) => {
        if (results == null) {
          results = { columns, rows: [row] };
        } else {
          results.rows.push(row);
        }
      },
    );

    return results!;
  },
};

Comlink.expose(SQLiteDatabase);

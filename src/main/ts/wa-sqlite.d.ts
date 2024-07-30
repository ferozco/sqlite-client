declare module "wa-sqlite/src/examples/OPFSAdaptiveVFS.js" {
  import * as VFS from "wa-sqlite/src/VFS.js";

  /** @ignore */
  export class OPFSAdaptiveVFS extends VFS.Base {
    name: string;

    // eslint-disable-next-line
    static create(name: string, module: any, options?: any): Promise<SQLiteVFS>;
  }
}

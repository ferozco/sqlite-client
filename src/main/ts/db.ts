export interface Database {
  init(fileName: string): Promise<void>;
  extend(fileName: string, tableName: string): Promise<void>;
  execute(query: string): Promise<Result>;
}

export interface Result {
  columns: string[];
  rows: Array<SQLiteCompatibleType | null>[];
}

import { Database } from "./db";
import React, { createContext, useContext } from "react";
import * as Comlink from "comlink";

const myWorker: Database = Comlink.wrap(
  new Worker(new URL("./sqlite-worker.worker.ts", import.meta.url)),
);
const DbContext = createContext<Database>(myWorker);

export const useDbContext = (): Database => useContext(DbContext);

export const DbProvider = ({ children }: { children?: React.ReactNode }) => {
  return <DbContext.Provider value={myWorker}>{children}</DbContext.Provider>;
};

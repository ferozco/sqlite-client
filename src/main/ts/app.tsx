import React, { useState } from "react";
import { useDbContext } from "./dbContext";

const TABLE_NAME = "awesome_table";

export const App = () => {
  const database = useDbContext();

  const [query, setQuery] = useState<string>("SELECT * FROM " + TABLE_NAME);

  const [result, setResult] = useState<string>();
  const [dbName, setDbName] = useState<string>("test");

  async function executeQuery() {
    const result = await database.execute(query);
    setResult(JSON.stringify(result));
  }

  async function loadFile(name: string) {
    const dir = await navigator.storage.getDirectory();
    const fileHandle = await dir.getFileHandle(name, { create: true });
    const writeableStream = await fileHandle.createWritable({
      keepExistingData: false,
    });

    const response = await fetch(`http://localhost:8443/data`);
    await writeableStream.write(await response.blob());
    await writeableStream.close();
  }

  async function loadDb() {
    await loadFile(dbName);
    await database.init(dbName);
  }

  async function extendDb() {
    const fileName = `extension_${Date.now()}`;
    await loadFile(fileName);
    await database.extend(fileName, TABLE_NAME);

    const dir = await navigator.storage.getDirectory();
    await dir.removeEntry(fileName);
  }

  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <p>SQL Test</p>
      <div>
        <label>
          DB name:
          <input
            name="dbName"
            onChange={(event) => setDbName(event.target.value)}
            value={dbName}
          />
        </label>
        <button onClick={loadDb}>Init DB</button>
        <button onClick={extendDb}>Extend DB</button>
      </div>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        ></textarea>
        <button onClick={executeQuery}>Execute</button>
        <textarea value={result}></textarea>
      </div>
    </div>
  );
};

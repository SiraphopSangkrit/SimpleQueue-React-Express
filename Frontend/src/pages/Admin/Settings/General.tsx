import { Input } from "../../../components/Inputs/Input";
import { useState } from "react";

export function General() {
  const [name, setName] = useState<string>("");

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">General Settings</h1>
      </div>

      <div className="w-full">
        <form className="max-w-3xl flex justify-center items-center mx-auto w-full flex-col gap-3">
          <Input
            boxClassName="flex-2"
            label="App Name"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="App Name"
            type="text"
            name="appname"
          />
          <Input
            boxClassName="flex-2"
            label="App Name"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="App Name"
            type="text"
            name="appname"
          />
          <Input
            boxClassName="flex-2"
            label="App Name"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="App Name"
            type="text"
            name="appname"
          />
          <Input
            boxClassName="flex-2"
            label="App Name"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="App Name"
            type="text"
            name="appname"
          />
          <div className="flex justify-end w-full gap-3">
            <button className="btn btn-primary" type="submit">
              Save Changes
            </button>
               <button className="btn btn-error">
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

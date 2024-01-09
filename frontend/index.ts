import fs from "fs";

enum ProcessState {
  stopped = 0,
  running = 1,
}

export const getRootPath = () => {
  return process.cwd();
};

export const exec = async (
  projectFolder: string,
  cmd: string | undefined,
  args: string
) => {
  const result = fetch("http://localhost:8181/exec", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectFolder: projectFolder,
      cmd: cmd,
      args: args,
    }),
  });

  const data = await result;

  if (data.status !== 200) {
    return { status: "error", message: data.statusText };
  }

  return data.json();
};

export function makeQuerablePromise(promise: any) {
  if (promise.isFulfilled) return promise;

  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;
  var data: any = null;

  var result = promise.then(
    function (v: any) {
      isFulfilled = true;
      isPending = false;
      data = v;
      return v;
    },
    function (e: any) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = function () {
    return isFulfilled;
  };
  result.isPending = function () {
    return isPending;
  };
  result.isRejected = function () {
    return isRejected;
  };
  result.getData = function () {
    return data;
  };
  return result;
}

const log = (output: string, colour: "white" | "blue" | "green" | "red") => {
  let colour_code = "97";
  switch (colour) {
    case "blue":
      colour_code = "34";
      break;
    case "green":
      colour_code = "32";
      break;
    case "red":
      colour_code = "31";
      break;
  }
  console.log(`\x1b[${colour_code}m${output}\x1b[0m`);
};

export const build = () => {
  console.clear();
  const rootPath = getRootPath();
  const rootPathArray = rootPath.split("/");
  const projectFolder = rootPathArray[rootPathArray.length - 1];
  const scriptPath = `${rootPath}/dream/task.script`;
  const script = fs.readFileSync(`${scriptPath}`, "utf8").split("\n");

  let taskState = ProcessState.stopped;
  let task: any = null;
  let line = 0;

  const t = setInterval(() => {
    if (taskState === ProcessState.stopped) {
      taskState = ProcessState.running;
      log(script[line], "blue");
      const cmdArray = script[line].split(" ");
      const cmd = cmdArray.shift();
      const args = cmdArray.join(" ");
      task = makeQuerablePromise(exec(projectFolder, cmd, args));
    }

    if (taskState === ProcessState.running) {
      if (task.isFulfilled()) {
        const data = task.getData();
        log(data.message, data.status === "error" ? "red" : "green");
        taskState = ProcessState.stopped;
        line++;
        if (line > script.length - 1 || data.status === "error") {
          taskState = ProcessState.stopped;
          clearInterval(t);
          if (data.status === "error") {
            log("Build failed!", "red");
            process.exit(1);
          } else {
            log("Build completed!", "green");
            run("npx ts-node dream/post.ts");
          }
        }
      }
    }
  });
};

export const run = (path: string) => {
  const execSync = require("child_process").execSync;
  const x = execSync(path);
  console.log(x.toString());
};

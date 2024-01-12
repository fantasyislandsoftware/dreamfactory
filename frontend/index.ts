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

const getProjectFolder = () => {
  const pathArray = getRootPath().split("/");
  let afterDream = false;
  let result = "";
  pathArray.forEach((folder, index) => {
    if (afterDream) {
      result += folder;
      if (index < pathArray.length - 1) {
        result += "/";
      }
    }
    if (folder === "dreams") {
      afterDream = true;
    }
  });
  return result;
};

export const build = () => {
  console.clear();

  const projectFolder = getProjectFolder();
  const rootPath = getRootPath();

  const scriptPath = `${rootPath}/dream/task.script`;
  let script = fs.readFileSync(`${scriptPath}`, "utf8").split("\n");

  script = script.filter((line) => {
    return !line.startsWith("#");
  });

  let taskState = ProcessState.stopped;
  let task: any = null;
  let line = 0;

  const chars = [" ", "⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"];
  let x = 0;

  let anim: any = undefined;

  let consoleText = "";

  const t = setInterval(() => {
    if (!anim) {
      anim = setInterval(() => {
        x++;
        if (x >= chars.length) {
          x = 1;
        }
      }, 50);
    }

    if (taskState === ProcessState.stopped) {
      taskState = ProcessState.running;
      consoleText = script[line];

      const cmdArray = script[line].split(" ");
      const cmd = cmdArray.shift();
      const args = cmdArray.join(" ");
      task = makeQuerablePromise(exec(projectFolder, cmd, args));
    }

    if (taskState === ProcessState.running) {
      process.stdout.write(`\r\x1b[34m${consoleText} ${chars[x]}\x1b[0m`);
      if (task.isFulfilled()) {
        const data = task.getData();
        process.stdout.write(`\r\x1b[34m${consoleText} ${chars[0]}\x1b[0m`);
        log(`${data.message}`, data.status === "error" ? "red" : "green");
        taskState = ProcessState.stopped;
        line++;
        if (line > script.length - 1 || data.status === "error") {
          taskState = ProcessState.stopped;
          clearInterval(t);
          clearInterval(anim);
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
  const result = execSync(path);
};

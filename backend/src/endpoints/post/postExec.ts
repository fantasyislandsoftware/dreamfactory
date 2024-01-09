import { dreamPath } from "../../env";

const postExec = (app: any) => {
  app.post("/exec", async (req: any, res: any, next: any) => {
    const spawnSync = require("child_process").spawnSync;
    try {
      const { projectFolder, cmd, args } = req.body;

      let command = "";
      let message = "";

      switch (cmd) {
        case "ls":
          command = "ls";
          break;
        case "bas2tap":
          command = "bas2tap";
          break;
        case "zxbasic_asm":
          command = "zxbasm.py";
          break;
        default:
          message = "Command not found";
      }

      let status = "success";
      try {
        const process = spawnSync(
          `cd ${dreamPath}/${projectFolder} && ${command} ${args}`,
          { shell: true }
        );
        if (process.stderr.length > 0) {
          status = "error";
          message = process.stderr.toString();
        } else {
          status = "success";
          message = process.stdout.toString();
        }
      } catch (error: any) {
        status = "error";
        message = error.message;
      }
      res.json({ status: status, message: message });
    } catch (error) {
      console.log(console.error());
      res.json({ status: "error", message: console.error() });
      next(error);
    }
  });
};

export default postExec;

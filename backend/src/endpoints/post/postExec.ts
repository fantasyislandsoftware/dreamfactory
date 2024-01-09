import { execSync } from "child_process";

const postExec = (app: any) => {
  app.post("/exec", async (req: any, res: any, next: any) => {
    try {
      const { projectFolder, cmd, args } = req.body;

      let cmdString = "";
      let message = "";

      switch (cmd) {
        case "ls":
          cmdString = "ls";
          break;
        case "zxbasic_asm":
          cmdString = "zxbasm.py";
          break;
        default:
          message = "Command not found";
      }

      let status = "success";
      try {
        message = execSync(cmdString).toString();
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

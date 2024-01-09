const postExec = (app: any) => {
  app.post("/exec", async (req: any, res: any, next: any) => {
    const execSync = require("child_process").execSync;
    try {
      const { projectFolder, cmd, args } = req.body;

      let command = "";
      let message = "";

      switch (cmd) {
        case "ls":
          command = "ls";
          break;
        case "zxbasic_asm":
          command = "zxbasm.py";
          break;
        default:
          message = "Command not found";
      }

      let status = "success";
      try {
        message = execSync(`${command} ${args}`).toString();
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

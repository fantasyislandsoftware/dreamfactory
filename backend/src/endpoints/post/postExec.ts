const postExec = (app: any) => {
  app.post("/exec", async (req: any, res: any, next: any) => {
    try {
      const { projectFolder, cmd, args } = req.body;

      switch (cmd) {
        case "run":
          res.json({ status: "success", message: "ok" });
          break;
        default:
          res.json({ status: "error", message: "command not found!" });
      }
    } catch (error) {
      console.log(console.error());
      res.json({ status: "error", message: console.error() });
      next(error);
    }
  });
};

export default postExec;

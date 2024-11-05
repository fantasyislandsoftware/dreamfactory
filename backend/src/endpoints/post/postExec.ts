import compileTap from "../../commands/compileTap";
import diag from "../../commands/diag";
import concatBasic from "../../commands/concatBasic";
import lnbas from "../../commands/lnbas";
import { dreamPath } from "../../env";
import { spawnSync } from "../../node";

const postExec = (app: any) => {
  app.post("/exec", async (req: any, res: any, next: any) => {
    try {
      const { projectFolder, cmd, args } = req.body;

      let command = "";
      let message = "";
      let internal: { message: string; status: string } = {
        message: "",
        status: "success",
      };

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
        case "zxbasic_bas":
          command = "zxbc.py";
          break;
        case "lnbas":
          command = "internal";
          internal = lnbas(projectFolder, args);
          break;
        case "vda68k":
          command = "vda68k";
          break;
        case "diag":
          command = "internal";
          internal = diag(projectFolder, args);
          break;
        case "compileTap":
          command = "internal";
          internal = compileTap(projectFolder, args);
          break;
        case "concatBasic":
          command = "internal";
          internal = concatBasic(projectFolder, args);
          break;
        default:
          message = "Command not found";
      }

      let status = "success";
      if (command === "internal") {
        message = internal.message;
        status = internal.status;
      } else {
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

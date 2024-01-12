import fs from "fs";
import { dreamPath } from "../env";

const diag = (projectFolder: string, args: string) => {
  const path = `${dreamPath}/${projectFolder}/dream/diag.html`;
  const html = `
        <head>
        </head>
        <body>
          <div>Test Diagnostic</div>
        </body>
      `;
  fs.writeFileSync(path, html);

  return { message: "", status: "success" };
};

export default diag;
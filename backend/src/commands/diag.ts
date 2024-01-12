import { dreamPath } from "../env";
import { writeFileSync } from "../node";

const diag = (projectFolder: string, args: string) => {
  const path = `${dreamPath}/${projectFolder}/dream/diag.html`;
  const html = `
        <head>
        </head>
        <body>
          <div>Test Diagnostic</div>
        </body>
      `;
  writeFileSync(path, html);

  return { message: "", status: "success" };
};

export default diag;

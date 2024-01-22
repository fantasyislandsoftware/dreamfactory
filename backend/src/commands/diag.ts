import { stat } from "fs";
import { dreamPath } from "../env";
import { readFileSync, writeFileSync, statSync } from "../node";

const getSpectrumDiag = (projectFolder: string, args: string) => {
  const argArray = args.split(" ");
  const blocksPath = argArray.length > 1 ? argArray[1] : "";
  const js = readFileSync("src/commands/test.js", "utf8");
  let blocks = readFileSync(
    `${dreamPath}/${projectFolder}/${blocksPath}`,
    "utf8"
  );
  const blocksJson = JSON.parse(blocks);
  blocksJson.map((block: any) => {
    block.size = statSync(`${dreamPath}/${projectFolder}/${block.path}`).size;
  });
  blocks = JSON.stringify(blocksJson);
  return `<head>            
          </head>
          <body>
            <div>
              <canvas id="canvas"></canvas>
            </div>
            <script>
              const blocks = ${blocks};
              ${js}
            </script>
          </body>`;
};

export const diag = (projectFolder: string, args: string) => {
  const argArray = args.split(" ");
  const machine = argArray.length > 0 ? argArray[0] : null;

  const path = `${dreamPath}/${projectFolder}/dream/diag.html`;

  let html = "";

  switch (machine) {
    case "spectrum":
      html = getSpectrumDiag(projectFolder, args);
      break;
  }

  writeFileSync(path, html);

  return { message: "", status: "success" };
};

export default diag;

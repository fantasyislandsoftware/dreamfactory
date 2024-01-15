import { dreamPath } from "../env";
import { arrayToBuffer, bufferToArray } from "../functions/bufferHandling";
import { bin2tapArray } from "../functions/tap";
import { ITapeBlock } from "../interface";
import { readFileSync, writeFileSync } from "../node";

const compileTap = (projectFolder: string, args: string) => {
  let message = "";
  const argArray = args.split(" ");
  const iPath =
    argArray.length > 0 ? `${dreamPath}/${projectFolder}/${argArray[0]}` : null;
  const oPath =
    argArray.length > 1 ? `${dreamPath}/${projectFolder}/${argArray[1]}` : null;

  if (!iPath || !oPath) {
    message = "Usage: compileTap <input file> <output file>";
    return { message: message, status: "error" };
  }

  /* Read tape block json */
  const blocks: ITapeBlock[] = JSON.parse(readFileSync(iPath, "utf8"));

  /* Read tape file into array */
  let tapeFileArray = bufferToArray(readFileSync(oPath));

  /* Add blocks to tape file array */
  blocks.map((block) => {
    const assetPath = `${dreamPath}/${projectFolder}/${block.path}`;
    tapeFileArray = tapeFileArray.concat(
      bin2tapArray(assetPath, block.name, block.address)
    );
  });

  /* Save Tape */
  writeFileSync(oPath, arrayToBuffer(tapeFileArray));

  /* Return success message */
  message = "Tap file compilation successful!";

  return { message: `\n${message}`, status: "success" };
};

export default compileTap;

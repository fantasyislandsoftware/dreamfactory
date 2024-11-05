import { dreamPath } from "../env";
import {
  existsSync,
  readDirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "../node";

const concatBasic = (projectFolder: string, args: string) => {
  let message = "";
  const argArray = args.split(" ");
  const mainPath = `${dreamPath}/${projectFolder}`;
  const iPath = argArray.length > 0 ? `${mainPath}/${argArray[0]}` : null;
  const sPath = argArray.length > 1 ? `${mainPath}/${argArray[1]}` : null;
  const oPath = argArray.length > 2 ? `${mainPath}/${argArray[2]}` : null;

  if (!iPath || !oPath || !sPath) {
    message = "Usage: js2amos <input file> <output file>";
    return { message: message, status: "error" };
  }

  const sName = argArray[0];

  //const concatPath = `${sPath}/blitball.txt`;

  /* Concat JS */
  if (existsSync(oPath)) {
    unlinkSync(oPath);
  }
  let includes = "";
  const sourceFiles = readDirSync(sPath);
  sourceFiles.forEach((file: string) => {
    if (file.endsWith(".bas") && !file.endsWith(sName)) {
      const source = readFileSync(`${sPath}/${file}`, "utf8");
      includes += `\n\n${source}`;
    }
  });
  const main = readFileSync(`${sPath}/${sName}`, "utf8").replace(
    "${includes}",
    includes
  ).replace(/rem/gi,';');

  //dest += `\n\n${main}`;
  writeFileSync(oPath, main);

  return { message: `\n${message}`, status: "success" };
};

export default concatBasic;

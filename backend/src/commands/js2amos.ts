import { exists, existsSync, writeFileSync } from "fs";
import { dreamPath } from "../env";
import { readDirSync, readFileSync, unlinkSync } from "../node";

const proceedSpaces = (str: string, count: number) => {
  let spaces = "";
  for (let i = 0; i < count; i++) {
    spaces += " ";
  }
  return `${spaces}${str}`;
};

const js2amos = (projectFolder: string, args: string) => {
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

  const concatPath = `${sPath}/concat.txt`;

  /* Concat JS */
  if (existsSync(concatPath)) {
    unlinkSync(concatPath);
  }
  let dest = "";
  const sourceFiles = readDirSync(sPath);
  sourceFiles.forEach((file: string) => {
    if (file.endsWith(".ts") && !file.endsWith(sName)) {
      const source = readFileSync(`${sPath}/${file}`, "utf8");
      dest += `\n\n${source}`;
    }
  });
  const main = readFileSync(`${sPath}/${sName}`, "utf8");
  dest += `\n\n${main}`;
  writeFileSync(concatPath, dest);

  /* Convert to AMOS */
  let js = readFileSync(concatPath, "utf8").split("\n");

  /* Get function list */
  let funcList: string[] = [];
  for (let i = 0; i < js.length; i++) {
    if (js[i].startsWith("export function ")) {
      let s = js[i].replace("export function ", "");
      for (let n = 0; n < s.length; n++) {
        if (s[n] === "(") {
          s = s.substring(0, n);
          break;
        }
      }
      funcList.push(s);
    }
  }

  for (let i = 0; i < js.length; i++) {
    /* Process for next */
    if (js[i].search("for") > -1) {
      const forLineArray = js[i].trimStart().split(" ");

      let l = i;
      const forIndent = js[i].search("for");
      let forEndSearch = proceedSpaces("}", forIndent);

      let forEndReplace = proceedSpaces("next", forIndent);
      for (let n = l; n < js.length; n++) {
        if (js[n].startsWith(forEndSearch)) {
          js[n] = js[n].replace(
            forEndSearch,
            `${forEndReplace} ${forLineArray[2]}`
          );
          break;
        }
      }
      js[l] = `${proceedSpaces(
        `${forLineArray[0]} ${forLineArray[2]} ${
          forLineArray[3]
        } ${forLineArray[4].replace(";", " to ")}${forLineArray[7].replace(
          ";",
          ""
        )}`,
        forIndent
      )}`;
    }

    /* Procedures & Functions */
    if (js[i].startsWith("export function") || js[i].startsWith("function")) {
      let l = i;
      js[i] = js[i]
        .replace("export function", "procedure")
        .replace("function", "procedure")
        .replace(": number", "")
        .replace("(", "[")
        .replace(")", "]")
        .replace("{", "")
        .replace("[]", "");
      for (let n = l; n < js.length; n++) {
        if (js[n].startsWith("}")) {
          js[n] = js[n].replace("}", "end proc");
          break;
        }
      }
    }

    /* If statements */
    if (js[i].trimStart().startsWith("if")) {
      let l = i;
      js[i] = js[i].replace("{", "");
      for (let n = l; n < js.length; n++) {
        if (js[n].trimStart().startsWith("}")) {
          js[n] = js[n].replace("}", "end if");
          break;
        }
      }
    }

    /* Global interface */
    if (js[i] === "interface Global {") {
      js[i] = "";
      let l = i;
      for (let n = l + 1; n < js.length; n++) {
        if (js[n].trimStart().startsWith("}")) {
          js[n] = js[n].replace("}", "");
          break;
        }
        js[n] = `global ${js[n]
          .trimStart()

          .replace(": Array<any>", "(())")}`;
      }
    }
  }

  /* Finalise */
  for (let i = 0; i < js.length; i++) {
    /* Replace js function calls to amos */
    if (js[i].trimStart().startsWith("amos.")) {
      js[i] = js[i]
        .replace("amos.print", "print ")
        .replace("amos.cls", "cls ")
        .replace("amos.loadIff", "load iff ")
        .replace("amos.getBob", "get bob ")
        .replace("amos.pasteBob", "paste bob ")
        .replace("amos.do", "do")
        .replace("amos.loop", "loop")
        .replace(', "to",', " to")
        .replace("(", "")
        .replace(")", "")
        .replace("amos.dim{ var: ", "dim ")
        .replace(", values: [", "(")
        .replace("] }", ")");
    }
    if (js[i].trimStart().startsWith("amos.set")) {
      js[i] = js[i].replace("amos.set", "").replace("], ", ") = ");
      js[i] = js[i].slice(0, -2);
    }

    /* Arrays */
    js[i] = js[i].replace("([", "(").replace("])", ")");

    /* Remove Let */
    if (js[i].trimStart().startsWith("let")) {
      js[i] = js[i].replace("let", "").replace(": any", "");
    }

    if (js[i].startsWith("import")) {
      js[i] = "";
    }
    if (js[i].endsWith(";")) {
      js[i] = js[i].substring(0, js[i].length - 1);
    }
    js[i] = js[i].replace("()", "");
    //

    if (js[i].endsWith(")")) {
      let custFunc = false;
      funcList.forEach((func) => {
        if (js[i].trimStart().startsWith(func)) {
          custFunc = true;
        }
      });

      if (custFunc) {
        js[i] = js[i].replace(")", "]");
        for (let n = 0; n < js[i].length; n++) {
          if (js[i][n] === "(") {
            js[i] = js[i].replace("(", "[");
            break;
          }
        }
      }
    }
    if (js[i].trimStart().startsWith("return")) {
      js[i] = js[i].replace("return", "end proc[");
      js[i] = js[i].trimStart() + " ]";
      js[i + 1] = "";
    }
    js[i] = js[i].replace("(())", "()");
  }
  let blank = 0;
  const output: string[] = [];
  for (let i = 0; i < js.length; i++) {
    if (blank == 1) {
      output.push("");
    }

    if (js[i].length === 0) {
      blank++;
    }
    if (js[i].length > 0) {
      output.push(js[i]);
      blank = 0;
    }
  }

  writeFileSync(oPath, output.join("\n"));

  return { message: `\n${message}`, status: "success" };
};

export default js2amos;

import { readFileSync, statSync } from "../node";

const addFilename = (array: any, str: any) => {
  for (let n in str) {
    array.push(str.charCodeAt(n));
  }
  for (let n = 0; n < 10 - str.length; n++) {
    array.push(32);
  }
  return array;
};

const addInt = (array: any, n: any) => {
  const lo = n & 0xff;
  const hi = (n >> 8) & 0xff;
  array.push(lo, hi);
  return array;
};

const xorall = (bytes: any, start: any) => {
  let r = 0;
  for (let n = start; n < bytes.length; n++) {
    r = r ^ bytes[n];
  }
  return r;
};

export const bin2tapArray = (source: any, name: any, org: any) => {
  const stats = statSync(source);
  const size = stats.size;

  /* header */
  let header: number[] = [];
  header.push(19);
  header.push(0);
  header.push(0);
  header.push(3);
  header = addFilename(header, name);
  header = addInt(header, size);
  header = addInt(header, org);
  header = addInt(header, 32768);
  header.push(xorall(header, 3));

  /* data */
  let data: any = [];
  data = addInt(data, size + 2);
  data.push(255);

  let fileData = readFileSync(source);
  for (let n = 0; n < fileData.length; n++) {
    data.push(fileData[n]);
  }

  data.push(xorall(data, 2));

  let fileArray: any = [];
  fileArray = fileArray.concat(header);
  fileArray = fileArray.concat(data);

  return fileArray;
};

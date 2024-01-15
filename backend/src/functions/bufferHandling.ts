export const bufferToArray = (buffer: any) => {
  let array: any = [];
  for (let n: number = 0; n < buffer.length; n++) {
    array.push(buffer[n]);
  }
  return array;
};

export const arrayToBuffer = (array: any) => {
    //@ts-ignore
    return Buffer.from(array);
};
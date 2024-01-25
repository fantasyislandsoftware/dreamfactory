class AMOS {
  dim(v: any, ...args: any) {}
  set(v: any, ...args: any) {}
  print(message: any) {}
  cls(colour: number) {}
  loadIff(path: string, screen: number) {}
  getBob(
    screenNumber: number,
    imageNumber: number,
    x1: number,
    y1: number,
    to: "to",
    x2: number,
    y2: number
  ) {}
  pasteBob(x: number, y: number, imageNumber: number) {}
  do() {}
  loop() {}
}

export default AMOS;

//@ts-nocheck

import * as fs from "fs";

export const spawnSync = require("child_process").spawnSync;
export const process = require('node:process');
export const readFileSync = fs.readFileSync;
export const writeFileSync = fs.writeFileSync;
export const statSync = fs.statSync;
export const readDirSync = fs.readdirSync;
export const unlinkSync = fs.unlinkSync;
export const existsSync = fs.existsSync;
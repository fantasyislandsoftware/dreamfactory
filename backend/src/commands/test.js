String.prototype.toRGB = function () {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

"string".toRGB();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 256;
const height = 512;
canvas.width = width;
canvas.height = height;
ctx.fillStyle = "black";

const defaultBlocks = [
  { name: "scr_px", address: 16384, size: 6144 },
  { name: "scr_att", address: 22528, size: 768 },
];

let x = 0;
let y = 0;
for (let n = 0 + 16384; n < 65536; n++) {
  let col = "black";

  defaultBlocks.map((block) => {
    if (block.address <= n && n < block.address + block.size) {
      col = block.name.toRGB();
    }
  });

  blocks.map((block) => {
    if (block.address <= n && n < block.address + block.size) {
      col = block.name.toRGB();
    }
  });

  ctx.fillStyle = col;
  ctx.fillRect(x, y, 1, 1);

  x += 1;
  if (x > 127) {
    x = 0;
    y += 1;
  }
}

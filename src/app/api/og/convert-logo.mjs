// convert-logo.mjs
import sharp from "sharp";

await sharp("public/vex/wink.webp").png().toFile("public/wink.png");

console.log("done");

# ImagePixArray
An object oriented JS solution, which collects an image's pixel values (rgba) and returns them into a 2D array of pixel objects

Eg: 2D Array: [Pixel: { r: 12, g: 53, b: 122, a: 0.5 }, ...]

## Instructions

*Please note that you can only use images served by other servers, you cannot use images on your filesystem*

Just include the script into your index.html and call `ImagePixArray.getPixelData(imgPath);` into an async function. (Where `imgPath` is the URL to an image you have access to.)

Eg:

```
async function main() {
  const pixelDataArray = ImagePixArray.getPixelData(SOME_IMAGE_PATH_HERE);
  console.log(pixelDataArray); // Array structure mentioned above in the readme file
}

main();
```

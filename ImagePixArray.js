class Pixel {
    constructor(r, g, b, a) {
        this.r = r ?? 0;
        this.g = g ?? 0;
        this.b = b ?? 0;
        this.a = a ?? 0;
    }
}

class ImagePixArray {
    static #pixelArray = [];

    static #validatePixelDataParams = (url) => {
        let errorMessage = "";

        try {
            // Validate url
            if (typeof url !== "string") {
                errorMessage += "`url` must be of type string!";
            }

            if (errorMessage !== "") throw new Error(errorMessage);
        } catch (error) {
            console.error(error.message);
            return false;
        }

        return true;
    }

    static getPixelData = async (url) => {
        if (!ImagePixArray.#validatePixelDataParams(url)) return;

        const size = [150, 150];
        const img = new Image();
        img.src = url;

        /* Prevents DOMSecurity error */
        img.crossOrigin = "anonymous";

        const [w, h] = size;

        img.width = w;
        img.height = h;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.height = w;
            canvas.width = h;

            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, w, h);

            const { data: imagePixelData } = context.getImageData(0, 0, w, h);
            const ipdLen = imagePixelData.length;

            /* 
    
            Parse pixel data to pixel objects and append to array.
    
            Where i0 is the index at value 0, and rgba are colour channel values:
            [i0, i1, i2, i3] = [r, g, b, a]
    
            */
            for (let i = 0; i < ipdLen; i += 4) {
                const currentPxData = [
                    imagePixelData[i],
                    imagePixelData[i + 1],
                    imagePixelData[i + 2],
                    imagePixelData[i + 3],
                ];

                ImagePixArray.#pixelArray.push(
                    new Pixel(...currentPxData)
                )
            }
        };

        return new Promise(async (res, rej) => {
            /* Observe array */
            const interval = 100;

            const MAX_TIMEOUT = 10000;
            let TIMER = 0;

            const observer = await setInterval(() => {
                // Timeout
                if (TIMER === MAX_TIMEOUT) {
                    rej(`Timeout! operation exceeds limit (${MAX_TIMEOUT / 1000} seconds)`);
                    clearInterval(observer);
                }

                // Array generated
                if (ImagePixArray.#pixelArray.length !== 0) {
                    res(ImagePixArray.#pixelArray);
                    clearInterval(observer);
                }

                TIMER += interval;
            }, interval);
        });
    }
}
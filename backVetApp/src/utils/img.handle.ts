import sharp from "sharp";


    export const encodeRezizeImgToJPEG = async (stringImg:string) => {
    let bufferImg = stringImg.split(';base64,').pop() as string
    let imgBuffer = Buffer.from( bufferImg, 'base64');
    try {
        const result = (await sharp(imgBuffer)
                            .toFormat('jpeg')
                            .resize({ width: 200,height: 200, fit:'inside'})
                            .toBuffer())
                            .toString('base64');
        return result;
    } catch (error) {
        console.log(error)
    }
    
}

//si, hice un método para solo esto...
export const decodeToHTML_JPEG = (base64JPEG:string) => {
    if (base64JPEG){
        return "data:image/jpeg;base64,"+base64JPEG;
    }
    return "";
}

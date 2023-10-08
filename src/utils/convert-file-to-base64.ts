export default function convertFileTobase64(file: File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = () => {
            reject('Failed to convert file to base64');
        };
        fileReader.readAsDataURL(file);
    });
}

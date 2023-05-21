export const generateRandomString = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 12;
    let randomString = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(randomNumber, randomNumber +1);
    }
    return randomString;
}

export const generateRandomPassword = () => {
    const regex = new RegExp("(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~\?!'¡@\`\´#$\"¿%^&*_=+\-]).{6,32}");
    let password = generateRandomString();
    console.log(password);
    while (!regex.test(password)){
        password = generateRandomString();
        console.log(password);
    }
    return password;
}
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);


const sendMailTest = async (email:string,asunto:string,texto:string,) => {
    const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
    console.log("mandando mail...");
    await mg.messages.create('sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org', {
        "from": "Oh my dog! <mailgun@sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org>",
        "to": [`${email}`],
        "subject": `${asunto}`,
        "text": `${texto}`,
        "html": `<p>${texto}</p>`
    })
    .then((msg:any) => {// logs response data
        console.log(msg);
    }) 
    .catch((err:any) => {// logs any error
        console.log(err)
        throw new Error("Error lanzado desde sendMailWithAttachment");
    }); 
}

export const sendMailWithAttachment = async (email:string,asunto:string,texto:string, file:Buffer, filename:string) => {
    const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
    console.log("mandando mail...");
    await mg.messages.create('sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org', {
        "from": "Oh my dog! <mailgun@sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org>",
        "to": [`${email}`],
        "subject": `${asunto}`,
        "text": `${texto}`,
        "html": `<p>${texto}</p>`,
        "attachment":{data: file, filename: filename}
    })
    .then((msg:any) => {// logs response data
        console.log(msg);
    }) 
    .catch((err:any) => {// logs any error
        console.log(err)
        throw new Error("Error lanzado desde sendMailWithAttachment");
    }); 
}

export {sendMailTest}

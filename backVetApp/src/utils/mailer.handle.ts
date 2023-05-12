const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);


const sendMailTest = (email:string,asunto:string,texto:string,) => {
    const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
    console.log("mandando mail...");
    mg.messages.create('sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org', {
        "from": "Oh my dog! <mailgun@sandbox46297a600e6a4388b5dc3889314ef1fa.mailgun.org>",
        "to": [`${email}`],
        "subject": `${asunto}`,
        "text": `${texto}`,
        "html": `<p>${texto}</p>`
    })
    .then((msg:any) => console.log(msg)) // logs response data
    .catch((err:any) => console.log(err)); // logs any error
}

export {sendMailTest}

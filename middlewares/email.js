const nodemailer = require('nodemailer')

const SMTP_CONFIG = require('../public/config/setup')



const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass
    },
    tls: {
        rejectUnauthorized: false
    }
})


const geraStringAleatoria =  (tamanho)=> {
    var stringAleatoria = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = caracteres.length;
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(stringAleatoria)
    return stringAleatoria;
    
}


const run = async (req,res,next) => {
    const {email} = req.body
    const token = geraStringAleatoria(20)
    const mailSent = await transporter.sendMail({
        text: 'Olá eu sou goku' ,
        subject: 'Token Senha',
        from: 'Cidre informatica <andrecidre@hotmail.com>',
        to: email,
        html: `
            <body>
                <strong>Olá </strong>
                <span>${token}</span>
            </body>

        `
    })
    console.log(run)
    console.log(email)
    next()

   
}

module.exports = transporter
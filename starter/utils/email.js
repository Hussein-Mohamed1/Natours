const { text } = require('express');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');
const Transport = require("nodemailer-brevo-transport");
const pug = require('pug');
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email,
            this.firstName = user.name.split(' ')[0],
            this.from = `Hussein Mohamed <${process.env.EMAIL_FROM}>`,
            this.url = url
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                host: 'smtp-relay.sendinblue.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SMTP_KEY
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            // html,
            text:"Hello"
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendwelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!')
    }
    async sendPasswordReset() {
        await this.send('passwordreset', 'Your password reset token (valid for only 10 minutes)');
    }

}


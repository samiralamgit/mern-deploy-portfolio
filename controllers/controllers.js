const nodemailer = require("nodemailer");
const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const sendEmailController = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        // validation
        if (!name || !email || !message || !subject) {
            return res.status(500).send({
                success: false,
                message: 'Please provide all field',
            })
        }

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const sender = {
            email: email,
            name: name,
        }
        const receivers = [
            {
                email: process.env.USER_GMAIL
            }
        ]

        const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: subject,
            textContent: message
        })

        return res.status(200).send({
            success: true,
            message: 'Email Send Successfully',
            sendEmail
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Send Email API Error',
            error
        })
    }
}

module.exports = { sendEmailController }
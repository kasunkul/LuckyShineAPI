const sgMail = require('@sendgrid/mail');
const axios = require('axios');

sgMail.setApiKey(
  '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',
);
const msg = {
  to: 'staff@lavup.it',
  from: 'staff@lavup.it', // Use the email address or domain you verified above
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

const headers = {
  headers: {
    'content-type': 'application/json',
    authorization:
      'Bearer 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',
  },
};

async function sendEmail(templateData, email) {
  console.log('email--', email);

  const data = {
    personalizations: [
      {
        to: [
          {
            email,
            name: templateData.name,
          },
        ],
        dynamic_template_data: templateData,
        subject: 'Order confirmation',
      },
    ],
    from: {
      email: 'staff@lavup.it',
      name: 'Lavup Team',
    },
    reply_to: {
      email: 'staff@lavup.it',
      name: 'Lavup Team',
    },
    template_id: 'd-02e6d35c684f425fb8f19f627e752769',
  };

  try {
    console.log('here');
    //   await sgMail.send(msg);
    await axios.post('https://api.sendgrid.com/v3/mail/send', data, headers);
  } catch (error) {
    console.error(error.response.data);

    if (error.response) {
      //   console.error(error.response.body);
    }
  }
}
module.exports = { sendEmail };

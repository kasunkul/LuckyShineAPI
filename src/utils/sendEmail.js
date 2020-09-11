const sgMail = require("@sendgrid/mail");
const axios = require("axios");
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "pathumsimpson@gmail.com",
  from: "pathum@earltech.biz", // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

const headers = {
  headers: {
    "content-type": "application/json",
    authorization:
      "Bearer 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",
  },
};

async function sendEmail(templateData, email) {
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
        subject: "Order confirmation",
      },
    ],
    from: {
      email: "pathum@earltech.biz",
      name: "Pathum lab manager",
    },
    reply_to: {
      email: "pathum@earltech.biz",
      name: "Pathum lab manager",
    },
    template_id: "d-02e6d35c684f425fb8f19f627e752769",
  };

  try {
    console.log("here");
    //   await sgMail.send(msg);
    await axios.post("https://api.sendgrid.com/v3/mail/send", data, headers);
  } catch (error) {
    console.error(error.response.data);

    if (error.response) {
      //   console.error(error.response.body);
    }
  }
}
module.exports = { sendEmail };

import nodemailer from 'nodemailer';

interface EmailOptions {
	email: string;
	subject: string;
	message: string;
}

export default async function sendEmail(options: EmailOptions) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: '5e245d09b7268f',
			pass: '00bdf7264021d7',
		},
	});

	const mailOptions = {
		from: 'Akash Shyam <akash.shyam2008@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
}

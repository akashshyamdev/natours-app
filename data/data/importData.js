const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { Tour } = require('../../dist/models/tourModel');
const colors = require('colors');

dotenv.config();

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((con) => {
		console.log(colors.yellow.bold(`Database connected ${con.connection.host}`));
	})
	.catch((err) => {
		console.error(err.message.red.underline.bold);
		process.exit(1);
	});

const tours = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tours-simple.json'), 'utf-8'));

async function importData() {
	try {
		await Tour.create(tours);

		console.log(colors.green('Data successfully imported'));
	} catch (error) {
		console.error(colors.red.bold(error));
	}

	process.exit();
}

async function deleteData() {
	console.log('D');
	try {
		await Tour.deleteMany();

		console.log(colors.green('Data successfully deleted'));
	} catch (error) {
		console.error(colors.red.bold(error));
	}

	process.exit();
}

if (process.argv[2] === '--import') {
	importData();
}

if (process.argv[2] === '--delete') {
	deleteData();
}

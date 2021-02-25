import { Schema, model, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
	name: string;
	email: string;
	photo: string;
	password: string;
	passwordConfirm: string | undefined;
	role: 'user' | 'guide' | 'admin' | 'lead-guide';
	passwordChangedAt: Date;
	passwordResetToken: string | undefined;
	passwordResetExpires: Date | undefined;
	correctPassword: (candidatePassword: string, userPassword: string) => boolean;
	hasPasswordChanged: (timestamp: Date) => Boolean;
	createPasswordResetToken: () => string;
}

const userSchema = new Schema<IUser>({
	name: {
		type: String,
		required: [true, 'An user must have a name'],
	},
	email: {
		type: String,
		required: [true, 'An user must have a email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Not a valid email'],
	},
	photo: {
		type: String,
	},
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'guide', 'lead-guide', 'admin'],
	},
	password: {
		type: String,
		required: [true, 'An user must have a password'],
		minLength: [true, 'Minimum length of the password must be 8 characters'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			validator: function (val: string): boolean {
				// @ts-ignore
				return val === this.password;
			},
			error: 'Password must be equal to the confirmed password',
		},
	},
	passwordResetToken: String,
	passwordResetExpires: Date,
	passwordChangedAt: Date,
	active: {
		type: Boolean,
		default: false,
		select: false,
	},
});

// Instance methods

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasPasswordChanged = function (timestamp: Date): boolean {
	if (this.passwordChangedAt) {
		return timestamp < new Date(this.passwordChangedAt.getTime());
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const token = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(token).digest().toString('hex');
	this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

	return token;
};

// Query Middleware
userSchema.pre<IUser>(/^find/, async function (next) {
	//@ts-ignore
	this.find({ active: { $ne: false } });

	next();
});

// Document middleware

userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = new Date(Date.now() - 1 * 1000);

	next();
});

export const User = model<IUser>('user', userSchema);

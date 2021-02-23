import { Response, Request } from 'express';

// BUG: remove prefix of request if using
export function getAllUsers(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export function getUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export function createUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export function updateUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export function deleteUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

import { Response, Request, NextFunction } from 'express';

export function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
	return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

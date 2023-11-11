import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from '@/utils/config';

declare module 'next' {
	interface NextApiRequest {
		session: any
	}
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const addr = req.session.siwe?.address;
	switch (method) {
		case 'GET':
			console.log(req, addr, 9999);
			res.send({ address: addr });
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};

export default withIronSessionApiRoute(handler, ironOptions);

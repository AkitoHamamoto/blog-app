// pages/api/isAdmin.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function isAdminHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.adminToken;
  if (token === 'valid') {
    return res.status(200).json({ isAdmin: true });
  } else {
    return res.status(200).json({ isAdmin: false });
  }
}

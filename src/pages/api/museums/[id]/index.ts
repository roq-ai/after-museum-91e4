import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { museumValidationSchema } from 'validationSchema/museums';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.museum
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getMuseumById();
    case 'PUT':
      return updateMuseumById();
    case 'DELETE':
      return deleteMuseumById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMuseumById() {
    const data = await prisma.museum.findFirst(convertQueryToPrismaUtil(req.query, 'museum'));
    return res.status(200).json(data);
  }

  async function updateMuseumById() {
    await museumValidationSchema.validate(req.body);
    const data = await prisma.museum.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteMuseumById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.museum.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

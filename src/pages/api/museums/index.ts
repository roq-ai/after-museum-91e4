import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { museumValidationSchema } from 'validationSchema/museums';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getMuseumsPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getMuseums();
    case 'POST':
      return createMuseum();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMuseumsPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'museum');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.museum.count(countOptions as unknown),
      prisma.museum.findMany({
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
        ...findOptions,
      }),
    ]);
    return res.status(200).json({ totalCount, data });
  }

  async function getMuseums() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.museum
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'museum'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createMuseum() {
    await museumValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.curator?.length > 0) {
      const create_curator = body.curator;
      body.curator = {
        create: create_curator,
      };
    } else {
      delete body.curator;
    }
    if (body?.exhibit?.length > 0) {
      const create_exhibit = body.exhibit;
      body.exhibit = {
        create: create_exhibit,
      };
    } else {
      delete body.exhibit;
    }
    if (body?.owner?.length > 0) {
      const create_owner = body.owner;
      body.owner = {
        create: create_owner,
      };
    } else {
      delete body.owner;
    }
    if (body?.visitor?.length > 0) {
      const create_visitor = body.visitor;
      body.visitor = {
        create: create_visitor,
      };
    } else {
      delete body.visitor;
    }
    const data = await prisma.museum.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
            const status = typeof rpcError.status === 'number' ? rpcError.status : 500;

            return response.status(status).json(rpcError);
        }

        response.status(500).json({
            status: 500,
            message: rpcError,
        });
    }
}

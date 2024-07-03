import {
    ArgumentsHost,
    Catch,
    HttpServer,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    private static readonly logger2 = new Logger('ExceptionsHandler');

    async handleUnknownError(
        exception: any,
        host: ArgumentsHost,
        applicationRef:
            | AbstractHttpAdapter<any, any, any>
            | HttpServer<any, any>,
    ): Promise<void> {
        const body = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception.message,
            exception: exception.constructor.name,
            trace: exception.stack.split('\n'),
        };

        applicationRef.reply(host.getArgByIndex(1), body, body.statusCode);

        Sentry.captureException(exception);
        await Sentry.flush(2000);

        if (this.isExceptionObject(exception)) {
            return HttpExceptionFilter.logger2.error(
                exception.message,
                exception.stack,
            );
        }

        return HttpExceptionFilter.logger2.error(exception);
    }
}
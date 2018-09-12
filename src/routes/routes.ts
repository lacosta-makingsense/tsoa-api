/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../config/ioc';
import { UserController } from './../controllers/user';
import { expressAuthentication } from './../authentication/authentication';

const models: TsoaRoute.Models = {
    "UserAttributes": {
        "properties": {
            "email": { "dataType": "string", "required": true, "validators": { "pattern": { "value": "^[a-zA-Z0-9_.+-]+\\x40[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$" } } },
            "name": { "dataType": "string", "required": true, "validators": { "minLength": { "value": 1 } } },
            "_id": { "dataType": "any", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
    },
    "PaginationResponseUserAttributes[]": {
        "properties": {
            "count": { "dataType": "double", "required": true },
            "items": { "dataType": "array", "array": { "ref": "UserAttributes" }, "required": true },
        },
    },
    "UserRequestData": {
        "properties": {
            "email": { "dataType": "string", "required": true, "validators": { "pattern": { "value": "^[a-zA-Z0-9_.+-]+\\x40[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$" } } },
            "name": { "dataType": "string", "required": true, "validators": { "minLength": { "value": 1 } } },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/service/users/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string", "validators": { "pattern": { "value": "^[A-Fa-f\\d]{24}$" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.get.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/service/users',
        function(request: any, response: any, next: any) {
            const args = {
                page: { "in": "query", "name": "page", "dataType": "integer", "validators": { "isInt": { "errorMsg": "page" }, "minimum": { "value": 1 } } },
                limit: { "in": "query", "name": "limit", "dataType": "integer", "validators": { "isInt": { "errorMsg": "limit" }, "minimum": { "value": 1 }, "maximum": { "value": 100 } } },
                query: { "in": "query", "name": "query", "dataType": "string", "validators": { "isString": { "errorMsg": "query" } } },
                sortBy: { "in": "query", "name": "sortBy", "dataType": "string", "validators": { "isString": { "errorMsg": "sortBy" } } },
                sortDirection: { "in": "query", "name": "sortDirection", "dataType": "enum", "enums": ["ASC", "DESC"], "validators": { "pattern": { "value": "^ASC|DESC$" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.search.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/service/users',
        authenticateMiddleware([{ "admin": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "UserRequestData" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.create.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/service/users/:id',
        authenticateMiddleware([{ "admin": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string", "validators": { "pattern": { "value": "^[A-Fa-f\\d]{24}$" } } },
                body: { "in": "body", "name": "body", "required": true, "ref": "UserRequestData" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.update.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/service/users/:id',
        authenticateMiddleware([{ "admin": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string", "validators": { "pattern": { "value": "^[A-Fa-f\\d]{24}$" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.delete.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = 401;
                    next(error)
                }
            }

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}

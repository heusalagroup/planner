// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ProcessUtils } from "./io/hyperify/core/ProcessUtils";

// Must be first import to define environment variables before anything else
ProcessUtils.initEnvFromDefaultFiles();

import {
    BUILD_USAGE_URL,
    BUILD_WITH_FULL_USAGE,
} from "./fi/hg/planner/constants/build";
import {
    BACKEND_SCRIPT_NAME,
    BACKEND_LOG_LEVEL,
    BACKEND_URL,
} from "./fi/hg/planner/constants/runtime";

import { LogService } from "./io/hyperify/core/LogService";
LogService.setLogLevel(BACKEND_LOG_LEVEL);

import { PlannerAppImpl } from "./fi/hg/planner/PlannerAppImpl";
import { PgEntityInsertQueryBuilder } from "./io/hyperify/core/data/query/pg/insert/PgEntityInsertQueryBuilder";
import { CrudRepositoryImpl } from "./io/hyperify/core/data/types/CrudRepositoryImpl";
import { EntityUtils } from "./io/hyperify/core/data/utils/EntityUtils";
import { LogLevel } from "./io/hyperify/core/types/LogLevel";
import { PgPersister } from "./io/hyperify/pg/PgPersister";
import { RequestClientImpl } from "./io/hyperify/core/RequestClientImpl";
import { CommandExitStatus } from "./io/hyperify/core/cmd/types/CommandExitStatus";
import { CommandArgumentUtils } from "./io/hyperify/core/cmd/utils/CommandArgumentUtils";
import { ParsedCommandArgumentStatus } from "./io/hyperify/core/cmd/types/ParsedCommandArgumentStatus";
import { HgNode } from "./io/hyperify/node/HgNode";
import { ServerServiceImpl } from "./io/hyperify/node/requestServer/ServerServiceImpl";
import { RequestServerImpl } from "./io/hyperify/node/RequestServerImpl";
import { RequestServer, RequestServerEvent } from "./io/hyperify/core/RequestServer";
import { RequestRouterImpl } from "./io/hyperify/core/requestServer/RequestRouterImpl";
import { Headers } from "./io/hyperify/core/request/types/Headers";

const LOG = LogService.createLogger('main');

export async function main (
    args: string[] = []
) : Promise<CommandExitStatus> {
    try {

        HgNode.initialize();

        Headers.setLogLevel(LogLevel.INFO);
        RequestRouterImpl.setLogLevel(LogLevel.INFO);
        RequestClientImpl.setLogLevel(LogLevel.INFO);
        RequestServerImpl.setLogLevel(LogLevel.INFO);
        PgPersister.setLogLevel(LogLevel.INFO);
        PgEntityInsertQueryBuilder.setLogLevel(LogLevel.INFO);
        CrudRepositoryImpl.setLogLevel(LogLevel.INFO);
        EntityUtils.setLogLevel(LogLevel.INFO);

        LOG.debug(`Loglevel as ${LogService.getLogLevelString()}`);

        const {scriptName, parseStatus, exitStatus, errorString} = CommandArgumentUtils.parseArguments(BACKEND_SCRIPT_NAME, args);

        if ( parseStatus === ParsedCommandArgumentStatus.HELP || parseStatus === ParsedCommandArgumentStatus.VERSION ) {
            console.log(getMainUsage(scriptName));
            return exitStatus;
        }

        if (errorString) {
            console.error(`ERROR: ${errorString}`);
            return exitStatus;
        }

        const server : RequestServer = RequestServerImpl.create(
            ServerServiceImpl.create(BACKEND_URL),
            RequestRouterImpl.create(),
        );

        const app = PlannerAppImpl.create(server);

        server.start();

        let serverListener : any = undefined;

        const stopPromise : Promise<void> = new Promise<void>((resolve, reject) => {
            try {
                LOG.debug('Stopping server from RequestServer stop event');
                serverListener = server.on(RequestServerEvent.STOPPED, () => {
                    serverListener = undefined;
                    resolve();
                });
            } catch(err) {
                reject(err);
            }
        });

        ProcessUtils.setupDestroyHandler( () => {
            LOG.debug('Stopping server from process utils event');
            app.destroy();
            server.stop();
            if (serverListener) {
                serverListener();
                serverListener = undefined;
            }
        }, (err : any) => {
            LOG.error('Error while shutting down the service: ', err);
        });

        await stopPromise;

        return CommandExitStatus.OK;
    } catch (err) {
        LOG.error(`Fatal error: `, err);
        return CommandExitStatus.FATAL_ERROR;
    }
}

/**
 *
 * @param scriptName
 * @nosideeffects
 * @__PURE__
 */
export function getMainUsage (
    scriptName: string
): string {

    /* @__PURE__ */if ( /* @__PURE__ */BUILD_WITH_FULL_USAGE ) {

        return `USAGE: ${/* @__PURE__ */scriptName} [OPT(s)] ARG(1) [...ARG(N)]

  HG Planner API service.
  
...and OPT is one of:

    -h --help          Print help
    -v --version       Print version
    --                 Disables option parsing

  Environment variables:

    BACKEND_LOG_LEVEL as one of: ALL, DEBUG, INFO, WARN, ERROR, NONE

`;
    } else {
        return `USAGE: ${/* @__PURE__ */scriptName} ARG(1) [...ARG(N)]
See ${/* @__PURE__ */BUILD_USAGE_URL}
`;
    }
}

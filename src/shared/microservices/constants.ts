export const PROVIDER_SERVER_MICROSERVICE = "PROVIDER_SERVER_MICROSERVICE";

export const NO_EVENT_HANDLER = `There is no matching event handler defined in the remote service.`;
export const CONNECT_EVENT = 'connect';
export const DISCONNECT_EVENT = 'disconnect';
export const MESSAGE_EVENT = 'message';
export const DATA_EVENT = 'data';
export const ERROR_EVENT = 'error';
export const CLOSE_EVENT = 'close';
export const SUBSCRIBE = 'subscribe';
export const CANCEL_EVENT = 'cancelled'

export const NO_MESSAGE_HANDLER = `There is no matching message handler defined in the remote service.`;
export const DISCONNECTED_RMQ_MESSAGE = `Disconnected from RMQ. Trying to reconnect.`;

export const TCP_DEFAULT_PORT = 3000;
export const TCP_DEFAULT_HOST = 'localhost';

export const RQM_DEFAULT_URL = 'amqp://localhost';
export const RQM_DEFAULT_QUEUE = 'default';
export const RQM_DEFAULT_PREFETCH_COUNT = 0;
export const RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT = false;
export const RQM_DEFAULT_QUEUE_OPTIONS = {};
export const RQM_DEFAULT_NOACK = true;
export const RQM_DEFAULT_PERSISTENT = false;

export const EADDRINUSE = 'EADDRINUSE';
export const ECONNREFUSED = 'ECONNREFUSED';
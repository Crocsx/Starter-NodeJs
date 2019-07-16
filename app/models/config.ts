export interface Config {
    mongodb: {
        local: {
            host: string
            databaseName: string
            port: number
        },
        dev: {
            host: string
            databaseName: string
            port: number
        },
        prod: {
            host: string
            databaseName: string
            port: number
        }
    };
}
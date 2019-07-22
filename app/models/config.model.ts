export interface IConfig {
    server: {
        [key:string]: {
            hostname: string
            port: number
        },
        local: {
            hostname: string
            port: number
        },
        development: {
            hostname: string
            port: number
        },
        production: {
            hostname: string
            port: number
        }
    }
    mongodb: {
        [key:string]: {
            host: string
            databaseName: string
            port: number
        },
        local: {
            host: string
            databaseName: string
            port: number
        },
        development: {
            host: string
            databaseName: string
            port: number
        },
        production: {
            host: string
            databaseName: string
            port: number
        }
    },
    token: {
        [key:string]: {key : string},
        local: {
            key : string
        }
        development: {
            key : string
        }
        production: {
            key : string
        }
    }
}

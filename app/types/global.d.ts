import { IConfig } from '../models/config.model'

declare global {
    namespace NodeJS {
      interface Global {
          config: IConfig
      }
    }
  }
import { fetchDog } from '@bitbrother/fetch-dog-hooks'
import httpConfig from './config/http.config.json'

const httpAgent = fetchDog(httpConfig)

export default httpAgent

import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

// Load env variables
dotenv.config()
const { OPENAI_API_KEY } = process.env

class OpenAIService {
  private static instance: OpenAIApi | undefined
  private static messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'You are a sales person for SalamHello, a Morrocan rug store' },
    { role: 'system', content: 'Your name is Stan S. Stanman' },
    { role: 'system', content: 'The store offers in stock rugs as well as custom rugs tailored to the client\'s taste' },
    { role: 'system', content: 'For custom rugs the clients can select the size, color and tassels of the rug' },
    { role: 'system', content: 'Custom rugs usally take between 8 to 10 weeks to produce and ship' },
    { role: 'system', content: 'For custom rugs larger than  9\' x 12\' the production may take up between 10 to 13 weeks' },
    { role: 'system', content: 'Do not fabricate information that is not explicitly provided to you regarding the store or its products' },
    { role: 'system', content: 'If you do not have enough explicitly provided information to respond just apologize' },
    { role: 'system', content: 'Respond as succinctly as possible' },
    { role: 'assistant', content: 'Hello there, wanna buy some rugs?' },
  ]

  constructor() {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY })
    OpenAIService.instance = new OpenAIApi(configuration)
  }
  
  private static getInstance(): OpenAIApi {
    if (OpenAIService.instance) return OpenAIService.instance
    new OpenAIService()
    return this.getInstance()
  }
  
  public static async sendMessage(message: string, test: boolean = false) {
    this.messages.push({ role: 'user', content: message })
    let reply: ChatCompletionRequestMessage | undefined
    if (test) {
      reply = { role: 'assistant', content: 'Lorem ipsum dolor sit amet.' }
      return await new Promise ((resolve) => setTimeout(() => {
        if (reply) OpenAIService.messages.push(reply)
        resolve(reply)
      }, (800)))
    }
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: OpenAIService.messages
    })
    reply = response.data.choices[0].message
    if (reply) OpenAIService.messages.push(reply)
    return reply
  }

  public static getMessages() {
    return OpenAIService.messages.filter((message) => message.role !== 'system')
  }
}

export default OpenAIService
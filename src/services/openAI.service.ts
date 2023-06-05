import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

// Load env variables
dotenv.config()
const { OPENAI_API_KEY } = process.env

class OpenAIService {
  private static instance: OpenAIApi | undefined
  private static messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'You are a sales person for SalamHello, a Morrocan rug store' },
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
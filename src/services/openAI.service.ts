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
  
  public static async sendMessage(message: string) {
    this.messages.push({ role: 'user', content: message })
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: OpenAIService.messages
    })
    const reply = response.data.choices[0].message?.content
    if (reply) OpenAIService.messages.push({ role: 'assistant', content: reply })
    return reply
  }

  public static getMessages() {
    return OpenAIService.messages
  }
}

export default OpenAIService
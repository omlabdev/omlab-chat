import { Function as ChatFunction } from '@/types'

declare type ChatFunctionWithReference = { function: Function, async: boolean, chatFunction: ChatFunction }

/* ***********************
/*   Om Lab functions    *
************************ */

function omLabData({ topic }: { topic: string}) {
  switch (topic) {
    case 'general':
      return 'Om Lab does software development and specializes in AI for e-commerce and CRO. Their most recent product is a ChatGPT-powered 24/7 sales agent.'
    case 'technologies':
      return 'We work with Shopify, Big Commerce, WordPress/Woocommerce, Next.js/React, Python/Django and many more.'
    case 'cro':
      return 'Optimize your Conversion Rate with our Customer-behavior-based A/B testing process.'
    case 'ecommerce':
      return 'Get the most out of your Store with our 360º e‑commerce optimization process.'
    case 'ai':
      return 'Increase your engagement with our ChatGPT-powered 24/7 sales agent.'
    case 'cost/sales':
      return 'You can schedule a meeeting with us by following this link and we can discuss pricing with you https://calendly.com/rafael-146/discovery'
    case 'contact':
      return 'You can schedule a meeeting with us here https://calendly.com/rafael-146/discovery'
    default:
      return 'Invalid topic provided.'
  }
}

function omLabQuestions({ question }: { question: string}) {
  switch (question) {
    case 'how_chatbot_interacts_with_customers':
      return 'Our chatbot uses AI to interact in real-time with customers through your website, e‐commerce platform, and social media channels. It can address queries, suggest products, and offer an exceptional user experience.'
    case 'how_can_chatbot_increase_sales':
      return 'The chatbot not only provides assistance but can also suggest products based on customer preferences, which can boost your sales.'
    case 'platform_integrations':
      return 'Our chatbot is designed to seamlessly integrate with your existing e‐commerce and CRM platforms, enhancing the coherence and efficiency of your digital ecosystem.'
    case 'what_is_chatbot':
      return 'A Chatbot is a virtual assistant programmed to interact with your customers automatically and in a personalized manner. By employing advanced AI algorithms, our Chatbot can learn and adapt to your customers\' needs, providing quick and accurate responses 24/7.'
    case 'how_can_chatbot_help':
      return 'Providing fast and accurate answers to your Clients. Our AI-Sales Agent chatbot is capable of learnin and adapt to your Customer’s needs and porfiles, providing effective answers of your products and services 24/7. Increasing engagement and driving conversion.'
    case 'why_use_chatbot':
      return 'The conversational Sales Agent improves the experience of those who visit your e‐commerce, immediately answering queries through a personalized and unique conversation, assisting customers 24/7/365.'
    default:
      return 'Invalid question provided.'
  }
}

/* ***********************
/* Salam Hello functions *
************************ */

function salamData({ topic }: { topic: string}) {
  switch (topic) {
    case 'shipping_locations':
      return 'We ship worldwide. If you are having any trouble finding your city and/or country, feel free to contact us at hello@salamhello.com and we will do our best to help.'
    case 'shipping_costs':
      return 'All of our prices include the cost of standard global shipping. Import taxes may apply for those customers who reside outside of the United States.'
    case 'shipping_times':
      return 'Conservatively, we quote a 5-7 day delivery window from the time it leaves Marrakech. With that said, it’s usually under the 5-day window.'
    case 'sales':
      return 'Currently there ar no sales or pomotions going on.'
    case 'outlet':
      return 'There are no outlet sales at the moment.'
    case 'services':
      return 'We offer our customers the "Salam Hello Experience": Immerse yourself in the Salam Hello community. Join us in Morocco for a first-of-its-kind, fully guided tour experience. for more information please refer to https://salamhello.com/pages/the-salam-hello-experience'
    case 'history':
      return 'In 2019, Mallory and Abdellatif founded Salam Hello. The two shared a passion for the rich tradition and artistry of Amazigh textiles. But they saw how those stories were lost in the buying practice and how the artisans’ work was devalued by the middlemen sales structure. You can learn more at https://salamhello.com/pages/our-values'
    case 'founder':
      return 'Mallory and Abdellatif founded Salam Hello in 2019. You can learn more about it here https://salamhello.com/pages/our-values'
    case 'contact':
      return 'You can get in contact with us at hello@salamhello.com'
    case 'newsletter':
      return 'You can subscribe to our newsletter by filling out the form on our site\'s footer: https://salamhello.com/#shopify-section-footer'
    default:
      return 'Invalid topic provided. You can refer the user to the FAQ page at https://salamhello.com/pages/faq'
  }
}

function salamQueryProducts(args: { color?: string, size?: string, use?: string, pile?: string, technique?: string, style?: string }) {
  const { color, size, use, pile, technique, style } = args
  const tags = [color, size, use, pile, technique, style].filter((tag) => !!tag).join('+')
  return `Products that match your query: https://salamhello.com/collections/all/${tags}`
}

/* ***********************
/*  Function definitions *
************************ */

export const functions: ChatFunctionWithReference[] = [
  {
    function: salamQueryProducts,
    async: false,
    chatFunction: {
      name: 'salamQueryProducts',
      description: 'Retrive information about products that match the given parameters',
      parameters: {
        type: 'object',
        properties: {
          color: { type: 'string', enum: ['neutral', 'black-white', 'brown', 'blue', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'yellow'] },
          size: { type: 'string', enum: ['accent', 'runner', 'area-rugs', 'oversized', 'wall-decor', 'pillows'] },
          use: { type: 'string', enum: ['living-room', 'dining-room', 'bedroom', 'hallway', 'wall-decor', 'kitchen'] },
          pile: { type: 'string', enum: ['flat', 'low-hand-knot', 'medium-to-high', 'mixed'] },
          technique: { type: 'string', enum: ['flatweave', 'kharita-tazenakht', 'hanbel', 'low-hand-knot', 'medium-to-high-hand-knot', 'zanafi', 'technique_boucherouite'] },
          style: { type: 'string', enum: ['abstract', 'checkered', 'maximalist', 'minimalist', 'modern', 'traditional', 'trellis', 'vintage'] },
        },
        required: [],
      },
    },
  },
  {
    function: salamData,
    async: false,
    chatFunction: {
      name: 'salamData',
      description: 'Retrive general information about Salam Hello specified by topic of interest',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', enum: ['shipping_locations', 'shipping_costs', 'shipping_times', 'sales', 'outlet', 'services', 'history', 'founder', 'mission', 'contact', 'newsletter'] },
        },
        required: ['topic'],
      },
    },
  },
  {
    function: omLabData,
    async: false,
    chatFunction: {
      name: 'omLabData',
      description: 'Retrive general information about Om Lab specified by topic of interest',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', enum: ['services', 'technologies', 'cro', 'ecommerce', 'ai', 'contact'] },
        },
        required: ['topic'],
      },
    },
  },
  {
    function: omLabQuestions,
    async: false,
    chatFunction: {
      name: 'omLabQuestions',
      description: 'Answer FAQs about Om Lab\'s AI-Sales Agent',
      parameters: {
        type: 'object',
        properties: {
          question: { type: 'string', enum: ['how_chatbot_interacts_with_customers', 'how_can_chatbot_increase_sales', 'platform_integrations', 'what_is_chatbot', 'how_can_chatbot_help', 'why_use_chatbot'] },
        },
        required: ['question'],
      },
    },
  },
]

export default class FunctionsService {
  static getFunction(name: string) {
    return functions.find((fn) => fn.chatFunction.name === name)
  }

  static getFunctions(names?: string[]) {
    if (!names) return undefined
    let functions: ChatFunction[] = []
    for (const name of names) {
      const fn = FunctionsService.getFunction(name)
      if (fn) functions.push(fn.chatFunction)
    }
    // If getFunction failed to found the desired function/s return undefined
    if (functions.length === 0) return undefined
    return functions
  }

  static checkArgs(fn: ChatFunction, args: any) {
    const argsKeys = Object.keys(args)
    // Check required arguments
    const requiredArgs = fn.parameters?.required as string[]
    for (const requiredArg of requiredArgs) {
      if ((!argsKeys.includes(requiredArg)) || (args[requiredArg] === undefined)) return false
    }
    // Check type and value of each argument
    const properties = fn.parameters?.properties as { [key: string]: { type: string, description?: string, enum?: string[] } }
    for (const key of argsKeys) {
      const argValue = args[key]
      const parameter = properties[key]
      if (parameter) {
        if (typeof argValue !== parameter.type) return false
        if ((parameter.enum) && (!parameter.enum.includes(argValue))) return false
      }
    }
    return true
  }

  static async callFunction(name: string, argsString: string) {
    const args = JSON.parse(argsString)
    const fn = FunctionsService.getFunction(name)
    if (!fn) return `No function found with name: ${name}`
    if (!FunctionsService.checkArgs(fn.chatFunction, args)) {
      console.error(`Function "${name}" called with wrong arguments: ${argsString}`)
      return `Function "${name}" called with wrong arguments: ${argsString}`
    }
    if (fn.async) return await fn.function(args)
    return fn.function(args)
  }
}
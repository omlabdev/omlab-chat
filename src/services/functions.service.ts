import { Function as ChatFunction } from '@/types'

declare type ChatFunctionWithReference = { function: Function, async: boolean, chatFunction: ChatFunction }

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
]

function salamQueryProducts(args: { color?: string, size?: string, use?: string, pile?: string, technique?: string, style?: string }) {
  const { color, size, use, pile, technique, style } = args
  const tags = [color, size, use, pile, technique, style].filter((tag) => !!tag).join('+')
  return `Products that match your query: https://salamhello.com/collections/all/${tags}`
}

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
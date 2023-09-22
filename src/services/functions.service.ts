import { Function } from '@/types'

export const functions: Function[] = [
  {
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
]

async function salamQueryProducts(args: { color?: string, size?: string, use?: string, pile?: string, technique?: string, style?: string }) {
  const { color, size, use, pile, technique, style } = args
  const tags = [color, size, use, pile, technique, style].filter((tag) => !!tag).join('+')
  return `Here is a list of products that suit your needs: https://salamhello.com/collections/all/${tags}`
}

export default class FunctionsService {
  static getFunction(name: string) {
    return functions.find((fn) => fn.name === name)
  }

  static getFunctions(names?: string[]) {
    if (!names) return undefined
    let functions: Function[] = []
    for (const name of names) {
      const fn = FunctionsService.getFunction(name)
      if (fn) functions.push(fn)
    }
    // If getFunction failed to found the desired function/s return undefined
    if (functions.length === 0) return undefined
    return functions
  }

  static async call(fn: string, argsString: string) {
    const args = JSON.parse(argsString)
    if (fn === 'salamQueryProducts') return await salamQueryProducts(args)
  }
}
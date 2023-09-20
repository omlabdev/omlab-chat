async function queryProducts(args: { color?: string, size?: string, use?: string, pile?: string, technique?: string, style?: string }) {
  const { color, size, use, pile, technique, style } = args
  const tags = [color, size, use, pile, technique, style].filter((tag) => !!tag).join('+')
  return `Here is a list of products that suit your needs: https://salamhello.com/collections/all/${tags}`
}

export default class SalamService {
  static async call(fn: string, argsString: string) {
    const args = JSON.parse(argsString)
    if (fn === 'queryProducts') return await queryProducts(args)
  }
}
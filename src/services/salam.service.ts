import { readFileSync } from 'fs'

import path from 'path'

import { parse } from '@fast-csv/parse'

async function getRawProducts(data: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const products: Product[] = []
    const stream = parse({ headers: true }).on('data', (product) => products.push(product)).on('end', () => resolve(products)).on('error', reject)
    stream.write(data)
    stream.end()
  })
}

async function getProducts() {
  const inventoryPath = path.join(__dirname, '../../../../../../../data/inventory.csv')
  const data = readFileSync(inventoryPath).toString()
  const rawProducts = await getRawProducts(data)
  const products: Product[] = []
  for (const rawProduct of rawProducts) {
    const product = products.find((product) => product.Handle === rawProduct.Handle)
    if (product) {
      product.variants.push(rawProduct)
    } else {
      rawProduct.variants = []
      products.push(rawProduct)
    }
  }
  return products
}

function cleanProductDescription(description: string) {
  return description.replace( /(<([^>]+)>)/ig, '')
}

async function queryProducts(args: { category: string, collection?: string, color?: string, size?: string, maxPrice?: number, minPrice?: number }) {
  const { category, collection, color, size, maxPrice, minPrice } = args
  const products = await getProducts()
  return products.filter((product) => {
    if (!product['Product Category'].toLowerCase().includes(category.toLowerCase())) return false
    if ((collection) && (!product.Tags.toLowerCase().includes(collection.toLowerCase()))) return false
    // if ((color) && (!product.Type.toLowerCase().includes(color.toLowerCase()))) return false
    // if ((size) && (!product.Type.toLowerCase().includes(size.toLowerCase()))) return false
    if ((maxPrice) && (Number(product['Variant Price']) > maxPrice)) return false
    if ((minPrice) && (Number(product['Variant Price']) < minPrice)) return false
    return true
  }).map((product) => ({
    title: product.Title,
    price: product['Variant Price'],
    url: `https://salamhello.com/products/${product.Handle}`,
    // description: cleanProductDescription(product['Body (HTML)']),
  }))
}

export default class SalamService {
  static async call(fn: string, argsString: string) {
    const args = JSON.parse(argsString)
    if (fn === 'queryProducts') return await queryProducts(args)
  }
}

declare type Product = {
  variants: Product[],
  'Handle': string,
  'Title': string,
  'Body (HTML)': string,
  'Vendor': string,
  'Product Category': string,
  'Type': string,
  'Tags': string,
  'Published': string,
  'Option1 Name': string,
  'Option1 Value': string,
  'Option2 Name': string,
  'Option2 Value': string,
  'Option3 Name': string,
  'Option3 Value': string,
  'Variant SKU': string,
  'Variant Grams': string,
  'Variant Inventory Tracker': string,
  'Variant Inventory Qty': string,
  'Variant Inventory Policy': string,
  'Variant Fulfillment Service': string,
  'Variant Price': string,
  'Variant Compare At Price': string,
  'Variant Requires Shipping': string,
  'Variant Taxable': string,
  'Variant Barcode': string,
  'Image Src': string,
  'Image Position': string,
  'Image Alt Text': string,
  'Gift Card': string,
  'SEO Title': string,
  'SEO Description': string,
  'Google Shopping / Google Product Category': string,
  'Google Shopping / Gender': string,
  'Google Shopping / Age Group': string,
  'Google Shopping / MPN': string,
  'Google Shopping / Condition': string,
  'Google Shopping / Custom Product': string,
  'Google Shopping / Custom Label 0': string,
  'Google Shopping / Custom Label 1': string,
  'Google Shopping / Custom Label 2': string,
  'Google Shopping / Custom Label 3': string,
  'Google Shopping / Custom Label 4': string,
  'Variant Image': string,
  'Variant Weight Unit': string,
  'Variant Tax Code': string,
  'Cost per item': string,
  'Included / United States': string,
  'Included / Australia': string,
  'Price / Australia': string,
  'Compare At Price / Australia': string,
  'Included / Canada': string,
  'Price / Canada': string,
  'Compare At Price / Canada': string,
  'Included / China': string,
  'Price / China': string,
  'Compare At Price / China': string,
  'Included / Denmark': string,
  'Price / Denmark': string,
  'Compare At Price / Denmark': string,
  'Included / Eurozone': string,
  'Price / Eurozone': string,
  'Compare At Price / Eurozone': string,
  'Included / International': string,
  'Price / International': string,
  'Compare At Price / International': string,
  'Included / Israel': string,
  'Price / Israel': string,
  'Compare At Price / Israel': string,
  'Included / Mexico': string,
  'Price / Mexico': string,
  'Compare At Price / Mexico': string,
  'Included / New Zealand': string,
  'Price / New Zealand': string,
  'Compare At Price / New Zealand': string,
  'Included / Norway': string,
  'Price / Norway': string,
  'Compare At Price / Norway': string,
  'Included / Sweden': string,
  'Price / Sweden': string,
  'Compare At Price / Sweden': string,
  'Included / Switzerland': string,
  'Price / Switzerland': string,
  'Compare At Price / Switzerland': string,
  'Included / United Kingdom': string,
  'Price / United Kingdom': string,
  'Compare At Price / United Kingdom': string,
  'Status': string,
}
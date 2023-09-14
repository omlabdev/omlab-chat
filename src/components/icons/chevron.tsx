export type Orientations = 'down' | 'left' | 'right' | 'up'

export default function Chevron({ color = '#000', orientation = 'down' }: { color?: string, orientation?: Orientations }) {
  let rotate = '0'
  if (orientation === 'left') rotate = '90'
  if (orientation === 'right') rotate = '-90'
  if (orientation === 'up') rotate = '180'
  return (
    <svg height={20} width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={color} transform={`rotate(${rotate})`}>
      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
    </svg>
  )
}
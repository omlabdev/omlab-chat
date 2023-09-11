import Script from 'next/script'

export default function Store() {
  const chat = { name: 'NAME' }
  
  return (
    <main className="container">
      <Script src="/embed.js" data-chat-id="b9f3c19e140223f86da61d8cbb06ce5f1c48d79e0afa99f2b3814b3be3c76ff7" />
      <h1 className="title">
        Om Lab GPT | Demo - {chat.name}
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, corrupti laborum? Est, quasi at quos sequi vel, aliquid hic ad iste maiores provident necessitatibus harum autem eveniet ratione repellat explicabo?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, corrupti laborum? Est, quasi at quos sequi vel, aliquid hic ad iste maiores provident necessitatibus harum autem eveniet ratione repellat explicabo?
      </p>
    </main>
  )
}
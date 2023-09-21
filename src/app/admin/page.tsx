import Chevron from '@/components/icons/chevron'

export default function Admin() {

  return (
    <main className="container page-admin">
      <h1 className="title">
        Om Lab GPT | Admin
      </h1>
      <ul className="admin__links">
        <li>
          <a className="admin__link" href="/admin/setup">
            <span>Setup</span>
            <Chevron orientation="right" />
          </a>
        </li>
        <li>
          <a className="admin__link" href="/admin/store">
            <span>Test</span>
            <Chevron orientation="right" />
          </a>
        </li>
      </ul>
    </main>
  )
}
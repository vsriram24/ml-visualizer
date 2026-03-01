import { Outlet } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Sidebar } from '../../components/layout/Sidebar'
import { SECTION_MAP } from '../../data/algorithms-meta'

const section = SECTION_MAP['fundamentals']

export default function FundamentalsPage() {
  return (
    <PageWrapper title="ML Fundamentals">
      <div className="flex gap-10">
        <Sidebar section={section} />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </PageWrapper>
  )
}

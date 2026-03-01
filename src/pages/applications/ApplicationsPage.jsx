import { Outlet } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Sidebar } from '../../components/layout/Sidebar'
import { SECTION_MAP } from '../../data/algorithms-meta'

const section = SECTION_MAP['applications']

export default function ApplicationsPage() {
  return (
    <PageWrapper title="GenAI Applications">
      <div className="flex gap-10">
        <Sidebar section={section} />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </PageWrapper>
  )
}

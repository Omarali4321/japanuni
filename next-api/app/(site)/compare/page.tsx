import { Suspense } from 'react'
import CompareContent from './compare-content'
export default function Page() { return <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">Loading...</div>}><CompareContent /></Suspense> }

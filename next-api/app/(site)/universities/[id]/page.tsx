import DetailContent from './detail-content'
export default function Page({ params }: { params: { id: string } }) { return <DetailContent id={params.id} /> }

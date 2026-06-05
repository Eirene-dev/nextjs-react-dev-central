import ShowcaseGallery from '@/components/showcases/ShowcaseGallery'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Showcases',
  description: '직접 만든 웹·AI 데모 — 카테고리로 둘러보세요.',
})

export default function ShowcasesPage() {
  return <ShowcaseGallery />
}

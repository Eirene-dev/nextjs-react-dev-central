'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from '@/components/Image'

type ImageSources = {
  sm: string
  md: string
  lg: string
  xl: string
}

interface ScreenShotProps {
  images: ImageSources
}

const ScreenShot: React.FC<ScreenShotProps> = ({ images }) => {
  return (
    <Tabs defaultValue="sm">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="sm">모바일</TabsTrigger>
        <TabsTrigger value="md">태블릿</TabsTrigger>
        <TabsTrigger value="lg">노트북</TabsTrigger>
        <TabsTrigger value="xl">테스크탑</TabsTrigger>
      </TabsList>
      <TabsContent value="sm">
        <Card>
          <div className="relative w-full">
            <Image src={images.sm} alt="sm" width={212.5} height={385.5} className="object-cover" />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="md">
        <Card>
          <div className="relative w-full">
            <Image src={images.md} alt="md" width={384} height={385.5} className="object-cover" />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="lg">
        <Card>
          <div className="relative w-full">
            <Image src={images.lg} alt="lg" width={512} height={385.5} className="object-cover" />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="xl">
        <Card>
          <div className="relative w-full">
            <Image src={images.xl} alt="xl" width={720} height={385.5} className="object-cover" />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ScreenShot

import Image from 'next/image'

// 앞면·중간(책등)·뒷면을 나란히 — /levelup/book 과 같은 배치.
// 높이(480px)를 맞추고 폭은 원본 픽셀 비율로 계산한다. 좁은 폭에선 앞면만 보인다.
const H = 480

type Cover = { src: string; width: number; height: number }

const w = (c: Cover) => Math.round((H * c.width) / c.height)

export default function BookCovers({
  title,
  front,
  middle,
  back,
}: {
  title: string
  front: Cover
  middle: Cover
  back: Cover
}) {
  return (
    <div className="flex flex-col justify-center p-0 sm:flex-row">
      <Image
        src={front.src}
        alt={`${title} 앞면`}
        width={w(front)}
        height={H}
        className="mx-auto h-auto w-full max-w-[335px] sm:mx-0 sm:h-[480px] sm:w-auto"
        priority
      />
      <Image
        src={middle.src}
        alt={`${title} 책등`}
        width={w(middle)}
        height={H}
        className="hidden sm:block sm:h-[480px] sm:w-auto"
      />
      <Image
        src={back.src}
        alt={`${title} 뒷면`}
        width={w(back)}
        height={H}
        className="hidden sm:block sm:h-[480px] sm:w-auto"
      />
    </div>
  )
}

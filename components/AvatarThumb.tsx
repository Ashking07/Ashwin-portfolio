'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function AvatarThumb({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)

  if (!ok) {
    return (
      <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-200 text-[12px] font-bold text-zinc-700 ring-1 ring-black/5 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10">
        AK
      </span>
    )
  }

  return (
    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="32px"
        priority
        className="object-cover"
        onError={() => setOk(false)}
      />
    </span>
  )
}

import { createServerFn } from '@tanstack/react-start'
import { nanoid } from 'nanoid'

import { prisma } from './prisma'

export const createPost = createServerFn({ method: 'POST' })
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new TypeError('Invalid form data')
    }
    const content = formData.get('markdown')

    if (!content) {
      throw new Error('Content is required')
    }
    return {
      content: content.toString(),
    }
  })
  .handler(async ({ data: { content } }) => {
    const publicId = nanoid(10)
    await prisma.post.create({
      data: {
        content,
        publicId,
      },
    })

    // throw redirect({
    //     to: `/$publicId`,
    //     params: { publicId }
    // })
    return {
      publicId,
      content,
    }
  })

export const updatePost = createServerFn({ method: 'POST' })
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new TypeError('Invalid form data')
    }
    const publicId = formData.get('publicId')
    const content = formData.get('content')

    if (!content || !publicId) {
      throw new Error('Content and publicId are required')
    }
    return {
      content: content.toString(),
      publicId: publicId.toString(),
    }
  })
  .handler(async ({ data: { content, publicId } }) => {
    await prisma.post.update({
      where: { publicId },
      data: {
        content,
      },
    })

    return {
      publicId,
      content,
    }
  })

export const getPost = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    const post = await prisma.post.findFirst({
      where: {
        publicId: data,
      },
    })
    return post
  })

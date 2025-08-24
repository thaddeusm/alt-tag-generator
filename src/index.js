import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const schema = z.object({
  key: z.string(),
  imageURL: z.string()
})

const app = new Hono()

app.post('/generate-alt-text', zValidator('json', schema), async (c) => {
  const body = await c.req.valid('json')

  // use user-provided key
  const openai = createOpenAI({
    apiKey: body.key
  })

  let result;

  try {
    result = await generateText({
      // most efficient and affordable model as of 08/2025
      model: openai('gpt-5-nano'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'describe the image in 10 words or less',
            },
            {
              type: 'image',
              image: new URL(
                body.imageURL,
              ),
            },
          ],
        },
      ],
    });
  } catch(error) {
    // handle API access errors (e.g. quota exceeded)
    return c.json(error, 429)
  }

  return c.json(result)
})

export default app

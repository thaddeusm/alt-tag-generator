import { Hono } from 'hono'
import { createOpenAI, openai } from '@ai-sdk/openai';
import { generateText } from 'ai'

const app = new Hono()

app.post('/generate-alt-text', async (c) => {
  const body = await c.req.json()

  // use user-provided provider key
  const openai = createOpenAI({
    apiKey: body.key
  })

  const result = await generateText({
    model: openai('gpt-4.1'),
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

  return c.json(result);
})

export default app

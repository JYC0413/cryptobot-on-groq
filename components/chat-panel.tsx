import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const exampleMessages = [
    {
      heading: 'Show me a cryptocurrency chart',
      subheading: 'for BTC',
      message: 'Show me a cryptocurrency chart for BTC'
    },
    {
      heading: 'Show me a cryptocurrency chart',
      subheading: 'for ETH',
      message: 'Show me a cryptocurrency chart for ETH'
    },
    {
      heading: 'Show me a cryptocurrency chart',
      subheading: 'for BTC and ETH',
      message: 'Show me a cryptocurrency chart for BTC and ETH'
    },
    {
      heading: 'Generate a cryptocurrency heatmap',
      subheading: 'for the top 50 coins',
      message: 'Generate a cryptocurrency heatmap for the top 50 coins'
    },
    {
      heading: 'What is the value',
      subheading: `of bitcoin?`,
      message: `What's the value of bitcoin?`
    },
    {
      heading: `Show me the prices`,
      subheading: 'for bitcoin, ethereum, and tether',
      message: `Show me the prices for bitcoin, ethereum, and tether.`
    },
    {
      heading: 'Give me detailed information',
      subheading: 'about bitcoin',
      message: `Give me detailed information about bitcoin`
    },
    {
      heading: 'Give me detailed information and exchange prices',
      subheading: 'for bitcoin',
      message: 'Give me detailed information and exchange prices for bitcoin'
    }
  ]

  interface ExampleMessage {
    heading: string
    subheading: string
    message: string
  }

  const [randExamples, setRandExamples] = useState<ExampleMessage[]>([])

  useEffect(() => {
    const shuffledExamples = [...exampleMessages].sort(
      () => 0.5 - Math.random()
    )
    setRandExamples(shuffledExamples)
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            randExamples.map((example, index) => (
              <div
                key={example.heading}
                className={`
                    cursor-pointer border bg-white p-4 
                    hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900
                    ${index >= 4 ? 'hidden md:block' : ''}
                    ${index >= 2 ? 'hidden 2xl:block' : ''}
                  `}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )
                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

'use client'

import {cn} from '@/lib/utils'
import {ChatList} from '@/components/chat-list'
import {ChatPanel} from '@/components/chat-panel'
import {EmptyScreen} from '@/components/empty-screen'
import {useLocalStorage} from '@/lib/hooks/use-local-storage'
import {useEffect, useState} from 'react'
import {useAIState, useUIState} from 'ai/rsc'
import {Message, Session} from '@/lib/types'
import {usePathname, useRouter} from 'next/navigation'
import {useScrollAnchor} from '@/lib/hooks/use-scroll-anchor'
import {toast} from 'sonner'
import {TickerTape} from '@/components/tradingview/ticker-tape'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: Session
}

export function Chat({id, className, session}: ChatProps) {
    const router = useRouter()
    const path = usePathname()
    const [input, setInput] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [messages] = useUIState()
    const [aiState] = useAIState()

    const [_, setNewChatId] = useLocalStorage('newChatId', id)

    useEffect(() => {
        if(messages.length && messages.length % 2 === 0) {
            setLoading(false)
        }else {
            setLoading(true)
        }
        if (session?.user) {
            if (!path.includes('chat') && messages.length === 1) {
                window.history.replaceState({}, '', `/chat/${id}`)
            }
        }
    }, [id, path, session?.user, messages])

    useEffect(() => {
        const messagesLength = aiState.messages?.length
        if (messagesLength === 2) {
            router.refresh()
        }
    }, [aiState.messages, router])

    useEffect(() => {
        setNewChatId(id)
    })

    const {messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom} =
        useScrollAnchor()

    return (
        <div
            className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
            ref={scrollRef}
        >
            <TickerTape/>

            <div
                className={cn(
                    messages.length ? 'pb-[200px] pt-4 md:pt-6' : 'pb-[200px] pt-0',
                    className
                )}
                ref={messagesRef}
            >
                {messages.length ? (
                    <ChatList messages={messages} isLoading={isLoading} isShared={false} session={session}/>
                ) : (
                    <EmptyScreen/>
                )}
                <div className="w-full h-px" ref={visibilityRef}/>
            </div>
            <ChatPanel
                id={id}
                input={input}
                setInput={setInput}
                isAtBottom={isAtBottom}
                scrollToBottom={scrollToBottom}
            />
        </div>
    )
}

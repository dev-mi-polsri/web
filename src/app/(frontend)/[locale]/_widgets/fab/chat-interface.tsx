'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Maximize2, Minimize2, X, Send, Bot, FlaskConical } from 'lucide-react'
import { useMobile } from '../../_hooks/use-mobile'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@ai-sdk/react'
import { useAutoScroll } from '@/hooks/use-auto-scroll'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface ChatInterfaceProps {
  onClose: () => void
}

interface Source {
  content: string
  path?: string
  title?: string
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const t = useTranslations('layout.chatbot')
  const [isMaximized, setIsMaximized] = useState(false)
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, Source[]>>({})
  const isMobile = useMobile()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai',
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources')
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, 'base64').toString('utf8'))
        : []

      const messageIndexHeader = response.headers.get('x-message-index')
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        })
      }
    },
  })

  const { containerRef, handleScroll, handleTouchStart } = useAutoScroll([messages])

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Container variants for animation
  const getContainerVariants = () => {
    if (isMobile) {
      return {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 },
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      }
    }

    if (isMaximized) {
      return {
        initial: { opacity: 0, scale: 0.8, y: 20, x: 20 },
        animate: { opacity: 1, scale: 1, y: 0, x: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20, x: 20 },
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      }
    }

    return {
      initial: { opacity: 0, scale: 0.8, y: 20, x: 20 },
      animate: { opacity: 1, scale: 1, y: 0, x: 0 },
      exit: { opacity: 0, scale: 0.8, y: 20, x: 20 },
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    }
  }

  const getContainerClasses = () => {
    if (isMobile) {
      return 'fixed inset-0 z-50 flex flex-col'
    }

    if (isMaximized) {
      return 'fixed bottom-6 right-6 w-[500px] h-[600px] z-50 flex flex-col'
    }

    return 'fixed bottom-6 right-6 w-[350px] h-[450px] z-50 flex flex-col'
  }

  return (
    <motion.div {...getContainerVariants()} className={getContainerClasses()}>
      <Card className="flex flex-col h-full border-0 shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <h3 className="font-medium">MI Assistant</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge>
                    <FlaskConical /> Beta
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('beta')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-1">
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMaximize}
                className="h-8 w-8 hover:bg-primary/20"
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-primary/20"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent
          className="flex-1 overflow-y-auto p-4 space-y-4"
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
        >
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={'flex justify-start'}
            >
              <div className={'max-w-[80%] rounded-lg p-3 bg-muted'}>
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary">MI Assistant</span>
                </div>
                <div className="text-sm space-y-2">
                  <p>{t('baseMessage')}</p>
                </div>
              </div>
            </motion.div>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-primary" />
                      <span className="text-xs font-medium text-primary">MI Assistant</span>
                    </div>
                  )}
                  <div className="text-sm space-y-2">
                    <MarkdownRenderer>{message.content}</MarkdownRenderer>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary">MI Assistant</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="p-3 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('input')}
              className="flex-1"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
              >
                <Send size={16} className="text-primary-foreground" />
              </Button>
            </motion.div>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

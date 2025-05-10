'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Maximize2, Minimize2, X, Send, Bot, Smile } from 'lucide-react'
import { useMobile } from '../../_hooks/use-mobile'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInterfaceProps {
  onClose: () => void
}

interface Message {
  id: string
  content: string
  isUser: boolean
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Let's review your diary entries! I can find and summarize any information that you saved.",
      isUser: false,
    },
  ])
  const [input, setInput] = useState('')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')

    // Show typing indicator
    setIsTyping(true)

    // Simulate AI response (in a real app, you'd call an API here)
    setTimeout(() => {
      setIsTyping(false)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm your AI assistant. How can I help you today?",
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  // Determine size based on device and maximized state
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
        <CardHeader className="flex flex-row items-center justify-between bg-primray text-primray-foreground">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <h3 className="font-medium">MI Assistant</h3>
          </div>
          <div className="flex items-center gap-1">
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMaximize}
                className="h-8 w-8 hover:bg-muted"
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-muted"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-primary" />
                      <span className="text-xs font-medium text-primary">MI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary">MI Assistant</span>
                </div>
                <div className="flex space-x-1">
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
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-3 border-t">
          <div className="flex w-full items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <Smile size={18} />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can you help me?"
              className="flex-1"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

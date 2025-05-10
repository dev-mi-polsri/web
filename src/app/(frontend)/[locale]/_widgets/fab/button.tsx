'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChatInterface from './chat-interface'

import { AnimatePresence, motion } from 'framer-motion'

export default function FabButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              className="rounded-full w-14 h-14 p-0 shadow-lg transition-all"
              aria-label="Open chat"
            >
              <MessageCircle className="h-8 w-8 fill-white text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

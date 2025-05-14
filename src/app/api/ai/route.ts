// import { NextRequest, NextResponse } from 'next/server'
// import { Message as VercelChatMessage, LangChainAdapter } from 'ai'

import { NextResponse } from 'next/server'

// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
// import { PromptTemplate } from '@langchain/core/prompts'
// import { Document } from '@langchain/core/documents'
// import { RunnableSequence } from '@langchain/core/runnables'
// import { StringOutputParser } from '@langchain/core/output_parsers'
// import { loadVectorStore } from './_lib/store'

// export const runtime = 'nodejs'

// const combineDocumentsFn = (docs: Document[]) => {
//   const serializedDocs = docs.map((doc) => doc.pageContent)
//   return serializedDocs.join('\n\n')
// }

// const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
//   const formattedDialogueTurns = chatHistory.map((message) => {
//     if (message.role === 'user') {
//       return `Human: ${message.content}`
//     } else if (message.role === 'assistant') {
//       return `Assistant: ${message.content}`
//     } else {
//       return `${message.role}: ${message.content}`
//     }
//   })
//   return formattedDialogueTurns.join('\n')
// }
// const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question. Important: Keep the exact same language as the original question.

// <chat_history>
//     {chat_history}
// </chat_history>

// Follow Up Input: {question}
// Standalone question (in the same language as the input):`
// const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE)

// const ANSWER_TEMPLATE = `You are an AI assistant for the Information Management Department at Politeknik Negeri Sriwijaya (POLSRI). Your role is to provide helpful and accurate information about the department, including its programs, courses, facilities, admissions, and other related information.

// Answer the question based only on the following context and chat history:
// <context>
//     {context}
// </context>

// <chat_history>
//     {chat_history}
// </chat_history>

// Question: {question}

// Important guidelines:
// - Provide clear and concise information
// - Be professional and helpful
// - If information is not available in the context, politely say so
// - Maintain a friendly but professional tone
// - You must respond in the EXACT SAME LANGUAGE as the question. If the question is in Indonesian, answer in Indonesian. If in English, answer in English.`

// const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE)

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const messages = body.messages ?? []
//     const previousMessages = messages.slice(0, -1)
//     const currentMessageContent = messages[messages.length - 1].content

//     const model = new ChatGoogleGenerativeAI({
//       model: 'gemini-2.0-flash',
//       temperature: 0.4,
//     })

//     const vectorstore = loadVectorStore()

//     const standaloneQuestionChain = RunnableSequence.from([
//       condenseQuestionPrompt,
//       model,
//       new StringOutputParser(),
//     ])

//     let resolveWithDocuments: (value: Document[]) => void
//     const documentPromise = new Promise<Document[]>((resolve) => {
//       resolveWithDocuments = resolve
//     })

//     const retriever = vectorstore.asRetriever({
//       callbacks: [
//         {
//           handleRetrieverEnd(documents) {
//             resolveWithDocuments(documents)
//           },
//         },
//       ],
//     })

//     const retrievalChain = retriever.pipe(combineDocumentsFn)

//     const answerChain = RunnableSequence.from([
//       {
//         context: RunnableSequence.from([(input) => input.question, retrievalChain]),
//         chat_history: (input) => input.chat_history,
//         question: (input) => input.question,
//       },
//       answerPrompt,
//       model,
//     ])

//     const conversationalRetrievalQAChain = RunnableSequence.from([
//       {
//         question: standaloneQuestionChain,
//         chat_history: (input) => input.chat_history,
//       },
//       answerChain,
//     ])

//     const stream = await conversationalRetrievalQAChain.stream({
//       question: currentMessageContent,
//       chat_history: formatVercelMessages(previousMessages),
//     })

//     const documents = await documentPromise
//     const serializedSources = Buffer.from(
//       JSON.stringify(
//         documents.map((doc) => {
//           return {
//             pageContent: doc.pageContent.slice(0, 50) + '...',
//             metadata: doc.metadata,
//           }
//         }),
//       ),
//     ).toString('base64')

//     return LangChainAdapter.toDataStreamResponse(stream, {
//       init: {
//         headers: {
//           'x-message-index': (previousMessages.length + 1).toString(),
//           'x-sources': serializedSources,
//         },
//       },
//     })
//     // eslint-disable-next-line
//   } catch (e: any) {
//     console.error(e)
//     return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
//   }
// }

export function GET() {
  return NextResponse.json({ message: 'Coming Soon!' })
}

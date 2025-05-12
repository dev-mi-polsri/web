import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector'
import { Pool } from '@neondatabase/serverless'
;(async () => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const ragContent = fs.readFileSync(path.join(__dirname, 'data/rag.md'), 'utf-8')

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
      chunkSize: 256,
      chunkOverlap: 20,
    })

    const splitDocuments = await splitter.createDocuments([ragContent])

    await PGVectorStore.fromDocuments(splitDocuments, new GoogleGenerativeAIEmbeddings(), {
      pool: new Pool({
        connectionString: process.env.DATABASE_URI as string,
      }),
      tableName: 'documents',
      schemaName: 'rag',
      distanceStrategy: 'cosine',
    })

    console.log('OK')
    return true
  } catch (error) {
    console.log('ERR')

    console.error(error)
    return false
  }
})()

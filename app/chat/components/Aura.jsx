'use client'

import AnalysisResults from '@/components/AnalysisResult'
import ChatMessage from '@/components/ChatMessage'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'


export default function Home() {
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: "Hi! I'm here to help analyze job requirements. Let's start with the technology you're hiring for."
    }])
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
    const [analysisResults, setAnalysisResults] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async (userInput) => {
        if (!userInput.trim() || isLoading) return

        setIsLoading(true)
        const newMessages = [...messages, { role: 'user', content: userInput }]
        setMessages(newMessages)

        try {
            const lastAssistantMessage = messages[messages.length - 1].content.toLowerCase()
            const userResponse = userInput.toLowerCase()

            // Check if this should trigger final analysis
            const isAnalysisTrigger =
                (lastAssistantMessage.includes('aligned with what you') ||
                    lastAssistantMessage.includes('shall we wrap up') ||
                    lastAssistantMessage.includes('would you like') ||
                    lastAssistantMessage.includes('is this summary')) &&
                (userResponse.includes('yes') ||
                    userResponse.includes('sure') ||
                    userResponse.includes('ok') ||
                    userResponse.includes('go ahead'));

            if (isAnalysisTrigger) {
                // Make the final analysis request
                const analysisResponse = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: newMessages,
                        isFinalAnalysis: true
                    }),
                })

                const data = await analysisResponse.json()

                // Parse and set the analysis results
                const parsedResults = {
                    mustHave: [],
                    goodToHave: [],
                    explanation: ''
                }

                const lines = data.message.split('\n')
                let currentSection = null

                for (const line of lines) {
                    if (line.includes('Must Have Technical Skills:')) {
                        currentSection = 'must'
                    } else if (line.includes('Good to Have Technical Skills:')) {
                        currentSection = 'good'
                    } else if (line.includes('Brief Explanation:')) {
                        currentSection = 'explanation'
                    } else if (line.trim().startsWith('-')) {
                        const skill = line.trim().substring(1).trim()
                        if (currentSection === 'must') {
                            parsedResults.mustHave.push(skill)
                        } else if (currentSection === 'good') {
                            parsedResults.goodToHave.push(skill)
                        }
                    } else if (currentSection === 'explanation' && line.trim()) {
                        parsedResults.explanation += line.trim() + ' '
                    }
                }

                setAnalysisResults(parsedResults)
                setIsAnalysisComplete(true)
            } else {
                // Regular conversation flow
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: newMessages,
                        isFinalAnalysis: false
                    }),
                })

                const data = await response.json()
                setMessages([...newMessages, { role: 'assistant', content: data.message }])
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#0f1117] text-gray-100">
            <Sidebar />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-8">JD Analyzer</h1>

                {!isAnalysisComplete ? (
                    <>
                        <div className="space-y-4 mb-8">
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    role={message.role}
                                    content={message.content}
                                />
                            ))}
                        </div>

                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Type your response..."
                                className="w-full bg-[#1e1e2d] border border-gray-700 rounded-lg p-3 text-gray-100 pr-12"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        handleSendMessage(e.target.value)
                                        e.target.value = ''
                                    }
                                }}
                                disabled={isLoading}
                            />
                            {isLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-8">
                        <AnalysisResults results={analysisResults} />
                        <button
                            onClick={() => {
                                setMessages([{
                                    role: 'assistant',
                                    content: "Hi! I'm here to help analyze job requirements. Let's start with the technology you're hiring for."
                                }])
                                setIsAnalysisComplete(false)
                                setAnalysisResults(null)
                            }}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Start New Analysis
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
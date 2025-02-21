export default function ChatMessage({ role, content }) {
    return (
        <div className={`flex items-start gap-4 p-4 border-b border-gray-800`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${role === 'assistant' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                {role === 'assistant' ? 'A' : 'U'}
            </div>
            <div className="flex-1">
                {content}
            </div>
        </div>
    )
}
'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useArcana } from '@/lib/store'

interface JournalProps {
  initialEntry?: string
  onSave?: (entry: string) => void
  placeholder?: string
  title?: string
}

export function JournalComponent({ 
  initialEntry = '', 
  onSave,
  placeholder = "What insights arise from today's reading?",
  title = "Your Reflection"
}: JournalProps) {
  const [entry, setEntry] = useState(initialEntry)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPrompts, setShowPrompts] = useState(false)
  const { updateJournal } = useArcana()

  // Auto-save every 30 seconds
  useEffect(() => {
    if (entry !== initialEntry && entry.trim()) {
      const timer = setTimeout(() => {
        handleSave(true) // Silent save
      }, 30000)
      
      return () => clearTimeout(timer)
    }
  }, [entry, initialEntry])

  const handleSave = async (silent = false) => {
    if (!silent) setIsSaving(true)
    
    try {
      // Update local state
      updateJournal(entry)
      
      // Call external save handler if provided
      onSave?.(entry)
      
      setLastSaved(new Date())
      
      // Here you would also save to Supabase
      // await saveJournalEntry(entry)
      
    } catch (error) {
      console.error('Error saving journal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const addPromptText = (promptText: string) => {
    const newText = entry ? `${entry}\n\n${promptText}` : promptText
    setEntry(newText)
  }

  const wordCount = entry.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <Card className="bg-black/20 border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif text-white">{title}</h3>
        <div className="text-purple-400 text-sm">
          {wordCount} words
        </div>
      </div>
      
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder={placeholder}
        className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400 min-h-40 mb-4 resize-none"
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-purple-400 text-xs">
          {lastSaved ? (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          ) : entry !== initialEntry ? (
            <span>Unsaved changes</span>
          ) : (
            <span>Auto-saves as you write</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPrompts(!showPrompts)}
            variant="outline"
            size="sm"
            className="bg-black/20 border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            {showPrompts ? 'Hide' : 'Show'} Prompts
          </Button>
          <Button 
            onClick={() => handleSave()}
            disabled={isSaving || entry === initialEntry}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        </div>
      </div>
      
      {/* Journal prompts */}
      {showPrompts && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 border-t border-purple-500/20"
        >
          <h4 className="text-purple-200 text-sm mb-3">Reflection prompts:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button 
              onClick={() => addPromptText("What surprised me: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • What surprised me about this reading?
            </button>
            <button 
              onClick={() => addPromptText("This connects to: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • How does this connect to my current life?
            </button>
            <button 
              onClick={() => addPromptText("I want to remember: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • What do I want to remember from this?
            </button>
            <button 
              onClick={() => addPromptText("Questions this raises: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • What questions does this raise for me?
            </button>
            <button 
              onClick={() => addPromptText("Action I might take: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • What action might I take from this insight?
            </button>
            <button 
              onClick={() => addPromptText("Pattern I notice: ")}
              className="text-left p-2 text-purple-400 text-xs hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
            >
              • What pattern do I notice emerging?
            </button>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

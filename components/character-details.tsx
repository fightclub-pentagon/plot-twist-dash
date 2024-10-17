'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { GameplayData } from '@/app/gameplay/[gameplayId]/page'
import { getImageUrl } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export function CharacterDetails(gameplay_data: GameplayData) {
  const [overviewExpanded, setOverviewExpanded] = useState(false)
  const [backstoryExpanded, setBackstoryExpanded] = useState(false)
  const [rulesExpanded, setRulesExpanded] = useState(false)

  const toggleSection = (section: 'overview' | 'backstory' | 'rules') => {
    switch (section) {
      case 'overview':
        setOverviewExpanded(!overviewExpanded)
        break
      case 'backstory':
        setBackstoryExpanded(!backstoryExpanded)
        break
      case 'rules':
        setRulesExpanded(!rulesExpanded)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="mb-4 flex items-center">
        <Link href={`/gameplay/${gameplay_data.id}`} className="mr-4 text-2xl text-gray-400 hover:text-gray-300">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">{gameplay_data.character.name}</h1>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg">
        <Image
          src={getImageUrl(gameplay_data.character.image)}
          alt="Character"
          width={400}
          height={400}
          className="w-full object-cover"
        />
      </div>

      <CollapsibleSection
        title="Character Overview"
        expanded={overviewExpanded}
        onToggle={() => toggleSection('overview')}
      >
        <p className="text-gray-300">
          {gameplay_data.character.overview}
        </p>
      </CollapsibleSection>

      <CollapsibleSection
        title="Character Backstory"
        expanded={backstoryExpanded}
        onToggle={() => toggleSection('backstory')}
      >
        <p className="text-gray-300">
          {gameplay_data.character.backstory}
        </p>
      </CollapsibleSection>

      <CollapsibleSection
        title="Rules"
        expanded={rulesExpanded}
        onToggle={() => toggleSection('rules')}
      >
        <p className="text-gray-300">
          {gameplay_data.game.rules.content}
        </p>
      </CollapsibleSection>

      <p className="mt-4 text-sm text-gray-400">
        Don&apos;t forget to add your character&apos;s backstory and personality traits!
      </p>

      <p className="mt-2 text-sm text-gray-400">
        Your character&apos;s appearance and mannerisms help bring them to life.
      </p>
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({ title, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-gray-800 shadow">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

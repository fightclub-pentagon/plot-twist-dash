'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Types
type ToastType = 'error' | 'warning' | 'info' | 'success'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message: string
}

interface ToastState {
  toasts: ToastProps[]
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastProps }
  | { type: 'REMOVE_TOAST'; payload: string }

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Reducer
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.payload, ...state.toasts] }
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((toast) => toast.id !== action.payload) }
    default:
      return state
  }
}

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [])

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: 'ADD_TOAST', payload: { id, ...toast } })
    setTimeout(() => removeToast(id), 10000) // Auto remove after 10 seconds
  }, [removeToast]) // Add removeToast to the dependency array

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center pt-4 px-4 sm:items-end">
        <AnimatePresence>
          {state.toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Toast Component
const Toast: React.FC<Omit<ToastProps, 'id'> & { onClose: () => void }> = ({ type, title, message, onClose }) => {
  const bgColor = {
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
  }[type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`w-full max-w-sm rounded-lg shadow-lg overflow-hidden ${bgColor} mb-4`}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          onClose()
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mt-2 text-sm text-white">{message}</p>
      </div>
    </motion.div>
  )
}

// Hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Example usage component
export const ToastExample: React.FC = () => {
  const { addToast } = useToast()

  const showToast = (type: ToastType) => {
    addToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: `This is a ${type} message.`,
    })
  }

  return (
    <div className="space-x-2">
      <button onClick={() => showToast('error')} className="px-4 py-2 bg-red-500 text-white rounded">
        Show Error
      </button>
      <button onClick={() => showToast('warning')} className="px-4 py-2 bg-yellow-500 text-white rounded">
        Show Warning
      </button>
      <button onClick={() => showToast('info')} className="px-4 py-2 bg-blue-500 text-white rounded">
        Show Info
      </button>
      <button onClick={() => showToast('success')} className="px-4 py-2 bg-green-500 text-white rounded">
        Show Success
      </button>
    </div>
  )
}

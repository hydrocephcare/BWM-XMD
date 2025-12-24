"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

interface BatchSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  filterType: "documentation" | "database" | "both"
  title: string
}

interface Batch {
  name: string
  hasDoc: boolean
  hasDB: boolean
  docPrice?: number
  dbPrice?: number
}

export function BatchSelectorModal({ isOpen, onClose, filterType, title }: BatchSelectorModalProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadBatches()
    }
  }, [isOpen])

  const loadBatches = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("*").order("batch_name", { ascending: true })

      if (error) {
        console.error("[v0] Error loading batches:", error)
        return
      }

      const batchMap = new Map<string, Batch>()

      data?.forEach((file) => {
        const batch = file.batch_name
        if (!batchMap.has(batch)) {
          batchMap.set(batch, { name: batch, hasDoc: false, hasDB: false })
        }

        const batchData = batchMap.get(batch)!
        if (file.file_type === "Word") {
          batchData.hasDoc = true
          batchData.docPrice = file.price
        } else if (file.file_type === "Access") {
          batchData.hasDB = true
          batchData.dbPrice = file.price
        }
      })

      let filteredBatches = Array.from(batchMap.values())

      if (filterType === "documentation") {
        filteredBatches = filteredBatches.filter((b) => b.hasDoc)
      } else if (filterType === "database") {
        filteredBatches = filteredBatches.filter((b) => b.hasDB)
      } else if (filterType === "both") {
        filteredBatches = filteredBatches.filter((b) => b.hasDoc && b.hasDB)
      }

      setBatches(filteredBatches)
    } catch (error) {
      console.error("[v0] Failed to load batches:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No batches available for this option</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {batches.map((batch) => (
              <Link key={batch.name} href={`/projects#${batch.name}`}>
                <button
                  onClick={onClose}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-gold-400 hover:bg-gold-50 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-navy-800">{batch.name}</h3>
                    <div className="flex gap-2">
                      {batch.hasDoc && <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded">Doc</span>}
                      {batch.hasDB && <span className="text-xs bg-navy-100 text-navy-700 px-2 py-1 rounded">DB</span>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {batch.hasDoc && batch.hasDB
                      ? `KES ${Math.min(batch.docPrice || 0, batch.dbPrice || 0)} - KES ${Math.max(batch.docPrice || 0, batch.dbPrice || 0)}`
                      : `KES ${batch.docPrice || batch.dbPrice}`}
                  </p>
                </button>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}

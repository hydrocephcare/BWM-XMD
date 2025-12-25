"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Loader2, FileText, Database } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Batch {
  name: string
  hasDocumentation: boolean
  hasDatabase: boolean
  docPrice?: number
  dbPrice?: number
}

interface BatchSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  milestoneType: "1" | "2" | "both"
}

export function BatchSelectorModal({ isOpen, onClose, milestoneType }: BatchSelectorModalProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      loadBatches()
    }
  }, [isOpen])

  const loadBatches = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("*").order("batch_name", { ascending: true })

      if (error) {
        console.error("Error loading batches:", error)
        return
      }

      const batchMap = new Map<string, Batch>()

      data?.forEach((project) => {
        if (!batchMap.has(project.batch_name)) {
          batchMap.set(project.batch_name, {
            name: project.batch_name,
            hasDocumentation: false,
            hasDatabase: false,
          })
        }

        const batch = batchMap.get(project.batch_name)!
        if (project.file_type === "Word") {
          batch.hasDocumentation = true
          batch.docPrice = project.price
        } else if (project.file_type === "Access") {
          batch.hasDatabase = true
          batch.dbPrice = project.price
        }
      })

      let filteredBatches = Array.from(batchMap.values())

      if (milestoneType === "1") {
        filteredBatches = filteredBatches.filter((b) => b.hasDocumentation)
      } else if (milestoneType === "2") {
        filteredBatches = filteredBatches.filter((b) => b.hasDatabase)
      } else if (milestoneType === "both") {
        filteredBatches = filteredBatches.filter((b) => b.hasDocumentation && b.hasDatabase)
      }

      setBatches(filteredBatches)
    } catch (error) {
      console.error("Failed to load batches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBatch = (batchName: string) => {
    const milestoneParam = milestoneType === "1" ? "1" : milestoneType === "2" ? "2" : "both"
    router.push(`/projects?batch=${encodeURIComponent(batchName)}&milestone=${milestoneParam}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
          <div>
            <CardTitle className="text-2xl text-navy-800">Select a Batch</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Choose the project files you'd like to download
            </CardDescription>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <X className="h-6 w-6" />
          </button>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
            </div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No batches available</p>
              <p className="text-gray-500 text-sm mt-1">for this milestone type</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {batches.map((batch) => (
                <button
                  key={batch.name}
                  onClick={() => handleSelectBatch(batch.name)}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-300 bg-white p-6 transition-all duration-300 hover:border-navy-500 hover:shadow-lg hover:bg-navy-50"
                >
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-navy-800">{batch.name}</h3>
                      <Badge className="bg-navy-600 text-white hover:bg-navy-700">Available</Badge>
                    </div>

                    <div className="space-y-2">
                      {batch.hasDocumentation && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 group-hover:bg-navy-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-navy-600" />
                            <span className="text-sm font-medium text-gray-800">Documentation</span>
                          </div>
                          <span className="text-sm font-bold text-navy-800">KES {batch.docPrice}</span>
                        </div>
                      )}
                      {batch.hasDatabase && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 group-hover:bg-navy-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-navy-600" />
                            <span className="text-sm font-medium text-gray-800">Database</span>
                          </div>
                          <span className="text-sm font-bold text-navy-800">KES {batch.dbPrice}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-4 bg-navy-600 hover:bg-navy-700 text-white font-medium transition-all duration-300 group-hover:shadow-lg"
                    >
                      View Files
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

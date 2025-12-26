"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, FileText, Database, LinkIcon, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: string
  file_url: string
  price: number
  is_external_link: boolean
  documentation_url?: string
  has_documentation: boolean
  has_database: boolean
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    batch: "Batch 1",
    price: 50,
    // Documentation fields
    docUploadMethod: "file" as "file" | "link",
    docFile: null as File | null,
    docExternalLink: "",
    // Database fields
    dbUploadMethod: "file" as "file" | "link",
    dbFile: null as File | null,
    dbExternalLink: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("batch_name", { ascending: true })

      if (error) {
        console.error("Error loading projects:", error)
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadForm.name || !uploadForm.batch) {
      alert("Please fill in all required fields")
      return
    }

    // Validate documentation
    const hasDoc = uploadForm.docUploadMethod === "file" ? !!uploadForm.docFile : !!uploadForm.docExternalLink
    // Validate database
    const hasDb = uploadForm.dbUploadMethod === "file" ? !!uploadForm.dbFile : !!uploadForm.dbExternalLink

    if (!hasDoc || !hasDb) {
      alert("Please provide both Documentation (Word) and Database (Access) files")
      return
    }

    setUploading(true)

    try {
      let docUrl = ""
      let dbUrl = ""

      // Upload Documentation
      if (uploadForm.docUploadMethod === "file" && uploadForm.docFile) {
        const formData = new FormData()
        formData.append("file", uploadForm.docFile)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (!data.url) throw new Error("Documentation upload failed")
        docUrl = data.url
      } else {
        docUrl = uploadForm.docExternalLink
      }

      // Upload Database
      if (uploadForm.dbUploadMethod === "file" && uploadForm.dbFile) {
        const formData = new FormData()
        formData.append("file", uploadForm.dbFile)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (!data.url) throw new Error("Database upload failed")
        dbUrl = data.url
      } else {
        dbUrl = uploadForm.dbExternalLink
      }

      // Insert into Supabase
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from("projects")
        .insert([
          {
            batch_name: uploadForm.batch,
            file_name: uploadForm.name,
            file_type: "Access", // Database file type
            price: uploadForm.price,
            file_url: dbUrl,
            documentation_url: docUrl,
            is_external_link: uploadForm.dbUploadMethod === "link",
            has_documentation: true,
            has_database: true,
          },
        ])

      if (insertError) throw insertError

      await loadProjects()
      setUploadForm({
        name: "",
        batch: "Batch 1",
        price: 50,
        docUploadMethod: "file",
        docFile: null,
        docExternalLink: "",
        dbUploadMethod: "file",
        dbFile: null,
        dbExternalLink: "",
      })
      setShowUpload(false)
      alert("Project added successfully!")
    } catch (error) {
      alert("Upload failed. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error
      await loadProjects()
      alert("Project deleted successfully")
    } catch (error) {
      alert("Failed to delete project")
      console.error("Delete error:", error)
    }
  }

  const batches = [...new Set(projects.map((p) => p.batch_name))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Project Management</h1>
              <p className="text-gray-600">Manage KCSE Computer Studies Projects</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin">
                <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                  Back to Admin
                </Button>
              </Link>
              <Button 
                onClick={() => setShowUpload(!showUpload)} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
              >
                <Upload className="w-4 h-4 mr-2" />
                Add New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <Card className="p-6 md:p-8 mb-8 shadow-xl border-2 border-blue-200 bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Project Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name *</label>
                  <Input
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    placeholder="e.g., School Management System 2025"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input
                      value={uploadForm.batch}
                      onChange={(e) => setUploadForm({ ...uploadForm, batch: e.target.value })}
                      placeholder="Batch 1"
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (KES) *</label>
                    <Input
                      type="number"
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm({ ...uploadForm, price: Number.parseInt(e.target.value) })}
                      min="1"
                      required
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-gray-900">Documentation (Word) *</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, docUploadMethod: "file", docExternalLink: "" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.docUploadMethod === "file"
                        ? "border-blue-600 bg-white shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Upload File</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, docUploadMethod: "link", docFile: null })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.docUploadMethod === "link"
                        ? "border-blue-600 bg-white shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <LinkIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">External Link</p>
                  </button>
                </div>

                {uploadForm.docUploadMethod === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept=".docx,.doc"
                      onChange={(e) => setUploadForm({ ...uploadForm, docFile: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">Accepted: .docx, .doc</p>
                  </div>
                ) : (
                  <Input
                    type="url"
                    value={uploadForm.docExternalLink}
                    onChange={(e) => setUploadForm({ ...uploadForm, docExternalLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    required
                    className="bg-white"
                  />
                )}
              </div>

              {/* Database Section */}
              <div className="bg-purple-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-lg text-gray-900">Database (Access) *</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, dbUploadMethod: "file", dbExternalLink: "" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.dbUploadMethod === "file"
                        ? "border-purple-600 bg-white shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium">Upload File</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, dbUploadMethod: "link", dbFile: null })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.dbUploadMethod === "link"
                        ? "border-purple-600 bg-white shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <LinkIcon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium">External Link</p>
                  </button>
                </div>

                {uploadForm.dbUploadMethod === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept=".accdb,.mdb"
                      onChange={(e) => setUploadForm({ ...uploadForm, dbFile: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">Accepted: .accdb, .mdb</p>
                  </div>
                ) : (
                  <Input
                    type="url"
                    value={uploadForm.dbExternalLink}
                    onChange={(e) => setUploadForm({ ...uploadForm, dbExternalLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    required
                    className="bg-white"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUpload(false)} 
                  className="flex-1"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Add Project"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Projects List */}
        <div className="space-y-8">
          {projects.length === 0 ? (
            <Card className="p-12 text-center bg-white shadow-lg">
              <Upload className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-medium">No projects uploaded yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add New Project" to get started</p>
            </Card>
          ) : (
            batches.map((batch) => {
              const batchProjects = projects.filter((p) => p.batch_name === batch)
              return (
                <div key={batch} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {batch}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {batchProjects.length} {batchProjects.length === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {batchProjects.map((file) => (
                      <Card key={file.id} className="p-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{file.file_name}</h3>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                <FileText className="w-3 h-3" />
                                Documentation
                              </span>
                              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                <Database className="w-3 h-3" />
                                Database
                              </span>
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Complete Project
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold text-blue-600">KES {file.price}</span>
                              {file.is_external_link && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                  External Link
                                </span>
                              )}
                            </div>
                          </div>

                          <Button 
                            variant="destructive" 
                            onClick={() => deleteFile(file.id)}
                            className="shadow-md hover:shadow-lg transition-shadow"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

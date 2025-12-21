"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, FileText, Database, LinkIcon, X } from "lucide-react"
import Link from "next/link"

interface ProjectFile {
  id: string
  name: string
  type: "word" | "access"
  url: string
  price: number
  batch: number
  isExternalLink?: boolean
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file")
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "word" as "word" | "access",
    price: 50,
    batch: 1,
    file: null as File | null,
    externalLink: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem("projectFiles")
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }

  const saveProjects = (newProjects: ProjectFile[]) => {
    localStorage.setItem("projectFiles", JSON.stringify(newProjects))
    setProjects(newProjects)
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadForm.name) {
      alert("Please enter a file name")
      return
    }

    if (uploadMethod === "file" && !uploadForm.file) {
      alert("Please select a file to upload")
      return
    }

    if (uploadMethod === "link" && !uploadForm.externalLink) {
      alert("Please enter an external link")
      return
    }

    setUploading(true)

    try {
      let fileUrl = ""

      if (uploadMethod === "file" && uploadForm.file) {
        const formData = new FormData()
        formData.append("file", uploadForm.file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        if (!data.url) {
          throw new Error("Upload failed")
        }
        fileUrl = data.url
      } else {
        fileUrl = uploadForm.externalLink
      }

      const newFile: ProjectFile = {
        id: Date.now().toString(),
        name: uploadForm.name,
        type: uploadForm.type,
        url: fileUrl,
        price: uploadForm.price,
        batch: uploadForm.batch,
        isExternalLink: uploadMethod === "link",
      }

      saveProjects([...projects, newFile])

      setUploadForm({
        name: "",
        type: "word",
        price: 50,
        batch: 1,
        file: null,
        externalLink: "",
      })
      setShowUpload(false)
      alert("File added successfully!")
    } catch (error) {
      alert("Upload failed. Please try again.")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      saveProjects(projects.filter((p) => p.id !== id))
    }
  }

  const batches = [...new Set(projects.map((p) => p.batch))].sort()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Project Files</h1>
            <p className="text-gray-600 mt-1">Upload and manage KCSE project files</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
            <Button onClick={() => setShowUpload(!showUpload)} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Add New File
            </Button>
          </div>
        </div>

        {showUpload && (
          <Card className="p-6 mb-8 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Project File</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Upload Method</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    uploadMethod === "file" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Upload File</p>
                  <p className="text-xs text-gray-500 mt-1">Upload .docx or .accdb file</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("link")}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    uploadMethod === "link" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <LinkIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">External Link</p>
                  <p className="text-xs text-gray-500 mt-1">Google Drive, Dropbox, etc.</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">File Name *</label>
                <Input
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g., Computer Studies Project 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">File Type *</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as "word" | "access" })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="word">Microsoft Word</option>
                    <option value="access">Microsoft Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (KES) *</label>
                  <Input
                    type="number"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: Number.parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Batch Number *</label>
                  <Input
                    type="number"
                    value={uploadForm.batch}
                    onChange={(e) => setUploadForm({ ...uploadForm, batch: Number.parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              {uploadMethod === "file" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Upload File *</label>
                  <input
                    type="file"
                    accept=".docx,.accdb"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: .docx, .accdb</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">External Link *</label>
                  <Input
                    type="url"
                    value={uploadForm.externalLink}
                    onChange={(e) => setUploadForm({ ...uploadForm, externalLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste link from Google Drive, Dropbox, OneDrive, etc.</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {uploading ? "Adding..." : `Add ${uploadMethod === "file" ? "File" : "Link"}`}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-8">
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No files uploaded yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "Add New File" to get started</p>
            </Card>
          ) : (
            batches.map((batch) => (
              <div key={batch}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Batch {batch}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    ({projects.filter((p) => p.batch === batch).length} files)
                  </span>
                </h2>
                <div className="grid gap-4">
                  {projects
                    .filter((p) => p.batch === batch)
                    .map((file) => (
                      <Card key={file.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              {file.type === "word" ? (
                                <FileText className="w-6 h-6 text-blue-600" />
                              ) : (
                                <Database className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900">{file.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-500">
                                  {file.type === "word" ? "Word Document" : "Access Database"}
                                </span>
                                <span className="text-sm font-medium text-blue-600">KES {file.price}</span>
                                {file.isExternalLink && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    External Link
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => deleteFile(file.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

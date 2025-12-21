"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, FileText, Database } from "lucide-react"
import Link from "next/link"

interface ProjectFile {
  id: string
  name: string
  type: "word" | "access"
  url: string
  price: number
  batch: number
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "word" as "word" | "access",
    price: 50,
    batch: 1,
    file: null as File | null,
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
    if (!uploadForm.file || !uploadForm.name) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", uploadForm.file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.url) {
        const newFile: ProjectFile = {
          id: Date.now().toString(),
          name: uploadForm.name,
          type: uploadForm.type,
          url: data.url,
          price: uploadForm.price,
          batch: uploadForm.batch,
        }

        saveProjects([...projects, newFile])

        setUploadForm({
          name: "",
          type: "word",
          price: 50,
          batch: 1,
          file: null,
        })
        setShowUpload(false)
        alert("File uploaded successfully!")
      }
    } catch (error) {
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = (id: string) => {
    if (confirm("Delete this file?")) {
      saveProjects(projects.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Project Files</h1>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
            <Button onClick={() => setShowUpload(!showUpload)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload New File
            </Button>
          </div>
        </div>

        {showUpload && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Upload New File</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">File Name</label>
                <Input
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g., Computer Studies Project 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">File Type</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as "word" | "access" })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="word">Microsoft Word</option>
                    <option value="access">Microsoft Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (KES)</label>
                  <Input
                    type="number"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: Number.parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Batch Number</label>
                  <Input
                    type="number"
                    value={uploadForm.batch}
                    onChange={(e) => setUploadForm({ ...uploadForm, batch: Number.parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <input
                  type="file"
                  accept=".docx,.accdb"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No files uploaded yet</p>
            </Card>
          ) : (
            projects.map((file) => (
              <Card key={file.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {file.type === "word" ? (
                        <FileText className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Database className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        Batch {file.batch} • {file.type === "word" ? "Word" : "Access"} • KES {file.price}
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteFile(file.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

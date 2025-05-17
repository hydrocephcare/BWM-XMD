"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Save, Trash, PlusCircle, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Storage key for team members
const STORAGE_KEY = "victory-school-team"

export function TeamEditor() {
  const [teamMembers, setTeamMembers] = useState([{ name: "", role: "", bio: "", image: "" }])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved team members on component mount
  useEffect(() => {
    try {
      const savedTeam = localStorage.getItem(STORAGE_KEY)
      if (savedTeam) {
        const parsedTeam = JSON.parse(savedTeam)
        if (parsedTeam.length > 0) {
          setTeamMembers(parsedTeam)
        }
      }
    } catch (error) {
      console.error("Error loading saved team:", error)
    }
  }, [])

  // Handle team member changes
  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeam = [...teamMembers]
    updatedTeam[index][field] = value
    setTeamMembers(updatedTeam)
  }

  // Add new team member
  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "", bio: "", image: "" }])
  }

  // Remove team member
  const removeTeamMember = (index) => {
    if (teamMembers.length === 1) {
      setTeamMembers([{ name: "", role: "", bio: "", image: "" }])
    } else {
      const updatedTeam = teamMembers.filter((_, i) => i !== index)
      setTeamMembers(updatedTeam)
    }
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Filter out empty team members
      const filteredTeam = teamMembers.filter((member) => member.name.trim() !== "" && member.role.trim() !== "")

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTeam))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("Team members saved successfully!")

      // Refresh the page to show the changes
      setTimeout(() => {
        window.location.href = "/about?team=" + Date.now()
      }, 1500)
    } catch (error) {
      console.error("Error saving changes:", error)
      setSaveMessage("Error saving changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Team Members</h1>
        <Button onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{saveMessage}</div>
      )}

      <div className="space-y-6">
        {teamMembers.map((member, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {member.name || `Team Member ${index + 1}`}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={() => removeTeamMember(index)} className="h-8 w-8">
                <Trash className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-${index}`}>Role</Label>
                    <Input
                      id={`role-${index}`}
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                      placeholder="Lead Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`bio-${index}`}>Bio</Label>
                    <Textarea
                      id={`bio-${index}`}
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(index, "bio", e.target.value)}
                      placeholder="Computer Science teacher with over 10 years of experience"
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <ImageUploader
                      initialImage={member.image}
                      onImageChange={(url) => handleTeamMemberChange(index, "image", url)}
                      aspectRatio="portrait"
                      buttonText="Upload Profile Photo"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addTeamMember} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Team Member
        </Button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
        <h3 className="font-bold">Team Members Display</h3>
        <p className="mt-2">
          Team members will appear on the About page. You can add as many team members as you want. Empty team members
          will not be displayed.
        </p>
      </div>
    </div>
  )
}

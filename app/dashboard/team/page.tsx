"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Sample data for demonstration
const initialTeamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Designer",
    permission: "editor",
    avatar: "/placeholder.svg?height=40&width=40",
    tasks: 8,
    completedTasks: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Developer",
    permission: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    tasks: 12,
    completedTasks: 9,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "Product Manager",
    permission: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    tasks: 15,
    completedTasks: 10,
  },
  {
    id: 4,
    name: "Sarah Kim",
    email: "sarah@example.com",
    role: "Marketing",
    permission: "viewer",
    avatar: "/placeholder.svg?height=40&width=40",
    tasks: 6,
    completedTasks: 3,
  },
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    permission: "viewer",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) return

    const member = {
      id: teamMembers.length + 1,
      ...newMember,
      avatar: "/placeholder.svg?height=40&width=40",
      tasks: 0,
      completedTasks: 0,
    }

    setTeamMembers([...teamMembers, member])
    setNewMember({
      name: "",
      email: "",
      role: "",
      permission: "viewer",
    })
    setIsDialogOpen(false)
  }

  const getPermissionBadge = (permission) => {
    switch (permission) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Admin</Badge>
      case "editor":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Editor</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Viewer</Badge>
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Members</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search team..."
                className="w-[200px] pl-8 md:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new team member to your project. They will receive an email invitation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="Developer, Designer, etc."
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="permission">Permission Level</Label>
                    <Select
                      value={newMember.permission}
                      onValueChange={(value) => setNewMember({ ...newMember, permission: value })}
                    >
                      <SelectTrigger id="permission">
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>Add Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <CardDescription className="text-sm">{member.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{member.email}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{member.completedTasks}</span>
                    <span className="text-gray-500">/{member.tasks} tasks</span>
                  </div>
                  {getPermissionBadge(member.permission)}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}


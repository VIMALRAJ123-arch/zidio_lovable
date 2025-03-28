"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Bell, CreditCard, Globe } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Product Manager with 5+ years of experience in SaaS products.",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskAssigned: true,
    taskUpdated: true,
    commentAdded: true,
    dueDateReminders: true,
    weeklyDigest: false,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
  })
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    density: "comfortable",
    defaultView: "kanban",
  })
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "Google Calendar", connected: true, lastSync: "2024-05-20T10:30:00" },
    { id: 2, name: "Slack", connected: false, lastSync: null },
    { id: 3, name: "GitHub", connected: true, lastSync: "2024-05-19T14:45:00" },
    { id: 4, name: "Jira", connected: false, lastSync: null },
  ])
  const [billingInfo, setBillingInfo] = useState({
    plan: "pro",
    billingCycle: "monthly",
    nextBillingDate: "2024-06-15",
    paymentMethod: "Visa ending in 4242",
  })

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1500)
  }

  const handleNotificationUpdate = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
    }, 1000)
  }

  const handleSecurityUpdate = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved.",
      })
    }, 1000)
  }

  const handleAppearanceUpdate = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      })
    }, 1000)
  }

  const toggleIntegration = (id) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              connected: !integration.connected,
              lastSync: integration.connected ? null : new Date().toISOString(),
            }
          : integration,
      ),
    )

    toast({
      title: "Integration updated",
      description: `Integration has been ${integrations.find((i) => i.id === id).connected ? "disconnected" : "connected"} successfully.`,
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information and public details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileForm.avatar} alt="Profile" />
                      <AvatarFallback>{profileForm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleProfileUpdate} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="taskAssigned" className="text-sm">
                            Task assigned to you
                          </Label>
                        </div>
                        <Switch
                          id="taskAssigned"
                          checked={notificationSettings.taskAssigned}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, taskAssigned: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="taskUpdated" className="text-sm">
                            Task updated
                          </Label>
                        </div>
                        <Switch
                          id="taskUpdated"
                          checked={notificationSettings.taskUpdated}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, taskUpdated: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="commentAdded" className="text-sm">
                            Comment added to your task
                          </Label>
                        </div>
                        <Switch
                          id="commentAdded"
                          checked={notificationSettings.commentAdded}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, commentAdded: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="dueDateReminders" className="text-sm">
                            Due date reminders
                          </Label>
                        </div>
                        <Switch
                          id="dueDateReminders"
                          checked={notificationSettings.dueDateReminders}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, dueDateReminders: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="weeklyDigest" className="text-sm">
                            Weekly digest
                          </Label>
                        </div>
                        <Switch
                          id="weeklyDigest"
                          checked={notificationSettings.weeklyDigest}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNotificationUpdate} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Change Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly to keep your account secure
                      </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <Badge variant="outline" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                    >
                      <SelectTrigger id="sessionTimeout" className="w-[180px]">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSecurityUpdate} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, theme: value })}
                    >
                      <SelectTrigger id="theme" className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="density">Interface Density</Label>
                    <Select
                      value={appearanceSettings.density}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, density: value })}
                    >
                      <SelectTrigger id="density" className="w-[180px]">
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Control the spacing and density of the interface</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="defaultView">Default Task View</Label>
                    <Select
                      value={appearanceSettings.defaultView}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, defaultView: value })}
                    >
                      <SelectTrigger id="defaultView" className="w-[180px]">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kanban">Kanban Board</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Choose your preferred task view layout</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleAppearanceUpdate} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with other tools and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {integration.connected
                              ? `Connected • Last synced: ${formatDate(integration.lastSync)}`
                              : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        onClick={() => toggleIntegration(integration.id)}
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your subscription and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {billingInfo.plan === "pro" ? "Pro" : billingInfo.plan === "team" ? "Team" : "Free"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {billingInfo.billingCycle === "monthly" ? "Monthly" : "Annual"} billing
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Next billing date: {billingInfo.nextBillingDate}
                      </p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Payment Method</h3>
                        <p className="text-sm text-muted-foreground">{billingInfo.paymentMethod}</p>
                      </div>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Billing History</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>May 15, 2024</span>
                        <span>$15.00</span>
                        <Badge variant="outline">Paid</Badge>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Apr 15, 2024</span>
                        <span>$15.00</span>
                        <Badge variant="outline">Paid</Badge>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Mar 15, 2024</span>
                        <span>$15.00</span>
                        <Badge variant="outline">Paid</Badge>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


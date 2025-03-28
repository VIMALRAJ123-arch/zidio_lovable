import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Zidio
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Zidio Task Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Streamline your workflow with our intuitive task management platform. Organize tasks, track
                    progress, and collaborate with your team in real-time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] lg:h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 w-[80%] h-[80%]">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-medium text-sm mb-2">To Do</h3>
                        <div className="space-y-2 flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-gray-400">
                            <p className="text-xs font-medium">Research competitors</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                                Medium
                              </span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 30</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-red-500">
                            <p className="text-xs font-medium">Update documentation</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded">High</span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 25</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-medium text-sm mb-2">In Progress</h3>
                        <div className="space-y-2 flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                            <p className="text-xs font-medium">Design new landing page</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                In Progress
                              </span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 28</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-purple-500">
                            <p className="text-xs font-medium">Implement authentication</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                In Review
                              </span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 26</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-medium text-sm mb-2">Completed</h3>
                        <div className="space-y-2 flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-green-500">
                            <p className="text-xs font-medium">Setup project repository</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                Completed
                              </span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 20</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-green-500">
                            <p className="text-xs font-medium">Initial wireframes</p>
                            <div className="flex items-center mt-2">
                              <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                Completed
                              </span>
                              <span className="text-[10px] text-gray-500 ml-auto">May 18</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage tasks and boost productivity
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  >
                    <path d="M11 12H3" />
                    <path d="M16 6H3" />
                    <path d="M16 18H3" />
                    <path d="M18 9v6" />
                    <path d="M21 12h-6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Task Assignment and Prioritization</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Assign tasks to team members with clear deadlines and priority levels.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Role-Based Permissions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Control access levels by assigning roles like Admin, Editor, or Viewer to team members.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  >
                    <path d="M10 8.5a2.5 2.5 0 0 1 5 0v1.5a2.5 2.5 0 0 1-5 0V8.5Z" />
                    <path d="M10 8.5V7a5 5 0 1 1 5 5h-3.5" />
                    <path d="M17.64 3.64A9 9 0 1 0 21 12h-2" />
                    <path d="m22 2-5 5" />
                    <path d="m17 2 5 5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Deadline Tracking and Notification</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Set task deadlines and receive automated reminders to stay on schedule.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Real-Time Collaboration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Add comments, share files, and discuss tasks within the platform for seamless teamwork.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Progress Reporting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Generate reports on task completion and team performance with analytics for better decision-making.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Secure Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Ensure only verified users can access the platform using secure login authentication.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Zidio Task Management. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="mailto:support@zidio.in">
            support@zidio.in
          </Link>
        </nav>
      </footer>
    </div>
  )
}


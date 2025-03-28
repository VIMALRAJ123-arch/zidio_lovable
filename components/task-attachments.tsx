"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Image, Paperclip, Upload, X } from "lucide-react"

export function TaskAttachments({ attachments, onUpload, isUploading, uploadProgress }) {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ""
    const options = { month: "short", day: "numeric", year: "numeric" }
    return new Date(dateTimeString).toLocaleString(undefined, options)
  }

  const formatFileSize = (sizeString) => {
    return sizeString
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attachments</h3>
        <Button onClick={onUpload} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {isUploading && (
        <div className="p-4 border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                {getFileIcon(attachment.type)}
                <div>
                  <p className="text-sm font-medium">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy} on{" "}
                    {formatDateTime(attachment.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={attachment.url} download target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8 border rounded-md">
          <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No attachments yet</p>
          <p className="text-sm">Upload files to share with your team</p>
        </div>
      )}
    </div>
  )
}


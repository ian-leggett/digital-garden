const fs = require("fs")
const path = require("path")
const { globSync } = require("glob")

// Find all markdown files in content directory
const files = globSync("content/python/**/*.md")
console.log(`Found ${files.length} markdown files to process.`)

let addedCount = 0
let skippedCount = 0

files.forEach((file) => {
  // Read file content
  const content = fs.readFileSync(file, "utf8")

  // Check if frontmatter already exists
  if (content.trim().startsWith("---")) {
    console.log(`Skipping ${file} - already has frontmatter`)
    skippedCount++
    return
  }

  // Get filename for title
  const fileName = path.basename(file, ".md")
  const title = fileName.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Create basic frontmatter
  const frontmatter = `---
title: "${title}"
tags:
  - python
description: ""
date: ${new Date().toISOString().split("T")[0]}
---

`
  // Add frontmatter to content
  const newContent = frontmatter + content
  fs.writeFileSync(file, newContent)

  console.log(`Added frontmatter to ${file}`)
  addedCount++
})

console.log(
  `Done! Added frontmatter to ${addedCount} files, skipped ${skippedCount} files that already had frontmatter.`,
)

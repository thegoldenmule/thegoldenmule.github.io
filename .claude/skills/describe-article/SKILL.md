---
name: describe-article
description: Analyze archive article content and generate a subtitle and description
argument-hint: [filename]
---

# Describe Article Skill

Analyze archive article content and generate a concise subtitle and description for display in the archive listing.

## Usage

```
/describe-article <filename>
```

Example:
```
/describe-article 2020-03-12-git-is-for-everyone.md
```

## Workflow

1. **Read the article** from `public/archive/<filename>`
2. **Read manifest.json** to find the existing entry
3. **Analyze content** to understand:
   - Main topic and theme
   - Key technical concepts covered
   - The article's purpose (tutorial, reflection, experiment, etc.)
4. **Generate subtitle** - A brief tagline (5-10 words)
5. **Generate description** - A 1-2 sentence summary (20-40 words)
6. **Update manifest.json** with subtitle and description fields
7. **Report** what was added

## Content Guidelines

### Subtitle

The subtitle should be:
- **Brief**: 5-10 words maximum
- **Descriptive**: Capture the essence of the article
- **Engaging**: Draw readers in without being clickbait
- **Consistent tone**: Match the author's voice (technical but accessible)

Subtitle patterns:
- For tutorials: "A guide to [topic]" or "How to [accomplish X]"
- For reflections: "Thoughts on [topic]" or "Exploring [concept]"
- For experiments: "Building [thing]" or "Experimenting with [technology]"
- For deep-dives: "Understanding [concept]" or "Inside [technology]"

### Description

The description should be:
- **Informative**: Summarize what the reader will learn or experience
- **Concise**: 1-2 sentences, 20-40 words
- **Accurate**: Reflect the actual content, not just the title
- **Value-focused**: Highlight what makes the article worth reading

Avoid:
- Starting with "This article..." or "In this post..."
- Repeating the title verbatim
- Being too vague or generic
- Using excessive jargon

### Examples

**Article: "Internet, Einstein; Einstein, Internet"** (physics simulation)
```json
{
  "subtitle": "A relativistic physics simulator in JavaScript",
  "description": "Exploring special relativity through code: building a simulator that demonstrates Lorentz transformations and time dilation at near-light speeds."
}
```

**Article: "git is for everyone"** (teaching)
```json
{
  "subtitle": "Version control beyond code",
  "description": "Git isn't just for programmers. Learn how writers, designers, and other creatives can benefit from version control in their daily work."
}
```

**Article: "The Hard Things About Simple Things"** (philosophy)
```json
{
  "subtitle": "Why easy problems are often the hardest",
  "description": "A reflection on the deceptive complexity of seemingly simple software problems, and why experience teaches us to respect the basics."
}
```

**Article: "Deferred vs Forward Thinking"** (graphics/technical)
```json
{
  "subtitle": "Comparing rendering pipeline approaches",
  "description": "An exploration of deferred and forward rendering techniques, their trade-offs, and when to use each approach in modern graphics programming."
}
```

## Implementation

When the skill is invoked:

```
1. Parse the filename from arguments
2. Read public/archive/<filename>
3. Read public/archive/manifest.json

4. Analyze article content:
   - Extract title from frontmatter
   - Read the full article body
   - Identify main themes, technologies, and purpose
   - Note the writing style and tone

5. Generate subtitle:
   - Create a 5-10 word tagline
   - Capture the article's essence
   - Match the author's tone

6. Generate description:
   - Write 1-2 sentences (20-40 words)
   - Summarize key content and value
   - Be specific, not generic

7. Update manifest.json:
   - Find the post entry matching the filename
   - Add "subtitle" field
   - Add "description" field
   - Write updated manifest.json

8. Report: "Added subtitle and description to <filename>"
   - Show the subtitle
   - Show the description
```

## Data Structures

### manifest.json Post Entry (after describing)
```json
{
  "title": "Internet, Einstein; Einstein, Internet",
  "date": "2011-08-31T01:18:32.000Z",
  "filename": "2011-08-30-internet-einstein-einstein-internet.md",
  "originalUrl": "https://thegoldenmule.com/blog/2011/08/internet-einstein-einstein-internet/",
  "tags": ["experiments", "physics", "js"],
  "subtitle": "A relativistic physics simulator in JavaScript",
  "description": "Exploring special relativity through code: building a simulator that demonstrates Lorentz transformations and time dilation at near-light speeds."
}
```

## Notes

- Subtitle and description are applied without confirmation (auto-apply)
- The manifest.json is updated in place
- If the article already has a subtitle/description, they will be replaced
- Read the full article content to generate accurate descriptions
- Match the technical level and tone of the original article

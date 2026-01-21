# Tag Article Skill

Analyze archive article content and apply relevant tags from the canonical tag list.

## Usage

```
/tag-article <filename>
```

Example:
```
/tag-article 2020-03-12-git-is-for-everyone.md
```

## Workflow

1. **Read the article** from `public/archive/<filename>`
2. **Load canonical tags** from `public/archive/tags.json`
3. **Analyze content** for tag indicators:
   - Title keywords and patterns
   - Code block languages (```js, ```csharp, etc.)
   - Technical terms and framework mentions
   - Content depth and type
4. **Select 3-6 appropriate tags** based on analysis
5. **Update manifest.json** with the tags array
6. **Report** what tags were applied

## Tag Selection Guidelines

### Analyze These Content Signals

1. **Title keywords**: Map words in the title to tags using the keywords mapping in tags.json
2. **Code blocks**: Identify language hints from fenced code blocks
3. **Technical terms**: Look for framework names, libraries, and domain-specific vocabulary
4. **Content type patterns**:
   - "Quick Post" → `quick-tips`
   - "Book Review" → `reviews`, `learning`
   - Tutorial-style content → `teaching`
   - Personal experiments → `experiments`
   - Philosophy/reflection → `philosophy`
   - Historical content → `history`

### Tag Quantity Rules

- **Minimum**: 2 tags (content_type + at least one technical tag)
- **Maximum**: 6 tags (avoid over-tagging)
- **Ideal**: 3-5 tags

### Tag Priority

1. **Required**: Always include one content_type tag
2. **Primary**: Main technical domain (graphics, games, web, etc.)
3. **Secondary**: Specific technologies mentioned (unity, react, etc.)
4. **Languages**: Only if code examples are shown or language is discussed

### Examples

**Article about Unity physics**:
```json
["unity", "games", "physics", "cs", "teaching"]
```

**Philosophical post about software**:
```json
["philosophy", "software"]
```

**Quick tip about JavaScript**:
```json
["quick-tips", "js", "web"]
```

**WebGL graphics experiment**:
```json
["experiments", "webgl", "graphics", "js"]
```

## Implementation

When the skill is invoked:

```
1. Parse the filename from arguments
2. Read public/archive/<filename>
3. Read public/archive/tags.json
4. Read public/archive/manifest.json

5. Analyze article content:
   - Extract title from frontmatter
   - Find code blocks and their language hints
   - Scan for keywords from tags.json keywords mapping
   - Determine content type from title patterns and content

6. Select appropriate tags (3-6 tags)

7. Update manifest.json:
   - Find the post entry matching the filename
   - Add "tags" array to that entry
   - Write updated manifest.json

8. Report: "Applied tags [tag1, tag2, ...] to <filename>"
```

## Data Structures

### tags.json Structure
```json
{
  "tags": [
    "ai", "akka", "aws", "azure", "backend", "bootstrap", "c", "cg", "cs",
    "deep-dives", "docker", "dotnet", "experiments", "flash", "frontend",
    "games", "glsl", "go", "graphics", "haxe", "history", "java", "js",
    "learning", "liveops", "mobile", "nakama", "nodejs", "objc", "physics",
    "python", "react", "redux", "software", "solidity", "teaching", "ts",
    "typescript", "unity", "web", "web3", "webgl"
    // ... full list in tags.json
  ],
  "keywords": {
    "Unity": ["unity", "games", "cs"],
    "shader": ["graphics", "cg", "glsl"],
    ...
  }
}
```

### manifest.json Post Entry (after tagging)
```json
{
  "title": "Example Post",
  "date": "2020-01-01T00:00:00.000Z",
  "filename": "2020-01-01-example-post.md",
  "originalUrl": "https://...",
  "tags": ["teaching", "unity", "games", "cs"]
}
```

## Notes

- Tags are applied without confirmation (auto-apply)
- The manifest.json is updated in place
- If the article already has tags, they will be replaced
- Use the keywords mapping as a guide, but also apply judgment for unlisted terms

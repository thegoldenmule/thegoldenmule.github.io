---
name: add-item
description: Add an item to the timeline interactively
argument-hint: [url]
---

# Add Item Skill

Add an item to the timeline interactively through a guided workflow.

## Usage

```
/add-item [url]
```

Example:
```
/add-item https://medium.com/some-article
```

## Workflow

1. **Ask item type** - Use AskUserQuestion to determine the type of item:
   - media
   - product
   - writing
   - career
   - code

2. **Ask parent career** (if not a career type):
   - Read `public/timeline.json` to get all career entries
   - Present career titles as options (e.g., "Founder: Goldenmule Media", "Experiments", "Miscellaneous Writing")
   - User selects which career the new item belongs under

3. **Get URL** - Either from the argument passed to the skill or via AskUserQuestion

4. **Analyze URL content** - Use WebFetch to:
   - Extract title
   - Extract description/summary
   - Identify relevant tech tags (match against `public/archive/tags.json`)
   - Extract image URL if available (og:image, twitter:image, etc.)
   - Determine date

5. **Generate entry** - Create JSON entry based on the type

6. **Insert entry** - Add the entry in the correct location in `public/timeline.json`:
   - If career: add to root of `events` array, sorted by date
   - If non-career: add to specified career's `children` array, sorted by date

## Type to Category Mapping

| User Type | Category      | Type Field   | Additional Fields                        |
|-----------|---------------|--------------|------------------------------------------|
| media     | `media`       | -            | -                                        |
| product   | `products`    | -            | -                                        |
| writing   | `publications`| `"writing"`  | -                                        |
| career    | `career`      | -            | `children: []`, `size`, `connectedLines` |
| code      | `code`        | -            | -                                        |

## Entry Structure

### Non-career entry (child of a career)
```json
{
  "category": "publications",
  "title": "Article Title",
  "type": "writing",
  "date": "Jan 2026",
  "subtitle": "A brief tagline",
  "description": "1-2 sentence description of the content.",
  "url": "https://example.com/article",
  "imageUrl": "https://example.com/image.jpg",
  "tech": ["ai", "games", "deep-dives"]
}
```

### Career entry (root level)
```json
{
  "category": "career",
  "title": "Company Name",
  "subtitle": "Role Title",
  "type": "",
  "date": "2024-Present",
  "description": "Description of the role/company.",
  "url": "https://company.com",
  "imageUrl": "path/to/image.png",
  "tech": ["games", "web", "software"],
  "size": 45,
  "connectedLines": true,
  "children": []
}
```

## Date Format

Dates in the timeline use various formats:
- Month Year: `"Jan 2026"`, `"August 2024"`
- Year range: `"2020-2023"`, `"2023-Present"`
- Month-Month Year: `"Mar 2024 - Apr 2024"`
- Just year: `"2022"`

For new entries, prefer `"Month Year"` format (e.g., `"Jan 2026"`).

## Date Sorting

Entries are sorted by date (most recent first). The skill will:
1. Parse the date from the URL content or ask the user
2. Find the correct position in the array based on date
3. Insert at that position to maintain chronological order

## Valid Tech Tags

Reference `public/archive/tags.json` for valid tech tags. Common tags include:
- Languages: `js`, `ts`, `cs`, `go`, `python`, `java`
- Frameworks: `react`, `unity`, `nakama`, `nodejs`
- Categories: `games`, `web`, `web3`, `software`, `ai`
- Topics: `deep-dives`, `teaching`, `learning`, `experiments`, `liveops`

## Implementation

When the skill is invoked:

```
1. Parse optional URL from arguments

2. Ask item type via AskUserQuestion:
   - Options: media, product, writing, career, code

3. If NOT career type:
   - Read public/timeline.json
   - Extract all career titles from events array (items with category="career")
   - Ask which career this item belongs under via AskUserQuestion

4. Get URL:
   - If URL was passed as argument, use it
   - Otherwise, ask user for URL via AskUserQuestion

5. Analyze URL with WebFetch:
   - Extract page title
   - Extract meta description or og:description
   - Extract og:image or similar image URL
   - Look for publication date
   - Identify technology/topic keywords that match tags.json

6. Generate entry JSON:
   - Map user type to category (see mapping table above)
   - Set title from page analysis
   - Generate subtitle (brief tagline)
   - Set description from page analysis
   - Set url from input
   - Set imageUrl from page analysis
   - Set tech array from identified tags
   - For career entries: add children: [], size: 45, connectedLines: true

7. Show the generated entry to user for confirmation

8. Insert entry into timeline.json:
   - If career: insert into events array at correct date position
   - If non-career: find parent career in events array, insert into its children array at correct date position
   - Write updated timeline.json

9. Report success with summary of what was added
```

## Example Session

```
User: /add-item https://medium.com/@thegoldenmule/some-article

Claude: What type of item is this?
[media] [product] [writing] [career] [code]

User: writing

Claude: Which career should this item be added under?
[Founder: Goldenmule Media] [Experiments] [Miscellaneous Writing] [CTO: Big Run Studios]

User: Miscellaneous Writing

Claude: Let me analyze that URL...

I found the following from the page:
- Title: "Some Amazing Article"
- Description: "A deep dive into something cool"
- Image: https://miro.medium.com/...
- Suggested tags: ai, deep-dives, learning

Here's the generated entry:
{
  "category": "publications",
  "title": "Some Amazing Article",
  "type": "writing",
  "date": "Jan 2026",
  "subtitle": "A deep dive into something cool",
  "description": "...",
  "url": "https://medium.com/@thegoldenmule/some-article",
  "imageUrl": "https://miro.medium.com/...",
  "tech": ["ai", "deep-dives", "learning"]
}

Adding to "Miscellaneous Writing" in timeline.json...

Done! Added "Some Amazing Article" to the timeline under Miscellaneous Writing.
```

## Notes

- Always confirm the generated entry before inserting
- The skill uses WebFetch to analyze URLs for metadata
- Tags are matched against the canonical list in tags.json
- Career entries default to size: 45 and connectedLines: true (can be adjusted manually)
- Dates should be extracted from the page when possible, otherwise ask the user

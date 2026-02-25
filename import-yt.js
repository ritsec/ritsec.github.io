import fs from 'fs';
import path from 'path';
const data = JSON.parse(fs.readFileSync('./youtube_data.json', 'utf8'));
const items = data.items ? data.items : data;

const outputDir = 'src/content/research';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

items.forEach(item => {
    const snippet = item.snippet;
    const videoId = snippet.resourceId.videoId;
    const publishDate = snippet.publishedAt.split('T')[0]; // Extract YYYY-MM-DD
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    let title = snippet.title;

    // 1. Remove "week" followed by digits (case insensitive)
    title = title.replace(/week\s*\d+/gi, '').trim();

    // Remove trailing " - " if it ended there
    queueMicrotask
    title = title.replace(/\s+-\s*$/, '');
    // Remove double spaces
    title = title.replace(/\s+/g, ' ');

    // 2. Extract Authors
    // Split by " - " to separate title from authors
    // Usually "Title - Authors"
    // Be careful with titles that contain " - " themselves. Usually authors are at the end.
    const parts = title.split(' - ');

    let displayTitle = parts[0].trim();
    let authors = [];

    if (parts.length > 1) {
        // Assume the last part is the author(s)
        const authorPart = parts[parts.length - 1].trim();

        // Check if authorPart looks like a date or something else?
        // Assuming names.
        // Split by " and ", " & ", ", "
        authors = authorPart.split(/,|&|\band\b/i)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        // If we split off the author, recombine the rest as title
        if (parts.length > 2) {
            displayTitle = parts.slice(0, parts.length - 1).join(' - ').trim();
        }
    } else {
        authors = ["RITSEC"];
    }

    // Construct Slug
    let slug = displayTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (!slug) {
        console.warn(`Skipping item with empty slug: ${snippet.title}`);
        return;
    }

    const dirPath = path.join(outputDir, slug);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const mdxContent = `---
title: "${displayTitle.replace(/"/g, '\\"')}"
authors:
${authors.map(a => `  - name: "${a.replace(/"/g, '\\"')}"`).join('\n')}
date: ${publishDate}
group: "general"
summary: "${(snippet.description ? snippet.description.split('\n')[0] : displayTitle).replace(/"/g, '\\"')}"
video: "${videoUrl}"
---
`;

    fs.writeFileSync(path.join(dirPath, 'index.mdx'), mdxContent);
    console.log(`Created: ${dirPath}/index.mdx`);
});

console.log('Import completed.');

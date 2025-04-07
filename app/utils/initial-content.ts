const initialContent = `# Welcome to the MDX Editor!

## Features
- Real-time preview
- MDX Component support
- GitHub Flavored Markdown
- Beautiful syntax highlighting
- Responsive design

Try editing this markdown on the left side!

### Custom Components Example
<InfoBox heading="Info Status">This is a custom component rendered in MDX!</InfoBox>
<InfoBox heading="Warning Status" headingAs="h4" variant="warning">This is a custom component rendered in MDX!</InfoBox>
<InfoBox heading="Success Status" headingAs="h4" variant="success">This is a custom component rendered in MDX!</InfoBox>
<InfoBox heading="Error Status" headingAs="h4" variant="error">This is a custom component rendered in MDX!</InfoBox>
<InfoBox heading="Emergency Status" headingAs="h4" variant="emergency">This is a custom component rendered in MDX!</InfoBox>
<InfoBox heading="Info Status" size="slim">Lorem ipsum dolor sit amet, [consectetur adipiscing](#) elit, sed do eiusmod.</InfoBox>
<InfoBox heading="Info Status" noIcon>This is a custom component rendered in MDX!</InfoBox>

### Code Example
\`\`\`javascript
function hello() {
  console.log('Hello, MDX!');
}
\`\`\`

### Table Example
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| MDX | ✅ |
| Tables | ✅ |
`

export default initialContent

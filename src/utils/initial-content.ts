const initialContent = `# Welcome to the MDX Editor!

## Features
- Real-time preview
- MDX Component support
- GitHub Flavored Markdown
- Beautiful syntax highlighting
- Responsive design

Try editing this markdown on the left side!

### Process List

<ProcessList>
  <ProcessItem headingText="Start a process">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque.
    - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis.
    - Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum.
    - Aliquam erat volutpat. Sed quis velit.
  </ProcessItem>
  <ProcessItem headingText="Proceed to the second step">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit amet enim. 
  </ProcessItem>
</ProcessList>

### Alert
<InfoBox headingText="Info Status">This is a custom component rendered in MDX!</InfoBox>
<InfoBox headingText="Warning Status" headingAs="h4" variant="warning">This is a custom component rendered in MDX!</InfoBox>
<InfoBox headingText="Success Status" headingAs="h4" variant="success">This is a custom component rendered in MDX!</InfoBox>
<InfoBox headingText="Error Status" headingAs="h4" variant="error">This is a custom component rendered in MDX!</InfoBox>
<InfoBox headingText="Emergency Status" headingAs="h4" variant="emergency">This is a custom component rendered in MDX!</InfoBox>
<InfoBox headingText="Info Status" size="slim">Lorem ipsum dolor sit amet, [consectetur adipiscing](#) elit, sed do eiusmod.</InfoBox>
<InfoBox headingText="Info Status" noIcon>This is a custom component rendered in MDX!</InfoBox>

### Accordion

<AccordionList multiselectable>
  <AccordionItem headingText="First Amendment" aria-expanded>
    Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.
  </AccordionItem>
  <AccordionItem headingText="Second Amendment">
    A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.
    - This is a list item
    - Another list item
  </AccordionItem>
  <AccordionItem headingText="Third Amendment">
    No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.
  </AccordionItem>
  <AccordionItem headingText="Fourth Amendment">
    The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.
  </AccordionItem>
  <AccordionItem headingText="Fifth Amendment">
    No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.
  </AccordionItem>
</AccordionList>

### Button Group

<ButtonGroup>
  <Button variant="outline">Back</Button>
  <Button>Next</Button>
</ButtonGroup>

### Button Group Segmented

<ButtonGroup segmented>
  <Button colorScheme="warm">One</Button>
  <Button colorScheme="cool">Two</Button>
  <Button colorScheme="secondary">Three</Button>
</ButtonGroup>

### Table Example
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| MDX | ✅ |
| Tables | ✅ |`

export default initialContent

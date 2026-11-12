// ─────────────────────────────────────────────────────────────
// SITE SETTINGS: words, links, and the four categories.
// Edit the text between the quotes. Colors and fonts live in
// assets/theme.css; category graphics live in assets/icons/.
// ─────────────────────────────────────────────────────────────
window.SITE = {
  name: "Taylor Mershon",
  roles: "Illustrator · Graphic Designer · Editor",
  intro: "I draw every day, and I bring that hand-made energy to brand identities, campaigns, apparel, picture books, and the pages of a national magazine.",
  location: "Bentonville, Arkansas · available remotely",

  // Leave email empty ("") to hide the email button.
  email: "taylorlucasmershon@gmail.com",
  resume: "", // e.g. "files/Taylor-Mershon-Resume.pdf"
  links: [
    { label: "Instagram", url: "https://www.instagram.com/mershon.art/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/taylor-mershon-46a772237/" },
    { label: "Behance", url: "https://www.behance.net/taylormershon" }
  ],

  // The four sections. Order here = order in the menu.
  //   color: the tile's background (flips to `ink` on hover)
  //   ink:   the tile's outline, text and graphic color
  //   icon:  graphic for the section page (SVG or PNG; swap in your own drawing)
  //   cover: the example image shown for this section on the home page
  //          (any image name from content/works.js, e.g. "ink-series-1")
  categories: [
    { id: "illustration", cover: "pitts-lettering-1", label: "Illustration", color: "#FFFFFF", ink: "#000000", icon: "assets/icons/illustration.svg",
      blurb: "Aviation art, portraits, ink and paint." },
    { id: "design", cover: "timber-tiger-1", label: "Graphic Design", short: "Design", color: "#FFFFFF", ink: "#000000", icon: "assets/icons/design.svg",
      blurb: "Identity, campaigns, apparel, packaging.",
      filters: ["Branding", "Advertising", "Apparel", "Packaging", "Digital", "Type", "Layout"] },
    { id: "editorial", cover: "spread-aj-wilder-1", label: "Editorial", color: "#FFFFFF", ink: "#000000", icon: "assets/icons/editorial.svg",
      blurb: "Editing and designing Sport Aerobatics, the IAC's magazine." },
    { id: "books", cover: "weird-farm-1", label: "Picture Books", short: "Books", color: "#FFFFFF", ink: "#000000", icon: "assets/icons/books.svg",
      blurb: "Six children's books, written and illustrated." }
  ],

  about: {
    bio: [
      "I'm Taylor Mershon, an illustrator and graphic designer. Since January 2024 I've been the editor of Sport Aerobatics, the magazine of the International Aerobatic Club. I plan each issue, edit contributors, design the layouts and covers, and make the house ads and merchandise that go with it.",
      "My background is in drawing: ink, graphite, watercolor, oil, and a lot of Procreate. That's why my design work tends to start with something hand-made. I've written and illustrated six picture books, designed identities and apparel for aviation businesses, and built campaigns for the EAA and IAC.",
      "I'm looking for illustration, graphic design, and editorial work, in-house or freelance."
    ],
    experience: [
      ["Editor, Sport Aerobatics", "International Aerobatic Club / EAA", "2024–now"],
      ["Graphic & web design", "IF1 Air Racing", "Contract"],
      ["Graphic design", "Experimental Aircraft Association", "2023"],
      ["Brand & apparel design", "Independent aviation clients", "Freelance"],
      ["Author & illustrator", "Six self-published picture books", "Ongoing"]
    ],
    education: [
      ["BA, Graphic Communication", "University of Maryland Global Campus", "2024"],
      ["UX Design Certificate", "Google", ""]
    ],
    tools: "Adobe InDesign, Illustrator & Photoshop · Procreate · Figma · traditional media"
  }
};

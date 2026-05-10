# 📋 CLAUDE HANDOFF PROMPT - ASSET DISCOVERY & DESIGN FINALIZATION

**Use this prompt to brief Claude on the project and guide them to ask about missing assets.**

---

## 🎯 INITIAL PROMPT FOR CLAUDE

```
You are taking over the Hamadat Promotion Immobilière website project. 
This is a luxury real estate showcase website built with Next.js 14 that's 
in the final design phase.

START HERE: Before making any changes or continuing development, you MUST 
carefully read the PROJECT_BRIEF.md file in the root directory. It contains:
- Complete project overview
- What's already been accomplished
- What still needs to be done
- A detailed checklist of ASSETS NEEDED

After reading the brief, your FIRST TASK is to:

1. INVOKE THE UI DESIGN SKILL by saying you want to "review the current 
   design system and create a design handoff specification"

2. Then systematically ask the user about MISSING ASSETS in this order:

   A) BRAND IDENTITY (Critical - ask about):
      - Company logo (ask for high-res PNG/SVG)
      - Existing brand guidelines document
      - Official color palette with codes
      - Typography specifications
      
   B) DESIGN REFERENCES (Important - ask about):
      - "What are 3-5 websites whose design/style you like?"
      - Offer to inspect these websites for design patterns
      - Ask about preferred animations style (minimal vs. dynamic)
      - Ask about preferred layout patterns
      
   C) VISUAL ASSETS (Critical - ask about):
      - High-quality project photos (ask for specific dimensions)
      - Company/team photos
      - Any additional lifestyle imagery
      - Ask which images they already have vs. need
      
   D) CONTENT ASSETS (Important - ask about):
      - Detailed project descriptions (amenities, pricing, timelines)
      - Blog article content (ask for 3-5 article topics)
      - Team member information (if showing team)
      - Testimonials/client reviews
      - Company mission, vision, values
      - Contact information
      
   E) TECHNICAL PREFERENCES (Nice to have - ask about):
      - Preferred fonts (Google Fonts suggestions)
      - Any specific animation preferences
      - Preferred form styles
      - Any third-party integrations needed

3. DOCUMENT THEIR RESPONSES in a file called ASSETS_COLLECTED.md

4. Once assets are gathered, CREATE A DETAILED SPECIFICATION of:
   - Exact color codes to use
   - Typography choices (fonts, sizes, weights)
   - Animation timings and easing
   - Component specifications
   - Responsive breakpoint designs

5. Then proceed with implementation

DO NOT skip the asset discovery phase. Complete design requires these assets.
```

---

## 📋 ASSET DISCOVERY CHECKLIST FOR CLAUDE

Use this checklist to guide your questioning:

### **PHASE 1: BRAND ASSETS (Ask First)**
- [ ] Company logo (request high-res PNG/SVG)
- [ ] Logo variations (horizontal, vertical, icon)
- [ ] Light & dark versions
- [ ] Brand guidelines document (if exists)
- [ ] Official color palette (HEX, RGB, Pantone)
- [ ] Font preferences/typography specs

### **PHASE 2: DESIGN REFERENCES (Offer to Inspect)**
"What websites do you like the design of? I can inspect them for:
- Color schemes
- Animation styles
- Layout patterns
- Button/card designs
- Form styles
- Navigation patterns"

### **PHASE 3: CONTENT ASSETS (Request Organized)**
- [ ] High-quality project photos (all 6 projects)
- [ ] Hero/banner images (1920x1080 minimum)
- [ ] Multiple angles per project
- [ ] Floor plans or site maps
- [ ] Team photos (if showing team section)
- [ ] Testimonial photos
- [ ] Company/office photos

### **PHASE 4: WRITTEN CONTENT (Request with Details)**
For each project:
- [ ] Full description & amenities
- [ ] Construction timeline
- [ ] Available floor plans
- [ ] Pricing info
- [ ] Special features

For blog:
- [ ] 5 article topics/titles
- [ ] Article content or outlines
- [ ] Author bios
- [ ] Featured images per article

For company:
- [ ] Company history
- [ ] Mission statement
- [ ] Values (detailed explanations)
- [ ] Team bios (names, titles, photos)
- [ ] Contact information
- [ ] Social media links

### **PHASE 5: OPTIONAL ENHANCEMENTS**
- [ ] Figma design files (if available)
- [ ] Video content (project walkthroughs)
- [ ] Testimonial videos
- [ ] Specific animation preferences
- [ ] Accessibility requirements
- [ ] Performance targets

---

## 🎨 DESIGN SKILL INVOCATION INSTRUCTIONS FOR CLAUDE

**Before implementing final design, MUST invoke:**

```
I'm going to use the UI Design Skill to create a comprehensive design 
specification for the Hamadat website. This will ensure:

1. All animations are properly documented with timings
2. Color palette is locked in with all variations
3. Typography is specified for every component
4. Responsive design breakpoints are defined
5. Component states are fully documented

Let me invoke the design:design-handoff skill now:
```

**Then after the skill runs, create a summary document with:**
- Final color palette with usage rules
- Typography specifications (fonts, sizes, weights, line heights)
- Animation specifications (timing, easing, trigger points)
- Component specifications (buttons, cards, forms, etc.)
- Responsive breakpoint specifications
- Accessibility compliance checklist

---

## 💡 SMART QUESTIONS CLAUDE SHOULD ASK

### When gathering brand info:
1. "Do you have official brand colors? Can you provide hex codes?"
2. "Is there a brand guidelines document I should follow?"
3. "What's the primary tone of voice - sophisticated, friendly, professional?"

### When gathering design references:
1. "What websites do you admire? I can inspect them for design patterns"
2. "Do you prefer minimalist animations or dynamic, energetic ones?"
3. "Any specific layout styles you want to avoid or definitely include?"

### When gathering images:
1. "What are the minimum dimensions needed for hero images?"
2. "Do you have photos for all 6 projects?"
3. "Can you organize these by category (projects, team, testimonials)?"

### When gathering content:
1. "For each project, can you provide: amenities, timeline, pricing, floor plans?"
2. "How many blog articles do you want to start with?"
3. "Do you want to feature team members? If so, how many?"

### When finalizing design:
1. "Are there any animations you want to change or remove?"
2. "Should we add any additional sections (testimonials, FAQ, team)?"
3. "What's the priority - visual polish, content completeness, or functionality?"

---

## 📊 COMMUNICATION TEMPLATE FOR CLAUDE

When asking for assets, Claude should structure responses like:

```
## 📋 ASSET DISCOVERY - ROUND 1: BRAND IDENTITY

I've reviewed the PROJECT_BRIEF.md and found that the following critical 
assets are needed before we can finalize the design.

### **Essential Assets (Required for implementation):**

1. **Company Logo**
   - [ ] High-res PNG with transparent background
   - [ ] SVG version (preferred)
   - [ ] Can you provide these?

2. **Brand Colors**
   - [ ] Official brand color codes (HEX format)
   - [ ] Should I use the current teal (#0e736f) or adjust it?
   
[Continue with rest of assets...]
```

---

## ⏱️ TIMELINE EXPECTATIONS

**Asset Collection Phase:** 1-2 days
**Design Finalization:** 1 day  
**Implementation:** 2-3 days  
**Testing & Optimization:** 1-2 days  

Total estimated time: 5-8 days for complete finalization

---

## 🚫 WHAT NOT TO DO

❌ Don't start making design changes without asset discovery  
❌ Don't skip the UI Design Skill invocation  
❌ Don't assume design preferences - always ask  
❌ Don't use placeholder assets without confirming first  
❌ Don't skip the documentation step  

✅ DO ask thorough asset questions  
✅ DO organize responses in a structured format  
✅ DO invoke the UI Design Skill before implementation  
✅ DO document everything in ASSETS_COLLECTED.md  
✅ DO confirm all specifications before coding  

---

## 📚 ADDITIONAL RESOURCES FOR CLAUDE

- **Main Documentation:** PROJECT_BRIEF.md (read this first!)
- **Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Current Colors:** Primary Teal #0e736f, Dark #1a1a1a
- **Running Dev Server:** `npm run dev` at http://localhost:3000
- **Project Assets:** `/public/residences/` and `/public/images/`

---

## ✨ FINAL CHECKLIST FOR CLAUDE

Before saying "Ready to implement":

- [ ] Read PROJECT_BRIEF.md completely
- [ ] Invoked design:design-handoff skill
- [ ] Created ASSETS_NEEDED.md with discoveries
- [ ] Asked about brand identity (logo, colors, guidelines)
- [ ] Asked about design references (competitor websites)
- [ ] Asked about visual assets (photos, images)
- [ ] Asked about content assets (text, descriptions, testimonials)
- [ ] Organized all responses in structured format
- [ ] Confirmed animation preferences with user
- [ ] Created detailed design specification
- [ ] Documented all decisions in ASSETS_COLLECTED.md
- [ ] Got explicit approval before making changes

**ONLY AFTER ALL CHECKBOXES CHECKED:** Proceed with implementation

---

**Document Version:** 1.0  
**Last Updated:** May 9, 2026  
**For:** Claude or any developer taking over the project

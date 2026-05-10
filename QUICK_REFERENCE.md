# ⚡ QUICK REFERENCE - HAMADAT WEBSITE PROJECT

**One-page summary of everything you need to know**

---

## 🎯 PROJECT AT A GLANCE

| Aspect | Details |
|--------|---------|
| **Project** | Hamadat Promotion Immobilière - Luxury Real Estate Website |
| **Status** | Design Complete - Ready for Finalization |
| **Location** | `/Users/macbookpro/Downloads/Site Hamadat/Residences` |
| **Tech Stack** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Dev Server** | `npm run dev` → http://localhost:3000 |
| **Pages** | 5 (Home, Projects, Blog, Contact, About) |
| **Owner** | Monsef (monsefam@gmail.com) |

---

## 📖 DOCUMENTS TO READ

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **README_HANDOFF.md** | Start here - Quick orientation | 5 min |
| **PROJECT_BRIEF.md** | Full project overview & status | 15 min |
| **CLAUDE_HANDOFF_PROMPT.md** | Instructions for next developer | 10 min |
| **ASSETS_CHECKLIST.md** | What to gather/organize | 5 min |

---

## ✅ WHAT'S DONE

```
✅ Next.js 14 setup with TypeScript
✅ 5 complete pages with professional design
✅ Real data: 6 projects, 2 blog articles, company values
✅ Real images: Residences, blog, team, testimonials
✅ Professional animations (scroll, hover, stagger)
✅ Bilingual (French/Arabic with RTL support)
✅ Color system: Teal #0e736f + supporting palette
✅ Responsive design
✅ Hover effects & transitions
✅ Navigation blur effect
✅ Statistics section with gradient
✅ Project filtering
✅ Professional footer
```

---

## 📋 WHAT'S NEEDED

### **Critical Assets** (Must Have)
```
□ Company logo (PNG/SVG)
□ Brand color codes (HEX format)
□ Typography specifications
□ High-quality project images (all 6)
□ Project descriptions & details
```

### **Important Assets** (Highly Recommended)
```
□ Design reference websites (URLs)
□ Blog article content
□ Company mission/vision/values (detailed)
□ Testimonials & client reviews
□ Team information (if showing team)
□ Contact information
```

### **Optional Assets** (Nice to Have)
```
□ Figma design files
□ Video content
□ Additional lifestyle images
□ Font preferences
□ Animation preferences
```

---

## 🚀 GETTING STARTED (3 Steps)

### **Step 1: Setup** (2 minutes)
```bash
cd /Users/macbookpro/Downloads/Site\ Hamadat/Residences
npm install
npm run dev
# Open http://localhost:3000
```

### **Step 2: Explore** (10 minutes)
- Visit all 5 pages
- Test hover effects
- Check mobile responsiveness
- Review current design

### **Step 3: Understand** (15 minutes)
- Read `PROJECT_BRIEF.md`
- Review color system
- Check assets in `/public`
- Review code structure in `/src`

---

## 🎨 DESIGN SYSTEM

### **Colors**
```
Primary Teal:      #0e736f  (Main brand color)
Teal Dark:         #0a5450  (Darker teal)
Teal Accent:       #1b948d  (Lighter accent)
Dark Footer:       #1a1a1a  (Footer background)
Text Dark:         #3a3b3d  (Primary text)
Text Gray:         #6b7280  (Secondary text)
Background Light:  #f5f3f0  (Card backgrounds)
White:             #ffffff  (Body background)
```

### **Typography**
- Font weights: 300, 400, 500, 600, 700
- Line heights: 1.2 (headings) to 1.8 (body)
- Letter spacing: -0.5px to 0.5px

### **Animations**
```
fadeInUp:  30px slide + fade in
slideDown: 20px top slide + fade in
bounce:    Vertical bounce effect
Timing:    0.6s - 1s with ease-out
Delays:    Staggered 0.1s - 0.35s
```

---

## 📂 KEY FILE LOCATIONS

```
/src/app/page.tsx                  → Homepage
/src/app/projets/page.tsx          → Projects page
/src/app/blog/page.tsx             → Blog page
/src/app/contact/page.tsx          → Contact page
/src/app/apropos/page.tsx          → About page
/src/lib/language-context.tsx      → Bilingual support
/public/residences/                → Project images
/public/images/                    → Blog & team images
/tailwind.config.js                → Color system
```

---

## 🔧 COMMON TASKS

### **Run Development Server**
```bash
npm run dev
# Runs at http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm start
```

### **Update Colors**
Edit: `/tailwind.config.js` → `theme.extend.colors`

### **Add New Page**
Create: `/src/app/[pagename]/page.tsx`

### **Modify Navigation**
Edit: Navigation component in each page file

### **Add Blog Article**
Update mock data in: `/src/app/blog/page.tsx`

### **Add Project**
Update mock data in: `/src/app/projets/page.tsx`

---

## 🤖 IF YOU'RE CLAUDE AI

**Quick Instructions:**

1. **Read First:** `PROJECT_BRIEF.md` (comprehensive overview)
2. **Follow Instructions:** `CLAUDE_HANDOFF_PROMPT.md` (detailed guidance)
3. **Invoke Skill:** Before making changes, invoke `design:design-handoff` skill
4. **Ask Questions:** Use the prompt to systematically ask about missing assets
5. **Document:** Track all responses in `ASSETS_COLLECTED.md`
6. **Implement:** Only after full asset discovery & approval

---

## 💡 THINGS TO REMEMBER

✅ **DO:**
- Ask about brand guidelines
- Check design references
- Document all assets
- Invoke UI Design skill
- Get approval before changes
- Test across devices
- Optimize images

❌ **DON'T:**
- Skip asset discovery
- Use placeholder images
- Change colors without approval
- Start coding before specifications
- Ignore mobile responsiveness
- Miss accessibility requirements
- Deploy without testing

---

## 📞 QUICK CONTACTS

| Role | Name | Email |
|------|------|-------|
| Project Owner | Monsef | monsefam@gmail.com |

---

## 🎓 NEXT STEPS

### **For Project Owner:**
1. Organize assets using `ASSETS_CHECKLIST.md`
2. Gather logos, images, content
3. Share folder with next developer or Claude

### **For Next Developer:**
1. Read `PROJECT_BRIEF.md`
2. Run `npm run dev` to see current state
3. Follow `CLAUDE_HANDOFF_PROMPT.md` instructions
4. Ask for missing assets
5. Implement from detailed specifications

### **For Claude AI:**
1. Read `PROJECT_BRIEF.md` completely
2. Follow guidance in `CLAUDE_HANDOFF_PROMPT.md`
3. Invoke `design:design-handoff` skill
4. Systematically ask about all assets
5. Create detailed specifications
6. Implement with full approval

---

## 📊 PROJECT STATS

```
Code Files:        30+
Lines of Code:     3000+
Pages:             5
Projects:          6
Blog Articles:     2
Real Images:       16+
Color Variables:   20+
Animations:        3 main + 10+ micro
```

---

## 🏁 CHECKLIST BEFORE HANDING OFF

- [ ] All documents in folder
- [ ] Code is clean & commented
- [ ] Development server works
- [ ] All assets documented
- [ ] Owner contact info included
- [ ] Instructions clear & comprehensive
- [ ] Design system documented
- [ ] Next steps defined
- [ ] Folder organized & ready

---

## 📌 REMEMBER

> The goal is to create a **beautifully designed, smoothly animated, 
> professional luxury real estate website** that showcases Hamadat's 
> stunning projects with **engaging interactions** and **real data**.

> Everything is ready. You just need to **finalize the design**, 
> **gather missing assets**, and **implement with polish**.

---

**Last Updated:** May 9, 2026  
**Version:** 1.0  
**Status:** Ready for Handoff  

---

**Questions?** Contact: monsefam@gmail.com  
**Let's build something great! 🚀**

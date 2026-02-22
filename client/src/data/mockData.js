export const CANDIDATES = [
  {
    id: 1, name: "Arjun Mehta", role: "ML Engineer", avatar: "AM", color: "#3b82f6",
    total: 91.4, topsis: 0.924, rank: 1, grade: "A+",
    experience: "3 yrs", education: "IIT Bombay", location: "Mumbai",
    sections: {
      "Contact Info":    { score: 95, weight: 5,  level: "excellent", feedback: "All channels present — LinkedIn, GitHub, Portfolio" },
      "Education":       { score: 88, weight: 20, level: "excellent", feedback: "IIT Bombay CS · CGPA 8.9/10 · Top-tier institution" },
      "Work Experience": { score: 94, weight: 30, level: "excellent", feedback: "Google & NVIDIA internships · Quantified impact metrics" },
      "Skills":          { score: 96, weight: 20, level: "excellent", feedback: "PyTorch, LayoutLMv3, TensorFlow, SBERT, Python" },
      "Projects":        { score: 90, weight: 15, level: "excellent", feedback: "4 ML projects · GitHub links · Live demos" },
      "Achievements":    { score: 85, weight: 5,  level: "good",      feedback: "2 research publications · Kaggle Grandmaster" },
      "Summary":         { score: 82, weight: 3,  level: "good",      feedback: "Targeted, specific · Could be more concise" },
      "Formatting":      { score: 91, weight: 2,  level: "excellent", feedback: "ATS-optimized · Consistent layout · Single column" },
    },
    insights: [
      { type: "success", text: "Exceptional technical stack alignment with ML roles" },
      { type: "success", text: "All work experience entries have quantified metrics" },
      { type: "warning", text: "Summary could highlight leadership experience more" },
    ],
    keywords: ["PyTorch", "LayoutLMv3", "SBERT", "NLP", "Deep Learning", "Python", "TensorFlow"],
  },
  {
    id: 2, name: "Priya Sharma", role: "Data Scientist", avatar: "PS", color: "#8b5cf6",
    total: 84.7, topsis: 0.851, rank: 2, grade: "A",
    experience: "2 yrs", education: "IIM Calcutta", location: "Bangalore",
    sections: {
      "Contact Info":    { score: 90, weight: 5,  level: "excellent", feedback: "Portfolio website present · All channels linked" },
      "Education":       { score: 92, weight: 20, level: "excellent", feedback: "IIM Calcutta MBA Analytics · Strong academic record" },
      "Work Experience": { score: 86, weight: 30, level: "good",      feedback: "2 years TCS Analytics · Solid but limited variety" },
      "Skills":          { score: 80, weight: 20, level: "good",      feedback: "R, Python, Tableau · Missing deep learning stack" },
      "Projects":        { score: 78, weight: 15, level: "good",      feedback: "3 projects · Limited public GitHub documentation" },
      "Achievements":    { score: 82, weight: 5,  level: "good",      feedback: "National hackathon winner · MLOps certification" },
      "Summary":         { score: 88, weight: 3,  level: "excellent", feedback: "Clear objective · Well-written executive summary" },
      "Formatting":      { score: 76, weight: 2,  level: "moderate",  feedback: "Minor ATS issues with table layout used" },
    },
    insights: [
      { type: "success", text: "Strong business acumen paired with technical skills" },
      { type: "warning", text: "GitHub profile needs more public repositories" },
      { type: "error",   text: "Missing deep learning frameworks in skills section" },
    ],
    keywords: ["R", "Python", "Tableau", "SQL", "Analytics", "MLOps", "Pandas"],
  },
  {
    id: 3, name: "Rohan Verma", role: "AI Research Intern", avatar: "RV", color: "#06b6d4",
    total: 78.2, topsis: 0.741, rank: 3, grade: "B+",
    experience: "1 yr", education: "BITS Pilani", location: "Hyderabad",
    sections: {
      "Contact Info":    { score: 70, weight: 5,  level: "moderate",  feedback: "Missing GitHub profile URL" },
      "Education":       { score: 85, weight: 20, level: "good",      feedback: "BITS Pilani CS · CGPA 8.2/10 · Well-regarded" },
      "Work Experience": { score: 65, weight: 30, level: "moderate",  feedback: "1 internship · Tenure too brief for strong signal" },
      "Skills":          { score: 84, weight: 20, level: "good",      feedback: "TensorFlow, NLP basics · Decent but incomplete" },
      "Projects":        { score: 90, weight: 15, level: "excellent", feedback: "Strong independent research · Paper submitted" },
      "Achievements":    { score: 72, weight: 5,  level: "moderate",  feedback: "Dean's list mention · Needs more specificity" },
      "Summary":         { score: 68, weight: 3,  level: "moderate",  feedback: "Generic objective · Not tailored to the role" },
      "Formatting":      { score: 80, weight: 2,  level: "good",      feedback: "Clean single-column layout · ATS-friendly" },
    },
    insights: [
      { type: "success", text: "Outstanding independent research project quality" },
      { type: "warning", text: "Work experience needs stronger impact metrics" },
      { type: "error",   text: "Generic summary hurts role-specific matching score" },
    ],
    keywords: ["TensorFlow", "NLP", "Research", "Python", "BERT", "Computer Vision"],
  },
  {
    id: 4, name: "Sneha Patel", role: "NLP Engineer", avatar: "SP", color: "#f59e0b",
    total: 71.5, topsis: 0.648, rank: 4, grade: "B",
    experience: "1.5 yrs", education: "Delhi University", location: "Delhi",
    sections: {
      "Contact Info":    { score: 85, weight: 5,  level: "good",      feedback: "All professional links active and present" },
      "Education":       { score: 75, weight: 20, level: "moderate",  feedback: "Delhi University CS · Solid, but CGPA not mentioned" },
      "Work Experience": { score: 60, weight: 30, level: "moderate",  feedback: "Freelance-only · No full-time employment history" },
      "Skills":          { score: 78, weight: 20, level: "good",      feedback: "Hugging Face, spaCy, NLTK · Good NLP coverage" },
      "Projects":        { score: 72, weight: 15, level: "moderate",  feedback: "2 NLP projects · Needs more depth and metrics" },
      "Achievements":    { score: 55, weight: 5,  level: "poor",      feedback: "No notable awards or recognitions listed" },
      "Summary":         { score: 70, weight: 3,  level: "moderate",  feedback: "Needs more specificity and role alignment" },
      "Formatting":      { score: 68, weight: 2,  level: "moderate",  feedback: "Inconsistent bullet spacing and font weight" },
    },
    insights: [
      { type: "success", text: "Strong NLP-specific tool proficiency demonstrated" },
      { type: "warning", text: "Freelance history may concern traditional employers" },
      { type: "error",   text: "Achievements section is significantly under-developed" },
    ],
    keywords: ["Hugging Face", "spaCy", "NLTK", "Python", "NLP", "Transformers"],
  },
  {
    id: 5, name: "Karan Gupta", role: "Backend + ML", avatar: "KG", color: "#f43f5e",
    total: 64.3, topsis: 0.512, rank: 5, grade: "C+",
    experience: "1 yr", education: "VIT Vellore", location: "Chennai",
    sections: {
      "Contact Info":    { score: 60, weight: 5,  level: "moderate",  feedback: "Missing portfolio — only email and phone" },
      "Education":       { score: 72, weight: 20, level: "moderate",  feedback: "VIT Vellore CS · CGPA 7.2/10 · Below ML bar" },
      "Work Experience": { score: 65, weight: 30, level: "moderate",  feedback: "1 year backend dev · Minimal ML relevance" },
      "Skills":          { score: 70, weight: 20, level: "moderate",  feedback: "Django, FastAPI basics · Limited ML frameworks" },
      "Projects":        { score: 58, weight: 15, level: "poor",      feedback: "Limited ML relevance in portfolio projects" },
      "Achievements":    { score: 48, weight: 5,  level: "poor",      feedback: "No achievements or certifications listed" },
      "Summary":         { score: 62, weight: 3,  level: "moderate",  feedback: "Vague objective with no role-specific keywords" },
      "Formatting":      { score: 74, weight: 2,  level: "moderate",  feedback: "Acceptable structure but cluttered experience" },
    },
    insights: [
      { type: "success", text: "Backend engineering adds solid engineering depth" },
      { type: "warning", text: "ML skill set too shallow for dedicated ML roles" },
      { type: "error",   text: "Missing achievements and certifications critically hurts" },
    ],
    keywords: ["Django", "FastAPI", "Python", "Backend", "REST APIs", "PostgreSQL"],
  },
];

export const PIPELINE_STAGES = [
  { id: 1, icon: "📥", title: "Ingestion", tech: "FastAPI · Celery · Redis", desc: "Batch upload 25+ resumes with non-blocking async I/O. Celery distributes tasks across Redis queues for zero-latency parallel processing.", color: "#3b82f6", techs: ["FastAPI", "Celery", "Redis"] },
  { id: 2, icon: "🗺️", title: "Spatial Parse", tech: "pdfplumber · OCR", desc: "Extracts text with pixel-precise bounding box coordinates. Preserves spatial hierarchy — headers, columns, sections — not just raw text.", color: "#06b6d4", techs: ["pdfplumber", "OCR", "Bounding Boxes"] },
  { id: 3, icon: "🧠", title: "Deep Extraction", tech: "LayoutLMv3", desc: "Jointly processes text tokens with 2D document coordinates. Achieves 95%+ section classification by treating layout as semantic context.", color: "#8b5cf6", techs: ["LayoutLMv3", "HuggingFace", "NER"] },
  { id: 4, icon: "⚖️", title: "Scoring & Rank", tech: "SBERT · TOPSIS", desc: "SBERT maps all skills to semantic vectors — eliminating keyword bias. TOPSIS calculates geometric distance from the ideal candidate profile.", color: "#a78bfa", techs: ["SBERT", "TOPSIS", "Cosine Similarity"] },
  { id: 5, icon: "📡", title: "Live Output", tech: "PostgreSQL · WebSockets", desc: "Rankings stream live to the React dashboard via WebSockets. Results appear as analysis completes — no full-page refresh required.", color: "#22d3ee", techs: ["PostgreSQL", "WebSockets", "React"] },
];

export const METRICS = [
  { icon: "🎯", value: 95, suffix: "%", label: "Extraction Accuracy", sub: "Spatial-aware LayoutLMv3 parsing", color: "#3b82f6" },
  { icon: "⚡", value: 0.3, suffix: "s", label: "Avg Processing Time", sub: "Per resume with async workers", color: "#22d3ee", decimal: 1 },
  { icon: "🗜️", value: 75, suffix: "%", label: "Memory Reduction", sub: "float32 → int8 quantization", color: "#8b5cf6" },
  { icon: "📦", value: 25, suffix: "+", label: "Batch Capacity", sub: "Per processing cycle", color: "#a78bfa" },
  { icon: "🔁", value: 100, suffix: "%", label: "Reproducibility", sub: "Deterministic ranking logic", color: "#10b981" },
  { icon: "⚖️", value: 0, suffix: "%", label: "Keyword Bias", sub: "SBERT semantic normalization", color: "#f59e0b" },
];

export const TEAM = [
  { name: "Shashank Tomar", role: "Lead AI & Backend Engineer", avatar: "ST", color: "#3b82f6", email: "shashanktomar912@gmail.com" },
  { name: "Shagun Chaudhary", role: "Frontend Developer (React)", avatar: "SC", color: "#8b5cf6", email: "shagunchaudhary0723@gmail.com" },
  { name: "Shreem Srivastava", role: "Product Analyst & Documentation", avatar: "SS", color: "#22d3ee", email: "shreemsrivastava2005@gmail.com" },
  { name: "Shahid Ansari", role: "Frontend Developer (Tailwind)", avatar: "SA", color: "#f59e0b", email: "shahidansaribhodu@gmail.com" },
];

export const PLANS = [
  { name: "Starter", price: 0, color: "#3b82f6", features: ["5 resumes / month", "Basic section scoring", "PDF export", "Email support"], cta: "Get Started" },
  { name: "Pro", price: 29, color: "#8b5cf6", popular: true, features: ["100 resumes / month", "Full TOPSIS ranking", "Semantic normalization", "Batch processing", "Priority support", "API access"], cta: "Start Free Trial" },
  { name: "Enterprise", price: 99, color: "#22d3ee", features: ["Unlimited resumes", "Custom scoring weights", "ATS integration", "White-label option", "Dedicated support", "SLA guarantee"], cta: "Contact Sales" },
];

export const FAQS = [
  { q: "How accurate is the resume extraction?", a: "Our LayoutLMv3-powered extraction achieves 95%+ accuracy by understanding document layout and spatial context, not just raw text parsing." },
  { q: "What file formats are supported?", a: "We support PDF, DOCX, DOC, ODT, and TXT. For best results, use PDF with proper text encoding (not scanned images)." },
  { q: "How does TOPSIS ranking work?", a: "TOPSIS calculates the geometric distance of each candidate from both the ideal best and worst profiles. The final score = d⁻ / (d⁺ + d⁻), ensuring no single section dominates." },
  { q: "Is my data secure?", a: "All resumes are encrypted at rest and in transit. We never store raw resume content beyond 30 days, and you can delete your data anytime." },
  { q: "Can I customize section weights?", a: "Yes! Pro and Enterprise plans let you adjust section weights to match your specific job requirements and hiring criteria." },
];

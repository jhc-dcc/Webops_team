export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  department: string;
  keywords: string[];
  date: string;
  category: string;
  type: "image" | "text" | "balanced";
}

export const blogPosts: BlogPost[] = [
  {
    id: "4",
    title:
      "Breaking Records with Responsibility: E-Waste Drive 2024 by Dot Com Club",
    excerpt:
      "A record-breaking E-Waste Drive achieved 454.25 kilograms of electronic waste collection, featuring global collaboration, educational seminars, and creative competitions.",
    content:
      "In a remarkable stride toward environmental consciousness and global collaboration, the Dot Com Club successfully organized a record-breaking E-Waste Drive on August 12th and 13th, 2024, as part of Phase 3 of their sustainability campaign. Held from 9 AM to 4 PM on both days, the event achieved a monumental milestone by collecting 454.25 kilograms of electronic waste—highlighting the growing awareness and responsibility among youth and communities alike.\n\nThe event wasn't just about collection—it was a celebration of ideas, education, and innovation. It featured a Global Conference on the E-Waste Crisis, bringing together students from multiple countries who passionately voiced their concerns and solutions. A thought-provoking skit by First and Second Year IT & SD students added depth by showcasing the real-life impact of e-waste on our planet.\n\nOne of the highlights of the event was the creative 'Best Out of E-Waste' competition, where students repurposed discarded electronics into functional and artistic creations—turning trash into treasure. The event also hosted an eye-opening awareness seminar conducted by experts from Waste Management Services, who shared practical insights on sustainable disposal methods.\n\nTo ensure environmental safety and impact, all collected e-waste was responsibly handed over to Green India and Waste Management Services for proper recycling.\n\nThis drive is a shining example of how student initiatives, when combined with purpose and planning, can lead to meaningful global change. Kudos to the Dot Com Club for turning awareness into action and inspiring others to think green!",
    author: "Dot Com Club",
    department: "Environmental Sustainability",
    keywords: [
      "e-waste",
      "sustainability",
      "environmental awareness",
      "student initiative",
      "recycling",
    ],
    date: "August 15, 2024",
    category: "Sustainability",
    type: "text",
  },
  {
    id: "6",
    title: "Code, Creativity & Curiosity: Highlights from Tech-Srujan 2025",
    excerpt:
      "Tech-Srujan 2025 brought together bright minds and cutting-edge technology in an inter-collegiate project exhibition that celebrated innovation, creativity, and the future of tech.",
    content:
      "What happens when bright minds, wild ideas, and cutting-edge technology come together under one roof? Magic. And that's exactly what Tech-Srujan 2025 was all about.\n\nOn 1st March 2025, our campus transformed into a buzzing hub of innovation as students from BScIT, BVocSD, MScBDA, and even colleges beyond ours gathered for the second edition of the Tech-Srujan Inter-Collegiate Project Exhibition.\n\nBut this wasn't just another college event—it was a celebration of ideas. Projects that had been brewing in classrooms, scribbled in notebooks, or coded late at night finally stepped into the spotlight. From smart IoT systems and AI innovations to data-driven research and entrepreneurial pitches that could one day change the world—Tech-Srujan had it all.\n\nWalking through the exhibition felt like taking a tour of tomorrow. Each stall was more than just a display—it was a story. Students stood proudly next to their work, explaining not only what they had built but also why they built it. You could see the spark in their eyes—that perfect mix of passion and purpose.\n\nWhat made this event even cooler? It wasn't just 'our' event—students from other colleges also joined in, turning Tech-Srujan into a true melting pot of fresh perspectives and cross-campus collaboration.\n\nParents, professors, and curious onlookers—everyone were there, not just to see the projects but to experience the energy of young innovators ready to make their mark. And of course, hard work deserves recognition. As the day drew to a close, a special prize distribution ceremony honoured the most outstanding projects, giving the event a grand, celebratory finish.\n\nWhy does Tech-Srujan matter?\nIt's more than a project exhibition—it's a launchpad for dreams. It's where shy coders become confident presenters, where wild ideas get applause, and where technology meets creativity in the most unexpected ways.\n\nTech-Srujan reminded us all of one simple truth: the future belongs to those who dare to build it.\n\nHere's to the creators, the coders, the dreamers—see you next year with even bigger ideas.",
    author: "Tech-Srujan Team",
    department: "Technology & Innovation",
    keywords: [
      "tech exhibition",
      "innovation",
      "inter-collegiate",
      "student projects",
      "technology showcase",
    ],
    date: "March 3, 2025",
    category: "Technology",
    type: "image",
  },
  {
    id: "5",
    title: "CyberStrike 2025: When Coding Met Catwalk!!!",
    excerpt:
      "CyberStrike 2025 transformed Jai Hind College into a tech carnival featuring esports, coding competitions, cultural events, and unforgettable moments of innovation and creativity.",
    content:
      "Let's be honest, no one expected a regular Monday morning at Jai Hind College to turn into a full-blown tech carnival. But on January 8th and 9th, the Dot Com Club said, 'Why not?' and the rest is history… or, well, a blog.\n\nCyberStrike 2025 wasn't just another fest. It was the fest with a global-tech-meets-gamer-meets-cultural-extravaganza kind of vibe. People came in from all corners of Mumbai (and beyond), gaming rigs fired up, brains set to 'problem-solve,' and creativity flowing like Red Bull at 2 a.m. (not officially sponsored, but you get the energy).\n\nThe Inauguration itself had us all inspired and slightly awestruck, thanks to the wisdom bombs dropped by Dr. Vijay Dabholkar and Prof. Wilson Rao. Big Data was mentioned. So was innovation. And somewhere in there, we all felt like tech superheroes about to embark on a mission.\n\nLevel 1: Esports Mania\nGamers, you had to be there. BGMI, Valorant, FIFA, CODM, Mortal Kombat 1—if it had a leaderboard and bragging rights, it was on. Shoutout to the teams who came in like esports ninjas and played as if their CPUs depended on it.\n\nLevel 2: Culture Shock (in the best way)\nBut CyberStrike wasn't just about fast fingers and frame rates. From Strut the Runway to Voices of Tomorrow, creativity was flexing just as hard. Whether you were posing behind a camera or puzzling your way through The Great Escape, there was something for every kind of curious soul.\n\nLevel 3: Code, Crack, Create\nNow, for the code warriors. Events like Bug Bounty, Sherlock Codes, and Prompt Craft had laptops heating up and brains in overdrive. It was problem-solving under pressure and somehow still fun (yes, fun and debugging can coexist).\n\nFinal Boss: The Grand Celebration\nThe closing ceremony? Electric. Awards were announced, people were cheered, and then… we danced. Yes, even the most introverted coders busted a move.\n\nWhy CyberStrike was a hit?\nCyberStrike wasn't just an event—it was a platform. A space where students showcased their skills, bonded over tech, and left inspired. It reminded us that college fests can be more than competitions—they can be community.\n\nUntil next time, stay curious. Stay caffeinated. Stay awesome.",
    author: "Dot Com Club",
    department: "Technology & Events",
    keywords: [
      "cyberstrike",
      "tech fest",
      "esports",
      "coding competition",
      "college event",
    ],
    date: "January 12, 2025",
    category: "Events",
    type: "balanced",
  },
];

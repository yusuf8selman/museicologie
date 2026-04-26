import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";

const FG = "#ffffff";
const FG_DIM = "rgba(255,255,255,0.35)";
const FG_GLOW = "rgba(255,255,255,0.08)";

const PRODUCTS = [
  {
    id: "no-001",
    name: "Zirgüle",
    subtitle: "Perde ve Çeşni Dershânesi",
    description: "",
    x: 75, y: 25,
    depth: 1.0,   // closest
  },
  {
    id: "no-002",
    name: "Kudüm",
    subtitle: "Usül Dershânesi",
    description: "",
    x: 88, y: 60,
    depth: 0.85,
  },
  {
    id: "no-003",
    name: "Seyr-i Makam",
    subtitle: "Seyir Dershânesi",
    description: "",
    x: 12, y: 60,
    depth: 0.75,
  },
  {
    id: "no-004",
    name: "Musicologie",
    subtitle: "Nedir?",
    description: "",
    x: 25, y: 25,
    depth: 0.9,
  },
  {
    id: "no-005",
    name: "Musiorganolog",
    subtitle: "Modern Organoloji Platform'u",
    description: "güzel bir site",
    x: 50, y: 85,
    depth: 0.65,  // farthest
  },
];

const CV_ITEMS_ALL = {
  en: [
    { name: "Profile",                    subtitle: "Interdisciplinary Researcher",                                      description: "Interdisciplinary researcher utilizing digital tools to analyze and preserve musical heritage. Bridging Turkish makam theory, Western contrapuntal techniques, ethnomusicological fieldwork and computational methods." },
    { name: "B.Sc Musicology",            subtitle: "İstanbul Technical University · 04/2019 – 06/2026",                description: "Bachelor of Science in Musicology at the ITU Turkish Music State Conservatory. Coursework spans Turkish music theory, Western harmony & counterpoint, ethnomusicology, organology and music technology." },
    { name: "Academic Thesis",            subtitle: "Ethnomusicological Transcription",                                  description: "Thesis project addressing methodological challenges of transcribing oral and improvisational traditions into notation systems, comparing makam, modal and Western frameworks." },
    { name: "Hamparsum.ai",               subtitle: "AI Hamparsum → Staff Notation",                                    description: "Prototype-ready AI system that translates Hamparsum notation into Western staff notation. Currently under ITU review with a planned launch in June 2026." },
    { name: "MuzApp",                     subtitle: "Musicological & Pedagogical Platform",                              description: "An integrated platform combining musicological reference materials with pedagogical tools, designed to support both researchers and learners." },
    { name: "Ottava Music",               subtitle: "3D Physical Music Education Tools",                                 description: "Designing tangible, three-dimensional educational instruments that make abstract music-theory concepts physically graspable for students." },
    { name: "Body and Mind",              subtitle: "Body and Mind in Musical Interaction · Experimental Research",      description: "Experimental research exploring the embodied and cognitive dimensions of musical interaction — how performers and listeners physically and mentally engage with sound." },
    { name: "Comp. Transcription",        subtitle: "Comparative Transcription Studies · Methodological",               description: "Methodological investigation comparing transcription practices across traditions, evaluating notation systems as analytical tools rather than neutral records." },
    { name: "Rock Music in Turkish Media",subtitle: "Socio-historical Study",                                            description: "Socio-historical study of rock music's reception, representation and transformation in Turkish media from its emergence through the contemporary era." },
    { name: "Bursa Org. Study",           subtitle: "Organological Study · Bursa Instrument Museum · Fieldwork",        description: "Fieldwork-based organological study of the instrument collection at the Bursa Instrument Museum, documenting construction, provenance and performance practice." },
    { name: "Film Music Portfolio",       subtitle: "5 Original Scores · The Last Supper",                              description: "Composed five original film scores, including the score for The Last Supper. Work spans orchestral, chamber and electronic textures tailored to narrative." },
    { name: "Piano Instructor",           subtitle: "2024 – Present",                                                    description: "Private piano instruction across beginner to intermediate levels, with a focus on classical repertoire alongside theory and ear training." },
    { name: "Guitar Instructor",          subtitle: "2023 – 2025",                                                       description: "Two years of guitar instruction covering classical, fingerstyle and contemporary repertoire, integrating harmony and rhythmic studies." },
    { name: "Skills",                     subtitle: "Theory · Palaeography · Counterpoint · Languages",                  description: "Turkish makam theory · Musical palaeography · Western contrapuntal techniques · Linguistic aptitude across multiple languages." },
    { name: "Performance",                subtitle: "Guitar · Piano · Cello · Tanbur",                                   description: "Guitar (10+ years) · Piano (8+ years) · Cello (2 years) · Tanbur (1.5 years). Active performer across classical, traditional and contemporary contexts." },
    { name: "Languages",                  subtitle: "English · German · Italian",                                        description: "English (B2, PTE 66) · German (A2, ongoing) · Italian (A2, four semesters of formal study)." },
    { name: "Contact",                    subtitle: "Istanbul, Türkiye",                                                  description: "yusuf8selman@gmail.com · Based in Istanbul, Türkiye. Open to research collaborations, teaching engagements and composition commissions." },
  ],
  tr: [
    { name: "Profil",                     subtitle: "Disiplinlerarası Araştırmacı",                                      description: "Müzik mirasını analiz etmek ve korumak için dijital araçları kullanan disiplinlerarası bir araştırmacı. Türk makam teorisi, Batı kontrpuan teknikleri, etnomüzikolojik alan çalışması ve hesaplamalı yöntemleri bir araya getiriyor." },
    { name: "Müzikoloji Lisans",          subtitle: "İstanbul Teknik Üniversitesi · 04/2019 – 06/2026",                 description: "İTÜ Türk Musikisi Devlet Konservatuvarı'nda Müzikoloji Lisans eğitimi. Türk müzik teorisi, Batı armoni ve kontrpuan, etnomüzikoloji, organoloji ve müzik teknolojisi alanlarını kapsamaktadır." },
    { name: "Akademik Tez",              subtitle: "Etnomüzikolojik Transkripsiyon",                                     description: "Sözlü ve doğaçlama geleneklerin nota sistemlerine aktarılmasındaki metodolojik zorlukları ele alan tez çalışması; makam, modal ve Batı çerçevelerini karşılaştırmalı olarak incelemektedir." },
    { name: "Hamparsum.ai",               subtitle: "YZ ile Hamparsum → Nota Çevirisi",                                 description: "Hamparsum notasını Batı nota yazımına çeviren, prototipi hazır bir yapay zeka sistemi. Haziran 2026 lansmanı hedefiyle İTÜ incelemesinde." },
    { name: "MuzApp",                     subtitle: "Müzikolojik ve Pedagojik Platform",                                 description: "Müzikolojik referans materyallerini pedagojik araçlarla birleştiren entegre bir platform; hem araştırmacılara hem de öğrencilere destek sağlamak üzere tasarlanmıştır." },
    { name: "Ottava Music",               subtitle: "3 Boyutlu Fiziksel Müzik Eğitim Araçları",                         description: "Soyut müzik teorisi kavramlarını öğrenciler için fiziksel olarak kavranabilir kılan somut, üç boyutlu eğitim enstrümanları tasarlama projesi." },
    { name: "Beden ve Zihin",             subtitle: "Müzikal Etkileşimde Beden ve Zihin · Deneysel Araştırma",          description: "Müzikal etkileşimin somutlaşmış ve bilişsel boyutlarını inceleyen deneysel araştırma; icracıların ve dinleyicilerin sesle fiziksel ve zihinsel etkileşim biçimleri üzerine." },
    { name: "Karş. Transkripsiyon",      subtitle: "Karşılaştırmalı Transkripsiyon Çalışmaları · Metodolojik",          description: "Farklı gelenekler arasındaki transkripsiyon pratiklerini karşılaştıran metodolojik araştırma; nota sistemlerini tarafsız kayıtlar değil, analitik araçlar olarak değerlendirmektedir." },
    { name: "Türk Medyasında Rock",      subtitle: "Sosyo-tarihsel Çalışma",                                             description: "Rock müziğin Türk medyasındaki kabulünü, temsilini ve dönüşümünü ortaya çıkışından günümüze kadar inceleyen sosyo-tarihsel çalışma." },
    { name: "Bursa Org. Çalışması",      subtitle: "Organoloji Çalışması · Bursa Çalgı Müzesi · Alan Araştırması",      description: "Bursa Çalgı Müzesi koleksiyonunun yapım, köken ve icra pratiği açısından belgelendiği alan araştırmasına dayalı organoloji çalışması." },
    { name: "Film Müziği Portföyü",      subtitle: "5 Orijinal Film Müziği · Son Akşam Yemeği",                         description: "Son Akşam Yemeği dahil beş orijinal film müziği bestelendi. Çalışmalar, anlatıya uygun orkestral, oda müziği ve elektronik dokular içermektedir." },
    { name: "Piyano Eğitmenliği",        subtitle: "2024 – Günümüz",                                                     description: "Başlangıç ve orta düzey öğrencilere klasik repertuvar odaklı özel piyano dersleri; teori ve işitme eğitimini de kapsamaktadır." },
    { name: "Gitar Eğitmenliği",         subtitle: "2023 – 2025",                                                        description: "İki yıl süresince klasik, fingerstyle ve çağdaş repertuvar üzerine gitar eğitimi; armoni ve ritim çalışmalarını bütünleştirerek yürütülmüştür." },
    { name: "Beceriler",                  subtitle: "Teori · Paleografi · Kontrpuan · Diller",                            description: "Türk makam teorisi · Müzikal paleografi · Batı kontrpuan teknikleri · Dilsel yetenek ve çok dilli iletişim becerisi." },
    { name: "Performans",                 subtitle: "Gitar · Piyano · Viyolonsel · Tanbur",                              description: "Gitar (10+ yıl) · Piyano (8+ yıl) · Viyolonsel (2 yıl) · Tanbur (1,5 yıl). Klasik, geleneksel ve çağdaş bağlamlarda aktif icracı." },
    { name: "Diller",                     subtitle: "İngilizce · Almanca · İtalyanca",                                   description: "İngilizce (B2, PTE 66) · Almanca (A2, devam ediyor) · İtalyanca (A2, 4 dönem formel eğitim)." },
    { name: "İletişim",                   subtitle: "İstanbul, Türkiye",                                                  description: "yusuf8selman@gmail.com · İstanbul, Türkiye. Araştırma işbirlikleri, eğitim çalışmaları ve beste komisyonlarına açık." },
  ],
  de: [
    { name: "Profil",                     subtitle: "Interdisziplinärer Forscher",                                       description: "Interdisziplinärer Forscher, der digitale Werkzeuge einsetzt, um musikalisches Erbe zu analysieren und zu bewahren. Verbindet türkische Maqam-Theorie, westliche Kontrapunkttechniken, ethnomusikal. Feldforschung und rechnergestützte Methoden." },
    { name: "B.Sc Musikwissenschaft",     subtitle: "İstanbul Technische Universität · 04/2019 – 06/2026",              description: "Bachelor of Science in Musikwissenschaft am Staatlichen Konservatorium für Türkische Musik der ITU. Türkische Musiktheorie, westliche Harmonie & Kontrapunkt, Ethnomusikolgie, Organologie und Musiktechnologie." },
    { name: "Abschlussarbeit",            subtitle: "Ethnomusikal. Transkription",                                       description: "Abschlussarbeit über methodische Herausforderungen der Transkription mündlicher und improvisatorischer Traditionen in Notationssysteme; Vergleich von Maqam, modalen und westlichen Ansätzen." },
    { name: "Hamparsum.ai",               subtitle: "KI Hamparsum → Notentranskription",                                 description: "Prototyp-fertiges KI-System zur Übersetzung von Hamparsum-Notation in westliche Notenschrift. Derzeit in der ITU-Prüfung, geplanter Start Juni 2026." },
    { name: "MuzApp",                     subtitle: "Musikwissenschaftliche Lernplattform",                              description: "Integrierte Plattform, die musikwissenschaftliche Referenzmaterialien mit pädagogischen Werkzeugen verbindet und sowohl Forscher als auch Lernende unterstützt." },
    { name: "Ottava Music",               subtitle: "3D-Musiklerninstrumente",                                           description: "Entwicklung greifbarer dreidimensionaler Lehrmittel, die abstrakte Musiktheorie für Schüler physisch begreifbar machen." },
    { name: "Körper und Geist",           subtitle: "Körper und Geist in musikalischer Interaktion · Experimentell",    description: "Experimentelle Forschung zu den verkörperten und kognitiven Dimensionen musikalischer Interaktion — wie Interpreten und Zuhörer körperlich und geistig mit Klang interagieren." },
    { name: "Komp. Transkription",        subtitle: "Vergleichende Transkriptionsstudien · Methodologisch",              description: "Methodologische Untersuchung von Transkriptionspraktiken über Traditionen hinweg; Notationssysteme als analytische Werkzeuge statt neutrale Aufzeichnungen." },
    { name: "Rock in türk. Medien",       subtitle: "Soziohistorische Studie",                                           description: "Soziohistorische Studie zur Rezeption, Repräsentation und Transformation von Rockmusik in türkischen Medien von ihrer Entstehung bis zur Gegenwart." },
    { name: "Bursa Org. Studie",          subtitle: "Organologische Studie · Bursa Instrumentenmuseum · Feldforschung", description: "Feldforschungsbasierte organologische Studie der Instrumentensammlung des Bursa Instrumentenmuseums; Dokumentation von Konstruktion, Herkunft und Aufführungspraxis." },
    { name: "Filmmusik Portfolio",        subtitle: "5 Originalpartituren · Das Letzte Abendmahl",                      description: "Fünf Originalfilmpartituren komponiert, darunter das Letzte Abendmahl. Orchestrale, Kammer- und elektronische Texturen, maßgeschneidert auf die Erzählung." },
    { name: "Klavierlehrer",              subtitle: "2024 – Heute",                                                       description: "Privater Klavierunterricht für Anfänger bis Fortgeschrittene mit Schwerpunkt auf klassischem Repertoire sowie Theorie und Gehörbildung." },
    { name: "Gitarrenlehrer",             subtitle: "2023 – 2025",                                                        description: "Zwei Jahre Gitarrenunterricht in klassischem, Fingerstyle- und zeitgenössischem Repertoire, integriert mit Harmonie- und Rhythmusstudien." },
    { name: "Fähigkeiten",                subtitle: "Theorie · Paläographie · Kontrapunkt · Sprachen",                   description: "Türkische Maqam-Theorie · Musikalische Paläographie · Westliche Kontrapunkttechniken · Sprachliche Begabung und mehrsprachige Kommunikation." },
    { name: "Aufführung",                 subtitle: "Gitarre · Klavier · Cello · Tanbur",                                description: "Gitarre (10+ Jahre) · Klavier (8+ Jahre) · Cello (2 Jahre) · Tanbur (1,5 Jahre). Aktiver Interpret in klassischen, traditionellen und zeitgenössischen Kontexten." },
    { name: "Sprachen",                   subtitle: "Englisch · Deutsch · Italienisch",                                   description: "Englisch (B2, PTE 66) · Deutsch (A2, laufend) · Italienisch (A2, 4 Semester formales Studium)." },
    { name: "Kontakt",                    subtitle: "Istanbul, Türkei",                                                   description: "yusuf8selman@gmail.com · Istanbul, Türkei. Offen für Forschungskooperationen, Lehraufträge und Kompositionsaufträge." },
  ],
};
// Default export for Three.js useEffect (uses English for initial render)
const CV_ITEMS = CV_ITEMS_ALL.en;

const TRANSLATIONS = {
  tr: {
    brandSub: "Teknoloji Çağının Müzikolojisi",
    tagline: "Nerede Malzeme Belleğe Dönüşür",
    returnToMap: "Haritaya Dön",
    productVisual: "Görsel",
    products: {
      "brand-info": { subtitle: "Felsefemiz", description: "Zirgüle, makâm perdelerinin incelikli tınılarını ve çeşnilerin köklü teorisini içselleştirmeniz için tasarlanmış yetkin bir rehberdir. Kudüm, usüllerin ritmik nabzını —kısasından uzununa değin— bütünüyle kavramanıza olanak tanıyan kapsamlı bir eğitim ekolüdür. Seyr-i Makam ise, bu sese adanmış serüvenin bir sonraki aşaması olarak çok yakında huzurlarınızda olacaktır." },
      "no-001": { subtitle: "Perde ve Çeşni Dershânesi", description: "Makâmâtď câlenân doğrusal bir makâm olmadığını anlamanın, perdeler arasındaki ince anlamları duyumsanın ilk adımı." },
      "no-002": { subtitle: "Usül Dershânesi", description: "Ritmin ruh olduğu yer. Kudüm'ün dili üzerinden Osmanlı-Türk musikisinin temel usül sistemleriyle tanışın." },
      "no-003": { subtitle: "Seyir Dershânesi", description: "Makâm, bir nota dizisi değil; bir seyirdir. Her makâmın çıkışını, gidiş yolunu ve varış noktasını öğrenin." },
      "no-004": { subtitle: "Nedir?", description: "Musicologie, müziği salt kulakla değil; akıl, duygu ve tarihsel bellekle algılamak için tasarlanmış dijital bir dershânedir." },
      "no-005": { subtitle: "Modern Organoloji Platform'u", description: "güzel bir site" },
    },
  },
  en: {
    brandSub: "Musicology of the Technological Age",
    tagline: "Where Material Becomes Memory",
    returnToMap: "Return to Map",
    productVisual: "Product Visual",
    products: {
      "brand-info": { subtitle: "Our Philosophy", description: "Zirgüle is a masterful guide designed to help you internalize the subtle pitches of the maqam and the deep theory of its modes. Kudüm is a comprehensive educational program that allows you to fully grasp the rhythmic pulse of the usuls, from the shortest to the most expansive. Seyr-i Makam, the next chapter in this auditory journey, will be unveiled very soon." },
      "no-001": { subtitle: "School of Maqam & Modes", description: "The first step to understanding that Maqamat is not a linear scale, but a living language of intervals and emotional colour." },
      "no-002": { subtitle: "School of Rhythm", description: "Where rhythm becomes soul. Explore the foundational rhythmic cycles of Ottoman-Turkish music through the language of the Kudüm drum." },
      "no-003": { subtitle: "School of Melodic Progression", description: "A Maqam is not a set of notes — it is a journey. Learn the departure, the path, and the destination of each Maqam." },
      "no-004": { subtitle: "What is it?", description: "Musicologie is a digital school designed to perceive music not only with the ear, but with the mind, emotion, and historical memory." },
      "no-005": { subtitle: "Modern Organology Platform", description: "güzel bir site" },
    },
  },
  de: {
    brandSub: "Musikologie des Technologischen Zeitalters",
    tagline: "Wo Material zu Erinnerung wird",
    returnToMap: "Zurück zur Karte",
    productVisual: "Produktbild",
    products: {
      "brand-info": { subtitle: "Unsere Philosophie", description: "Zirgüle ist ein meisterhafter Führer, der entworfen wurde, um die subtilen Tonhöhen des Maqam und die tiefe Theorie seiner Modi zu verinnerlichen. Kudüm ist ein umfassendes Bildungsprogramm, das es Ihnen ermöglicht, den rhythmischen Puls der Usuls von den kürzesten bis zu den ausgedehntesten vollständig zu erfassen. Seyr-i Makam, das nächste Kapitel dieser akustischen Reise, wird in Kürze enthüllt." },
      "no-001": { subtitle: "Schule der Tonleitern & Modi", description: "Der erste Schritt zum Verständnis, dass Maqamat keine lineare Skala ist, sondern eine lebendige Sprache der Intervalle und Emotionen." },
      "no-002": { subtitle: "Rhythmusschule", description: "Wo Rhythmus zur Seele wird. Erkunde die rhythmischen Grundzyklen der osmanisch-türkischen Musik durch die Sprache der Kudüm-Trommel." },
      "no-003": { subtitle: "Schule der melodischen Entwicklung", description: "Ein Maqam ist keine Notenreihe — er ist eine Reise. Lerne Abgang, Weg und Ziel jedes Maqams kennen." },
      "no-004": { subtitle: "Was ist das?", description: "Musicologie ist eine digitale Schule, die Musik nicht nur mit dem Ohr, sondern mit Verstand, Gefühl und historischem Gedächtnis erfahrbar macht." },
      "no-005": { subtitle: "Moderne Organologie-Plattform", description: "güzel bir site" },
    },
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Outfit:wght@200;300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .msc-root {
    width: 100vw; height: 100vh; overflow: hidden;
    position: relative; cursor: crosshair;
    font-family: 'Outfit', sans-serif;
    background-color: #d1a554;
  }

  .msc-bg-canvas {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    width: 100vw; height: 100vh;
  }

  .msc-rays {
    position: absolute; top: -20%; left: -20%; width: 140vw; height: 140vh;
    z-index: 2; pointer-events: none;
    background: 
      linear-gradient(130deg, transparent 25%, rgba(255,255,255,0.25) 35%, transparent 40%),
      linear-gradient(140deg, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%),
      linear-gradient(145deg, transparent 65%, rgba(255,255,255,0.1) 68%, transparent 72%),
      linear-gradient(120deg, transparent 15%, rgba(255,255,255,0.2) 20%, transparent 30%);
    background-size: 100% 100%;
    mix-blend-mode: overlay;
    animation: pulseRays 18s ease-in-out infinite alternate;
    transform-origin: 0% 0%;
  }
  @keyframes pulseRays {
    0% { transform: scale(1.0) rotate(0deg); opacity: 0.6; }
    33% { transform: scale(1.15) rotate(2deg); opacity: 1; }
    66% { transform: scale(0.95) rotate(-1deg); opacity: 0.5; }
    100% { transform: scale(1.1) rotate(1deg); opacity: 0.8; }
  }

  .msc-glow {
    position: absolute; top: -50%; left: -50%; z-index: 2; pointer-events: none;
    width: 200vw; height: 200vh;
    background: radial-gradient(circle at 20% 20%, rgba(255,255,230,0.6) 0%, rgba(255,255,220,0.15) 30%, transparent 60%);
    mix-blend-mode: screen;
    opacity: 0.85;
  }
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.15); opacity: 1; }
  }

  .msc-vignette {
    position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: 
      radial-gradient(ellipse at center, transparent 20%, rgba(60, 35, 5, 0.55) 100%),
      radial-gradient(ellipse 120% 80% at 50% 110%, rgba(40,20,0,0.4) 0%, transparent 60%);
    mix-blend-mode: multiply;
  }

  .msc-mouse-light {
    position: fixed; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,255,230,0.15) 0%, transparent 60%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: 3;
    mix-blend-mode: overlay;
  }

  .msc-brand {
    position: absolute; top: 40px; left: 50%; transform: translateX(-50%);
    z-index: 10; text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 18px; letter-spacing: 14px; text-transform: uppercase;
    color: ${FG}; opacity: 0;
    text-shadow: 0 2px 4px rgba(100, 60, 10, 0.2);
    animation: msc-fadeIn 2s ease 0.5s forwards;
  }

  .msc-brand-sub {
    display: block; font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 6px;
    color: rgba(255,255,255,0.7); margin-top: 8px;
  }

  .msc-canvas-wrap {
    position: absolute; inset: 0;
    z-index: 5; pointer-events: none;
    transition: opacity 1s ease;
  }
  .msc-canvas-wrap.hidden {
    opacity: 0; pointer-events: none;
  }
  .msc-canvas-wrap canvas {
    display: block;
  }

  .msc-logo-hit {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 6; pointer-events: auto;
    width: 240px; height: 240px; border-radius: 50%;
    cursor: pointer;
  }

  .msc-svg-overlay {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    transition: opacity 0.8s ease;
  }
  .msc-svg-overlay.hidden { opacity: 0; }

  .msc-line {
    stroke: ${FG}; stroke-width: 1.5; fill: none;
    opacity: 0.25; mix-blend-mode: screen;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: msc-drawLine 2.5s ease 1s forwards;
  }

  .msc-line-glow {
    stroke: ${FG}; stroke-width: 4; fill: none;
    opacity: 0.2; filter: blur(4px); mix-blend-mode: screen;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: msc-drawLine 2.5s ease 1s forwards;
  }

  .msc-line-hover {
    stroke: rgba(255,220,120,0.55); stroke-width: 6; fill: none;
    filter: blur(5px); mix-blend-mode: screen;
    pointer-events: none; opacity: 0;
    transition: opacity 0.4s ease;
  }
  .msc-line-hover.active { opacity: 1; }

  .msc-pulse-dot {
    fill: ${FG}; opacity: 0;
    animation: none;
  }

  .msc-center-dot {
    fill: ${FG}; opacity: 0;
    animation: msc-fadeIn 1.5s ease 1.5s forwards;
  }

  @keyframes msc-drawLine {
    to { stroke-dashoffset: 0; }
  }

  @keyframes msc-pulseDot {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.6; }
  }

  @keyframes msc-fadeIn {
    to { opacity: 1; }
  }

  @keyframes msc-fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msc-node {
    position: absolute; z-index: 8; cursor: pointer;
    transform: translate(-50%, -50%);
    opacity: 0; animation: msc-fadeIn 1.5s ease 2s forwards;
    transition: opacity 0.8s ease, transform 0.8s ease;
    display: flex; flex-direction: column; align-items: center;
  }
  /* Transparent extended hit area — does not affect absolute-positioned children */
  .msc-node::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 120px; height: 120px;
    border-radius: 50%;
  }
  .msc-node.hidden {
    opacity: 0 !important; pointer-events: none;
    transform: translate(-50%, -50%) scale(0.5);
  }
  .msc-node:hover .msc-node-ring {
    transform: scale(1.4);
    box-shadow: 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1);
  }
  .msc-node:hover .msc-node-label {
    opacity: 1; transform: translateY(0);
  }
  .msc-node:hover .msc-node-subtitle {
    opacity: 0.5; transform: translateY(0);
  }

  .msc-node-ring {
    width: 12px; height: 12px; border-radius: 50%;
    border: 1px solid ${FG_DIM};
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    position: relative;
  }
  .msc-node-ring::after {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 3px; height: 3px; border-radius: 50%;
    background: ${FG};
  }

  .msc-node-label {
    position: absolute; top: -32px; left: 50%; transform: translateX(-50%) translateY(5px);
    white-space: nowrap;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400; font-size: 14px; letter-spacing: 3px;
    color: ${FG}; opacity: 0.6;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .msc-node-subtitle {
    position: absolute; top: 24px; left: 50%; transform: translateX(-50%) translateY(5px);
    white-space: nowrap;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: ${FG}; opacity: 0;
    transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
  }

  /* Detail view */
  .msc-detail {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: rgba(4, 3, 2, 0.1);
    backdrop-filter: blur(8px);
    animation: detailFadeIn 0.8s forwards;
  }
  .msc-detail.closing {
    animation: detailFadeOut 0.6s forwards;
  }
  @keyframes detailFadeIn {
    0% { opacity: 0; backdrop-filter: blur(0px); }
    100% { opacity: 1; backdrop-filter: blur(8px); }
  }
  @keyframes detailFadeOut {
    0% { opacity: 1; backdrop-filter: blur(8px); }
    100% { opacity: 0; backdrop-filter: blur(0px); }
  }

  .msc-detail-inner {
    display: flex; align-items: center; gap: 80px;
    max-width: 1000px; padding: 40px;
  }

  .msc-detail-image {
    width: 350px; height: 450px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.15);
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; animation: msc-fadeInUp 0.8s ease 0.2s forwards;
    position: relative; overflow: hidden;
  }
  .msc-detail-image::before {
    content: ''; position: absolute; inset: 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .msc-detail-image-text {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 5px;
    color: rgba(255,255,255,0.2); text-transform: uppercase;
  }

  .msc-detail-content {
    flex: 1;
    opacity: 0; animation: msc-fadeInUp 0.8s ease 0.4s forwards;
  }

  .msc-detail-number {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 11px; letter-spacing: 6px;
    color: rgba(255,255,255,0.4); margin-bottom: 16px;
  }

  .msc-detail-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 48px; letter-spacing: 2px;
    color: ${FG}; margin-bottom: 12px; line-height: 1.1;
  }

  .msc-detail-desc {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 14px; line-height: 1.9;
    color: rgba(255,255,255,0.35); max-width: 380px;
    margin-bottom: 40px;
  }

  .msc-detail-back {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(255,255,255,0.5); cursor: pointer;
    background: none; border: none; padding: 12px 0;
    transition: color 0.3s ease;
  }
  .msc-detail-back:hover { color: ${FG}; }
  .msc-detail-back-line {
    width: 40px; height: 1px; background: rgba(255,255,255,0.3);
    transition: width 0.3s ease, background 0.3s ease;
  }
  .msc-detail-back:hover .msc-detail-back-line {
    width: 60px; background: ${FG};
  }

  .msc-detail-divider {
    width: 50px; height: 1px;
    background: linear-gradient(to right, ${FG_DIM}, transparent);
    margin-bottom: 24px;
  }

  /* Bottom tagline */
  .msc-tagline {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    z-index: 9;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 5px; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    opacity: 0; animation: msc-fadeIn 2s ease 2.5s forwards;
    transition: opacity 0.8s ease;
  }
  .msc-tagline.hidden {
    opacity: 0 !important; transform: translate(-50%, 10px);
  }

  /* Corner accents */
  .msc-corner {
    position: absolute; z-index: 6; opacity: 0;
    animation: msc-fadeIn 2s ease 2s forwards;
  }
  .msc-corner-tl { top: 30px; left: 30px; }
  .msc-corner-br { bottom: 30px; right: 30px; }
  
  .msc-spatial-zoom {
    width: 100vw; height: 100vh;
    position: absolute; top: 0; left: 0;
    transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease 0.4s;
    will-change: transform, opacity;
  }
  .msc-spatial-zoom.zoom-in-001 { transform-origin: 80% 20%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-002 { transform-origin: 85% 70%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-003 { transform-origin: 20% 75%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-004 { transform-origin: 18% 25%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-005 { transform-origin: 50% 85%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-brand-info { transform-origin: 50% 10%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-cv { transform-origin: 50% 95%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  
  .msc-spatial-zoom.zoom-out-001 { transform-origin: 80% 20%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-002 { transform-origin: 85% 70%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-003 { transform-origin: 20% 75%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-004 { transform-origin: 18% 25%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-005 { transform-origin: 50% 85%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-brand-info { transform-origin: 50% 10%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-cv { transform-origin: 50% 95%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }

  /* ═══ CV Vinyl Record Page ═══ */
  .msc-cv-backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(10, 8, 4, 0.88);
    backdrop-filter: blur(16px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.7s ease;
  }
  .msc-cv-backdrop.active {
    opacity: 1;
    pointer-events: auto;
  }

  .msc-cv-combo {
    position: fixed; left: 0; top: 0;
    z-index: 51;
    pointer-events: none;
  }
  .msc-cv-combo-record {
    position: absolute; z-index: 1;
  }
  .msc-cv-combo-record canvas {
    width: 100% !important; height: 100% !important;
  }
  .msc-cv-combo-sleeve {
    position: absolute; z-index: 2;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s;
  }
  .msc-cv-sleeve-inner {
    width: 100%; height: 100%;
    background: linear-gradient(145deg, #3d2e12 0%, #2a1f0c 40%, #1e1608 100%);
    border: 1px solid rgba(212,165,32,0.15);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.05),
      inset 0 -1px 0 rgba(0,0,0,0.3);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .msc-cv-sleeve-inner::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px
    );
    pointer-events: none;
  }
  .msc-cv-sleeve-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 32px; letter-spacing: 3px;
    color: rgba(212, 165, 32, 0.85);
    text-shadow: 0 2px 8px rgba(100, 60, 10, 0.3);
    text-align: center; margin-bottom: 6px;
  }
  .msc-cv-sleeve-sub {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 6px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 30px;
  }
  .msc-cv-sleeve-btn {
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 10px; letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(212,165,32,0.7);
    background: none;
    border: 1px solid rgba(212,165,32,0.25);
    padding: 10px 28px;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s, box-shadow 0.3s;
  }
  .msc-cv-sleeve-btn:hover {
    color: rgba(212,165,32,1);
    border-color: rgba(212,165,32,0.5);
    box-shadow: 0 0 20px rgba(212,165,32,0.15);
  }

  /* CV Back Button — top-left */
  .msc-cv-back {
    position: fixed; top: 36px; left: 36px;
    z-index: 56;
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 10px; letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    background: none; border: none;
    cursor: pointer; pointer-events: auto;
    transition: color 0.3s ease;
    opacity: 0;
    animation: msc-fadeIn 0.6s ease 0.3s forwards;
  }
  .msc-cv-back:hover { color: rgba(255,255,255,0.9); }
  .msc-cv-back-line {
    width: 35px; height: 1px;
    background: rgba(255,255,255,0.25);
    transition: width 0.3s ease, background 0.3s ease;
  }
  .msc-cv-back:hover .msc-cv-back-line {
    width: 55px; background: rgba(212,165,32,0.7);
  }

  /* CV Detail Panel — right side, çarkıfelek */
  .msc-cv-detail {
    position: fixed; top: 50%; right: 6vw;
    transform: translateY(-50%);
    width: min(38vw, 520px);
    z-index: 55;
    pointer-events: none;
    color: rgba(255,255,255,0.85);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .msc-cv-detail.active { opacity: 1; }
  .msc-cv-detail-eyebrow {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(212,165,32,0.6);
    margin-bottom: 18px;
  }
  .msc-cv-detail-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 44px; line-height: 1.1;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.95);
    margin-bottom: 14px;
  }
  .msc-cv-detail-sub {
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 12px; letter-spacing: 2px;
    color: rgba(212,165,32,0.75);
    margin-bottom: 24px;
  }
  .msc-cv-detail-desc {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 14px; line-height: 1.7;
    color: rgba(255,255,255,0.55);
    max-width: 480px;
  }
  .msc-cv-detail-fade {
    animation: msc-cvDetailFade 0.5s ease;
  }
  @keyframes msc-cvDetailFade {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* CV scroll hint */
  .msc-cv-scroll-hint {
    position: fixed; bottom: 30px; left: 50%;
    transform: translateX(-50%);
    z-index: 56;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    opacity: 0;
    animation: msc-fadeIn 1s ease 0.5s forwards, msc-pulseHint 2s ease-in-out 1.5s infinite;
  }
  @keyframes msc-pulseHint {
    0%, 100% { opacity: 0.25; transform: translateX(-50%) translateY(0); }
    50% { opacity: 0.5; transform: translateX(-50%) translateY(-4px); }
  }

  /* Language Switcher */
  .msc-lang-btn {
    position: fixed; top: 28px; right: 36px;
    z-index: 200;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.55);
    display: flex; align-items: center; gap: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    transition: color 0.3s ease;
    padding: 6px 0;
  }
  .msc-lang-btn:hover { color: rgba(255,255,255,0.9); }
  .msc-lang-btn svg { transition: opacity 0.3s ease; }

  .msc-lang-dropdown {
    position: fixed; top: 54px; right: 30px;
    z-index: 200;
    background: rgba(30,20,5,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    animation: msc-fadeIn 0.18s ease forwards;
  }
  .msc-lang-option {
    display: block; width: 100%;
    padding: 9px 20px;
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    text-align: left;
    transition: color 0.2s ease, background 0.2s ease;
    white-space: nowrap;
  }
  .msc-lang-option:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.05); }
  .msc-lang-option.active { color: rgba(255,225,160,0.9); }

  /* Page Transition */
  .page-transition-right {
    animation: slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  @keyframes slideOutRight {
    to { transform: translateX(-50px); opacity: 0; }
  }
`;

export default function Museicologie() {
  const [lang, setLang] = useState("tr");
  const [langOpen, setLangOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [transitionState, setTransitionState] = useState("");
  const [detailClosing, setDetailClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cvState, setCvState] = useState("hidden");
  const [cvSelected, setCvSelected] = useState(0);
  const cvSelectedRef = useRef(0);
  const cvWheelCooldownRef = useRef(0);
  cvSelectedRef.current = cvSelected;

  const t = TRANSLATIONS[lang];

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [langOpen]);

  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef(null);
  const mouseLightRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const cvCanvasRef = useRef(null);
  const cvAnimRef = useRef(null);
  const cvStateRef = useRef("hidden");
  // Stores {canvas, tex} for each label plane so we can redraw on lang change
  const cvLabelTexRef = useRef([]);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      if (mouseLightRef.current) {
        mouseLightRef.current.style.left = `${x}%`;
        mouseLightRef.current.style.top = `${y}%`;
      }

      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      if (!window.__mscMouse) window.__mscMouse = new THREE.Vector2(0.5, 0.5);
      window.__mscMouse.set(mouseRef.current.x, 1.0 - mouseRef.current.y);
    };
    window.addEventListener("mousemove", onMove);
    setEntered(true);
    
    if (mouseLightRef.current) {
        mouseLightRef.current.style.left = `50%`;
        mouseLightRef.current.style.top = `50%`;
    }

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Background Fluid Shader
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;
    
    const TRAIL_SIZE = 25;
    const initialTrail = new Array(TRAIL_SIZE).fill(null).map(() => new THREE.Vector2(0.5, 0.5));
    
    const uniforms = {
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_trail: { value: initialTrail },
      u_velocity: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() { 
          vUv = uv; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec2 u_trail[25];
        uniform float u_velocity;
        uniform vec2 u_resolution;
        varying vec2 vUv;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm(vec2 x) {
          float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 5; ++i) {
            v += a * noise(x); x = rot * x * 2.0 + shift; a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float aspect = u_resolution.x / u_resolution.y;
          st.x *= aspect;
          
          float totalRipple = 0.0;
          float totalDistortion = 0.0;
          vec2 totalDir = vec2(0.0);
          
          float vel = clamp(u_velocity * 4.0, 0.0, 1.0);

          // Iterate through the historical trail points (loop manually unrolled for strict GLSL ES 1.0 compatibility)
          ` + new Array(25).fill(0).map((_, i) => `
          {
             float age = ${i}.0 / 25.0; 
             float decay = 1.0 - age;
             decay *= decay; 
             
             vec2 trailPos = u_trail[${i}];
             trailPos.x *= aspect;
             
             vec2 diff = st - trailPos;
             float dist = length(diff);
             vec2 dir = dist > 0.0001 ? diff / dist : vec2(0.0);
             
             float maxRadius = mix(0.015, 0.06, vel);
             float mask = smoothstep(maxRadius, maxRadius * 0.1, dist);
             
             float wave = sin(dist * 120.0 - u_time * 15.0 - age * 8.0);
             
             totalRipple += wave * mask * decay * 0.02;
             totalDistortion += exp(-dist * 25.0) * decay * 0.03 * mask;
             totalDir += dir * mask * decay;
          }
          `).join('') + `
          
          vec2 avgDir = length(totalDir) > 0.0001 ? normalize(totalDir) : vec2(0.0);
          
          // Velocity multiplying output ensures instantaneous flatness when mouse completely stops
          vec2 uv = vUv + avgDir * (totalDistortion + totalRipple) * vel;

          // Cloudy, realistic metallic brass simulation
          vec3 color1 = vec3(0.92, 0.77, 0.44); // Lighter gold
          vec3 color2 = vec3(0.59, 0.40, 0.14); // Darker vintage gold
          
          // Use FBM (Fractal Brownian Motion) instead of simple distance
          float n = fbm(uv * 3.0 + fbm(uv * 1.5 + u_time * 0.02));
          vec3 color = mix(color2, color1, clamp(n * 1.2, 0.0, 1.0));

          // Fine grit overlay
          float grain = noise(uv * 1000.0);
          color *= (0.9 + 0.1 * grain);

          // Specular highlights mapped to the fluid ripples
          float pointerDist = length(st - (u_mouse * vec2(aspect, 1.0)));
          float highlight = smoothstep(0.04, 0.0, pointerDist) * smoothstep(0.0, 0.04, pointerDist) * vel;
          color += vec3(0.5, 0.4, 0.15) * highlight;
          color += vec3(0.3, 0.2, 0.0) * max(0.0, totalRipple) * 20.0;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(
        window.innerWidth * renderer.getPixelRatio(),
        window.innerHeight * renderer.getPixelRatio()
      );
    };
    window.addEventListener('resize', resize);
    resize();

    let mouseLerp = new THREE.Vector2(0.5, 0.5);
    let velocitySmooth = 0.0;
    let req;

    let trail = new Array(TRAIL_SIZE).fill(null).map(() => new THREE.Vector2(0.5, 0.5));

    const animate = (time) => {
      const targetMouse = window.__mscMouse || new THREE.Vector2(0.5, 0.5);
      
      // Calculate delta distance for velocity
      const dx = targetMouse.x - mouseLerp.x;
      const dy = targetMouse.y - mouseLerp.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      velocitySmooth += (speed - velocitySmooth) * 0.15; // Ease in/out velocity
      
      // Hard cutoff to absolutely prevent micro-ripples when physically stationary
      if (speed < 0.001) velocitySmooth *= 0.8;
      if (velocitySmooth < 0.0001) velocitySmooth = 0.0;

      mouseLerp.lerp(targetMouse, 0.2);
      
      // Update historical wave positions
      for (let i = TRAIL_SIZE - 1; i >= 1; i--) {
        trail[i].copy(trail[i - 1]);
      }
      trail[0].copy(mouseLerp);

      uniforms.u_time.value = time * 0.001;
      uniforms.u_mouse.value.copy(mouseLerp);
      uniforms.u_velocity.value = velocitySmooth * 20.0; // Scale up for visual impact
      uniforms.u_trail.value = trail;

      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(req);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Three.js — Gold Monogram M
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.z = 8.0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    rendererRef.current = renderer;

    const resizeMono = () => {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeMono);

    // Lighting setup for premium gold look
    const ambientLight = new THREE.AmbientLight(0xfff5d0, 0.6);
    scene.add(ambientLight);

    // Key light from upper-left (warm golden)
    const keyLight = new THREE.DirectionalLight(0xffe8a0, 3.5);
    keyLight.position.set(-2, 3, 4);
    scene.add(keyLight);

    // Fill light (cooler, from right)
    const fillLight = new THREE.DirectionalLight(0xffd070, 1.2);
    fillLight.position.set(3, -1, 2);
    scene.add(fillLight);

    // Rim light from behind (deeply warm amber)
    const rimLight = new THREE.DirectionalLight(0xff9900, 0.8);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    // Subtle top bounce
    const topLight = new THREE.PointLight(0xfffbe0, 1.5, 20);
    topLight.position.set(0, 5, 3);
    scene.add(topLight);

    // Gold material — polished metal feel
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4a520),
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 1.0,
    });

    let pmremGen = null;
    let neutralEnv = null;
    let monogramMesh = null;

    // Musical Note Particles — scattered across full screen
    const NOTE_SYMBOLS = ['♩', '♪', '♫', '♬', '𝄞'];
    const pCountPerGroup = 34; // ~170 total — sparse enough not to feel dense
    const allNoteGroups = [];
    const allBasePos = [];
    const allPhases = [];

    NOTE_SYMBOLS.forEach((symbol) => {
      // Draw symbol on canvas
      const nc = document.createElement('canvas');
      nc.width = 64; nc.height = 64;
      const nctx = nc.getContext('2d');
      nctx.clearRect(0, 0, 64, 64);
      // Soft white glow behind note for visibility
      nctx.shadowColor = 'rgba(255,240,180,0.9)';
      nctx.shadowBlur = 6;
      nctx.fillStyle = 'rgba(255, 248, 220, 0.92)';
      nctx.font = '600 36px serif';
      nctx.textAlign = 'center';
      nctx.textBaseline = 'middle';
      nctx.fillText(symbol, 32, 34);
      const noteTex = new THREE.CanvasTexture(nc);

      const gPositions = new Float32Array(pCountPerGroup * 3);
      const gBase = new Float32Array(pCountPerGroup * 3);
      const gPhases = new Float32Array(pCountPerGroup);
      for (let i = 0; i < pCountPerGroup; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 24;
        const z = (Math.random() - 0.5) * 12;
        gBase[i*3] = x; gBase[i*3+1] = y; gBase[i*3+2] = z;
        gPositions[i*3] = x; gPositions[i*3+1] = y; gPositions[i*3+2] = z;
        gPhases[i] = Math.random() * Math.PI * 2;
      }
      const gGeo = new THREE.BufferGeometry();
      gGeo.setAttribute("position", new THREE.BufferAttribute(gPositions, 3));
      const gMat = new THREE.PointsMaterial({
        size: 0.40, map: noteTex,
        transparent: true, opacity: 0.28,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const gPoints = new THREE.Points(gGeo, gMat);
      scene.add(gPoints);
      // vx/vy: per-particle repulsion velocity that decays over time
      const gVel = new Float32Array(pCountPerGroup * 2);
      allNoteGroups.push({ points: gPoints, base: gBase, phases: gPhases, vel: gVel, tex: noteTex });
    });
    // Keep pCount + phases refs for animation loop compatibility
    const pCount = pCountPerGroup;
    const basePositions = allNoteGroups[0].base;
    const phases = allNoteGroups[0].phases;
    const particles = allNoteGroups[0].points;

    // Load STL + RoomEnvironment together (avoids THREE.RoomEnvironment not being on core THREE)
    Promise.all([
      import('three/examples/jsm/loaders/STLLoader.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
    ]).then(([{ STLLoader }, { RoomEnvironment }]) => {
      // Apply environment map for metallic reflections
      pmremGen = new THREE.PMREMGenerator(renderer);
      pmremGen.compileEquirectangularShader();
      neutralEnv = pmremGen.fromScene(new RoomEnvironment()).texture;
      scene.environment = neutralEnv;
      pmremGen.dispose();

      // Now load the monogram geometry
      const loader = new STLLoader();
      loader.load('/Monogram_Stacked_M.stl', (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
        const size3D = new THREE.Vector3();
        box.getSize(size3D);
        const maxDim = Math.max(size3D.x, size3D.y, size3D.z);
        const scale = 2.2 / maxDim;

        monogramMesh = new THREE.Mesh(geometry, goldMat);
        monogramMesh.scale.setScalar(scale);
        // STL is typically Z-up; rotate so it faces the camera correctly
        monogramMesh.rotation.x = 0;
        scene.add(monogramMesh);
      });
    });

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;

      if (monogramMesh) {
        // Mouse parallax only — no auto-rotation (model back is flat)
        monogramMesh.rotation.y += (mx * 0.75 - monogramMesh.rotation.y) * 0.08;
        monogramMesh.rotation.x += (my * -0.75 - monogramMesh.rotation.x) * 0.08;
      }

      // Musical note flutter + mouse repulsion
      const timeSec = Date.now() * 0.001;
      // Convert mouse screen (0-1) → world XY at z=0 plane
      const halfH = Math.tan((45 * Math.PI / 180) / 2) * 8; // camera z=8, FOV=45
      const aspect = renderer.domElement.width / renderer.domElement.height;
      const mwx = (mouseRef.current.x - 0.5) * 2 * halfH * aspect;
      const mwy = -(mouseRef.current.y - 0.5) * 2 * halfH;
      const REPULSE_RADIUS = 2.8;   // world units — influence zone
      const REPULSE_FORCE  = 0.045; // subtle nudge
      const VEL_DECAY      = 0.82;  // fast decay so notes settle quickly

      allNoteGroups.forEach(({ points, base, phases: gPhases, vel }, gi) => {
        const posAttr = points.geometry.attributes.position;
        const posArray = posAttr.array;
        const driftSpeed = 0.0025 + gi * 0.0004;
        for (let i = 0; i < pCountPerGroup; i++) {
          const phase = gPhases[i];

          // Drift + gentle bob
          base[i*3]   += driftSpeed;
          base[i*3+1] += driftSpeed * 0.55;
          if (base[i*3]   >  12.5) base[i*3]   = -12.5;
          if (base[i*3+1] >   7.5) base[i*3+1] = -7.5;

          const bx = base[i*3]   + Math.sin(timeSec * 0.45 + phase + gi) * 0.28;
          const by = base[i*3+1] + Math.cos(timeSec * 0.28 + phase + gi) * 0.28;

          // Mouse repulsion force
          const dx = bx - mwx;
          const dy = by - mwy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSE_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / REPULSE_RADIUS;   // strongest at center
            const strength = falloff * falloff * REPULSE_FORCE;
            vel[i*2]   += (dx / dist) * strength;
            vel[i*2+1] += (dy / dist) * strength;
          }

          // Decay velocity
          vel[i*2]   *= VEL_DECAY;
          vel[i*2+1] *= VEL_DECAY;

          posArray[i*3]   = bx + vel[i*2];
          posArray[i*3+1] = by + vel[i*2+1];
          // Z stays as-is from initial scatter
        }
        posAttr.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeMono);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      goldMat.dispose();
      allNoteGroups.forEach(({ points, tex }) => {
        points.geometry.dispose();
        points.material.dispose();
        tex.dispose();
      });
      if (neutralEnv) neutralEnv.dispose();
    };
  }, []);

  // Three.js — Vinyl Record for CV page
  useEffect(() => {
    const canvas = cvCanvasRef.current;
    if (!canvas) return;

    const getCvSize = () => Math.round(Math.min(window.innerWidth * 0.88, window.innerHeight * 0.88));
    const cvSize = getCvSize();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(cvSize, cvSize);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6.5;

    // Enhanced lighting for depth and realism
    scene.add(new THREE.AmbientLight(0xfff5d0, 0.3));
    const keyLight = new THREE.DirectionalLight(0xffe8a0, 4.0);
    keyLight.position.set(-2, 3, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffd070, 1.5);
    fillLight.position.set(4, -1, 2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffaa22, 1.2);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);
    const topLight = new THREE.PointLight(0xfffbe0, 2.0, 12);
    topLight.position.set(1, 5, 4);
    scene.add(topLight);
    const sideLight = new THREE.PointLight(0xffd060, 1.0, 10);
    sideLight.position.set(-4, 0, 3);
    scene.add(sideLight);

    const group = new THREE.Group();
    cvGroupRef.current = group;

    // Record body — higher-segment gold cylinder for smooth edge
    const bodyGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.06, 256);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8a6010, metalness: 0.98, roughness: 0.08,
      envMapIntensity: 2.0,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Groove surface — high-resolution ShaderMaterial
    const grooveGeo = new THREE.RingGeometry(0.55, 2.18, 256, 64);
    const grooveUniforms = {
      u_time: { value: 0 },
      u_lightDir: { value: new THREE.Vector3(-0.5, 0.8, 1.0).normalize() },
      u_lightDir2: { value: new THREE.Vector3(1.0, -0.3, 0.6).normalize() },
    };
    const grooveMat = new THREE.ShaderMaterial({
      uniforms: grooveUniforms,
      vertexShader: [
        "varying vec2 vLP;",
        "varying vec3 vN;",
        "varying vec3 vVP;",
        "void main() {",
        "  vLP = position.xy;",
        "  vN = normalize(normalMatrix * normal);",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  vVP = mv.xyz;",
        "  gl_Position = projectionMatrix * mv;",
        "}",
      ].join("\n"),
      fragmentShader: [
        "uniform float u_time;",
        "uniform vec3 u_lightDir;",
        "uniform vec3 u_lightDir2;",
        "varying vec2 vLP;",
        "varying vec3 vN;",
        "varying vec3 vVP;",
        "void main() {",
        "  float r = length(vLP);",
        "  float ang = atan(vLP.y, vLP.x);",
        // Deep gold palette
        "  vec3 dk = vec3(0.20, 0.12, 0.02);",
        "  vec3 md = vec3(0.55, 0.38, 0.06);",
        "  vec3 br = vec3(0.88, 0.70, 0.18);",
        "  vec3 hl = vec3(1.0, 0.95, 0.72);",
        // Sharp groove pattern — high frequency
        "  float gf = sin(r * 180.0) * 0.5 + 0.5;",
        "  gf = pow(gf, 0.25);",
        "  float gs = cos(r * 180.0);",
        // Perturbed normal for groove micro-facets
        "  vec3 rd = normalize(vec3(vLP, 0.0));",
        "  vec3 N = normalize(vN + rd * gs * 0.18);",
        "  vec3 V = normalize(-vVP);",
        // Key light specular
        "  vec3 H1 = normalize(u_lightDir + V);",
        "  float sp1 = pow(max(dot(N, H1), 0.0), 96.0);",
        // Fill light specular
        "  vec3 H2 = normalize(u_lightDir2 + V);",
        "  float sp2 = pow(max(dot(N, H2), 0.0), 48.0);",
        "  float df1 = max(dot(N, u_lightDir), 0.0);",
        "  float df2 = max(dot(N, u_lightDir2), 0.0) * 0.4;",
        // Iridescent shimmer across grooves
        "  float ph = r * 80.0 + ang + u_time * 0.08;",
        "  vec3 ir = vec3(sin(ph)*0.5+0.5, sin(ph+2.094)*0.5+0.5, sin(ph+4.189)*0.5+0.5) * 0.10;",
        // Fresnel edge glow
        "  float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.4;",
        "  vec3 c = mix(dk, md, gf);",
        "  c = mix(c, br, df1 * 0.35 + df2 * 0.15);",
        "  c += hl * (sp1 * 0.9 + sp2 * 0.3);",
        "  c += ir * (sp1 * 0.8 + 0.2);",
        "  c += br * fr;",
        // Edge fade
        "  float oe = 1.0 - smoothstep(2.12, 2.18, r);",
        "  float ie = smoothstep(0.52, 0.55, r);",
        "  gl_FragColor = vec4(c, oe * ie);",
        "}",
      ].join("\n"),
      transparent: true,
      side: THREE.FrontSide,
    });
    const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
    grooveMesh.position.z = 0.031;
    group.add(grooveMesh);

    // Center label
    const lc = document.createElement("canvas");
    lc.width = 512; lc.height = 512;
    const lx = lc.getContext("2d");
    const grd = lx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grd.addColorStop(0, "#f0d878");
    grd.addColorStop(0.5, "#d4a520");
    grd.addColorStop(1, "#8a6010");
    lx.fillStyle = grd;
    lx.beginPath(); lx.arc(256, 256, 256, 0, Math.PI * 2); lx.fill();
    // Fine decorative rings
    lx.strokeStyle = "rgba(40, 25, 3, 0.3)";
    lx.lineWidth = 0.8;
    [170, 185, 198, 210].forEach((rad) => {
      lx.beginPath(); lx.arc(256, 256, rad, 0, Math.PI * 2); lx.stroke();
    });
    // Center hole
    lx.fillStyle = "#0e0907";
    lx.beginPath(); lx.arc(256, 256, 18, 0, Math.PI * 2); lx.fill();
    // Center label text
    lx.fillStyle = "rgba(50, 32, 5, 0.75)";
    lx.font = "400 38px 'Cormorant Garamond', serif";
    lx.textAlign = "center"; lx.textBaseline = "middle";
    lx.fillText("Yusuf Selman", 256, 130);
    lx.fillText("Bağış", 256, 172);
    lx.font = "200 15px 'Outfit', sans-serif";
    lx.fillStyle = "rgba(50, 32, 5, 0.40)";
    lx.fillText("CURRICULUM VITAE", 256, 330);

    const labelTex = new THREE.CanvasTexture(lc);
    const labelGeo = new THREE.CircleGeometry(0.54, 128);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.z = 0.032;
    group.add(labelMesh);

    // CV data — all sections from PDF. Only `name` is shown on the record;
    // subtitle/description go to the side detail panel.
    const cvItems = CV_ITEMS;
    const N = cvItems.length;
    const spriteTex = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    cvLabelTexRef.current = [];
    cvItems.forEach(({ name }, i) => {
      const angle = (i * Math.PI * 2) / N;
      // Canvas pixel size is independent of the plane world size.
      // Wide canvas → long names never clip. Tall canvas → sharp text on Retina.
      const cw = 2048, ch = 256;
      const sc = document.createElement("canvas");
      sc.width = cw; sc.height = ch;
      const sx = sc.getContext("2d");
      sx.clearRect(0, 0, cw, ch);
      sx.fillStyle = "rgba(6, 3, 0, 0.92)";
      sx.font = "600 148px 'Cormorant Garamond', serif";
      sx.textAlign = "center"; sx.textBaseline = "middle";
      sx.fillText(name, cw / 2, ch / 2 + 6);

      const tex = new THREE.CanvasTexture(sc);
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
      spriteTex.push(tex);
      cvLabelTexRef.current.push({ canvas: sc, tex });

      const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
      // planeW / planeH are world-space display sizes — decoupled from canvas pixels
      const planeW = 1.72, planeH = 0.215;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      const centerR = 1.50;
      mesh.position.set(Math.cos(angle) * centerR, Math.sin(angle) * centerR, 0.15);
      mesh.rotation.z = angle;
      mesh.renderOrder = 10;
      group.add(mesh);
    });

    scene.add(group);

    // Environment map for metallic reflections
    import("three/examples/jsm/environments/RoomEnvironment.js").then(({ RoomEnvironment }) => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const env = pmrem.fromScene(new RoomEnvironment()).texture;
      scene.environment = env;
      bodyMat.envMapIntensity = 2.5;
      pmrem.dispose();
    });

    // Animation loop
    const animate = () => {
      cvAnimRef.current = requestAnimationFrame(animate);
      const state = cvStateRef.current;
      if (state === "hidden") return;

      grooveUniforms.u_time.value += 0.008;

      if (state === "scrolling" || state === "record") {
        // Snap-to-index z-rotation: target = -selectedIndex * (2π / N)
        const targetZ = -cvSelectedRef.current * (Math.PI * 2) / CV_ITEMS.length;
        group.rotation.z += (targetZ - group.rotation.z) * 0.12;
        // Slight tilt persists
        group.rotation.y *= 0.95;
        group.rotation.x *= 0.95;
      } else {
        // Subtle mouse parallax tilt — kept small so sprites stay readable
        const mx = mouseRef.current.x - 0.5;
        const my = mouseRef.current.y - 0.5;
        group.rotation.y += (mx * 0.08 - group.rotation.y) * 0.05;
        group.rotation.x += (my * -0.05 - group.rotation.x) * 0.05;
      }

      // Slight camera zoom when in record/scrolling state
      const targetZ_cam = (state === "record" || state === "scrolling") ? 6.0 : 6.5;
      camera.position.z += (targetZ_cam - camera.position.z) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(cvAnimRef.current);
      renderer.dispose();
      bodyGeo.dispose(); bodyMat.dispose();
      grooveGeo.dispose(); grooveMat.dispose();
      labelGeo.dispose(); labelMat.dispose(); labelTex.dispose();
      spriteTex.forEach(t => t.dispose());
    };
  }, []);

  const navigateToProduct = useCallback(
    (product) => {
      if (transitionState) return;
      setTransitionState(`zoom-in-${product.id}`);
      setActiveProduct(product);
      window.history.pushState({ product: product.id }, "", `/${product.id}`);

      setTimeout(() => {
        setShowDetail(true);
      }, 700); // Mid-zoom show detail
    },
    [transitionState]
  );

  const navigateHome = useCallback(() => {
    if (!showDetail || detailClosing) return;
    setDetailClosing(true);
    setTransitionState(`zoom-out-${activeProduct.id}`);

    setTimeout(() => {
      setShowDetail(false);
      setDetailClosing(false);
      setActiveProduct(null);
      setTransitionState("");
      window.history.pushState({}, "", "/");
    }, 1100); // Let CSS complete backwards
  }, [showDetail, detailClosing, activeProduct]);

  const closeCv = useCallback(() => {
    const s = cvStateRef.current;
    if (s === "hidden" || s === "preview" || s === "leaving") return;
    // Reverse: scrolling→record→sleeve→leaving→hidden
    if (s === "scrolling") {
      scrollRef.current = 0;
      setCvSelected(0);
      setCvState("record");
      setTimeout(() => {
        setCvState("sleeve");
        setTimeout(() => {
          setCvState("leaving");
          setTimeout(() => setCvState("hidden"), 900);
        }, 800);
      }, 600);
    } else if (s === "record") {
      setCvState("sleeve");
      setTimeout(() => {
        setCvState("leaving");
        setTimeout(() => setCvState("hidden"), 900);
      }, 800);
    } else if (s === "sleeve") {
      setCvState("leaving");
      setTimeout(() => setCvState("hidden"), 900);
    }
  }, []);

  const scrollRef = useRef(0);
  const cvGroupRef = useRef(null);

  // ESC to close CV
  useEffect(() => {
    if (cvState === "hidden" || cvState === "preview") return;
    const onKey = (e) => { if (e.key === "Escape") closeCv(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cvState, closeCv]);

  // Scroll wheel → spin record (enters scrolling state on first scroll in record state)
  useEffect(() => {
    const onWheel = (e) => {
      const s = cvStateRef.current;
      if (s !== "record" && s !== "scrolling") return;
      e.preventDefault();
      const now = performance.now();
      if (now - cvWheelCooldownRef.current < 380) return;
      if (Math.abs(e.deltaY) < 4) return;
      cvWheelCooldownRef.current = now;
      const dir = Math.sign(e.deltaY);
      const N = CV_ITEMS.length;
      const next = ((cvSelectedRef.current + dir) % N + N) % N;
      setCvSelected(next);
      if (s === "record") setCvState("scrolling");
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (activeProduct) navigateHome();
      const s = cvStateRef.current;
      if (s === "record" || s === "scrolling" || s === "sleeve") closeCv();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [activeProduct, navigateHome, closeCv]);

  // Clean up /cv URL when CV closes
  useEffect(() => {
    if (cvState === "hidden" && window.location.pathname === "/cv") {
      window.history.replaceState({}, "", "/");
    }
  }, [cvState]);

  // Redraw record label canvases when language changes
  useEffect(() => {
    const items = CV_ITEMS_ALL[lang] || CV_ITEMS_ALL.en;
    cvLabelTexRef.current.forEach(({ canvas, tex }, i) => {
      if (!items[i]) return;
      const cw = canvas.width, ch = canvas.height;
      const sx = canvas.getContext("2d");
      sx.clearRect(0, 0, cw, ch);
      sx.fillStyle = "rgba(6, 3, 0, 0.92)";
      sx.font = "600 148px 'Cormorant Garamond', serif";
      sx.textAlign = "center";
      sx.textBaseline = "middle";
      sx.fillText(items[i].name, cw / 2, ch / 2 + 6);
      tex.needsUpdate = true;
    });
  }, [lang]);

  cvStateRef.current = cvState;

  // Responsive sizing helpers
  const getCvSize = () => Math.min(window.innerWidth * 0.62, window.innerHeight * 0.85);

  // Combo wrapper: contains sleeve + record as children, handles unified scale/position
  const getCvComboStyle = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rs = getCvSize();           // record size
    const ss = rs * 0.92;             // sleeve size
    const rl = ss - rs / 2;           // record left within combo (half inside sleeve)
    const cw = ss + rs / 2;           // combo width
    const ch = rs;                    // combo height (record is tallest)
    const rcx = rl + rs / 2;          // record center X within combo = ss

    const base = { width: cw, height: ch };
    const fastT = "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s";
    const slowT = "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s";
    const leaveT = "transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease 0.2s";

    if (cvState === "hidden")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh + ch * 0.2}px) scale(0.3)`, opacity: 0, transition: fastT };
    if (cvState === "preview") {
      // Peek from bottom — scale 0.38, ~40% visible above viewport bottom
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh - ch * 0.46}px) scale(0.38)`, opacity: 1, transition: fastT };
    }
    if (cvState === "sleeve")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh / 2 - ch / 2}px)`, opacity: 1, transition: slowT };
    if (cvState === "record" || cvState === "scrolling") {
      // Çarkıfelek: record positioned LEFT, detail panel on RIGHT
      const recordCenterX = vw * 0.30;
      return { ...base, transform: `translate(${recordCenterX - rcx}px, ${vh / 2 - ch / 2}px)`, opacity: 1, transition: slowT };
    }
    if (cvState === "leaving")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh + ch * 0.2}px) scale(0.3)`, opacity: 0, transition: leaveT };
    return base;
  };

  // Inner sleeve positioning within combo
  const getCvSleeveInComboStyle = () => {
    const rs = getCvSize();
    const ss = rs * 0.92;
    const sleeveTop = (rs - ss) / 2;
    const base = { left: 0, top: sleeveTop, width: ss, height: ss };

    if (cvState === "record" || cvState === "scrolling") {
      return { ...base, transform: `translateX(${-ss * 1.2}px)`, opacity: 0 };
    }
    return { ...base, opacity: 1 };
  };

  // Inner record positioning within combo
  const getCvRecordInComboStyle = () => {
    const rs = getCvSize();
    const ss = rs * 0.92;
    const rl = ss - rs / 2;
    return { left: rl, top: 0, width: rs, height: rs };
  };

  const isHome = !activeProduct;

  return (
    <div className="msc-root">
      <style>{CSS}</style>

      {/* Spatial Zoom Wrapper */}
      <div className={`msc-spatial-zoom ${transitionState}`}>
        {/* Dynamic Native WebGL Fluid Background */}
        <canvas ref={bgCanvasRef} className="msc-bg-canvas" />

        {/* Atmospheric Overhead Layers */}
        <div className="msc-rays" />
        <div className="msc-glow" />

        {/* Mouse-following light */}
        <div
          ref={mouseLightRef}
          className="msc-mouse-light"
        />

        {/* Vignette */}
        <div className="msc-vignette" />

        {/* Brand */}
        <div
          className="msc-brand"
          style={{ cursor: "pointer" }}
          onClick={() => activeProduct ? navigateHome() : navigateToProduct({ id: "brand-info", name: "MUSEICOLOGIE", subtitle: "blank blank blank" })}
        >
          Museicologie
          <span className="msc-brand-sub">{t.brandSub}</span>
        </div>

        {/* Corner accents */}
        <svg className="msc-corner msc-corner-tl" width="40" height="40">
          <line x1="0" y1="0" x2="40" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.2" />
          <line x1="0" y1="0" x2="0" y2="40" stroke={FG} strokeWidth="0.5" opacity="0.2" />
        </svg>
        <svg className="msc-corner msc-corner-br" width="40" height="40">
          <line x1="40" y1="40" x2="0" y2="40" stroke={FG} strokeWidth="0.5" opacity="0.2" />
          <line x1="40" y1="40" x2="40" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.2" />
        </svg>

        {/* Three.js canvas — full screen so particles aren't clipped */}
        <div className={`msc-canvas-wrap ${activeProduct ? "hidden" : ""}`}>
          <canvas ref={canvasRef} />
        </div>
        {/* Invisible logo hit area for click-to-open */}
        {!activeProduct && (
          <div
            className="msc-logo-hit"
            onClick={() => navigateToProduct({ id: "brand-info", name: "MUSEICOLOGIE", subtitle: "blank blank blank" })}
          />
        )}

        {/* Constellation lines SVG */}
        <svg
          className={`msc-svg-overlay ${activeProduct ? "hidden" : ""}`}
          width="100%"
          height="100%"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center dot */}
          <circle cx="50%" cy="50%" r="2" className="msc-center-dot" />

          {PRODUCTS.map((p, i) => {
            const delay = 1 + i * 0.2;
            const isHovered = hoveredNode === p.id;
            // particle animation duration varies per arm for organic feel
            const dur = `${3.5 + i * 0.7}s`;
            return (
              <g key={p.id}>
                {/* Hover beam — warm gold blur behind line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className={`msc-line-hover ${isHovered ? 'active' : ''}`}
                />
                {/* Glow line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className="msc-line-glow"
                  style={{ animationDelay: `${delay}s` }}
                />
                {/* Main line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className="msc-line"
                  style={{ animationDelay: `${delay}s` }}
                />
                {/* Flowing gold particle along the arm */}
                <circle r={isHovered ? '2.2' : '1.4'} fill="rgba(255,215,100,0.85)" style={{ filter: 'blur(0.5px)' }}>
                  <animateMotion
                    dur={dur}
                    repeatCount="indefinite"
                    begin={`${delay + 0.5}s`}
                    path={`M ${50 * window.innerWidth / 100} ${50 * window.innerHeight / 100} L ${p.x * window.innerWidth / 100} ${p.y * window.innerHeight / 100}`}
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.4 0 0.6 1"
                  />
                </circle>
                {/* Pulse dot at midpoint */}
                <circle
                  cx={`${(50 + p.x) / 2}%`}
                  cy={`${(50 + p.y) / 2}%`}
                  r="1.5"
                  className="msc-pulse-dot"
                  style={{ animationDelay: `${delay + 1}s` }}
                />
              </g>
            );
          })}
        </svg>

        {/* Product nodes */}
        {PRODUCTS.map((p) => {
          const ringSize = 12 * (p.depth ?? 1.0);
          const ringOpacity = 0.3 + 0.35 * (p.depth ?? 1.0);
          return (
            <div
              key={p.id}
              className={`msc-node ${activeProduct && activeProduct.id !== p.id ? "hidden" : ""} ${activeProduct && activeProduct.id === p.id ? "hidden" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => navigateToProduct(p)}
              onMouseEnter={() => setHoveredNode(p.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="msc-node-ring" style={{
                width: `${ringSize}px`,
                height: `${ringSize}px`,
                borderColor: `rgba(255,255,255,${ringOpacity})`,
                boxShadow: hoveredNode === p.id ? `0 0 ${24 * (p.depth ?? 1)}px rgba(255,210,80,0.45), 0 0 ${48 * (p.depth ?? 1)}px rgba(255,210,80,0.15)` : 'none',
                transition: 'box-shadow 0.4s ease, transform 0.5s ease',
              }} />
              <div className="msc-node-label">{p.name}</div>
              <div className="msc-node-subtitle">{t.products[p.id]?.subtitle || p.subtitle}</div>
            </div>
          );
        })}

        {/* Bottom tagline — entire area is hover/click target */}
        <div
          className={`msc-tagline ${activeProduct ? "hidden" : ""}`}
          style={{ pointerEvents: "auto", cursor: "pointer" }}
          onMouseEnter={() => setCvState(s => s === "hidden" ? "preview" : s)}
          onMouseLeave={() => setCvState(s => s === "preview" ? "hidden" : s)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (cvStateRef.current !== "hidden" && cvStateRef.current !== "preview") return;
            setCvState("sleeve");
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>
            Yusuf Selman Bağış
          </span>
          {lang === 'tr' ? ' yapımıdır' : lang === 'de' ? ' arbeit' : ' production'}
        </div>
      </div>

      {/* Product detail overlay */}
      {showDetail && activeProduct && (
        <div className={`msc-detail ${detailClosing ? "closing" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) navigateHome(); }}>
          <div className="msc-detail-inner">
            <div className="msc-detail-image">
              <span className="msc-detail-image-text">{t.productVisual}</span>
              {/* Gold corner accents inside image */}
              <svg style={{ position: "absolute", top: 10, left: 10 }} width="20" height="20">
                <line x1="0" y1="0" x2="20" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="0" x2="0" y2="20" stroke={FG} strokeWidth="0.5" opacity="0.3" />
              </svg>
              <svg style={{ position: "absolute", bottom: 10, right: 10 }} width="20" height="20">
                <line x1="20" y1="20" x2="0" y2="20" stroke={FG} strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="20" x2="20" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
            <div className="msc-detail-content">
              <div className="msc-detail-number">{activeProduct.name}</div>
              <div className="msc-detail-title">{activeProduct.subtitle}</div>
              <div className="msc-detail-divider" />
              {activeProduct.id === 'cv' ? (
                <div className="msc-detail-desc" style={{fontSize: "13px", lineHeight: "1.6", maxWidth: "450px"}}>
                  <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#d4a520", marginBottom: "8px", fontWeight: 400}}>Hakkında</h3>
                  <p style={{marginBottom: "20px", color: "rgba(255,255,255,0.5)"}}>{activeProduct.description}</p>
                  
                  <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#d4a520", marginBottom: "8px", fontWeight: 400}}>Dijital Projeler</h3>
                  <div style={{marginBottom: "12px", color: "rgba(255,255,255,0.5)"}}>
                     <div style={{color: "rgba(255,255,255,0.85)", fontWeight: 400}}>Musicologie Platformu</div>
                     <div style={{fontSize: "11px", color: "rgba(212,165,32,0.8)", marginBottom: "4px"}}>2026</div>
                     Müziği edebiyat, tarih ve makam teorisi ile buluşturan modern dijital dershane ekosistemi.
                  </div>
                  <div style={{color: "rgba(255,255,255,0.5)", marginBottom: "30px"}}>
                     <div style={{color: "rgba(255,255,255,0.85)", fontWeight: 400}}>Organoloji Aile Ağacı</div>
                     <div style={{fontSize: "11px", color: "rgba(212,165,32,0.8)", marginBottom: "4px"}}>2026</div>
                     Hornbostel-Sachs sınıflandırma sistemine dayalı interaktif müzik enstrümanları haritası.
                  </div>
                </div>
              ) : (
                <div className="msc-detail-desc">{t.products[activeProduct.id]?.description || activeProduct.description}</div>
              )}
              <button className="msc-detail-back" onClick={navigateHome}>
                <div className="msc-detail-back-line" />
                {t.returnToMap}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CV Vinyl Record Page ═══ */}
      {/* Backdrop */}
      <div
        className={`msc-cv-backdrop ${(cvState === "sleeve" || cvState === "record" || cvState === "scrolling" || cvState === "leaving") ? "active" : ""}`}
      />

      {/* Combo wrapper — sleeve + record as unified element for scaling */}
      <div className="msc-cv-combo" style={getCvComboStyle()}>
        {/* Sleeve (inside combo) */}
        <div className="msc-cv-combo-sleeve" style={getCvSleeveInComboStyle()}>
          <div className="msc-cv-sleeve-inner">
            <div className="msc-cv-sleeve-title">Yusuf Selman Bağış</div>
            <div className="msc-cv-sleeve-sub">CV</div>
            {cvState === "sleeve" && (
              <button
                className="msc-cv-sleeve-btn"
                style={{ pointerEvents: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCvState("record");
                  window.history.pushState({ cv: true }, "", "/cv");
                }}
              >
                İncele
              </button>
            )}
          </div>
        </div>

        {/* 3D Vinyl record (inside combo) */}
        <div className="msc-cv-combo-record" style={getCvRecordInComboStyle()}>
          <canvas ref={cvCanvasRef} />
        </div>
      </div>

      {/* CV Detail panel — right side */}
      {(cvState === "record" || cvState === "scrolling") && (
        <div className="msc-cv-detail active">
          <div className="msc-cv-detail-eyebrow">
            {String(cvSelected + 1).padStart(2, "0")} / {String(CV_ITEMS.length).padStart(2, "0")}
          </div>
          <div key={cvSelected} className="msc-cv-detail-fade">
            <div className="msc-cv-detail-title">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].name}</div>
            <div className="msc-cv-detail-sub">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].subtitle}</div>
            <div className="msc-cv-detail-desc">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].description}</div>
          </div>
        </div>
      )}

      {/* Back button — top-left, visible when not hidden/preview */}
      {(cvState === "sleeve" || cvState === "record" || cvState === "scrolling") && (
        <button className="msc-cv-back" onClick={closeCv}>
          <div className="msc-cv-back-line" />
          {t.returnToMap}
        </button>
      )}

      {/* Scroll hint — shown in scrolling state */}
      {cvState === "scrolling" && (
        <div className="msc-cv-scroll-hint">↕ kaydır</div>
      )}

      {/* Language Switcher — always on top */}
      <button
        className="msc-lang-btn"
        onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o); }}
        title="Language / Dil / Sprache"
      >
        {/* Globe SVG icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{lang.toUpperCase()}</span>
      </button>

      {langOpen && (
        <div className="msc-lang-dropdown" onClick={(e) => e.stopPropagation()}>
          {[{code:"tr",label:"Türkçe"},{code:"en",label:"English"},{code:"de",label:"Deutsch"}].map(({code, label}) => (
            <button
              key={code}
              className={`msc-lang-option ${lang === code ? "active" : ""}`}
              onClick={() => { setLang(code); setLangOpen(false); }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement._reactRoot) {
  rootElement._reactRoot = ReactDOM.createRoot(rootElement);
}
rootElement._reactRoot.render(
  <React.StrictMode>
    <Museicologie />
  </React.StrictMode>
);

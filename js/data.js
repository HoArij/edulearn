/* Helpers : T = texte traduit, L = leçon */
const T = (fr, en, ar) => ({ fr, en, ar });
const L = (title, body, video = "") => ({ title, body, video });

/* ===== MATIÈRES ===== */
const CATEGORIES = {
  web:      { icon: "🌐", name: T("Développement Web", "Web Development", "تطوير الويب") },
  prog:     { icon: "💻", name: T("Programmation", "Programming", "البرمجة") },
  data:     { icon: "🗄️", name: T("Bases de données", "Databases", "قواعد البيانات") },
  network:  { icon: "📡", name: T("Réseaux", "Networking", "الشبكات") },
  ai:       { icon: "🤖", name: T("Intelligence Artificielle", "Artificial Intelligence", "الذكاء الاصطناعي") }
};

/* ===== COURS ===== */
const COURSES = [

  /* ---------- WEB ---------- */
  {
    id: "html", cat: "web", level: "beginner", hours: 4, icon: "🌐", c1: "#f97316", c2: "#ef4444",
    title: T("HTML5 - Les bases", "HTML5 Fundamentals", "أساسيات HTML5"),
    desc: T("Structure, balises sémantiques, médias et formulaires.", "Structure, semantic tags, media and forms.", "البنية والوسوم الدلالية والوسائط والنماذج."),
    lessons: [
      L(T("Introduction à HTML", "Introduction to HTML", "مقدمة في HTML"), `
        <p>HTML (<em>HyperText Markup Language</em>) est le langage de balisage qui structure le contenu des pages web.</p>
        <ul><li>Créé par Tim Berners-Lee en 1991</li><li>HTML5 est le standard actuel</li><li>Un document est un arbre d'éléments (balises)</li></ul>
        <pre><code>&lt;p&gt;Bonjour le monde&lt;/p&gt;</code></pre>
        <div class="callout">💡 Une balise ouvrante, du contenu, puis une balise fermante.</div>`),
      L(T("Structure d'une page", "Page structure", "بنية الصفحة"), `
        <p>Toute page HTML5 suit un squelette de base :</p>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="fr"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Ma page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Titre&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
        <p>Les balises sémantiques (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>) améliorent l'accessibilité et le référencement.</p>`),
      L(T("Images et vidéos", "Images and video", "الصور والفيديو"), `
        <p>Utilisez <code>&lt;img&gt;</code> avec un attribut <code>alt</code>, et <code>&lt;video&gt;</code> pour les vidéos.</p>
        <pre><code>&lt;img src="images/logo.png" alt="Logo"&gt;
&lt;video controls src="images/cours.mp4"&gt;&lt;/video&gt;</code></pre>
        <div class="callout">♿ L'attribut <code>alt</code> est indispensable pour l'accessibilité.</div>`),
      L(T("Formulaires", "Forms", "النماذج"), `
        <p>Les formulaires collectent les données de l'utilisateur.</p>
        <pre><code>&lt;form&gt;
  &lt;label for="nom"&gt;Nom&lt;/label&gt;
  &lt;input type="text" id="nom" required&gt;
  &lt;button type="submit"&gt;Envoyer&lt;/button&gt;
&lt;/form&gt;</code></pre>
        <p>Types utiles : <code>email</code>, <code>password</code>, <code>number</code>, <code>date</code>, <code>checkbox</code>, <code>radio</code>.</p>`)
    ]
  },
  {
    id: "css", cat: "web", level: "beginner", hours: 5, icon: "🎨", c1: "#0ea5e9", c2: "#6366f1",
    title: T("CSS3 - Mise en forme", "CSS3 Styling", "تنسيق CSS3"),
    desc: T("Sélecteurs, Flexbox, Grid et responsive design.", "Selectors, Flexbox, Grid and responsive design.", "المحددات وFlexbox وGrid والتصميم المتجاوب."),
    lessons: [
      L(T("Sélecteurs et propriétés", "Selectors and properties", "المحددات والخصائص"), `
        <p>CSS décrit l'apparence des éléments HTML.</p>
        <pre><code>h1 { color: #4f46e5; font-size: 2rem; }
.carte { padding: 1rem; border-radius: 12px; }
#menu a:hover { text-decoration: underline; }</code></pre>
        <ul><li><code>h1</code> : sélecteur de balise</li><li><code>.carte</code> : sélecteur de classe</li><li><code>#menu</code> : sélecteur d'identifiant</li></ul>`),
      L(T("Le modèle de boîte", "The box model", "نموذج الصندوق"), `
        <p>Chaque élément est une boîte : <strong>content → padding → border → margin</strong>.</p>
        <pre><code>* { box-sizing: border-box; }
.box { width: 300px; padding: 20px; border: 2px solid #ccc; margin: 16px auto; }</code></pre>
        <div class="callout">💡 <code>box-sizing: border-box</code> simplifie énormément les calculs de taille.</div>`),
        L(T("Flexbox", "Flexbox", "Flexbox"), `
        <p>Flexbox aligne les éléments sur un axe (ligne ou colonne).</p>
        <pre><code>.nav { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }</code></pre>
        <p>Propriétés clés : <code>flex-direction</code>, <code>justify-content</code>, <code>align-items</code>, <code>flex-wrap</code>.</p>`,
        "OXGznpKZ_sA@1520"),
      L(T("Grid et responsive", "Grid and responsive", "Grid والتجاوب"), `
        <p>Grid organise une mise en page en deux dimensions.</p>
        <pre><code>.grille { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }

@media (max-width: 768px) {
  .nav { flex-direction: column; }
}</code></pre>
        <div class="callout">📱 Pensez « mobile first » : commencez par le mobile, puis élargissez.</div>`)
    ]
  },
  {
    id: "js", cat: "web", level: "intermediate", hours: 6, icon: "⚡", c1: "#eab308", c2: "#f97316",
    title: T("JavaScript - Initiation", "JavaScript Essentials", "أساسيات JavaScript"),
    desc: T("Variables, fonctions, DOM et événements.", "Variables, functions, the DOM and events.", "المتغيرات والدوال وDOM والأحداث."),
    lessons: [
      L(T("Variables et types", "Variables and types", "المتغيرات والأنواع"), `
        <pre><code>const nom = "Amine";
let age = 21;
const actif = true;
console.log(nom, age, actif);</code></pre>
        <p>Préférez <code>const</code>, utilisez <code>let</code> si la valeur change, évitez <code>var</code>.</p>`),
      L(T("Fonctions", "Functions", "الدوال"), `
        <pre><code>function somme(a, b) { return a + b; }
const double = n =&gt; n * 2;
console.log(somme(2, 3), double(4));</code></pre>
        <p>Les <em>arrow functions</em> offrent une syntaxe courte et sont très utilisées.</p>`),
      L(T("Manipuler le DOM", "Working with the DOM", "التعامل مع DOM"), `
        <pre><code>const titre = document.querySelector("h1");
titre.textContent = "Nouveau titre";
titre.classList.add("actif");</code></pre>
        <p>Le DOM représente la page comme un arbre d'objets modifiables.</p>`),
      L(T("Événements", "Events", "الأحداث"), `
        <pre><code>const bouton = document.querySelector("#btn");
bouton.addEventListener("click", () =&gt; {
  alert("Cliqué !");
});</code></pre>
        <div class="callout">🎯 Événements courants : <code>click</code>, <code>input</code>, <code>submit</code>, <code>keydown</code>.</div>`)
    ]
  },

  /* ---------- PROGRAMMATION ---------- */
  {
    id: "python", cat: "prog", level: "beginner", hours: 8, icon: "🐍", c1: "#22c55e", c2: "#0ea5e9",
    title: T("Python pour débutants", "Python for Beginners", "بايثون للمبتدئين"),
    desc: T("Syntaxe, structures de contrôle, listes et fonctions.", "Syntax, control flow, lists and functions.", "الصيغة وهياكل التحكم والقوائم والدوال."),
    lessons: [
      L(T("Premiers pas", "First steps", "الخطوات الأولى"), `
        <pre><code>nom = "Sara"
print("Bonjour", nom)</code></pre>
        <p>Python utilise l'<strong>indentation</strong> pour délimiter les blocs de code.</p>`),
      L(T("Conditions et boucles", "Conditions and loops", "الشروط والحلقات"), `
        <pre><code>for i in range(5):
    if i % 2 == 0:
        print(i, "est pair")
    else:
        print(i, "est impair")</code></pre>`),
      L(T("Listes et dictionnaires", "Lists and dictionaries", "القوائم والقواميس"), `
        <pre><code>fruits = ["pomme", "banane"]
fruits.append("kiwi")
etudiant = {"nom": "Ali", "note": 15}
print(len(fruits), etudiant["nom"])</code></pre>`),
      L(T("Fonctions", "Functions", "الدوال"), `
        <pre><code>def moyenne(notes):
    return sum(notes) / len(notes)

print(moyenne([12, 15, 18]))</code></pre>
        <div class="callout">💡 Une fonction = un nom, des paramètres et une valeur de retour.</div>`)
    ]
  },
  {
    id: "algo", cat: "prog", level: "intermediate", hours: 6, icon: "🧩", c1: "#8b5cf6", c2: "#ec4899",
    title: T("Algorithmique", "Algorithms", "الخوارزميات"),
    desc: T("Complexité, tris et recherches fondamentales.", "Complexity, sorting and fundamental searches.", "التعقيد والفرز وعمليات البحث الأساسية."),
    lessons: [
      L(T("Notion de complexité", "Complexity", "مفهوم التعقيد"), `
        <p>La complexité mesure le coût d'un algorithme selon la taille <code>n</code> des données.</p>
        <ul><li><strong>O(1)</strong> : constant</li><li><strong>O(log n)</strong> : logarithmique</li><li><strong>O(n)</strong> : linéaire</li><li><strong>O(n²)</strong> : quadratique</li></ul>`),
      L(T("Recherche dichotomique", "Binary search", "البحث الثنائي"), `
        <p>Sur un tableau <strong>trié</strong>, on divise l'intervalle par 2 à chaque étape : O(log n).</p>
        <pre><code>def dicho(t, x):
    g, d = 0, len(t) - 1
    while g &lt;= d:
        m = (g + d) // 2
        if t[m] == x: return m
        if t[m] &lt; x: g = m + 1
        else: d = m - 1
    return -1</code></pre>`),
      L(T("Algorithmes de tri", "Sorting algorithms", "خوارزميات الفرز"), `
        <ul><li><strong>Tri à bulles</strong> : simple, O(n²)</li><li><strong>Tri fusion</strong> : O(n log n)</li><li><strong>Tri rapide</strong> : O(n log n) en moyenne</li></ul>
        <div class="callout">⚡ En pratique, utilisez le tri natif du langage (<code>sorted()</code> en Python).</div>`)
    ]
  },

  /* ---------- DONNÉES ---------- */
  {
    id: "sql", cat: "data", level: "beginner", hours: 5, icon: "🗄️", c1: "#06b6d4", c2: "#3b82f6",
    title: T("SQL et bases de données", "SQL and Databases", "SQL وقواعد البيانات"),
    desc: T("Modèle relationnel, requêtes SELECT et jointures.", "Relational model, SELECT queries and joins.", "النموذج العلائقي واستعلامات SELECT والربط."),
    lessons: [
      L(T("Le modèle relationnel", "The relational model", "النموذج العلائقي"), `
        <p>Les données sont organisées en <strong>tables</strong> (lignes = enregistrements, colonnes = attributs), reliées par des <strong>clés</strong>.</p>
        <ul><li>Clé primaire : identifie une ligne</li><li>Clé étrangère : référence une autre table</li></ul>`),
      L(T("Requêtes SELECT", "SELECT queries", "استعلامات SELECT"), `
        <pre><code>SELECT nom, note
FROM etudiants
WHERE note &gt;= 10
ORDER BY note DESC
LIMIT 5;</code></pre>`),
      L(T("Jointures", "Joins", "عمليات الربط"), `
        <pre><code>SELECT e.nom, c.titre
FROM etudiants e
INNER JOIN inscriptions i ON i.id_etudiant = e.id
INNER JOIN cours c ON c.id = i.id_cours;</code></pre>
        <div class="callout">💡 <code>INNER JOIN</code> ne garde que les lignes ayant une correspondance des deux côtés.</div>`)
    ]
  },

  /* ---------- RÉSEAUX ---------- */
  {
    id: "network", cat: "network", level: "beginner", hours: 5, icon: "📡", c1: "#14b8a6", c2: "#6366f1",
    title: T("Fondamentaux des réseaux", "Networking Fundamentals", "أساسيات الشبكات"),
    desc: T("Modèle OSI, adressage IP et protocoles courants.", "OSI model, IP addressing and common protocols.", "نموذج OSI وعنونة IP والبروتوكولات الشائعة."),
    lessons: [
      L(T("Le modèle OSI", "The OSI model", "نموذج OSI"), `
        <p>Le modèle OSI découpe la communication en <strong>7 couches</strong> :</p>
        <ol><li>Physique</li><li>Liaison</li><li>Réseau</li><li>Transport</li><li>Session</li><li>Présentation</li><li>Application</li></ol>`),
      L(T("Adressage IP", "IP addressing", "عنونة IP"), `
        <p>Une adresse IPv4 compte 32 bits, par exemple <code>192.168.1.10</code>. Le masque (<code>/24</code>) sépare la partie réseau de la partie hôte.</p>
        <div class="callout">🏠 Plages privées : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.</div>`),
      L(T("Protocoles courants", "Common protocols", "البروتوكولات الشائعة"), `
        <ul><li><strong>HTTP/HTTPS</strong> : web</li><li><strong>DNS</strong> : noms de domaine → IP</li><li><strong>TCP</strong> : transport fiable</li><li><strong>UDP</strong> : transport rapide sans garantie</li></ul>`)
    ]
  },

  /* ---------- IA ---------- */
  {
    id: "ml", cat: "ai", level: "advanced", hours: 7, icon: "🤖", c1: "#ec4899", c2: "#8b5cf6",
    title: T("Introduction au Machine Learning", "Intro to Machine Learning", "مقدمة في تعلّم الآلة"),
    desc: T("Apprentissage supervisé, non supervisé et évaluation.", "Supervised, unsupervised learning and evaluation.", "التعلم الخاضع للإشراف وغير الخاضع والتقييم."),
    lessons: [
      L(T("Qu'est-ce que le ML ?", "What is ML?", "ما هو تعلّم الآلة؟"), `
        <p>Le <em>machine learning</em> permet à un programme d'apprendre à partir de données plutôt que de règles écrites à la main.</p>
        <ul><li><strong>Supervisé</strong> : données étiquetées (classification, régression)</li><li><strong>Non supervisé</strong> : sans étiquettes (clustering)</li></ul>`),
      L(T("Premier modèle avec scikit-learn", "First model with scikit-learn", "أول نموذج مع scikit-learn"), `
        <pre><code>from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2)
modele = KNeighborsClassifier().fit(Xtr, ytr)
print(modele.score(Xte, yte))</code></pre>`),
      L(T("Évaluer un modèle", "Evaluating a model", "تقييم النموذج"), `
        <ul><li><strong>Accuracy</strong> : proportion de bonnes prédictions</li><li><strong>Précision / Rappel</strong> : qualité par classe</li><li><strong>Overfitting</strong> : le modèle « apprend par cœur » les données d'entraînement</li></ul>
        <div class="callout">⚠️ Évaluez toujours sur des données que le modèle n'a jamais vues.</div>`)
    ]
  }
];


/* ===== Vidéos (une par cours, affichée dans chaque leçon) ===== */

const COURSE_VIDEOS = {
  html:    "it1rTvBcfRg",   // HTML Full Course 
  css:     "VSwaoQ3TFkQ",   // CSS Tutorial - Zero to Hero 
  js:      "zofMnllkVfI",   // Learn JavaScript - Full Course 
  python:  "xkZMUX_oQX4",   // Learn Python - Full Course 
  algo:    "UglQN5S9-lc&list=PLBlnK6fEyqRiD0mBVMOOye846W5tipxiC",   // Algorithms and Data Structures 
  sql:     "zpnHsWOy0RY",   // SQL Tutorial - Full Database Course 
  network: "3QhU9jd03a0",   // Computer Networking Course 
  ml:      "i_LwzRVP7bg"    // Machine Learning for Everybody 
};
COURSES.forEach(c => { c.video = c.video || COURSE_VIDEOS[c.id]; });

/* ===== QUIZ (un par cours) ===== */
const Q = (q, options, answer, exp) => ({ q, options, answer, exp });

const QUIZZES = {
  html: [
    Q(T("Quelle balise affiche une image ?", "Which tag displays an image?", "ما الوسم الذي يعرض صورة؟"),
      ["<img>", "<image>", "<picture-src>", "<src>"], 0,
      T("On utilise <img> avec les attributs src et alt.", "Use <img> with the src and alt attributes.", "نستعمل الوسم <img> مع الخاصيتين src وalt.")),
    Q(T("À quoi sert l'attribut alt d'une image ?", "What is the alt attribute for?", "ما فائدة الخاصية alt في الصورة؟"),
      [T("À l'accessibilité (texte alternatif)", "Accessibility (alternative text)", "إمكانية الوصول (نص بديل)"),
       T("À changer la taille de l'image", "To resize the image", "لتغيير حجم الصورة"),
       T("À ajouter un lien", "To add a link", "لإضافة رابط"),
       T("À définir la couleur", "To set the colour", "لتحديد اللون")], 0,
      T("Il décrit l'image aux lecteurs d'écran et s'affiche si l'image ne charge pas.", "It describes the image to screen readers and shows if the image fails to load.", "يصف الصورة لقارئات الشاشة ويظهر إذا تعذر تحميلها.")),
    Q(T("Laquelle de ces balises est sémantique ?", "Which of these tags is semantic?", "أي من هذه الوسوم دلالي؟"),
      ["<div>", "<span>", "<nav>", "<b>"], 2,
      T("<nav> indique clairement une zone de navigation.", "<nav> clearly marks a navigation area.", "الوسم <nav> يحدد بوضوح منطقة التنقل."))
  ],
  css: [
    Q(T("Quelle déclaration active Flexbox ?", "Which declaration enables Flexbox?", "أي تصريح يفعّل Flexbox؟"),
      ["display: flex", "position: flex", "float: flex", "flex: container"], 0),
    Q(T("Quel est l'ordre du modèle de boîte, de l'intérieur vers l'extérieur ?", "What is the box model order, from inside to outside?", "ما ترتيب نموذج الصندوق من الداخل إلى الخارج؟"),
      ["content → padding → border → margin", "margin → border → padding → content", "padding → content → margin → border", "border → content → margin → padding"], 0),
    Q(T("Quel sélecteur cible la classe « carte » ?", "Which selector targets the class “carte”?", "أي محدد يستهدف الصنف « carte »؟"),
      ["#carte", ".carte", "carte", "*carte"], 1,
      T("Le point (.) désigne une classe, le dièse (#) un identifiant.", "A dot (.) targets a class, a hash (#) targets an id.", "النقطة (.) للصنف والعلامة (#) للمعرّف."))
  ],
  js: [
    Q(T("Quel mot-clé déclare une constante ?", "Which keyword declares a constant?", "أي كلمة مفتاحية تعرّف ثابتاً؟"),
      ["const", "let", "var", "fixed"], 0),
    Q(T("Quelle méthode attache un gestionnaire d'événement ?", "Which method attaches an event handler?", "أي دالة تربط معالج حدث؟"),
      ["addEventListener", "attachClick", "listen", "onEvent"], 0),
    Q(T("Quel est le résultat de typeof 21 ?", "What does typeof 21 return?", "ما نتيجة typeof 21 ؟"),
      ['"number"', '"int"', '"string"', '"numeric"'], 0)
  ],
  python: [
    Q(T("Comment Python délimite-t-il les blocs de code ?", "How does Python delimit code blocks?", "كيف تحدد بايثون كتل الشيفرة؟"),
      [T("Par l'indentation", "With indentation", "بالإزاحة (Indentation)"),
       T("Par des accolades { }", "With curly braces { }", "بالأقواس { }"),
       T("Par des points-virgules", "With semicolons", "بالفاصلة المنقوطة"),
       T("Par des parenthèses", "With parentheses", "بالأقواس ( )")], 0),
    Q(T("Que renvoie len([\"a\", \"b\", \"c\"]) ?", "What does len([\"a\", \"b\", \"c\"]) return?", "ماذا تُرجع len([\"a\", \"b\", \"c\"]) ؟"),
      ["3", "2", "4", "Error"], 0),
    Q(T("Quel mot-clé définit une fonction ?", "Which keyword defines a function?", "أي كلمة مفتاحية تعرّف دالة؟"),
      ["def", "function", "fun", "func"], 0)
  ],
  algo: [
    Q(T("Quelle est la complexité de la recherche dichotomique ?", "What is the complexity of binary search?", "ما تعقيد البحث الثنائي؟"),
      ["O(log n)", "O(n)", "O(n²)", "O(1)"], 0),
    Q(T("Quelle condition est nécessaire pour la recherche dichotomique ?", "What does binary search require?", "ما الشرط اللازم للبحث الثنائي؟"),
      [T("Le tableau doit être trié", "The array must be sorted", "يجب أن يكون الجدول مرتباً"),
       T("Le tableau doit contenir des nombres pairs", "The array must contain even numbers", "يجب أن يحتوي على أعداد زوجية"),
       T("Le tableau doit être vide", "The array must be empty", "يجب أن يكون فارغاً"),
       T("Aucune condition", "No requirement", "لا يوجد شرط")], 0),
    Q(T("Quel tri est en O(n log n) ?", "Which sort runs in O(n log n)?", "أي فرز تعقيده O(n log n)؟"),
      [T("Tri fusion", "Merge sort", "الفرز بالدمج"),
       T("Tri à bulles", "Bubble sort", "فرز الفقاعات"),
       T("Tri par sélection", "Selection sort", "الفرز بالاختيار"),
       T("Tri par insertion", "Insertion sort", "الفرز بالإدراج")], 0)
  ],
  sql: [
    Q(T("Quelle clause filtre les lignes ?", "Which clause filters rows?", "أي عبارة تصفّي الصفوف؟"),
      ["WHERE", "FILTER", "FROM", "ORDER BY"], 0),
    Q(T("À quoi sert une clé primaire ?", "What is a primary key for?", "ما فائدة المفتاح الأساسي؟"),
      [T("À identifier une ligne de façon unique", "To uniquely identify a row", "لتعريف الصف بشكل فريد"),
       T("À trier les résultats", "To sort results", "لفرز النتائج"),
       T("À supprimer une table", "To delete a table", "لحذف جدول"),
       T("À crypter les données", "To encrypt data", "لتشفير البيانات")], 0),
    Q(T("Que garde un INNER JOIN ?", "What does an INNER JOIN keep?", "ماذا يُبقي INNER JOIN؟"),
      [T("Les lignes qui correspondent des deux côtés", "Rows that match on both sides", "الصفوف المتطابقة في الجدولين"),
       T("Toutes les lignes de gauche", "All rows from the left table", "كل صفوف الجدول الأيسر"),
       T("Toutes les lignes de droite", "All rows from the right table", "كل صفوف الجدول الأيمن"),
       T("Aucune ligne", "No rows", "لا شيء")], 0)
  ],
  network: [
    Q(T("Combien de couches compte le modèle OSI ?", "How many layers does the OSI model have?", "كم عدد طبقات نموذج OSI؟"),
      ["7", "5", "4", "6"], 0),
    Q(T("Quel est le rôle du DNS ?", "What is the role of DNS?", "ما دور DNS؟"),
      [T("Traduire les noms de domaine en adresses IP", "Translate domain names into IP addresses", "تحويل أسماء النطاقات إلى عناوين IP"),
       T("Chiffrer les échanges", "Encrypt traffic", "تشفير التبادلات"),
       T("Attribuer des adresses MAC", "Assign MAC addresses", "منح عناوين MAC"),
       T("Envoyer des e-mails", "Send e-mails", "إرسال البريد")], 0),
    Q(T("Quel protocole offre un transport fiable ?", "Which protocol provides reliable transport?", "أي بروتوكول يوفر نقلاً موثوقاً؟"),
      ["TCP", "UDP", "DNS", "ARP"], 0)
  ],
  ml: [
    Q(T("Que nécessite l'apprentissage supervisé ?", "What does supervised learning need?", "ماذا يحتاج التعلم الخاضع للإشراف؟"),
      [T("Des données étiquetées", "Labelled data", "بيانات موسومة"),
       T("Aucune donnée", "No data", "لا بيانات"),
       T("Uniquement des images", "Only images", "صوراً فقط"),
       T("Un GPU obligatoirement", "A GPU, always", "معالج رسومي حتماً")], 0),
    Q(T("Qu'est-ce que le surapprentissage (overfitting) ?", "What is overfitting?", "ما هو فرط التعلّم (overfitting)؟"),
      [T("Le modèle apprend par cœur les données d'entraînement", "The model memorises the training data", "النموذج يحفظ بيانات التدريب"),
       T("Le modèle est trop rapide", "The model is too fast", "النموذج سريع جداً"),
       T("Le modèle n'a pas assez de données", "The model has too little data", "بيانات غير كافية"),
       T("Le modèle ne démarre pas", "The model won't start", "النموذج لا يعمل")], 0,
      T("Il obtient un bon score à l'entraînement mais généralise mal.", "It scores well on training data but generalises poorly.", "أداؤه جيد في التدريب لكنه ضعيف على بيانات جديدة.")),
    Q(T("Laquelle de ces tâches est une classification ?", "Which of these tasks is classification?", "أي من هذه المهام تصنيف؟"),
      [T("Prédire si un e-mail est un spam", "Predict whether an e-mail is spam", "توقع ما إذا كان البريد مزعجاً"),
       T("Prédire le prix d'une maison", "Predict a house price", "توقع سعر منزل"),
       T("Regrouper des clients similaires", "Group similar customers", "تجميع زبائن متشابهين"),
       T("Compresser une image", "Compress an image", "ضغط صورة")], 0)
  ]
};
COURSES.forEach(c => { c.quiz = QUIZZES[c.id] || []; });
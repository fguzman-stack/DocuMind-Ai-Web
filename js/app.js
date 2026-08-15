(function(){
  "use strict";

  var I18N = {
    es: {
      "nav.features":"Funciones","nav.how":"Cómo funciona","nav.engines":"Motores","nav.privacy":"Privacidad","nav.start":"Por defecto",
      "shots.eyebrow":"CAPTURAS","shots.title":"Así se ve DocuMind AI","shots.subtitle":"El flujo completo dentro de la app, capturado en pantalla.",
      "settings.button":"Preferencias","lang.label":"Idioma","theme.label":"Tema",
      "theme.light":"Claro","theme.dark":"Oscuro","theme.system":"Sistema","accent.label":"Color de acento",
      "hero.eyebrow":"// 100% LOCAL POR DEFECTO",
      "hero.title":"Conversa con tus documentos. Nada sale de tu equipo.",
      "hero.subtitle":"DocuMind AI es una app de escritorio que responde preguntas sobre tus PDF, Word, Excel y archivos de texto usando un modelo de lenguaje local. El parseo, la búsqueda y la generación corren en tu máquina; solo si tú lo activas, un modelo en la nube redacta la respuesta final.",
      "hero.cta1":"Ver cómo funciona","hero.cta2":"Opcional",
      "hero.annotation1":"PDF · DOCX · XLSX · TXT","hero.annotation2":"5 idiomas de interfaz","hero.annotation3":"0 documentos enviados, siempre",
      "diagram.doc":"Documento","diagram.chunks":"Fragmentos","diagram.vectors":"Vectores","diagram.engine":"Motor local","diagram.answer":"Respuesta",
      "features.eyebrow":"FUNCIONES","features.title":"Todo lo que necesitas, nada que temer",
      "features.subtitle":"Una base de conocimiento personal que responde con fuentes, sin depender de la nube.",
      "features.1.title":"100% local por defecto","features.1.desc":"El parseo, los embeddings, la búsqueda y la generación corren en tu máquina desde la primera pregunta.",
      "features.2.title":"Motor en la nube, opcional","features.2.desc":"Activa Gemini, DeepSeek u OpenAI solo para redactar la respuesta final. La búsqueda sigue siendo local.",
      "features.3.title":"Fuentes verificables","features.3.desc":"Cada respuesta muestra los fragmentos exactos usados, con su puntaje de similitud, como en un artículo académico.",
      "features.4.title":"Workspaces aislados","features.4.desc":"Organiza documentos y chats en proyectos independientes; los datos nunca se mezclan entre ellos.",
      "features.5.title":"Progreso en tiempo real","features.5.desc":"Una barra de avance muestra cada paso mientras se analizan, fragmentan e indexan tus archivos.",
      "features.6.title":"Interfaz en 5 idiomas","features.6.desc":"Inglés, español, portugués, francés y alemán, con detección automática del idioma del sistema.",
      "how.eyebrow":"PROCESO","how.title":"De un archivo a una respuesta con fuentes","how.subtitle":"Cinco pasos, todos dentro de tu equipo, con progreso visible en cada uno.",
      "how.1.title":"Analizar","how.1.desc":"Extrae el texto de PDF, DOCX, XLSX o TXT. Los PDF usan un motor de respaldo si el primero falla.",
      "how.2.title":"Fragmentar","how.2.desc":"Divide el texto en piezas de 1000 caracteres con 50 de solape, para no cortar ideas a la mitad.",
      "how.3.title":"Vectorizar","how.3.desc":"Convierte cada fragmento en un vector de 768 dimensiones con nomic-embed-text, en grupos concurrentes.",
      "how.4.title":"Indexar","how.4.desc":"Guarda los vectores en SQLite, en lotes de 100 filas, listos para búsqueda por similitud.",
      "how.5.title":"Responder","how.5.desc":"Al preguntar, se buscan los 5 fragmentos más cercanos y se generan la respuesta y sus fuentes.",
      "engines.eyebrow":"MOTORES DE RESPUESTA","engines.title":"Elige dónde se redacta la respuesta",
      "engines.subtitle":"La recuperación de información es siempre local. Solo el último paso, la redacción, puede delegarse a la nube.",
      "engines.local.title":"IA local · Ollama","engines.local.desc":"Corre en tu máquina con llama3.2:1b por defecto. Sin cuenta, sin costo, sin conexión.",
      "engines.cloud.title":"IA en la nube · opcional","engines.cloud.desc":"Gemini, DeepSeek u OpenAI redactan la respuesta final con la clave que tú configuras.",
      "engines.row.where":"Dónde corre","engines.row.internet":"Necesita internet","engines.row.cost":"Costo","engines.row.sends":"Qué se envía",
      "engines.local.where":"Tu máquina (localhost)","engines.local.internet":"No","engines.local.cost":"Gratis","engines.local.sends":"Nada",
      "engines.cloud.where":"Servidores del proveedor","engines.cloud.internet":"Sí","engines.cloud.cost":"Según el proveedor","engines.cloud.sends":"Solo la pregunta y los fragmentos recuperados",
      "engines.note":"Tus archivos, el texto extraído y los vectores nunca salen de tu equipo, elijas el motor que elijas.",
      "privacy.eyebrow":"PRIVACIDAD","privacy.title":"Un mapa exacto de qué se guarda y qué se envía","privacy.subtitle":"La misma tabla que verías en la configuración de la app.",
      "privacy.col.data":"Dato","privacy.col.stored":"Dónde se guarda","privacy.col.leaves":"¿Sale de tu equipo?",
      "privacy.row1.label":"Tus archivos","privacy.row1.stored":"Tu disco","privacy.row1.leaves":"Nunca",
      "privacy.row2.label":"Texto extraído","privacy.row2.leaves":"Nunca",
      "privacy.row3.label":"Embeddings","privacy.row3.leaves":"Nunca",
      "privacy.row4.label":"Historial de chat","privacy.row4.leaves":"Nunca",
      "privacy.row5.label":"Claves de API","privacy.row5.leaves":"Solo al llamar al proveedor elegido",
      "privacy.row6.label":"Pregunta + contexto recuperado","privacy.row6.stored":"Memoria, durante la consulta","privacy.row6.leaves":"Solo si activas la nube",
      "stack.eyebrow":"TECNOLOGÍA","stack.title":"Construido con herramientas de escritorio modernas",
      "start.eyebrow":"INSTALACIÓN","start.title":"En marcha en tres pasos","start.subtitle":"Necesitas Node.js 22+, Rust estable y Ollama instalado y en ejecución.",
      "start.step1":"1. Instala los modelos","start.step2":"2. Instala las dependencias","start.step3":"3. Ejecuta la app",
      "start.note":"Modelo de chat: llama3.2:1b (~1.3 GB) · Modelo de embeddings: nomic-embed-text (274 MB, 768 dimensiones)",
      "footer.tagline":"Chatea con tus documentos. Sin conexión, si así lo prefieres.",
      "footer.author":"Construido con Tauri 2, React 19, TypeScript, Tailwind CSS y Ollama. Autor: Francisco Guzmán.",
      "footer.backToTop":"Volver arriba"
    },
    en: {
      "nav.features":"Features","nav.how":"How it works","nav.engines":"Engines","nav.privacy":"Privacy","nav.start":"By default",
      "shots.eyebrow":"SCREENSHOTS","shots.title":"This is how DocuMind AI looks","shots.subtitle":"The full in-app flow, captured on screen.",
      "settings.button":"Preferences","lang.label":"Language","theme.label":"Theme",
      "theme.light":"Light","theme.dark":"Dark","theme.system":"System","accent.label":"Accent color",
      "hero.eyebrow":"// 100% LOCAL BY DEFAULT",
      "hero.title":"Chat with your documents. Nothing leaves your machine.",
      "hero.subtitle":"DocuMind AI is a desktop app that answers questions about your PDFs, Word, Excel and text files using a local language model. Parsing, search and generation run on your machine; only if you enable it, a cloud model drafts the final answer.",
      "hero.cta1":"See how it works","hero.cta2":"Optional",
      "hero.annotation1":"PDF · DOCX · XLSX · TXT","hero.annotation2":"5 interface languages","hero.annotation3":"0 documents sent, always",
      "diagram.doc":"Document","diagram.chunks":"Chunks","diagram.vectors":"Vectors","diagram.engine":"Local engine","diagram.answer":"Answer",
      "features.eyebrow":"FEATURES","features.title":"Everything you need, nothing to fear",
      "features.subtitle":"A personal knowledge base that answers with sources, without depending on the cloud.",
      "features.1.title":"100% local by default","features.1.desc":"Parsing, embeddings, search and generation run on your machine from the first question.",
      "features.2.title":"Cloud engine, optional","features.2.desc":"Enable Gemini, DeepSeek or OpenAI just to draft the final answer. Search stays local.",
      "features.3.title":"Verifiable sources","features.3.desc":"Every answer shows the exact chunks used, with their similarity score, like a research paper.",
      "features.4.title":"Isolated workspaces","features.4.desc":"Organize documents and chats into separate projects; data never mixes between them.",
      "features.5.title":"Real-time progress","features.5.desc":"A progress bar shows every step while your files are parsed, chunked and indexed.",
      "features.6.title":"Interface in 5 languages","features.6.desc":"English, Spanish, Portuguese, French and German, with automatic system-language detection.",
      "how.eyebrow":"PROCESS","how.title":"From a file to a sourced answer","how.subtitle":"Five steps, all on your machine, with visible progress at every stage.",
      "how.1.title":"Parse","how.1.desc":"Extracts text from PDF, DOCX, XLSX or TXT. PDFs fall back to a second engine if the first one fails.",
      "how.2.title":"Chunk","how.2.desc":"Splits the text into 1000-character pieces with a 50-character overlap, so ideas aren't cut in half.",
      "how.3.title":"Embed","how.3.desc":"Turns each chunk into a 768-dimension vector with nomic-embed-text, in concurrent groups.",
      "how.4.title":"Index","how.4.desc":"Stores the vectors in SQLite, in batches of 100 rows, ready for similarity search.",
      "how.5.title":"Answer","how.5.desc":"When you ask, the 5 closest chunks are retrieved and the answer and its sources are generated.",
      "engines.eyebrow":"ANSWER ENGINES","engines.title":"Choose where the answer gets written",
      "engines.subtitle":"Retrieval is always local. Only the last step, writing the answer, can be delegated to the cloud.",
      "engines.local.title":"Local AI · Ollama","engines.local.desc":"Runs on your machine with llama3.2:1b by default. No account, no cost, no connection.",
      "engines.cloud.title":"Cloud AI · optional","engines.cloud.desc":"Gemini, DeepSeek or OpenAI draft the final answer with the key you configure.",
      "engines.row.where":"Where it runs","engines.row.internet":"Needs internet","engines.row.cost":"Cost","engines.row.sends":"What is sent",
      "engines.local.where":"Your machine (localhost)","engines.local.internet":"No","engines.local.cost":"Free","engines.local.sends":"Nothing",
      "engines.cloud.where":"Provider's servers","engines.cloud.internet":"Yes","engines.cloud.cost":"Depends on the provider","engines.cloud.sends":"Only the question and the retrieved chunks",
      "engines.note":"Your files, the extracted text and the vectors never leave your machine, whichever engine you choose.",
      "privacy.eyebrow":"PRIVACY","privacy.title":"An exact map of what's stored and what's sent","privacy.subtitle":"The same table you'd see in the app's settings.",
      "privacy.col.data":"Data","privacy.col.stored":"Stored where","privacy.col.leaves":"Leaves your machine?",
      "privacy.row1.label":"Your files","privacy.row1.stored":"Your disk","privacy.row1.leaves":"Never",
      "privacy.row2.label":"Extracted text","privacy.row2.leaves":"Never",
      "privacy.row3.label":"Embeddings","privacy.row3.leaves":"Never",
      "privacy.row4.label":"Chat history","privacy.row4.leaves":"Never",
      "privacy.row5.label":"API keys","privacy.row5.leaves":"Only when calling the chosen provider",
      "privacy.row6.label":"Question + retrieved context","privacy.row6.stored":"Memory, during the query","privacy.row6.leaves":"Only if you enable the cloud",
      "stack.eyebrow":"TECHNOLOGY","stack.title":"Built with modern desktop tooling",
      "start.eyebrow":"INSTALLATION","start.title":"Up and running in three steps","start.subtitle":"You'll need Node.js 22+, stable Rust and Ollama installed and running.",
      "start.step1":"1. Install the models","start.step2":"2. Install the dependencies","start.step3":"3. Run the app",
      "start.note":"Chat model: llama3.2:1b (~1.3 GB) · Embedding model: nomic-embed-text (274 MB, 768 dimensions)",
      "footer.tagline":"Chat with your documents. Offline, if you prefer.",
      "footer.author":"Built with Tauri 2, React 19, TypeScript, Tailwind CSS and Ollama. Author: Francisco Guzmán.",
      "footer.backToTop":"Back to top"
    },
    pt: {
      "nav.features":"Recursos","nav.how":"Como funciona","nav.engines":"Motores","nav.privacy":"Privacidade","nav.start":"Por padrão",
      "shots.eyebrow":"CAPTURAS","shots.title":"Assim é o DocuMind AI","shots.subtitle":"O fluxo completo dentro do app, capturado na tela.",
      "settings.button":"Preferências","lang.label":"Idioma","theme.label":"Tema",
      "theme.light":"Claro","theme.dark":"Escuro","theme.system":"Sistema","accent.label":"Cor de destaque",
      "hero.eyebrow":"// 100% LOCAL POR PADRÃO",
      "hero.title":"Converse com seus documentos. Nada sai do seu computador.",
      "hero.subtitle":"DocuMind AI é um app de desktop que responde perguntas sobre seus PDFs, Word, Excel e arquivos de texto usando um modelo de linguagem local. A extração, a busca e a geração rodam na sua máquina; só se você ativar, um modelo na nuvem redige a resposta final.",
      "hero.cta1":"Ver como funciona","hero.cta2":"Opcional",
      "hero.annotation1":"PDF · DOCX · XLSX · TXT","hero.annotation2":"5 idiomas de interface","hero.annotation3":"0 documentos enviados, sempre",
      "diagram.doc":"Documento","diagram.chunks":"Fragmentos","diagram.vectors":"Vetores","diagram.engine":"Motor local","diagram.answer":"Resposta",
      "features.eyebrow":"RECURSOS","features.title":"Tudo o que você precisa, nada a temer",
      "features.subtitle":"Uma base de conhecimento pessoal que responde com fontes, sem depender da nuvem.",
      "features.1.title":"100% local por padrão","features.1.desc":"A extração, os embeddings, a busca e a geração rodam na sua máquina desde a primeira pergunta.",
      "features.2.title":"Motor na nuvem, opcional","features.2.desc":"Ative Gemini, DeepSeek ou OpenAI só para redigir a resposta final. A busca continua local.",
      "features.3.title":"Fontes verificáveis","features.3.desc":"Cada resposta mostra os trechos exatos usados, com sua pontuação de similaridade, como em um artigo acadêmico.",
      "features.4.title":"Workspaces isolados","features.4.desc":"Organize documentos e chats em projetos independentes; os dados nunca se misturam entre eles.",
      "features.5.title":"Progresso em tempo real","features.5.desc":"Uma barra de progresso mostra cada etapa enquanto seus arquivos são analisados, fragmentados e indexados.",
      "features.6.title":"Interface em 5 idiomas","features.6.desc":"Inglês, espanhol, português, francês e alemão, com detecção automática do idioma do sistema.",
      "how.eyebrow":"PROCESSO","how.title":"De um arquivo a uma resposta com fontes","how.subtitle":"Cinco etapas, todas no seu computador, com progresso visível em cada uma.",
      "how.1.title":"Analisar","how.1.desc":"Extrai o texto de PDF, DOCX, XLSX ou TXT. Os PDFs usam um motor reserva se o primeiro falhar.",
      "how.2.title":"Fragmentar","how.2.desc":"Divide o texto em pedaços de 1000 caracteres com 50 de sobreposição, para não cortar ideias ao meio.",
      "how.3.title":"Vetorizar","how.3.desc":"Transforma cada fragmento em um vetor de 768 dimensões com nomic-embed-text, em grupos simultâneos.",
      "how.4.title":"Indexar","how.4.desc":"Guarda os vetores no SQLite, em lotes de 100 linhas, prontos para busca por similaridade.",
      "how.5.title":"Responder","how.5.desc":"Ao perguntar, os 5 fragmentos mais próximos são recuperados e a resposta e suas fontes são geradas.",
      "engines.eyebrow":"MOTORES DE RESPOSTA","engines.title":"Escolha onde a resposta é escrita",
      "engines.subtitle":"A recuperação é sempre local. Só a última etapa, a redação, pode ser delegada à nuvem.",
      "engines.local.title":"IA local · Ollama","engines.local.desc":"Roda na sua máquina com llama3.2:1b por padrão. Sem conta, sem custo, sem conexão.",
      "engines.cloud.title":"IA na nuvem · opcional","engines.cloud.desc":"Gemini, DeepSeek ou OpenAI redigem a resposta final com a chave que você configura.",
      "engines.row.where":"Onde roda","engines.row.internet":"Precisa de internet","engines.row.cost":"Custo","engines.row.sends":"O que é enviado",
      "engines.local.where":"Sua máquina (localhost)","engines.local.internet":"Não","engines.local.cost":"Grátis","engines.local.sends":"Nada",
      "engines.cloud.where":"Servidores do provedor","engines.cloud.internet":"Sim","engines.cloud.cost":"Depende do provedor","engines.cloud.sends":"Só a pergunta e os trechos recuperados",
      "engines.note":"Seus arquivos, o texto extraído e os vetores nunca saem do seu computador, seja qual for o motor escolhido.",
      "privacy.eyebrow":"PRIVACIDADE","privacy.title":"Um mapa exato do que é guardado e do que é enviado","privacy.subtitle":"A mesma tabela que você veria nas configurações do app.",
      "privacy.col.data":"Dado","privacy.col.stored":"Onde é guardado","privacy.col.leaves":"Sai do seu computador?",
      "privacy.row1.label":"Seus arquivos","privacy.row1.stored":"Seu disco","privacy.row1.leaves":"Nunca",
      "privacy.row2.label":"Texto extraído","privacy.row2.leaves":"Nunca",
      "privacy.row3.label":"Embeddings","privacy.row3.leaves":"Nunca",
      "privacy.row4.label":"Histórico de chat","privacy.row4.leaves":"Nunca",
      "privacy.row5.label":"Chaves de API","privacy.row5.leaves":"Só ao chamar o provedor escolhido",
      "privacy.row6.label":"Pergunta + contexto recuperado","privacy.row6.stored":"Memória, durante a consulta","privacy.row6.leaves":"Só se você ativar a nuvem",
      "stack.eyebrow":"TECNOLOGIA","stack.title":"Construído com ferramentas modernas de desktop",
      "start.eyebrow":"INSTALAÇÃO","start.title":"Funcionando em três passos","start.subtitle":"Você vai precisar do Node.js 22+, Rust estável e do Ollama instalado e em execução.",
      "start.step1":"1. Instale os modelos","start.step2":"2. Instale as dependências","start.step3":"3. Execute o app",
      "start.note":"Modelo de chat: llama3.2:1b (~1,3 GB) · Modelo de embeddings: nomic-embed-text (274 MB, 768 dimensões)",
      "footer.tagline":"Converse com seus documentos. Offline, se preferir.",
      "footer.author":"Construído com Tauri 2, React 19, TypeScript, Tailwind CSS e Ollama. Autor: Francisco Guzmán.",
      "footer.backToTop":"Voltar ao topo"
    },
    fr: {
      "nav.features":"Fonctionnalités","nav.how":"Fonctionnement","nav.engines":"Moteurs","nav.privacy":"Confidentialité","nav.start":"Par défaut",
      "shots.eyebrow":"CAPTURES D'ÉCRAN","shots.title":"Voici à quoi ressemble DocuMind AI","shots.subtitle":"Le flux complet dans l'application, capturé à l'écran.",
      "settings.button":"Préférences","lang.label":"Langue","theme.label":"Thème",
      "theme.light":"Clair","theme.dark":"Sombre","theme.system":"Système","accent.label":"Couleur d'accent",
      "hero.eyebrow":"// 100 % LOCAL PAR DÉFAUT",
      "hero.title":"Discutez avec vos documents. Rien ne quitte votre machine.",
      "hero.subtitle":"DocuMind AI est une application de bureau qui répond à vos questions sur vos PDF, Word, Excel et fichiers texte grâce à un modèle de langage local. L'extraction, la recherche et la génération s'exécutent sur votre machine ; seulement si vous l'activez, un modèle cloud rédige la réponse finale.",
      "hero.cta1":"Voir le fonctionnement","hero.cta2":"En option",
      "hero.annotation1":"PDF · DOCX · XLSX · TXT","hero.annotation2":"5 langues d'interface","hero.annotation3":"0 document envoyé, toujours",
      "diagram.doc":"Document","diagram.chunks":"Fragments","diagram.vectors":"Vecteurs","diagram.engine":"Moteur local","diagram.answer":"Réponse",
      "features.eyebrow":"FONCTIONNALITÉS","features.title":"Tout ce qu'il faut, rien à craindre",
      "features.subtitle":"Une base de connaissances personnelle qui répond avec ses sources, sans dépendre du cloud.",
      "features.1.title":"100 % local par défaut","features.1.desc":"L'extraction, les embeddings, la recherche et la génération s'exécutent sur votre machine dès la première question.",
      "features.2.title":"Moteur cloud, en option","features.2.desc":"Activez Gemini, DeepSeek ou OpenAI juste pour rédiger la réponse finale. La recherche reste locale.",
      "features.3.title":"Sources vérifiables","features.3.desc":"Chaque réponse affiche les extraits exacts utilisés, avec leur score de similarité, comme dans un article de recherche.",
      "features.4.title":"Espaces de travail isolés","features.4.desc":"Organisez documents et discussions en projets distincts ; les données ne se mélangent jamais entre eux.",
      "features.5.title":"Progression en temps réel","features.5.desc":"Une barre de progression affiche chaque étape pendant l'analyse, le découpage et l'indexation de vos fichiers.",
      "features.6.title":"Interface en 5 langues","features.6.desc":"Anglais, espagnol, portugais, français et allemand, avec détection automatique de la langue du système.",
      "how.eyebrow":"PROCESSUS","how.title":"D'un fichier à une réponse sourcée","how.subtitle":"Cinq étapes, toutes sur votre machine, avec une progression visible à chaque étape.",
      "how.1.title":"Analyser","how.1.desc":"Extrait le texte des PDF, DOCX, XLSX ou TXT. Les PDF basculent sur un second moteur si le premier échoue.",
      "how.2.title":"Découper","how.2.desc":"Divise le texte en blocs de 1000 caractères avec un chevauchement de 50, pour ne pas couper les idées en deux.",
      "how.3.title":"Vectoriser","how.3.desc":"Transforme chaque bloc en un vecteur de 768 dimensions avec nomic-embed-text, par groupes simultanés.",
      "how.4.title":"Indexer","how.4.desc":"Enregistre les vecteurs dans SQLite, par lots de 100 lignes, prêts pour la recherche par similarité.",
      "how.5.title":"Répondre","how.5.desc":"À chaque question, les 5 blocs les plus proches sont récupérés, puis la réponse et ses sources sont générées.",
      "engines.eyebrow":"MOTEURS DE RÉPONSE","engines.title":"Choisissez où la réponse est rédigée",
      "engines.subtitle":"La recherche est toujours locale. Seule la dernière étape, la rédaction, peut être déléguée au cloud.",
      "engines.local.title":"IA locale · Ollama","engines.local.desc":"S'exécute sur votre machine avec llama3.2:1b par défaut. Sans compte, sans coût, sans connexion.",
      "engines.cloud.title":"IA cloud · en option","engines.cloud.desc":"Gemini, DeepSeek ou OpenAI rédigent la réponse finale avec la clé que vous configurez.",
      "engines.row.where":"Où ça s'exécute","engines.row.internet":"Besoin d'internet","engines.row.cost":"Coût","engines.row.sends":"Ce qui est envoyé",
      "engines.local.where":"Votre machine (localhost)","engines.local.internet":"Non","engines.local.cost":"Gratuit","engines.local.sends":"Rien",
      "engines.cloud.where":"Serveurs du fournisseur","engines.cloud.internet":"Oui","engines.cloud.cost":"Selon le fournisseur","engines.cloud.sends":"Seulement la question et les extraits récupérés",
      "engines.note":"Vos fichiers, le texte extrait et les vecteurs ne quittent jamais votre machine, quel que soit le moteur choisi.",
      "privacy.eyebrow":"CONFIDENTIALITÉ","privacy.title":"Une carte exacte de ce qui est stocké et envoyé","privacy.subtitle":"Le même tableau que celui des réglages de l'application.",
      "privacy.col.data":"Donnée","privacy.col.stored":"Stockée où","privacy.col.leaves":"Quitte votre machine ?",
      "privacy.row1.label":"Vos fichiers","privacy.row1.stored":"Votre disque","privacy.row1.leaves":"Jamais",
      "privacy.row2.label":"Texte extrait","privacy.row2.leaves":"Jamais",
      "privacy.row3.label":"Embeddings","privacy.row3.leaves":"Jamais",
      "privacy.row4.label":"Historique des discussions","privacy.row4.leaves":"Jamais",
      "privacy.row5.label":"Clés API","privacy.row5.leaves":"Seulement lors de l'appel au fournisseur choisi",
      "privacy.row6.label":"Question + contexte récupéré","privacy.row6.stored":"Mémoire, pendant la requête","privacy.row6.leaves":"Seulement si vous activez le cloud",
      "stack.eyebrow":"TECHNOLOGIE","stack.title":"Conçu avec des outils de bureau modernes",
      "start.eyebrow":"INSTALLATION","start.title":"Opérationnel en trois étapes","start.subtitle":"Il vous faut Node.js 22+, Rust stable et Ollama installé et lancé.",
      "start.step1":"1. Installez les modèles","start.step2":"2. Installez les dépendances","start.step3":"3. Lancez l'application",
      "start.note":"Modèle de discussion : llama3.2:1b (~1,3 Go) · Modèle d'embeddings : nomic-embed-text (274 Mo, 768 dimensions)",
      "footer.tagline":"Discutez avec vos documents. Hors ligne, si vous préférez.",
      "footer.author":"Conçu avec Tauri 2, React 19, TypeScript, Tailwind CSS et Ollama. Auteur : Francisco Guzmán.",
      "footer.backToTop":"Retour en haut"
    },
    de: {
      "nav.features":"Funktionen","nav.how":"Funktionsweise","nav.engines":"Engines","nav.privacy":"Datenschutz","nav.start":"Standardmäßig",
      "shots.eyebrow":"SCREENSHOTS","shots.title":"So sieht DocuMind AI aus","shots.subtitle":"Der komplette Ablauf in der App, auf dem Bildschirm festgehalten.",
      "settings.button":"Einstellungen","lang.label":"Sprache","theme.label":"Design",
      "theme.light":"Hell","theme.dark":"Dunkel","theme.system":"System","accent.label":"Akzentfarbe",
      "hero.eyebrow":"// STANDARDMÄSSIG 100 % LOKAL",
      "hero.title":"Chatten Sie mit Ihren Dokumenten. Nichts verlässt Ihr Gerät.",
      "hero.subtitle":"DocuMind AI ist eine Desktop-App, die Fragen zu Ihren PDF-, Word-, Excel- und Textdateien mit einem lokalen Sprachmodell beantwortet. Extraktion, Suche und Generierung laufen auf Ihrem Gerät; nur wenn Sie es aktivieren, verfasst ein Cloud-Modell die endgültige Antwort.",
      "hero.cta1":"Funktionsweise ansehen","hero.cta2":"Optional",
      "hero.annotation1":"PDF · DOCX · XLSX · TXT","hero.annotation2":"5 Oberflächensprachen","hero.annotation3":"0 gesendete Dokumente, immer",
      "diagram.doc":"Dokument","diagram.chunks":"Abschnitte","diagram.vectors":"Vektoren","diagram.engine":"Lokale Engine","diagram.answer":"Antwort",
      "features.eyebrow":"FUNKTIONEN","features.title":"Alles, was Sie brauchen, nichts zu befürchten",
      "features.subtitle":"Eine persönliche Wissensdatenbank, die mit Quellen antwortet, ohne auf die Cloud angewiesen zu sein.",
      "features.1.title":"Standardmäßig 100 % lokal","features.1.desc":"Extraktion, Embeddings, Suche und Generierung laufen ab der ersten Frage auf Ihrem Gerät.",
      "features.2.title":"Cloud-Engine, optional","features.2.desc":"Aktivieren Sie Gemini, DeepSeek oder OpenAI nur, um die endgültige Antwort zu verfassen. Die Suche bleibt lokal.",
      "features.3.title":"Überprüfbare Quellen","features.3.desc":"Jede Antwort zeigt die genau verwendeten Abschnitte mit ihrem Ähnlichkeitswert, wie in einer Fachpublikation.",
      "features.4.title":"Isolierte Workspaces","features.4.desc":"Organisieren Sie Dokumente und Chats in getrennten Projekten; Daten vermischen sich nie.",
      "features.5.title":"Fortschritt in Echtzeit","features.5.desc":"Ein Fortschrittsbalken zeigt jeden Schritt, während Ihre Dateien analysiert, zerlegt und indexiert werden.",
      "features.6.title":"Oberfläche in 5 Sprachen","features.6.desc":"Englisch, Spanisch, Portugiesisch, Französisch und Deutsch, mit automatischer Erkennung der Systemsprache.",
      "how.eyebrow":"ABLAUF","how.title":"Von einer Datei zu einer belegten Antwort","how.subtitle":"Fünf Schritte, alle auf Ihrem Gerät, mit sichtbarem Fortschritt bei jedem Schritt.",
      "how.1.title":"Analysieren","how.1.desc":"Extrahiert Text aus PDF, DOCX, XLSX oder TXT. Bei PDFs greift eine zweite Engine, falls die erste scheitert.",
      "how.2.title":"Zerlegen","how.2.desc":"Teilt den Text in 1000 Zeichen lange Abschnitte mit 50 Zeichen Überlappung, damit Gedanken nicht abgeschnitten werden.",
      "how.3.title":"Vektorisieren","how.3.desc":"Wandelt jeden Abschnitt mit nomic-embed-text in einen 768-dimensionalen Vektor um, in gleichzeitigen Gruppen.",
      "how.4.title":"Indexieren","how.4.desc":"Speichert die Vektoren in SQLite, in Stapeln von 100 Zeilen, bereit für die Ähnlichkeitssuche.",
      "how.5.title":"Antworten","how.5.desc":"Bei einer Frage werden die 5 nächstliegenden Abschnitte abgerufen und Antwort samt Quellen erzeugt.",
      "engines.eyebrow":"ANTWORT-ENGINES","engines.title":"Wählen Sie, wo die Antwort geschrieben wird",
      "engines.subtitle":"Das Abrufen ist immer lokal. Nur der letzte Schritt, das Verfassen, kann an die Cloud delegiert werden.",
      "engines.local.title":"Lokale KI · Ollama","engines.local.desc":"Läuft standardmäßig mit llama3.2:1b auf Ihrem Gerät. Kein Konto, keine Kosten, keine Verbindung.",
      "engines.cloud.title":"Cloud-KI · optional","engines.cloud.desc":"Gemini, DeepSeek oder OpenAI verfassen die endgültige Antwort mit dem von Ihnen konfigurierten Schlüssel.",
      "engines.row.where":"Wo es läuft","engines.row.internet":"Benötigt Internet","engines.row.cost":"Kosten","engines.row.sends":"Was gesendet wird",
      "engines.local.where":"Ihr Gerät (localhost)","engines.local.internet":"Nein","engines.local.cost":"Kostenlos","engines.local.sends":"Nichts",
      "engines.cloud.where":"Server des Anbieters","engines.cloud.internet":"Ja","engines.cloud.cost":"Abhängig vom Anbieter","engines.cloud.sends":"Nur die Frage und die abgerufenen Abschnitte",
      "engines.note":"Ihre Dateien, der extrahierte Text und die Vektoren verlassen nie Ihr Gerät, unabhängig von der gewählten Engine.",
      "privacy.eyebrow":"DATENSCHUTZ","privacy.title":"Eine genaue Übersicht, was gespeichert und gesendet wird","privacy.subtitle":"Dieselbe Tabelle wie in den Einstellungen der App.",
      "privacy.col.data":"Daten","privacy.col.stored":"Gespeichert wo","privacy.col.leaves":"Verlässt Ihr Gerät?",
      "privacy.row1.label":"Ihre Dateien","privacy.row1.stored":"Ihre Festplatte","privacy.row1.leaves":"Nie",
      "privacy.row2.label":"Extrahierter Text","privacy.row2.leaves":"Nie",
      "privacy.row3.label":"Embeddings","privacy.row3.leaves":"Nie",
      "privacy.row4.label":"Chatverlauf","privacy.row4.leaves":"Nie",
      "privacy.row5.label":"API-Schlüssel","privacy.row5.leaves":"Nur beim Aufruf des gewählten Anbieters",
      "privacy.row6.label":"Frage + abgerufener Kontext","privacy.row6.stored":"Speicher, während der Anfrage","privacy.row6.leaves":"Nur wenn Sie die Cloud aktivieren",
      "stack.eyebrow":"TECHNOLOGIE","stack.title":"Gebaut mit modernen Desktop-Werkzeugen",
      "start.eyebrow":"INSTALLATION","start.title":"In drei Schritten startklar","start.subtitle":"Sie benötigen Node.js 22+, stabiles Rust sowie ein installiertes und laufendes Ollama.",
      "start.step1":"1. Modelle installieren","start.step2":"2. Abhängigkeiten installieren","start.step3":"3. App starten",
      "start.note":"Chat-Modell: llama3.2:1b (~1,3 GB) · Embedding-Modell: nomic-embed-text (274 MB, 768 Dimensionen)",
      "footer.tagline":"Chatten Sie mit Ihren Dokumenten. Offline, wenn Sie möchten.",
      "footer.author":"Gebaut mit Tauri 2, React 19, TypeScript, Tailwind CSS und Ollama. Autor: Francisco Guzmán.",
      "footer.backToTop":"Nach oben"
    }
  };

  var SUPPORTED = ["es","en","pt","fr","de"];
  var ACCENTS = {
    blue:   { solid:"#3D63DD", tint:"#8FA8FF" },
    violet: { solid:"#6D4CE0", tint:"#C3B4FF" },
    teal:   { solid:"#0E8E80", tint:"#5EEAD4" },
    amber:  { solid:"#B45F06", tint:"#F5A623" },
    rose:   { solid:"#B32A62", tint:"#F98FBF" }
  };

  var root = document.documentElement;
  var state = { lang:"es", themeMode:"system", accent:"blue" };

  function detectLang(){
    var nav = ((navigator.language || "es").slice(0,2)).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : "es";
  }

  function applyLang(lang){
    if(!I18N[lang]) lang = "es";
    state.lang = lang;
    root.setAttribute("lang", lang);
    var dict = I18N[lang];
    var nodes = document.querySelectorAll("[data-i18n]");
    for(var i=0;i<nodes.length;i++){
      var key = nodes[i].getAttribute("data-i18n");
      var val = dict[key] !== undefined ? dict[key] : I18N.es[key];
      if(val !== undefined) nodes[i].textContent = val;
    }
    var langBtns = document.querySelectorAll("#langGrid .opt-btn");
    for(var j=0;j<langBtns.length;j++){
      langBtns[j].classList.toggle("active", langBtns[j].getAttribute("data-lang") === lang);
    }
  }

  function resolvedTheme(){
    if(state.themeMode === "system"){
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return state.themeMode;
  }

  function applyThemeAndAccent(){
    var resolved = resolvedTheme();
    root.setAttribute("data-theme", resolved);

    var a = ACCENTS[state.accent] || ACCENTS.blue;
    root.style.setProperty("--accent-solid", a.solid);
    root.style.setProperty("--accent-text", resolved === "dark" ? a.tint : a.solid);

    var metaTheme = document.getElementById("metaThemeColor");
    if(metaTheme) metaTheme.setAttribute("content", resolved === "dark" ? "#12161A" : "#F2F5F4");

    var themeBtns = document.querySelectorAll("#themeRow .opt-btn");
    for(var i=0;i<themeBtns.length;i++){
      themeBtns[i].classList.toggle("active", themeBtns[i].getAttribute("data-theme-mode") === state.themeMode);
    }
    var swatches = document.querySelectorAll("#swatchRow .swatch");
    for(var j=0;j<swatches.length;j++){
      swatches[j].classList.toggle("active", swatches[j].getAttribute("data-accent") === state.accent);
    }
  }

  // ---- wire up controls ----
  document.getElementById("langGrid").addEventListener("click", function(e){
    var btn = e.target.closest("[data-lang]");
    if(!btn) return;
    applyLang(btn.getAttribute("data-lang"));
  });

  document.getElementById("themeRow").addEventListener("click", function(e){
    var btn = e.target.closest("[data-theme-mode]");
    if(!btn) return;
    state.themeMode = btn.getAttribute("data-theme-mode");
    applyThemeAndAccent();
  });

  document.getElementById("swatchRow").addEventListener("click", function(e){
    var btn = e.target.closest("[data-accent]");
    if(!btn) return;
    state.accent = btn.getAttribute("data-accent");
    applyThemeAndAccent();
  });

  var toggleBtn = document.getElementById("settingsToggle");
  var popover = document.getElementById("settingsPopover");
  toggleBtn.addEventListener("click", function(e){
    e.stopPropagation();
    var open = popover.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function(e){
    if(!popover.contains(e.target) && e.target !== toggleBtn){
      popover.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded","false");
    }
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      popover.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded","false");
    }
  });

  if(window.matchMedia){
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(){
      if(state.themeMode === "system") applyThemeAndAccent();
    });
  }

  // ---- reveal on scroll ----
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in-view"); });
  }

  // ---- screenshot lightbox ----
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">&times;</button><img alt="">';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector("img");
  function closeLightbox(){
    lightbox.classList.remove("open");
    lightboxImg.removeAttribute("src");
  }
  var shots = document.querySelectorAll(".shot");
  for(var s=0;s<shots.length;s++){
    (function(shot){
      shot.addEventListener("click", function(){
        lightboxImg.src = shot.getAttribute("data-src");
        lightbox.classList.add("open");
      });
    })(shots[s]);
  }
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function(e){
    if(e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeLightbox();
  });

  // ---- init ----
  state.lang = detectLang();
  applyLang(state.lang);
  applyThemeAndAccent();
})();

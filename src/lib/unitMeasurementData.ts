// Data and translations for Units of Measurement game

export type UnitType = 'length' | 'volume' | 'weight';

export interface UnitData {
  units: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  cascadeColors: string[];
  rowColors: string[];
  icon: string;
  fullUnits: Record<string, string>;
}

export const unitTypes: Record<UnitType, UnitData> = {
  length: {
    units: ['m', 'dm', 'cm', 'mm'],
    color: '#4A90E2',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    cascadeColors: ['#4A90E2', '#6FA8E8', '#94C0EE', '#B9D8F4'],
    rowColors: ['bg-blue-200', 'bg-blue-150', 'bg-blue-100', 'bg-blue-50'],
    icon: '📏',
    fullUnits: {
      m: 'metri',
      dm: 'decimetri',
      cm: 'centimetri',
      mm: 'milimetri'
    }
  },
  volume: {
    units: ['l', 'dl', 'cl', 'ml'],
    color: '#B8D234',
    bgColor: 'bg-lime-100',
    borderColor: 'border-lime-400',
    cascadeColors: ['#B8D234', '#C6DA5A', '#D4E280', '#E2EAA6'],
    rowColors: ['bg-lime-200', 'bg-lime-150', 'bg-lime-100', 'bg-lime-50'],
    icon: '🥤',
    fullUnits: {
      l: 'litri',
      dl: 'decilitri',
      cl: 'centilitri',
      ml: 'mililitri'
    }
  },
  weight: {
    units: ['kg', 'hg', 'dag', 'g'],
    color: '#FF8C42',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400',
    cascadeColors: ['#FF8C42', '#FFA368', '#FFBA8E', '#FFD1B4'],
    rowColors: ['bg-orange-200', 'bg-orange-150', 'bg-orange-100', 'bg-orange-50'],
    icon: '⚖️',
    fullUnits: {
      kg: 'kilograme',
      hg: 'hectograme',
      dag: 'decagrame',
      g: 'grame'
    }
  }
};

export const gameTranslations = {
  ro: {
    title: "Unități de Măsură",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    instructions: "Instrucțiuni",
    showKeyboard: "Afișează tastatura",
    hideKeyboard: "Ascunde tastatura",
    validateAnswer: "Validează răspunsul",
    transform: "Transformă",
    in: "în",
    yourAnswer: "Răspunsul tău",
    correct: "Bravo! Răspuns corect!",
    tryAgain: "Încearcă din nou!",
    unitTypes: {
      length: "Metrul (m)",
      volume: "Litrul (l)",
      weight: "Kilogramul (kg)"
    },
    units: "UNITĂȚI",
    tens: "ZECI",
    hundreds: "SUTE",
    thousands: "MII",
    unitsClass: "CLASA UNITĂȚILOR",
    thousandsClass: "CLASA MIILOR",
    instructionsTitle: "Cum să joci - Unități de Măsură",
    instructionsContent: "Învață să transformi unitățile de măsură! Folosește tastatura NumLit pentru a introduce răspunsul. Nivel 1: Transformă unități mari în subunități (×10).",
    transformationType: {
      multipliToSubmultipli: "Multipli în Submultipli",
      submultipliToMultipli: "Submultipli în Multipli",
      random: "Aleator"
    },
    gameMode: {
      easy: "Ușor",
      pro: "PRO",
      easyDesc: "Mută personajul pe scară",
      proDesc: "Completează tabelul"
    },
    requirement: "CERINȚĂ",
    transformationSelector: "Tip Transformare"
  },
  en: {
    title: "Units of Measurement",
    back: "Back",
    language: "Language",
    level: "Level",
    instructions: "Instructions",
    showKeyboard: "Show keyboard",
    hideKeyboard: "Hide keyboard",
    validateAnswer: "Validate answer",
    transform: "Transform",
    in: "to",
    yourAnswer: "Your answer",
    correct: "Great! Correct answer!",
    tryAgain: "Try again!",
    unitTypes: {
      length: "Meter (m)",
      volume: "Liter (l)",
      weight: "Kilogram (kg)"
    },
    units: "UNITS",
    tens: "TENS",
    hundreds: "HUNDREDS",
    thousands: "THOUSANDS",
    unitsClass: "UNITS CLASS",
    thousandsClass: "THOUSANDS CLASS",
    instructionsTitle: "How to Play - Units of Measurement",
    instructionsContent: "Learn to transform units of measurement! Use the NumLit keyboard to enter your answer. Level 1: Transform large units into subunits (×10).",
    transformationType: {
      multipliToSubmultipli: "Multiples to Submultiples",
      submultipliToMultipli: "Submultiples to Multiples",
      random: "Random"
    },
    gameMode: {
      easy: "Easy",
      pro: "PRO",
      easyDesc: "Move character on ladder",
      proDesc: "Fill the table"
    },
    requirement: "REQUIREMENT",
    transformationSelector: "Transformation Type"
  },
  fr: {
    title: "Unités de Mesure",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    instructions: "Instructions",
    showKeyboard: "Afficher le clavier",
    hideKeyboard: "Masquer le clavier",
    validateAnswer: "Valider la réponse",
    transform: "Transformer",
    in: "en",
    yourAnswer: "Votre réponse",
    correct: "Bravo! Bonne réponse!",
    tryAgain: "Réessayez!",
    unitTypes: {
      length: "Mètre (m)",
      volume: "Litre (l)",
      weight: "Kilogramme (kg)"
    },
    units: "UNITÉS",
    tens: "DIZAINES",
    hundreds: "CENTAINES",
    thousands: "MILLIERS",
    unitsClass: "CLASSE DES UNITÉS",
    thousandsClass: "CLASSE DES MILLIERS",
    instructionsTitle: "Comment jouer - Unités de mesure",
    instructionsContent: "Apprenez à transformer les unités de mesure! Utilisez le clavier NumLit pour saisir votre réponse. Niveau 1: Transformez les grandes unités en sous-unités (×10).",
    transformationType: {
      multipliToSubmultipli: "Multiples vers Sous-multiples",
      submultipliToMultipli: "Sous-multiples vers Multiples",
      random: "Aléatoire"
    },
    gameMode: {
      easy: "Facile",
      pro: "PRO",
      easyDesc: "Déplacez le personnage",
      proDesc: "Remplissez le tableau"
    },
    requirement: "EXIGENCE",
    transformationSelector: "Type de Transformation"
  },
  de: {
    title: "Maßeinheiten",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    instructions: "Anweisungen",
    showKeyboard: "Tastatur anzeigen",
    hideKeyboard: "Tastatur ausblenden",
    validateAnswer: "Antwort validieren",
    transform: "Umwandeln",
    in: "in",
    yourAnswer: "Deine Antwort",
    correct: "Toll! Richtige Antwort!",
    tryAgain: "Versuchen Sie es erneut!",
    unitTypes: {
      length: "Meter (m)",
      volume: "Liter (l)",
      weight: "Kilogramm (kg)"
    },
    units: "EINER",
    tens: "ZEHNER",
    hundreds: "HUNDERTER",
    thousands: "TAUSENDER",
    unitsClass: "EINER-KLASSE",
    thousandsClass: "TAUSENDER-KLASSE",
    instructionsTitle: "Spielanleitung - Maßeinheiten",
    instructionsContent: "Lernen Sie, Maßeinheiten umzurechnen! Verwenden Sie die NumLit-Tastatur, um Ihre Antwort einzugeben. Level 1: Wandeln Sie große Einheiten in Untereinheiten um (×10).",
    transformationType: {
      multipliToSubmultipli: "Vielfache zu Untereinheiten",
      submultipliToMultipli: "Untereinheiten zu Vielfache",
      random: "Zufällig"
    },
    gameMode: {
      easy: "Einfach",
      pro: "PRO",
      easyDesc: "Charakter bewegen",
      proDesc: "Tabelle ausfüllen"
    },
    requirement: "ANFORDERUNG",
    transformationSelector: "Transformationstyp"
  },
  es: {
    title: "Unidades de Medida",
    back: "Atrás",
    language: "Idioma",
    level: "Nivel",
    instructions: "Instrucciones",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar respuesta",
    transform: "Transformar",
    in: "a",
    yourAnswer: "Tu respuesta",
    correct: "¡Genial! ¡Respuesta correcta!",
    tryAgain: "¡Inténtalo de nuevo!",
    unitTypes: {
      length: "Metro (m)",
      volume: "Litro (l)",
      weight: "Kilogramo (kg)"
    },
    units: "UNIDADES",
    tens: "DECENAS",
    hundreds: "CENTENAS",
    thousands: "MILLARES",
    unitsClass: "CLASE DE UNIDADES",
    thousandsClass: "CLASE DE MILLARES",
    instructionsTitle: "Cómo jugar - Unidades de medida",
    instructionsContent: "¡Aprende a transformar unidades de medida! Usa el teclado NumLit para ingresar tu respuesta. Nivel 1: Transforma unidades grandes en subunidades (×10).",
    transformationType: {
      multipliToSubmultipli: "Múltiplos a Submúltiplos",
      submultipliToMultipli: "Submúltiplos a Múltiplos",
      random: "Aleatorio"
    },
    gameMode: {
      easy: "Fácil",
      pro: "PRO",
      easyDesc: "Mueve el personaje",
      proDesc: "Completa la tabla"
    },
    requirement: "REQUISITO",
    transformationSelector: "Tipo de Transformación"
  },
  it: {
    title: "Unità di Misura",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    instructions: "Istruzioni",
    showKeyboard: "Mostra tastiera",
    hideKeyboard: "Nascondi tastiera",
    validateAnswer: "Convalida risposta",
    transform: "Trasforma",
    in: "in",
    yourAnswer: "La tua risposta",
    correct: "Ottimo! Risposta corretta!",
    tryAgain: "Riprova!",
    unitTypes: {
      length: "Metro (m)",
      volume: "Litro (l)",
      weight: "Chilogrammo (kg)"
    },
    units: "UNITÀ",
    tens: "DECINE",
    hundreds: "CENTINAIA",
    thousands: "MIGLIAIA",
    unitsClass: "CLASSE DELLE UNITÀ",
    thousandsClass: "CLASSE DELLE MIGLIAIA",
    instructionsTitle: "Come giocare - Unità di misura",
    instructionsContent: "Impara a trasformare le unità di misura! Usa la tastiera NumLit per inserire la tua risposta. Livello 1: Trasforma grandi unità in sottounità (×10).",
    transformationType: {
      multipliToSubmultipli: "Multipli a Sottomultipli",
      submultipliToMultipli: "Sottomultipli a Multipli",
      random: "Casuale"
    },
    gameMode: {
      easy: "Facile",
      pro: "PRO",
      easyDesc: "Muovi il personaggio",
      proDesc: "Completa la tabella"
    },
    requirement: "REQUISITO",
    transformationSelector: "Tipo di Trasformazione"
  },
  pt: {
    title: "Unidades de Medida",
    back: "Voltar",
    language: "Idioma",
    level: "Nível",
    instructions: "Instruções",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar resposta",
    transform: "Transformar",
    in: "em",
    yourAnswer: "A sua resposta",
    correct: "Ótimo! Resposta correta!",
    tryAgain: "Tente novamente!",
    unitTypes: {
      length: "Metro (m)",
      volume: "Litro (l)",
      weight: "Quilograma (kg)"
    },
    units: "UNIDADES",
    tens: "DEZENAS",
    hundreds: "CENTENAS",
    thousands: "MILHARES",
    unitsClass: "CLASSE DAS UNIDADES",
    thousandsClass: "CLASSE DOS MILHARES",
    instructionsTitle: "Como jogar - Unidades de medida",
    instructionsContent: "Aprenda a transformar unidades de medida! Use o teclado NumLit para inserir sua resposta. Nível 1: Transforme grandes unidades em subunidades (×10).",
    transformationType: {
      multipliToSubmultipli: "Múltiplos para Submúltiplos",
      submultipliToMultipli: "Submúltiplos para Múltiplos",
      random: "Aleatório"
    },
    gameMode: {
      easy: "Fácil",
      pro: "PRO",
      easyDesc: "Mova o personagem",
      proDesc: "Preencha a tabela"
    },
    requirement: "REQUISITO",
    transformationSelector: "Tipo de Transformação"
  },
  cz: {
    title: "Jednotky měření",
    back: "Zpět",
    language: "Jazyk",
    level: "Úroveň",
    instructions: "Instrukce",
    showKeyboard: "Zobrazit klávesnici",
    hideKeyboard: "Skrýt klávesnici",
    validateAnswer: "Ověřit odpověď",
    transform: "Transformovat",
    in: "na",
    yourAnswer: "Vaše odpověď",
    correct: "Skvělé! Správná odpověď!",
    tryAgain: "Zkuste to znovu!",
    unitTypes: {
      length: "Metr (m)",
      volume: "Litr (l)",
      weight: "Kilogram (kg)"
    },
    units: "JEDNOTKY",
    tens: "DESÍTKY",
    hundreds: "STOVKY",
    thousands: "TISÍCE",
    unitsClass: "TŘÍDA JEDNOTEK",
    thousandsClass: "TŘÍDA TISÍCŮ",
    instructionsTitle: "Jak hrát - Jednotky měření",
    instructionsContent: "Naučte se transformovat jednotky měření! Použijte klávesnici NumLit k zadání odpovědi. Úroveň 1: Transformujte velké jednotky na podjednotky (×10).",
    transformationType: {
      multipliToSubmultipli: "Násobky na Podnásobky",
      submultipliToMultipli: "Podnásobky na Násobky",
      random: "Náhodný"
    },
    gameMode: {
      easy: "Snadný",
      pro: "PRO",
      easyDesc: "Pohybujte postavou",
      proDesc: "Vyplňte tabulku"
    },
    requirement: "POŽADAVEK",
    transformationSelector: "Typ Transformace"
  },
  pl: {
    title: "Jednostki miary",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    instructions: "Instrukcje",
    showKeyboard: "Pokaż klawiaturę",
    hideKeyboard: "Ukryj klawiaturę",
    validateAnswer: "Sprawdź odpowiedź",
    transform: "Przekształć",
    in: "na",
    yourAnswer: "Twoja odpowiedź",
    correct: "Świetnie! Poprawna odpowiedź!",
    tryAgain: "Spróbuj ponownie!",
    unitTypes: {
      length: "Metr (m)",
      volume: "Litr (l)",
      weight: "Kilogram (kg)"
    },
    units: "JEDNOSTKI",
    tens: "DZIESIĄTKI",
    hundreds: "SETKI",
    thousands: "TYSIĄCE",
    unitsClass: "KLASA JEDNOSTEK",
    thousandsClass: "KLASA TYSIĘCY",
    instructionsTitle: "Jak grać - Jednostki miary",
    instructionsContent: "Naucz się przekształcać jednostki miary! Użyj klawiatury NumLit, aby wprowadzić odpowiedź. Poziom 1: Przekształć duże jednostki w podjednostki (×10).",
    transformationType: {
      multipliToSubmultipli: "Wielokrotności na Podwielokrotności",
      submultipliToMultipli: "Podwielokrotności na Wielokrotności",
      random: "Losowy"
    },
    gameMode: {
      easy: "Łatwy",
      pro: "PRO",
      easyDesc: "Przesuń postać",
      proDesc: "Wypełnij tabelę"
    },
    requirement: "WYMAGANIE",
    transformationSelector: "Typ Transformacji"
  },
  hu: {
    title: "Mértékegységek",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    instructions: "Utasítások",
    showKeyboard: "Billentyűzet megjelenítése",
    hideKeyboard: "Billentyűzet elrejtése",
    validateAnswer: "Válasz érvényesítése",
    transform: "Átalakítás",
    in: "erre",
    yourAnswer: "Az Ön válasza",
    correct: "Nagyszerű! Helyes válasz!",
    tryAgain: "Próbáld újra!",
    unitTypes: {
      length: "Méter (m)",
      volume: "Liter (l)",
      weight: "Kilogramm (kg)"
    },
    units: "EGYESEK",
    tens: "TÍZESEK",
    hundreds: "SZÁZASOK",
    thousands: "EZRESEK",
    unitsClass: "EGYESEK OSZTÁLYA",
    thousandsClass: "EZRESEK OSZTÁLYA",
    instructionsTitle: "Hogyan játszd - Mértékegységek",
    instructionsContent: "Tanuld meg a mértékegységek átalakítását! Használd a NumLit billentyűzetet a válasz megadásához. 1. szint: Alakítsd át a nagy egységeket alegységekké (×10).",
    transformationType: {
      multipliToSubmultipli: "Többszörösök Altöbbszörösökké",
      submultipliToMultipli: "Altöbbszörösök Többszörösökké",
      random: "Véletlenszerű"
    },
    gameMode: {
      easy: "Könnyű",
      pro: "PRO",
      easyDesc: "Mozgassa a karaktert",
      proDesc: "Töltse ki a táblázatot"
    },
    requirement: "KÖVETELMÉNY",
    transformationSelector: "Átalakítás Típusa"
  },
  bg: {
    title: "Мерни единици",
    back: "Назад",
    language: "Език",
    level: "Ниво",
    instructions: "Инструкции",
    showKeyboard: "Покажи клавиатура",
    hideKeyboard: "Скрий клавиатура",
    validateAnswer: "Валидирай отговор",
    transform: "Трансформирай",
    in: "в",
    yourAnswer: "Твоят отговор",
    correct: "Браво! Верен отговор!",
    tryAgain: "Опитай отново!",
    unitTypes: {
      length: "Метър (m)",
      volume: "Литър (l)",
      weight: "Килограм (kg)"
    },
    units: "ЕДИНИЦИ",
    tens: "ДЕСЕТКИ",
    hundreds: "СТОТИЦИ",
    thousands: "ХИЛЯДИ",
    unitsClass: "КЛАС НА ЕДИНИЦИТЕ",
    thousandsClass: "КЛАС НА ХИЛЯДИТЕ",
    instructionsTitle: "Как да играеш - Мерни единици",
    instructionsContent: "Научи се да преобразуваш мерни единици! Използвай клавиатурата NumLit за да въведеш отговора. Ниво 1: Преобразувай големи единици в подединици (×10).",
    transformationType: {
      multipliToSubmultipli: "Кратни в Подкратни",
      submultipliToMultipli: "Подкратни в Кратни",
      random: "Случаен"
    },
    gameMode: {
      easy: "Лесен",
      pro: "ПРО",
      easyDesc: "Премести персонажа",
      proDesc: "Попълни таблицата"
    },
    requirement: "ИЗИСКВАНЕ",
    transformationSelector: "Тип Трансформация"
  },
  ru: {
    title: "Единицы измерения",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    instructions: "Инструкции",
    showKeyboard: "Показать клавиатуру",
    hideKeyboard: "Скрыть клавиатуру",
    validateAnswer: "Проверить ответ",
    transform: "Преобразовать",
    in: "в",
    yourAnswer: "Ваш ответ",
    correct: "Отлично! Правильный ответ!",
    tryAgain: "Попробуйте снова!",
    unitTypes: {
      length: "Метр (m)",
      volume: "Литр (l)",
      weight: "Килограмм (kg)"
    },
    units: "ЕДИНИЦЫ",
    tens: "ДЕСЯТКИ",
    hundreds: "СОТНИ",
    thousands: "ТЫСЯЧИ",
    unitsClass: "КЛАСС ЕДИНИЦ",
    thousandsClass: "КЛАСС ТЫСЯЧ",
    instructionsTitle: "Как играть - Единицы измерения",
    instructionsContent: "Научитесь преобразовывать единицы измерения! Используйте клавиатуру NumLit для ввода ответа. Уровень 1: Преобразуйте большие единицы в подъединицы (×10).",
    transformationType: {
      multipliToSubmultipli: "Кратные в Подкратные",
      submultipliToMultipli: "Подкратные в Кратные",
      random: "Случайный"
    },
    gameMode: {
      easy: "Легкий",
      pro: "ПРО",
      easyDesc: "Переместите персонажа",
      proDesc: "Заполните таблицу"
    },
    requirement: "ТРЕБОВАНИЕ",
    transformationSelector: "Тип Трансформации"
  },
  ar: {
    title: "وحدات القياس",
    back: "رجوع",
    language: "اللغة",
    level: "المستوى",
    instructions: "التعليمات",
    showKeyboard: "إظهار لوحة المفاتيح",
    hideKeyboard: "إخفاء لوحة المفاتيح",
    validateAnswer: "التحقق من الإجابة",
    transform: "تحويل",
    in: "إلى",
    yourAnswer: "إجابتك",
    correct: "رائع! إجابة صحيحة!",
    tryAgain: "حاول مرة أخرى!",
    unitTypes: {
      length: "متر (m)",
      volume: "لتر (l)",
      weight: "كيلوغرام (kg)"
    },
    units: "الوحدات",
    tens: "العشرات",
    hundreds: "المئات",
    thousands: "الآلاف",
    unitsClass: "فئة الوحدات",
    thousandsClass: "فئة الآلاف",
    instructionsTitle: "كيفية اللعب - وحدات القياس",
    instructionsContent: "تعلم تحويل وحدات القياس! استخدم لوحة مفاتيح NumLit لإدخال إجابتك. المستوى 1: حول الوحدات الكبيرة إلى وحدات فرعية (×10).",
    transformationType: {
      multipliToSubmultipli: "المضاعفات إلى المضاعفات الفرعية",
      submultipliToMultipli: "المضاعفات الفرعية إلى المضاعفات",
      random: "عشوائي"
    },
    gameMode: {
      easy: "سهل",
      pro: "محترف",
      easyDesc: "حرك الشخصية",
      proDesc: "املأ الجدول"
    },
    requirement: "المتطلب",
    transformationSelector: "نوع التحويل"
  },
  tr: {
    title: "Ölçü Birimleri",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    instructions: "Talimatlar",
    showKeyboard: "Klavyeyi göster",
    hideKeyboard: "Klavyeyi gizle",
    validateAnswer: "Cevabı doğrula",
    transform: "Dönüştür",
    in: "için",
    yourAnswer: "Cevabınız",
    correct: "Harika! Doğru cevap!",
    tryAgain: "Tekrar deneyin!",
    unitTypes: {
      length: "Metre (m)",
      volume: "Litre (l)",
      weight: "Kilogram (kg)"
    },
    units: "BİRLİKLER",
    tens: "ONLAR",
    hundreds: "YÜZLER",
    thousands: "BİNLER",
    unitsClass: "BİRLİKLER SINIFI",
    thousandsClass: "BİNLER SINIFI",
    instructionsTitle: "Nasıl oynanır - Ölçü birimleri",
    instructionsContent: "Ölçü birimlerini dönüştürmeyi öğrenin! Cevabınızı girmek için NumLit klavyesini kullanın. Seviye 1: Büyük birimleri alt birimlere dönüştürün (×10).",
    transformationType: {
      multipliToSubmultipli: "Katlar Alt Katlara",
      submultipliToMultipli: "Alt Katlar Katlara",
      random: "Rastgele"
    },
    gameMode: {
      easy: "Kolay",
      pro: "PRO",
      easyDesc: "Karakteri hareket ettirin",
      proDesc: "Tabloyu doldurun"
    },
    requirement: "GEREKLİLİK",
    transformationSelector: "Dönüşüm Türü"
  },
  nl: {
    title: "Meeteenheden",
    back: "Terug",
    language: "Taal",
    level: "Niveau",
    instructions: "Instructies",
    showKeyboard: "Toetsenbord tonen",
    hideKeyboard: "Toetsenbord verbergen",
    validateAnswer: "Antwoord valideren",
    transform: "Transformeer",
    in: "naar",
    yourAnswer: "Jouw antwoord",
    correct: "Geweldig! Correct antwoord!",
    tryAgain: "Probeer opnieuw!",
    unitTypes: {
      length: "Meter (m)",
      volume: "Liter (l)",
      weight: "Kilogram (kg)"
    },
    units: "EENHEDEN",
    tens: "TIENTALLEN",
    hundreds: "HONDERDEN",
    thousands: "DUIZENDEN",
    unitsClass: "EENHEDEN KLASSE",
    thousandsClass: "DUIZENDEN KLASSE",
    instructionsTitle: "Hoe te spelen - Meeteenheden",
    instructionsContent: "Leer meeteenheden te transformeren! Gebruik het NumLit-toetsenbord om je antwoord in te voeren. Niveau 1: Transformeer grote eenheden naar subeenheden (×10).",
    transformationType: {
      multipliToSubmultipli: "Veelvouden naar Subveelvouden",
      submultipliToMultipli: "Subveelvouden naar Veelvouden",
      random: "Willekeurig"
    },
    gameMode: {
      easy: "Gemakkelijk",
      pro: "PRO",
      easyDesc: "Verplaats het personage",
      proDesc: "Vul de tabel in"
    },
    requirement: "VEREISTE",
    transformationSelector: "Transformatietype"
  }
};

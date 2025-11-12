import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import Timer from "@/components/educational/Timer";
import Rigleta from "@/components/educational/Rigleta";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Home, Info, Globe } from "lucide-react";
import ProportionSelector from "@/components/educational/ProportionSelector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import InteractiveMultiplicationTable from "@/components/educational/InteractiveMultiplicationTable";
import ShopPromoBox from "@/components/educational/ShopPromoBox";

const languages = {
  ro: {
    flag: "🇷🇴",
    name: "Română",
    title: "Magia Înmulțirii ✨",
    subtitle: "Descoperă puterea înmulțirii cu riglete magice!",
    slogan: "Antrenează Creierul",
    instructions: "Alege două numere și descoperă rezultatul înmulțirii lor cu ajutorul rigletelor:",
    selectFirstNumber: "Alege primul număr:",
    selectSecondNumber: "Alege al doilea număr:",
    multiplyButton: "Înmulțește! ✨",
    result: "Rezultat:",
    correct: "Bravo! Răspuns corect!",
    incorrect: "Încearcă din nou!",
    backToHome: "Înapoi Acasă",
    newGame: "Joc Nou",
    practice: "Exersează",
    explanation: "Înmulțirea este o operație care ne ajută să calculăm rapid suma mai multor grupuri egale de obiecte.",
    howToPlay: "Cum se joacă",
    howToPlayText: "Selectează numerele pentru înmulțire și observă vizualizarea magică cu riglete!",
    level: "Nivel",
    multiplicationTable: "Tabla înmulțirii",
    random: "Pe Sarite",
    language: "Limbă",
    progressLabel: "Progres",
    levels: {
      beginner: "1",
      easy: "2", 
      medium: "3",
      hard: "4"
    },
    validation: "Verificare",
    validationSuccess: "Corect! Felicitări!",
    congratulations: "Bravo! Răspuns corect! 🎉",
    tryAgain: "Încearcă din nou!",
    chooseFirstFactor: "Alege primul factor",
    chooseSecondFactor: "Alege al doilea factor",
    numLitKeyboard: "Tastatura NumLit",
    delete: "Șterge",
    openNumLit: "Deschide NumLit",
    factor: "Factor",
    product: "Produs",
    takenTimes: "luat de",
    times: "ori",
    groupsOf: "grupe de câte",
    rods: "elemente",
    units: "Unități",
    tens: "Zeci", 
    hundreds: "Sute",
    thousands: "Mii",
    findResult: "Găsește rezultatul:",
    allMultiplicationsFor: "Toate înmulțirile pentru",
    newProblemGenerated: "Problemă nouă generată!",
    validateAndContinue: "Validează și continuă",
    pressButtonFromTable: "Apasă pe un buton din tabel",
    resultsWillAppearHere: "Rezultatele vor apărea aici",
    concentru: "Concentru",
    pitagora: "Pitagora",
    multiplicationFormula1: "luat de",
    multiplicationFormula2: "grupe de câte",
    clearAll: "Șterge",
    openNumLitFull: "Deschide NumLit",
    multipliers: {
      1: "același",
      2: "dublul", 
      3: "triplul",
      4: "împatritul",
      5: "încinciitul",
      6: "înșesitul",
      7: "înșeptitul",
      8: "octuplul",
      9: "nonuplul",
      10: "decuplul",
      11: "undecuplul",
      12: "duodecuplul"
    },
    is: "este",
    taken: "luat",
    once: "o dată",
    of: "DE"
  },
  en: {
    flag: "🇬🇧",
    name: "English",
    title: "Magic of Multiplication ✨",
    subtitle: "Discover the power of multiplication with magic rods!",
    slogan: "Train the Brain",
    instructions: "Choose two numbers and discover the result of their multiplication using the rods:",
    selectFirstNumber: "Choose the first number:",
    selectSecondNumber: "Choose the second number:",
    multiplyButton: "Multiply! ✨",
    result: "Result:",
    correct: "Great! Correct answer!",
    incorrect: "Try again!",
    backToHome: "Back Home",
    newGame: "New Game",
    practice: "Practice",
    explanation: "Multiplication is an operation that helps us quickly calculate the sum of multiple equal groups of objects.",
    howToPlay: "How to Play",
    howToPlayText: "Select numbers for multiplication and observe the magic visualization with rods!",
    level: "Level",
    multiplicationTable: "Multiplication Table",
    random: "Random",
    language: "Language",
    progressLabel: "Progress",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3", 
      hard: "4"
    },
    validation: "Validation",
    validationSuccess: "Correct! Congratulations!",
    congratulations: "Bravo! Correct answer! 🎉",
    tryAgain: "Try again!",
    chooseFirstFactor: "Choose first factor",
    chooseSecondFactor: "Choose second factor",
    numLitKeyboard: "NumLit Keyboard",
    delete: "Delete",
    openNumLit: "Open NumLit",
    factor: "Factor",
    product: "Product",
    takenTimes: "taken",
    times: "times",
    groupsOf: "groups of",
    rods: "elements",
    units: "Units",
    tens: "Tens",
    hundreds: "Hundreds", 
    thousands: "Thousands",
    findResult: "Find the result:",
    allMultiplicationsFor: "All multiplications for",
    newProblemGenerated: "New problem generated!",
    validateAndContinue: "Validate and continue",
    pressButtonFromTable: "Press a button from the table",
    resultsWillAppearHere: "Results will appear here",
    concentru: "Focus",
    pitagora: "Pythagoras",
    multiplicationFormula1: "taken",
    multiplicationFormula2: "groups of",
    clearAll: "Clear",
    openNumLitFull: "Open NumLit",
    multipliers: {
      1: "the same",
      2: "double",
      3: "triple", 
      4: "quadruple",
      5: "quintuple",
      6: "sextuple",
      7: "septuple",
      8: "octuple",
      9: "nonuple",
      10: "decuple",
      11: "undecuple",
      12: "duodecuple"
    },
    is: "is",
    taken: "taken",
    once: "once",
    of: "of"
  },
  fr: {
    flag: "🇫🇷",
    name: "Français",
    title: "Magie de la Multiplication ✨",
    subtitle: "Découvrez le pouvoir de la multiplication avec des baguettes magiques!",
    slogan: "Entraînez le Cerveau",
    instructions: "Choisissez deux nombres et découvrez le résultat de leur multiplication avec les baguettes:",
    selectFirstNumber: "Choisissez le premier nombre:",
    selectSecondNumber: "Choisissez le deuxième nombre:",
    multiplyButton: "Multiplier! ✨",
    result: "Résultat:",
    correct: "Bravo! Bonne réponse!",
    incorrect: "Essayez encore!",
    backToHome: "Retour Accueil",
    newGame: "Nouveau Jeu",
    practice: "S'entraîner",
    explanation: "La multiplication est une opération qui nous aide à calculer rapidement la somme de plusieurs groupes égaux d'objets.",
    howToPlay: "Comment jouer",
    howToPlayText: "Sélectionnez les nombres pour la multiplication et observez la visualisation magique avec des baguettes!",
    level: "Niveau",
    multiplicationTable: "Table de multiplication",
    random: "Au hasard",
    language: "Langue",
    progressLabel: "Progrès",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Validation",
    validationSuccess: "Correct! Félicitations!",
    congratulations: "Bravo! Bonne réponse! 🎉",
    tryAgain: "Essayez encore!",
    chooseFirstFactor: "Choisissez le premier facteur",
    chooseSecondFactor: "Choisissez le deuxième facteur",
    numLitKeyboard: "Clavier NumLit",
    delete: "Supprimer",
    openNumLit: "Ouvrir NumLit",
    factor: "Facteur",
    product: "Produit",
    takenTimes: "pris",
    times: "fois",
    groupsOf: "groupes de",
    rods: "éléments",
    units: "Unités",
    tens: "Dizaines",
    hundreds: "Centaines",
    thousands: "Milliers", 
    findResult: "Trouvez le résultat:",
    allMultiplicationsFor: "Toutes les multiplications pour",
    newProblemGenerated: "Nouveau problème généré!",
    validateAndContinue: "Valider et continuer",
    pressButtonFromTable: "Appuyez sur un bouton du tableau",
    resultsWillAppearHere: "Les résultats apparaîtront ici",
    concentru: "Concentration",
    pitagora: "Pythagore",
    multiplicationFormula1: "pris",
    multiplicationFormula2: "groupes de",
    clearAll: "Effacer",
    openNumLitFull: "Ouvrir NumLit",
    multipliers: {
      1: "le même",
      2: "le double",
      3: "le triple",
      4: "le quadruple",
      5: "le quintuple",
      6: "le sextuple",
      7: "le septuple",
      8: "l'octuple",
      9: "le nonuple",
      10: "le décuple",
      11: "l'undécuple",
      12: "le duodécuple"
    },
    is: "est",
    taken: "pris",
    once: "une fois",
    of: "de"
  },
  de: {
    flag: "🇩🇪",
    name: "Deutsch",
    title: "Magie der Multiplikation ✨",
    subtitle: "Entdecke die Macht der Multiplikation mit magischen Stäben!",
    slogan: "Trainiere das Gehirn",
    instructions: "Wähle zwei Zahlen und entdecke das Ergebnis ihrer Multiplikation mit den Stäben:",
    selectFirstNumber: "Wähle die erste Zahl:",
    selectSecondNumber: "Wähle die zweite Zahl:",
    multiplyButton: "Multiplizieren! ✨",
    result: "Ergebnis:",
    correct: "Super! Richtige Antwort!",
    incorrect: "Versuche es nochmal!",
    backToHome: "Zurück zur Startseite",
    newGame: "Neues Spiel",
    practice: "Üben",
    explanation: "Multiplikation ist eine Operation, die uns hilft, schnell die Summe mehrerer gleicher Objektgruppen zu berechnen.",
    howToPlay: "Wie man spielt",
    howToPlayText: "Wähle Zahlen für die Multiplikation und beobachte die magische Visualisierung mit Stäben!",
    level: "Level",
    multiplicationTable: "Einmaleins",
    random: "Zufällig",
    language: "Sprache",
    progressLabel: "Fortschritt",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Validierung",
    validationSuccess: "Richtig! Gratulation!",
    congratulations: "Bravo! Richtige Antwort! 🎉",
    tryAgain: "Versuchen Sie es nochmal!",
    chooseFirstFactor: "Ersten Faktor wählen",
    chooseSecondFactor: "Zweiten Faktor wählen",
    numLitKeyboard: "NumLit Tastatur",
    delete: "Löschen",
    openNumLit: "NumLit öffnen",
    factor: "Faktor",
    product: "Produkt",
    takenTimes: "genommen",
    times: "mal",
    groupsOf: "Gruppen von",
    rods: "Elemente",
    units: "Einer",
    tens: "Zehner",
    hundreds: "Hunderter",
    thousands: "Tausender",
    findResult: "Finden Sie das Ergebnis:",
    allMultiplicationsFor: "Alle Multiplikationen für",
    newProblemGenerated: "Neues Problem generiert!",
    validateAndContinue: "Validieren und fortfahren",
    pressButtonFromTable: "Drücken Sie eine Taste aus der Tabelle",
    resultsWillAppearHere: "Die Ergebnisse werden hier angezeigt",
    concentru: "Konzentration",
    pitagora: "Pythagoras",
    multiplicationFormula1: "genommen",
    multiplicationFormula2: "Gruppen von",
    clearAll: "Löschen",
    openNumLitFull: "NumLit öffnen",
    multipliers: {
      1: "dasselbe",
      2: "das Doppelte",
      3: "das Dreifache",
      4: "das Vierfache",
      5: "das Fünffache",
      6: "das Sechsfache",
      7: "das Siebenfache",
      8: "das Achtfache",
      9: "das Neunfache",
      10: "das Zehnfache",
      11: "das Elffache",
      12: "das Zwölffache"
    },
    is: "ist",
    taken: "genommen",
    once: "einmal",
    of: "von"
  },
  es: {
    flag: "🇪🇸",
    name: "Español",
    title: "Magia de la Multiplicación ✨",
    subtitle: "¡Descubre el poder de la multiplicación con varitas mágicas!",
    slogan: "Entrena el Cerebro",
    instructions: "Elige dos números y descubre el resultado de su multiplicación con las varitas:",
    selectFirstNumber: "Elige el primer número:",
    selectSecondNumber: "Elige el segundo número:",
    multiplyButton: "¡Multiplicar! ✨",
    result: "Resultado:",
    correct: "¡Genial! ¡Respuesta correcta!",
    incorrect: "¡Inténtalo de nuevo!",
    backToHome: "Volver al Inicio",
    newGame: "Juego Nuevo",
    practice: "Practicar",
    explanation: "La multiplicación es una operación que nos ayuda a calcular rápidamente la suma de varios grupos iguales de objetos.",
    howToPlay: "Cómo jugar",
    howToPlayText: "¡Selecciona números para multiplicar y observa la visualización mágica con varitas!",
    level: "Nivel",
    multiplicationTable: "Tabla de multiplicar",
    random: "Al azar",
    language: "Idioma",
    progressLabel: "Progreso",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Validación",
    validationSuccess: "¡Correcto! ¡Felicidades!",
    congratulations: "¡Bravo! ¡Respuesta correcta! 🎉",
    tryAgain: "¡Inténtalo de nuevo!",
    chooseFirstFactor: "Elige primer factor",
    chooseSecondFactor: "Elige segundo factor",
    numLitKeyboard: "Teclado NumLit",
    delete: "Borrar",
    openNumLit: "Abrir NumLit",
    factor: "Factor",
    product: "Producto",
    takenTimes: "tomado",
    times: "veces",
    groupsOf: "grupos de",
    rods: "elementos",
    units: "Unidades", 
    tens: "Decenas",
    hundreds: "Centenas",
    thousands: "Miles",
    findResult: "Encuentra el resultado:",
    allMultiplicationsFor: "Todas las multiplicaciones para",
    newProblemGenerated: "¡Nuevo problema generado!",
    validateAndContinue: "Validar y continuar",
    pressButtonFromTable: "Presiona un botón de la tabla",
    resultsWillAppearHere: "Los resultados aparecerán aquí",
    concentru: "Concentración",
    pitagora: "Pitágoras",
    multiplicationFormula1: "tomado",
    multiplicationFormula2: "grupos de",
    clearAll: "Borrar",
    openNumLitFull: "Abrir NumLit",
    multipliers: {
      1: "lo mismo",
      2: "el doble",
      3: "el triple",
      4: "el cuádruple",
      5: "el quíntuple",
      6: "el séxtuple",
      7: "el séptuple",
      8: "el óctuple",
      9: "el nónuple",
      10: "el décuple",
      11: "el undécuple",
      12: "el duodécuple"
    },
    is: "es",
    taken: "tomado",
    once: "una vez",
    of: "de"
  },
  ru: {
    flag: "🇷🇺",
    name: "Русский",
    title: "Магия Умножения ✨",
    subtitle: "Откройте силу умножения с волшебными палочками!",
    slogan: "Тренируйте Мозг",
    instructions: "Выберите два числа и откройте результат их умножения с помощью палочек:",
    selectFirstNumber: "Выберите первое число:",
    selectSecondNumber: "Выберите второе число:",
    multiplyButton: "Умножить! ✨",
    result: "Результат:",
    correct: "Отлично! Правильный ответ!",
    incorrect: "Попробуйте еще раз!",
    backToHome: "Домой",
    newGame: "Новая Игра",
    practice: "Практиковаться",
    explanation: "Умножение - это операция, которая помогает нам быстро вычислить сумму нескольких одинаковых групп объектов.",
    howToPlay: "Как играть",
    howToPlayText: "Выберите числа для умножения и наблюдайте за волшебной визуализацией с палочками!",
    level: "Уровень",
    multiplicationTable: "Таблица умножения",
    random: "Случайно",
    language: "Язык",
    progressLabel: "Прогресс",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Проверка",
    validationSuccess: "Правильно! Поздравления!",
    congratulations: "Браво! Правильный ответ! 🎉",
    tryAgain: "Попробуйте еще раз!",
    chooseFirstFactor: "Выберите первый множитель",
    chooseSecondFactor: "Выберите второй множитель",
    numLitKeyboard: "Клавиатура NumLit",
    delete: "Удалить",
    openNumLit: "Открыть NumLit",
    factor: "Множитель",
    product: "Произведение",
    takenTimes: "взято",
    times: "раз",
    groupsOf: "групп по",
    rods: "элементы",
    units: "Единицы",
    tens: "Десятки", 
    hundreds: "Сотни",
    thousands: "Тысячи",
    findResult: "Найдите результат:",
    allMultiplicationsFor: "Все умножения для",
    newProblemGenerated: "Новая задача сгенерирована!",
    validateAndContinue: "Проверить и продолжить",
    pressButtonFromTable: "Нажмите кнопку из таблицы",
    resultsWillAppearHere: "Результаты появятся здесь",
    concentru: "Концентрация",
    pitagora: "Пифагор",
    multiplicationFormula1: "взято",
    multiplicationFormula2: "групп по",
    clearAll: "Очистить",
    openNumLitFull: "Открыть NumLit",
    multipliers: {
      1: "то же самое",
      2: "двойное",
      3: "тройное",
      4: "четырёхкратное",
      5: "пятикратное",
      6: "шестикратное",
      7: "семикратное",
      8: "восьмикратное",
      9: "девятикратное",
      10: "десятикратное",
      11: "одиннадцатикратное",
      12: "двенадцатикратное"
    },
    is: "это",
    taken: "взято",
    once: "один раз",
    of: ""
  },
  el: {
    flag: "🇬🇷",
    name: "Ελληνικά",
    title: "Μαγεία του Πολλαπλασιασμού ✨",
    subtitle: "Ανακαλύψτε τη δύναμη του πολλαπλασιασμού με μαγικές ράβδους!",
    slogan: "Εκπαιδεύστε τον Εγκέφαλο",
    instructions: "Επιλέξτε δύο αριθμούς και ανακαλύψτε το αποτέλεσμα του πολλαπλασιασμού τους με τις ράβδους:",
    selectFirstNumber: "Επιλέξτε τον πρώτο αριθμό:",
    selectSecondNumber: "Επιλέξτε τον δεύτερο αριθμό:",
    multiplyButton: "Πολλαπλασιασμός! ✨",
    result: "Αποτέλεσμα:",
    correct: "Μπράβο! Σωστή απάντηση!",
    incorrect: "Δοκιμάστε ξανά!",
    backToHome: "Επιστροφή στην Αρχική",
    newGame: "Νέο Παιχνίδι",
    practice: "Εξάσκηση",
    explanation: "Ο πολλαπλασιασμός είναι μια πράξη που μας βοηθά να υπολογίσουμε γρήγορα το άθροισμα πολλών ίσων ομάδων αντικειμένων.",
    howToPlay: "Πώς να παίξετε",
    howToPlayText: "Επιλέξτε αριθμούς για πολλαπλασιασμό και παρατηρήστε τη μαγική οπτικοποίηση με ράβδους!",
    level: "Επίπεδο",
    multiplicationTable: "Πίνακας πολλαπλασιασμού",
    random: "Τυχαία",
    language: "Γλώσσα",
    progressLabel: "Πρόοδος",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Επικύρωση",
    validationSuccess: "Σωστό! Συγχαρητήρια!",
    congratulations: "Μπράβο! Σωστή απάντηση! 🎉",
    tryAgain: "Δοκιμάστε ξανά!",
    chooseFirstFactor: "Επιλέξτε πρώτο παράγοντα",
    chooseSecondFactor: "Επιλέξτε δεύτερο παράγοντα",
    numLitKeyboard: "Πληκτρολόγιο NumLit",
    delete: "Διαγραφή",
    openNumLit: "Άνοιγμα NumLit",
    factor: "Παράγοντας",
    product: "Προϊόν",
    takenTimes: "λήφθηκε",
    times: "φορές",
    groupsOf: "ομάδες των",
    rods: "στοιχεία",
    units: "Μονάδες",
    tens: "Δεκάδες",
    hundreds: "Εκατοντάδες",
    thousands: "Χιλιάδες",
    findResult: "Βρείτε το αποτέλεσμα:",
    allMultiplicationsFor: "Όλοι οι πολλαπλασιασμοί για",
    newProblemGenerated: "Δημιουργήθηκε νέο πρόβλημα!",
    validateAndContinue: "Επικύρωση και συνέχεια",
    pressButtonFromTable: "Πατήστε ένα κουμπί από τον πίνακα",
    resultsWillAppearHere: "Τα αποτελέσματα θα εμφανιστούν εδώ",
    concentru: "Συγκέντρωση",
    pitagora: "Πυθαγόρας",
    multiplicationFormula1: "λήφθηκε",
    multiplicationFormula2: "ομάδες των",
    clearAll: "Καθαρισμός",
    openNumLitFull: "Άνοιγμα NumLit",
    multipliers: {
      1: "το ίδιο",
      2: "το διπλό",
      3: "το τριπλό",
      4: "το τετραπλό",
      5: "το πενταπλό",
      6: "το εξαπλό",
      7: "το επταπλό",
      8: "το οκταπλό",
      9: "το εννεαπλό",
      10: "το δεκαπλό",
      11: "το ενδεκαπλό",
      12: "το δωδεκαπλό"
    },
    is: "είναι",
    taken: "λήφθηκε",
    once: "μία φορά",
    of: "του"
  },
  bg: {
    flag: "🇧🇬",
    name: "Български",
    title: "Магията на Умножението ✨",
    subtitle: "Открийте силата на умножението с магически пръчки!",
    slogan: "Тренирайте Мозъка",
    instructions: "Изберете две числа и открийте резултата от тяхното умножение с пръчките:",
    selectFirstNumber: "Изберете първото число:",
    selectSecondNumber: "Изберете второто число:",
    multiplyButton: "Умножи! ✨",
    result: "Резултат:",
    correct: "Браво! Правилен отговор!",
    incorrect: "Опитайте отново!",
    backToHome: "Назад към Началото",
    newGame: "Нова Игра",
    practice: "Практикувай",
    explanation: "Умножението е операция, която ни помага да изчислим бързо сумата от няколко равни групи обекти.",
    howToPlay: "Как да играем",
    howToPlayText: "Изберете числа за умножение и наблюдавайте магическата визуализация с пръчки!",
    level: "Ниво",
    multiplicationTable: "Таблица на умножението",
    random: "Случайно",
    language: "Език",
    progressLabel: "Напредък",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Валидация",
    validationSuccess: "Правилно! Честито!",
    congratulations: "Браво! Правилен отговор! 🎉",
    tryAgain: "Опитайте отново!",
    chooseFirstFactor: "Изберете първи фактор",
    chooseSecondFactor: "Изберете втори фактор",
    numLitKeyboard: "NumLit клавиатура",
    delete: "Изтриване",
    openNumLit: "Отворете NumLit",
    factor: "Фактор",
    product: "Произведение",
    takenTimes: "взет",
    times: "пъти",
    groupsOf: "групи от",
    rods: "елементи",
    units: "Единици", 
    tens: "Десетки",
    hundreds: "Стотици",
    thousands: "Хиляди",
    findResult: "Намерете резултата:",
    allMultiplicationsFor: "Всички умножения за",
    newProblemGenerated: "Генериран нов проблем!",
    validateAndContinue: "Валидирай и продължи",
    pressButtonFromTable: "Натиснете бутон от таблицата",
    resultsWillAppearHere: "Резултатите ще се появят тук",
    concentru: "Концентрация",
    pitagora: "Питагор",
    multiplicationFormula1: "взето",
    multiplicationFormula2: "групи от", 
    clearAll: "Изчисти",
    openNumLitFull: "Отвори NumLit",
    multipliers: {
      1: "същото",
      2: "двойното",
      3: "тройното",
      4: "четворното",
      5: "петорното",
      6: "шесторното",
      7: "седморното",
      8: "осморното",
      9: "деветорното",
      10: "десетократното",
      11: "единадесеторното",
      12: "дванадесетократното"
    },
    is: "е",
    taken: "взето",
    once: "веднъж",
    of: "на"
  },
  ar: {
    flag: "🇸🇦",
    name: "العربية",
    title: "سحر الضرب ✨",
    subtitle: "اكتشف قوة الضرب بالعصي السحرية!",
    slogan: "درب العقل",
    instructions: "اختر رقمين واكتشف نتيجة ضربهما باستخدام العصي:",
    selectFirstNumber: "اختر الرقم الأول:",
    selectSecondNumber: "اختر الرقم الثاني:",
    multiplyButton: "اضرب! ✨",
    result: "النتيجة:",
    correct: "رائع! إجابة صحيحة!",
    incorrect: "حاول مرة أخرى!",
    backToHome: "العودة للصفحة الرئيسية",
    newGame: "لعبة جديدة",
    practice: "تدرب",
    explanation: "الضرب هو عملية تساعدنا في حساب مجموع عدة مجموعات متساوية من الأشياء بسرعة.",
    howToPlay: "كيف تلعب",
    howToPlayText: "اختر الأرقام للضرب واراقب التصور السحري بالعصي!",
    level: "المستوى",
    multiplicationTable: "جدول الضرب",
    random: "عشوائي",
    language: "اللغة",
    progressLabel: "التقدم",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "التحقق",
    validationSuccess: "صحيح! تهانينا!",
    congratulations: "رائع! إجابة صحيحة! 🎉",
    tryAgain: "حاول مرة أخرى!",
    chooseFirstFactor: "اختر العامل الأول",
    chooseSecondFactor: "اختر العامل الثاني",
    numLitKeyboard: "لوحة مفاتيح NumLit",
    delete: "حذف",
    openNumLit: "افتح NumLit",
    factor: "عامل",
    product: "منتج",
    takenTimes: "مأخوذ",
    times: "مرات",
    groupsOf: "مجموعات من",
    rods: "عناصر",
    units: "آحاد",
    tens: "عشرات", 
    hundreds: "مئات",
    thousands: "آلاف",
    findResult: "ابحث عن النتيجة:",
    allMultiplicationsFor: "جميع الضربات لـ",
    newProblemGenerated: "تم إنشاء مشكلة جديدة!",
    validateAndContinue: "تحقق واستمر",
    pressButtonFromTable: "اضغط على زر من الجدول",
    resultsWillAppearHere: "ستظهر النتائج هنا",
    concentru: "التركيز",
    pitagora: "فيثاغورس",
    multiplicationFormula1: "مأخوذ",
    multiplicationFormula2: "مجموعات من",
    clearAll: "مسح",
    openNumLitFull: "افتح NumLit",
    multipliers: {
      1: "نفس",
      2: "ضعف",
      3: "ثلاثة أضعاف",
      4: "أربعة أضعاف",
      5: "خمسة أضعاف",
      6: "ستة أضعاف",
      7: "سبعة أضعاف",
      8: "ثمانية أضعاف",
      9: "تسعة أضعاف",
      10: "عشرة أضعاف",
      11: "أحد عشر ضعفاً",
      12: "اثنا عشر ضعفاً"
    },
    is: "هو",
    taken: "مأخوذ",
    once: "مرة واحدة",
    of: ""
  },
  pl: {
    flag: "🇵🇱",
    name: "Polski",
    title: "Magia Mnożenia ✨",
    subtitle: "Odkryj siłę mnożenia z magicznymi pałeczkami!",
    slogan: "Trenuj Mózg",
    instructions: "Wybierz dwie liczby i odkryj wynik ich mnożenia za pomocą pałeczek:",
    selectFirstNumber: "Wybierz pierwszą liczbę:",
    selectSecondNumber: "Wybierz drugą liczbę:",
    multiplyButton: "Pomnóż! ✨",
    result: "Wynik:",
    correct: "Świetnie! Poprawna odpowiedź!",
    incorrect: "Spróbuj ponownie!",
    backToHome: "Powrót do Domu",
    newGame: "Nowa Gra",
    practice: "Ćwicz",
    explanation: "Mnożenie to operacja, która pomaga nam szybko obliczyć sumę kilku równych grup obiektów.",
    howToPlay: "Jak grać",
    howToPlayText: "Wybierz liczby do mnożenia i obserwuj magiczną wizualizację z pałeczkami!",
    level: "Poziom",
    multiplicationTable: "Tabliczka mnożenia",
    random: "Losowo",
    language: "Język",
    progressLabel: "Postęp",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Walidacja",
    validationSuccess: "Poprawne! Gratulacje!",
    congratulations: "Świetnie! Poprawna odpowiedź! 🎉",
    tryAgain: "Spróbuj ponownie!",
    chooseFirstFactor: "Wybierz pierwszy czynnik",
    chooseSecondFactor: "Wybierz drugi czynnik",
    numLitKeyboard: "Klawiatura NumLit",
    delete: "Usuń",
    openNumLit: "Otwórz NumLit",
    factor: "Czynnik",
    product: "Iloczyn",
    takenTimes: "wzięte",
    times: "razy",
    groupsOf: "grupy po",
    rods: "elementy",
    units: "Jedności",
    tens: "Dziesiątki",
    hundreds: "Setki",
    thousands: "Tysiące",
    findResult: "Znajdź wynik:",
    allMultiplicationsFor: "Wszystkie mnożenia dla",
    newProblemGenerated: "Wygenerowano nowy problem!",
    validateAndContinue: "Sprawdź i kontynuuj",
    pressButtonFromTable: "Naciśnij przycisk z tabeli",
    resultsWillAppearHere: "Wyniki pojawią się tutaj",
    concentru: "Koncentracja",
    pitagora: "Pitagoras",
    multiplicationFormula1: "wzięte",
    multiplicationFormula2: "grupy po",
    clearAll: "Wyczyść",
    openNumLitFull: "Otwórz NumLit",
    multipliers: {
      1: "to samo",
      2: "dwukrotność",
      3: "trzykrotność",
      4: "czterokrotność",
      5: "pięciokrotność",
      6: "sześciokrotność",
      7: "siedmiokrotność",
      8: "ośmiokrotność",
      9: "dziewięciokrotność",
      10: "dziesięciokrotność",
      11: "jedenastokrotność",
      12: "dwunastokrotność"
    },
    is: "to",
    taken: "wzięte",
    once: "raz",
    of: ""
  },
  cs: {
    flag: "🇨🇿",
    name: "Čeština",
    title: "Kouzlo Násobení ✨",
    subtitle: "Objevte sílu násobení s magickými tyčkami!",
    slogan: "Trénujte Mozek",
    instructions: "Vyberte dvě čísla a objevte výsledek jejich násobení pomocí tyček:",
    selectFirstNumber: "Vyberte první číslo:",
    selectSecondNumber: "Vyberte druhé číslo:",
    multiplyButton: "Násobit! ✨",
    result: "Výsledek:",
    correct: "Skvěle! Správná odpověď!",
    incorrect: "Zkuste to znovu!",
    backToHome: "Zpět Domů",
    newGame: "Nová Hra",
    practice: "Cvičit",
    explanation: "Násobení je operace, která nám pomáhá rychle spočítat součet několika stejných skupin objektů.",
    howToPlay: "Jak hrát",
    howToPlayText: "Vyberte čísla pro násobení a pozorujte magickou vizualizaci s tyčkami!",
    level: "Úroveň",
    multiplicationTable: "Tabulka násobení",
    random: "Náhodně",
    language: "Jazyk",
    progressLabel: "Pokrok",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Ověření",
    validationSuccess: "Správně! Blahopřejeme!",
    congratulations: "Skvěle! Správná odpověď! 🎉",
    tryAgain: "Zkuste to znovu!",
    chooseFirstFactor: "Vyberte první činitel",
    chooseSecondFactor: "Vyberte druhý činitel",
    numLitKeyboard: "Klávesnice NumLit",
    delete: "Smazat",
    openNumLit: "Otevřít NumLit",
    factor: "Činitel",
    product: "Součin",
    takenTimes: "vzat",
    times: "krát",
    groupsOf: "skupiny po",
    rods: "prvky",
    units: "Jednotky",
    tens: "Desítky",
    hundreds: "Stovky", 
    thousands: "Tisíce",
    findResult: "Najděte výsledek:",
    allMultiplicationsFor: "Všechna násobení pro",
    newProblemGenerated: "Vygenerován nový problém!",
    validateAndContinue: "Ověřit a pokračovat",
    pressButtonFromTable: "Stiskněte tlačítko z tabulky",
    resultsWillAppearHere: "Výsledky se zobrazí zde",
    concentru: "Koncentrace",
    pitagora: "Pythagoras",
    multiplicationFormula1: "vzat",
    multiplicationFormula2: "skupiny po",
    clearAll: "Vymazat", 
    openNumLitFull: "Otevřít NumLit",
    multipliers: {
      1: "stejné",
      2: "dvojnásobek",
      3: "trojnásobek",
      4: "čtyřnásobek",
      5: "pětinásobek",
      6: "šestinásobek",
      7: "sedminásobek",
      8: "osminásobek",
      9: "devítinásobek",
      10: "desítinásobek",
      11: "jedenáctinásobek",
      12: "dvanáctinásobek"
    },
    is: "je",
    taken: "vzat",
    once: "jednou",
    of: ""
  },
  it: {
    flag: "🇮🇹",
    name: "Italiano",
    title: "Magia della Moltiplicazione ✨",
    subtitle: "Scopri il potere della moltiplicazione con bacchette magiche!",
    slogan: "Allena il Cervello",
    instructions: "Scegli due numeri e scopri il risultato della loro moltiplicazione con le bacchette:",
    selectFirstNumber: "Scegli il primo numero:",
    selectSecondNumber: "Scegli il secondo numero:",
    multiplyButton: "Moltiplica! ✨",
    result: "Risultato:",
    correct: "Ottimo! Risposta corretta!",
    incorrect: "Prova ancora!",
    backToHome: "Torna a Casa",
    newGame: "Nuovo Gioco",
    practice: "Esercitati",
    explanation: "La moltiplicazione è un'operazione che ci aiuta a calcolare rapidamente la somma di più gruppi uguali di oggetti.",
    howToPlay: "Come giocare",
    howToPlayText: "Seleziona i numeri per la moltiplicazione e osserva la visualizzazione magica con le bacchette!",
    level: "Livello",
    multiplicationTable: "Tavola pitagorica",
    random: "Casuale",
    language: "Lingua",
    progressLabel: "Progresso",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Convalida",
    validationSuccess: "Corretto! Congratulazioni!",
    congratulations: "Ottimo! Risposta corretta! 🎉",
    tryAgain: "Prova ancora!",
    chooseFirstFactor: "Scegli primo fattore",
    chooseSecondFactor: "Scegli secondo fattore",
    numLitKeyboard: "Tastiera NumLit",
    delete: "Elimina",
    openNumLit: "Apri NumLit",
    factor: "Fattore",
    product: "Prodotto",
    takenTimes: "preso",
    times: "volte",
    groupsOf: "gruppi di",
    rods: "elementi",
    units: "Unità",
    tens: "Decine",
    hundreds: "Centinaia",
    thousands: "Migliaia", 
    findResult: "Trova il risultato:",
    allMultiplicationsFor: "Tutte le moltiplicazioni per",
    newProblemGenerated: "Nuovo problema generato!",
    validateAndContinue: "Convalida e continua",
    pressButtonFromTable: "Premi un pulsante dalla tabella",
    resultsWillAppearHere: "I risultati appariranno qui",
    concentru: "Concentrazione",
    pitagora: "Pitagora",
    multiplicationFormula1: "preso",
    multiplicationFormula2: "gruppi di",
    clearAll: "Cancella",
    openNumLitFull: "Apri NumLit",
    multipliers: {
      1: "lo stesso",
      2: "il doppio",
      3: "il triplo",
      4: "il quadruplo",
      5: "il quintuplo",
      6: "il sestuplo",
      7: "il settuplo",
      8: "l'ottuplo",
      9: "il nonuplo",
      10: "il decuplo",
      11: "l'undecuplo",
      12: "il duodecuplo"
    },
    is: "è",
    taken: "preso",
    once: "una volta",
    of: "di"
  },
  pt: {
    flag: "🇵🇹",
    name: "Português",
    title: "Magia da Multiplicação ✨",
    subtitle: "Descubra o poder da multiplicação com varinhas mágicas!",
    slogan: "Treine o Cérebro",
    instructions: "Escolha dois números e descubra o resultado da sua multiplicação com as varinhas:",
    selectFirstNumber: "Escolha o primeiro número:",
    selectSecondNumber: "Escolha o segundo número:",
    multiplyButton: "Multiplicar! ✨",
    result: "Resultado:",
    correct: "Ótimo! Resposta correta!",
    incorrect: "Tente novamente!",
    backToHome: "Voltar ao Início",
    newGame: "Novo Jogo",
    practice: "Praticar",
    explanation: "A multiplicação é uma operação que nos ajuda a calcular rapidamente a soma de vários grupos iguais de objetos.",
    howToPlay: "Como jogar",
    howToPlayText: "Selecione números para multiplicação e observe a visualização mágica com varinhas!",
    level: "Nível",
    multiplicationTable: "Tabuada",
    random: "Aleatório",
    language: "Idioma",
    progressLabel: "Progresso",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Validação",
    validationSuccess: "Correto! Parabéns!",
    congratulations: "Ótimo! Resposta correta! 🎉",
    tryAgain: "Tente novamente!",
    chooseFirstFactor: "Escolha primeiro fator",
    chooseSecondFactor: "Escolha segundo fator",
    numLitKeyboard: "Teclado NumLit",
    delete: "Excluir",
    openNumLit: "Abrir NumLit",
    factor: "Fator",
    product: "Produto",
    takenTimes: "tomado",
    times: "vezes",
    groupsOf: "grupos de",
    rods: "elementos",
    units: "Unidades",
    tens: "Dezenas", 
    hundreds: "Centenas",
    thousands: "Milhares",
    findResult: "Encontre o resultado:",
    allMultiplicationsFor: "Todas as multiplicações para",
    newProblemGenerated: "Novo problema gerado!",
    validateAndContinue: "Validar e continuar",
    pressButtonFromTable: "Pressione um botão da tabela",
    resultsWillAppearHere: "Os resultados aparecerão aqui",
    concentru: "Concentração",
    pitagora: "Pitágoras",
    multiplicationFormula1: "tomado",
    multiplicationFormula2: "grupos de",
    clearAll: "Limpar",
    openNumLitFull: "Abrir NumLit",
    multipliers: {
      1: "o mesmo",
      2: "o dobro",
      3: "o triplo",
      4: "o quádruplo",
      5: "o quíntuplo",
      6: "o sêxtuplo",
      7: "o séptuplo",
      8: "o óctuplo",
      9: "o nónuplo",
      10: "o décuplo",
      11: "o undécuplo",
      12: "o duodécuplo"
    },
    is: "é",
    taken: "tomado",
    once: "uma vez",
    of: "de"
  },
  hu: {
    flag: "🇭🇺",
    name: "Magyar",
    title: "A Szorzás Mágiája ✨",
    subtitle: "Fedezd fel a szorzás erejét varázspálcákkal!",
    slogan: "Eddzük az Agyat",
    instructions: "Válassz két számot és fedezd fel a szorzás eredményét a pálcákkal:",
    selectFirstNumber: "Válaszd ki az első számot:",
    selectSecondNumber: "Válaszd ki a második számot:",
    multiplyButton: "Szorozzunk! ✨",
    result: "Eredmény:",
    correct: "Nagyszerű! Helyes válasz!",
    incorrect: "Próbáld újra!",
    backToHome: "Vissza a Főoldalra",
    newGame: "Új Játék",
    practice: "Gyakorlás",
    explanation: "A szorzás egy művelet, amely segít gyorsan kiszámítani több egyenlő csoport összegét.",
    howToPlay: "Hogyan játsszunk",
    howToPlayText: "Válassz számokat a szorzáshoz és figyeld a varázslatos vizualizációt pálcákkal!",
    level: "Szint",
    multiplicationTable: "Szorzótábla",
    random: "Véletlenszerű",
    language: "Nyelv",
    progressLabel: "Haladás",
    levels: {
      beginner: "1",
      easy: "2", 
      medium: "3",
      hard: "4"
    },
    validation: "Ellenőrzés",
    validationSuccess: "Helyes! Gratulálunk!",
    congratulations: "Szuper! Helyes válasz! 🎉",
    tryAgain: "Próbáld újra!",
    chooseFirstFactor: "Válaszd ki az első tényezőt",
    chooseSecondFactor: "Válaszd ki a második tényezőt",
    numLitKeyboard: "NumLit Billentyűzet",
    delete: "Törlés",
    openNumLit: "NumLit Megnyitása",
    factor: "Tényező",
    product: "Szorzat",
    takenTimes: "vett",
    times: "szer",
    groupsOf: "csoport",
    rods: "elem",
    units: "Egyesek",
    tens: "Tízesek",
    hundreds: "Százasok",
    thousands: "Ezresek",
    findResult: "Találd meg az eredményt:",
    allMultiplicationsFor: "Összes szorzás ehhez:",
    newProblemGenerated: "Új feladat generálva!",
    validateAndContinue: "Ellenőrizd és folytasd",
    pressButtonFromTable: "Nyomj meg egy gombot a táblázatból",
    resultsWillAppearHere: "Az eredmények itt fognak megjelenni",
    concentru: "Koncentráció",
    pitagora: "Pitagorasz",
    multiplicationFormula1: "vett",
    multiplicationFormula2: "csoport",
    clearAll: "Törlés",
    openNumLitFull: "NumLit Megnyitása",
    multipliers: {
      1: "ugyanaz",
      2: "kétszer",
      3: "háromszor",
      4: "négyszer", 
      5: "ötször",
      6: "hatszor",
      7: "hétszer",
      8: "nyolcszor",
      9: "kilencszer",
      10: "tízszer",
      11: "tizenegyszer",
      12: "tizenkétszer"
    },
    is: "az",
    taken: "vett",
    once: "egyszer",
    of: ""
  },
  tr: {
    flag: "🇹🇷",
    name: "Türkçe",
    title: "Çarpımın Büyüsü ✨",
    subtitle: "Sihirli çubuklar ile çarpmanın gücünü keşfedin!",
    slogan: "Beyni Eğit",
    instructions: "İki sayı seçin ve çubukları kullanarak çarpma sonucunu keşfedin:",
    selectFirstNumber: "İlk sayıyı seçin:",
    selectSecondNumber: "İkinci sayıyı seçin:",
    multiplyButton: "Çarp! ✨",
    result: "Sonuç:",
    correct: "Harika! Doğru cevap!",
    incorrect: "Tekrar deneyin!",
    backToHome: "Ana Sayfaya Dön",
    newGame: "Yeni Oyun",
    practice: "Alıştırma",
    explanation: "Çarpma, birden fazla eşit nesne grubunun toplamını hızlıca hesaplamamıza yardımcı olan bir işlemdir.",
    howToPlay: "Nasıl Oynanır",
    howToPlayText: "Çarpma için sayıları seçin ve çubuklar ile sihirli görselleştirmeyi izleyin!",
    level: "Seviye",
    multiplicationTable: "Çarpım tablosu",
    random: "Rastgele",
    language: "Dil",
    progressLabel: "İlerleme",
    levels: {
      beginner: "1",
      easy: "2",
      medium: "3",
      hard: "4"
    },
    validation: "Doğrulama",
    validationSuccess: "Doğru! Tebrikler!",
    congratulations: "Harika! Doğru cevap! 🎉",
    tryAgain: "Tekrar deneyin!",
    chooseFirstFactor: "İlk çarpanı seçin",
    chooseSecondFactor: "İkinci çarpanı seçin",
    numLitKeyboard: "NumLit Klavyesi",
    delete: "Sil",
    openNumLit: "NumLit'i Aç",
    factor: "Çarpan",
    product: "Çarpım",
    takenTimes: "alındı",
    times: "kez",
    groupsOf: "grup",
    rods: "öğe",
    units: "Birler",
    tens: "Onlar",
    hundreds: "Yüzler",
    thousands: "Binler",
    findResult: "Sonucu bulun:",
    allMultiplicationsFor: "Tüm çarpımlar:",
    newProblemGenerated: "Yeni problem oluşturuldu!",
    validateAndContinue: "Doğrula ve devam et",
    pressButtonFromTable: "Tablodan bir düğmeye basın",
    resultsWillAppearHere: "Sonuçlar burada görünecek",
    concentru: "Konsantrasyon",
    pitagora: "Pisagor",
    multiplicationFormula1: "alındı",
    multiplicationFormula2: "grup",
    clearAll: "Temizle",
    openNumLitFull: "NumLit'i Aç",
    multipliers: {
      1: "aynı",
      2: "iki katı",
      3: "üç katı",
      4: "dört katı",
      5: "beş katı",
      6: "altı katı",
      7: "yedi katı",
      8: "sekiz katı",
      9: "dokuz katı",
      10: "on katı",
      11: "on bir katı",
      12: "on iki katı"
    },
    is: "dir",
    taken: "alındı",
    once: "bir kez",
    of: ""
  }
};

// Function to generate dynamic multiplication phrases
const generateMultiplicationPhrase = (factor1: number, factor2: number, t: any) => {
  const multiplier = t.multipliers[factor2];
  if (!multiplier) return `${factor1} ${t.taken} ${factor2} ${t.times}`;
  
  // Special logic for Romanian to use "DE" instead of "lui"
  if (t.of === "DE") {
    return `${factor1} ${t.taken} ${t.of} ${factor2} ${t.times} ${t.is} ${multiplier} ${t.of === "DE" ? "lui" : t.of} ${factor1}`;
  }
  
  return `${factor1} ${t.taken} ${t.of ? t.of + ' ' : ''}${factor2} ${t.times} ${t.is} ${multiplier}${t.of ? ' ' + t.of + ' ' : ' '}${factor1}`;
};

export default function MagiaInmultirii() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof languages>("ro");
  const [firstNumber, setFirstNumber] = useState<number>(2);
  const [secondNumber, setSecondNumber] = useState<number>(3);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [totalExercises] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const [editableResult, setEditableResult] = useState<string>("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number>(0);
  
  // New states for addition boxes
  const [leftAdditionResults, setLeftAdditionResults] = useState<string[]>([]);
  const [rightAdditionResults, setRightAdditionResults] = useState<string[]>([]);
  const [activeAdditionBox, setActiveAdditionBox] = useState<{zone: 'left' | 'right' | 'main', index: number} | null>(null);

  const t = languages[selectedLanguage] || languages.ro;
  const correctResult = firstNumber * secondNumber;

  // Helper function to check if editableResult is complete
  const isResultComplete = () => {
    return editableResult.length > 0 && !editableResult.includes('?');
  };

  const handleKeyboardInput = (value: string) => {
    if (value === 'backspace' || value === '⌫') {
      if (activeAdditionBox) {
        // Handle backspace for addition boxes - remove last digit from fixed position
        if (activeAdditionBox.zone === 'left') {
          const newResults = [...leftAdditionResults];
          const currentValue = newResults[activeAdditionBox.index] || '';
          if (currentValue.length > 0) {
            newResults[activeAdditionBox.index] = currentValue.slice(0, -1);
          }
          setLeftAdditionResults(newResults);
        } else if (activeAdditionBox.zone === 'right') {
          const newResults = [...rightAdditionResults];
          const currentValue = newResults[activeAdditionBox.index] || '';
          if (currentValue.length > 0) {
            newResults[activeAdditionBox.index] = currentValue.slice(0, -1);
          }
          setRightAdditionResults(newResults);
        }
      } else {
        // Handle backspace for main result - clear current active position
        const newResult = editableResult.split('');
        if (activeDigitIndex >= 0 && activeDigitIndex < newResult.length) {
          newResult[activeDigitIndex] = '?';
          setEditableResult(newResult.join(''));
        }
      }
    } else if (value === 'clear') {
      if (activeAdditionBox) {
        // Clear all addition results
        if (activeAdditionBox.zone === 'left') {
          setLeftAdditionResults(Array(firstNumber - 1).fill(''));
        } else if (activeAdditionBox.zone === 'right') {
          setRightAdditionResults(Array(secondNumber - 1).fill(''));
        }
      } else {
        // Clear main result
        const digitCount = correctResult.toString().length;
        setEditableResult("?".repeat(digitCount));
        setActiveDigitIndex(0);
      }
    } else if (value === 'validate' || value === '✓') {
      setShowKeyboard(false);
      // Check if result is correct
      if (activeAdditionBox) {
        // Validate addition results
        let isCorrect = false;
        if (activeAdditionBox.zone === 'left') {
          const expectedValue = secondNumber * (activeAdditionBox.index + 2);
          isCorrect = leftAdditionResults[activeAdditionBox.index] === expectedValue.toString();
        } else if (activeAdditionBox.zone === 'right') {
          const expectedValue = firstNumber * (activeAdditionBox.index + 2);
          isCorrect = rightAdditionResults[activeAdditionBox.index] === expectedValue.toString();
        }
        if (isCorrect) {
          toast.success(t.validationSuccess);
        } else {
          toast.error(t.tryAgain);
        }
      } else {
        if (editableResult === correctResult.toString()) {
          toast.success(t.validationSuccess);
        } else {
          toast.error(t.tryAgain);
        }
      }
    } else if (/^\d$/.test(value)) {
      if (activeAdditionBox) {
        // Handle digit input for addition boxes - fixed position input
        if (activeAdditionBox.zone === 'left') {
          const newResults = [...leftAdditionResults];
          const currentValue = newResults[activeAdditionBox.index] || '';
          // Limit to 3 digits max, add to right (units position)
          if (currentValue.length < 3) {
            newResults[activeAdditionBox.index] = currentValue + value;
          }
          setLeftAdditionResults(newResults);
        } else if (activeAdditionBox.zone === 'right') {
          const newResults = [...rightAdditionResults];
          const currentValue = newResults[activeAdditionBox.index] || '';
          // Limit to 3 digits max, add to right (units position)
          if (currentValue.length < 3) {
            newResults[activeAdditionBox.index] = currentValue + value;
          }
          setRightAdditionResults(newResults);
        }
      } else {
        // Handle digit input for main result - place in specific position (fixed position)
        const newResult = editableResult.split('');
        if (activeDigitIndex >= 0 && activeDigitIndex < newResult.length) {
          newResult[activeDigitIndex] = value;
          setEditableResult(newResult.join(''));
          // Don't auto-move to next position, stay in current position for fixed entry
        }
      }
    }
  };


  const getPlaceValueName = (position: number): string => {
    const names = [t.units, t.tens, t.hundreds, t.thousands];
    return names[position] || '';
  };

  // Handle direct keyboard input for physical keyboard
  const handleDirectKeyInput = (e: React.KeyboardEvent, boxType: 'main' | 'left' | 'right', boxIndex?: number) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
      e.preventDefault();
      if (boxType === 'main') {
        // Main result box - place digit in active position
        const newResult = editableResult.split('');
        if (activeDigitIndex >= 0 && activeDigitIndex < newResult.length) {
          newResult[activeDigitIndex] = key;
          setEditableResult(newResult.join(''));
        }
      } else if (boxType === 'left' && boxIndex !== undefined) {
        // Left addition box - append digit
        const newResults = [...leftAdditionResults];
        const currentValue = newResults[boxIndex] || '';
        if (currentValue.length < 3) {
          newResults[boxIndex] = currentValue + key;
          setLeftAdditionResults(newResults);
        }
      } else if (boxType === 'right' && boxIndex !== undefined) {
        // Right addition box - append digit
        const newResults = [...rightAdditionResults];
        const currentValue = newResults[boxIndex] || '';
        if (currentValue.length < 3) {
          newResults[boxIndex] = currentValue + key;
          setRightAdditionResults(newResults);
        }
      }
    } else if (key === 'Backspace') {
      e.preventDefault();
      if (boxType === 'main') {
        // Clear current position
        const newResult = editableResult.split('');
        if (activeDigitIndex >= 0 && activeDigitIndex < newResult.length) {
          newResult[activeDigitIndex] = '?';
          setEditableResult(newResult.join(''));
        }
      } else if (boxType === 'left' && boxIndex !== undefined) {
        // Remove last digit from left addition box
        const newResults = [...leftAdditionResults];
        const currentValue = newResults[boxIndex] || '';
        if (currentValue.length > 0) {
          newResults[boxIndex] = currentValue.slice(0, -1);
        }
        setLeftAdditionResults(newResults);
      } else if (boxType === 'right' && boxIndex !== undefined) {
        // Remove last digit from right addition box
        const newResults = [...rightAdditionResults];
        const currentValue = newResults[boxIndex] || '';
        if (currentValue.length > 0) {
          newResults[boxIndex] = currentValue.slice(0, -1);
        }
        setRightAdditionResults(newResults);
      }
    } else if (key === 'ArrowLeft' && boxType === 'main') {
      e.preventDefault();
      if (activeDigitIndex > 0) {
        setActiveDigitIndex(activeDigitIndex - 1);
      }
    } else if (key === 'ArrowRight' && boxType === 'main') {
      e.preventDefault();
      if (activeDigitIndex < editableResult.length - 1) {
        setActiveDigitIndex(activeDigitIndex + 1);
      }
    } else if (key === 'Tab') {
      e.preventDefault();
      if (boxType === 'main') {
        // Move to next digit position
        const nextIndex = activeDigitIndex + 1;
        if (nextIndex < editableResult.length) {
          setActiveDigitIndex(nextIndex);
        } else {
          setActiveDigitIndex(0); // Wrap to beginning
        }
      }
    }
  };

  const renderDigitBoxes = (number: number) => {
    console.log('renderDigitBoxes called with:', number);
    const digits = number.toString().split('');
    const digitCount = digits.length;
    
    // Initialize editable result if not set
    if (editableResult === "") {
      setEditableResult("?".repeat(digitCount));
    }

    const handleDigitClick = (index: number) => {
      setActiveDigitIndex(index);
      setActiveAdditionBox({zone: 'main', index});
    };
    
    return (
      <div className="flex items-end gap-2">
        {digits.map((digit, index) => {
          const digitValue = parseInt(digit);
          const isEven = digitValue % 2 === 0;
          const position = digits.length - 1 - index; // Position from right (0=units, 1=tens, etc.)
          const displayDigit = showResult ? digit : (editableResult[index] || '?');
          const isActive = activeDigitIndex === index;
          
          console.log(`Digit ${digit} at position ${position}, isEven: ${isEven}`);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`border-2 ${
                  isEven 
                    ? 'border-red-400 bg-red-100 text-red-600' 
                    : 'border-blue-400 bg-blue-100 text-blue-600'
                } ${isActive ? 'ring-4 ring-yellow-400' : ''} rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all`}
                style={{ width: '5.5rem', height: '5.5rem' }}
                onClick={() => handleDigitClick(index)}
                onKeyDown={(e) => handleDirectKeyInput(e, 'main')}
                tabIndex={0}
                role="textbox"
                aria-label={`${getPlaceValueName(position)} digit input`}
              >
                <span className="text-8xl font-bold">{displayDigit}</span>
              </div>
              <div className="text-xl text-gray-600 mt-2 text-center min-w-[80px] font-semibold">
                {getPlaceValueName(position)}
              </div>
            </div>
          );
        })}
        
      </div>
    );
  };

  const handleMultiply = () => {
    setShowResult(true);
    setGameStarted(true);
    // Reset editable result for new calculation
    const digitCount = correctResult.toString().length;
    setEditableResult("?".repeat(digitCount));
    setActiveDigitIndex(0);
    toast.success(t.correct, {
      description: `${firstNumber} × ${secondNumber} = ${correctResult}`,
      duration: 3000,
    });
  };

  const generateNewMultiplication = () => {
    if (selectedTable === "random") {
      // Pe sărite - choose 2 random factors from 1-10 (limited for this level)
      setFirstNumber(Math.floor(Math.random() * 10) + 1);
      setSecondNumber(Math.floor(Math.random() * 10) + 1);
    } else if (selectedTable) {
      // Specific multiplication table - one factor is the table number (max 10), other is random (1-10)
      const tableNumber = Math.min(parseInt(selectedTable), 10); // Limit to 10
      const randomFactor = Math.floor(Math.random() * 10) + 1; // Limit to 10
      
      // Randomly decide which position gets the table number
      if (Math.random() < 0.5) {
        setFirstNumber(tableNumber);
        setSecondNumber(randomFactor);
      } else {
        setFirstNumber(randomFactor);
        setSecondNumber(tableNumber);
      }
    } else {
      // Default - random numbers from 1-10 (updated from 1-9)
      setFirstNumber(Math.floor(Math.random() * 10) + 1);
      setSecondNumber(Math.floor(Math.random() * 10) + 1);
    }
  };

  const handleNewGame = () => {
    generateNewMultiplication();
    setShowResult(false);
    setUserAnswer(null);
    setGameStarted(false);
    setEditableResult("");
    setActiveDigitIndex(0);
    setShowKeyboard(false);
    setLeftAdditionResults([]);
    setRightAdditionResults([]);
    setActiveAdditionBox(null);
  };

  // Update editable result when numbers change
  useEffect(() => {
    const digitCount = correctResult.toString().length;
    setEditableResult("?".repeat(digitCount));
    setActiveDigitIndex(0);
    // Initialize addition result arrays
    setLeftAdditionResults(Array(firstNumber - 1).fill(''));
    setRightAdditionResults(Array(secondNumber - 1).fill(''));
    setActiveAdditionBox(null);
  }, [firstNumber, secondNumber]);

  const handlePlay = () => {
    setIsGamePlaying(true);
    setIsTimerRunning(true);
  };

  const handlePause = () => {
    setIsGamePlaying(false);
    setIsTimerRunning(false);
  };

  const handleShuffle = () => {
    handleNewGame();
  };

  const handleNextExercise = () => {
    if (currentExercise < totalExercises) {
      setCurrentExercise(prev => prev + 1);
      handleNewGame();
    }
  };

  useEffect(() => {
    if (showResult && currentExercise < totalExercises) {
      const timer = setTimeout(() => {
        handleNextExercise();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult, currentExercise, totalExercises]);

  const renderSidebar = () => (
    <Sidebar className="w-48">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-primary">
            {t.title}
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="space-y-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    {t.backToHome}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Language Selector */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
              <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                <div className="text-sm font-bold text-green-600 text-center">
                  {t.language}
                </div>
              </div>
              <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof languages)}>
                <SelectTrigger className="h-6 text-xs border-green-300 focus:border-green-500">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {t.flag} {t.name}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {Object.entries(languages)
                    .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                    .map(([code, lang]) => (
                    <SelectItem key={code} value={code}>
                      <span className="flex items-center gap-2">
                        {lang.flag} {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Selector */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-1">
              <div className="bg-white border-2 border-purple-400 rounded-lg p-1 mb-1">
                <div className="text-sm font-bold text-purple-600 text-center">
                  {t.level}
                </div>
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-white border h-6 text-xs border-purple-300 focus:border-purple-500 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="beginner">1</SelectItem>
                  <SelectItem value="easy">2</SelectItem>
                  <SelectItem value="medium">3</SelectItem>
                  <SelectItem value="hard">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multiplication Table Selector */}
            <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-1">
              <div className="bg-white border-2 border-pink-400 rounded-lg p-1 mb-1">
                <div className="text-sm font-bold text-pink-600 text-center">
                  {t.multiplicationTable}
                </div>
              </div>
              <Select value={selectedTable || ""} onValueChange={setSelectedTable}>
                <SelectTrigger className="h-6 text-xs border-pink-300 focus:border-pink-500">
                  <SelectValue placeholder={t.multiplicationTable} />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="random">{t.random}</SelectItem>
                  {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {t.multiplicationTable} {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructions */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Info className="mr-2 h-4 w-4" />
                  {t.howToPlay}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.howToPlay}</DialogTitle>
                  <DialogDescription>
                    {t.howToPlayText}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Shop Promo Stamp */}
        <SidebarGroup>
          <SidebarGroupContent className="p-2">
            <div className="transform scale-75 origin-center">
              <ShopPromoBox language={selectedLanguage} />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  const renderBottomSelector = () => {
    const isCorrect = editableResult === correctResult.toString();
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4">
        <div className="max-w-7xl mx-auto flex gap-3">
          {/* First Factor Selector - Compact */}
          <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200 w-48 flex-shrink-0">
            <p className="text-xs font-medium text-center mb-2">{t.chooseFirstFactor}</p>
            <div className="bg-white rounded-lg border-2 border-blue-300 h-16 flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-blue-600">{firstNumber}</span>
            </div>
            <Select value={firstNumber.toString()} onValueChange={(value) => {
              setFirstNumber(parseInt(value));
              setShowResult(false);
              setGameStarted(false);
              // Reset the result when factor changes
              const newCorrectResult = parseInt(value) * secondNumber;
              const digitCount = newCorrectResult.toString().length;
              setEditableResult("?".repeat(digitCount));
              setActiveDigitIndex(0);
            }}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
               <SelectContent>
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                   <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>
          
          {/* Second Factor Selector - Compact */}
          <div className="bg-orange-50 rounded-xl p-3 border-2 border-orange-200 w-48 flex-shrink-0">
            <p className="text-xs font-medium text-center mb-2">{t.chooseSecondFactor}</p>
            <div className="bg-white rounded-lg border-2 border-orange-300 h-16 flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-orange-600">{secondNumber}</span>
            </div>
            <Select value={secondNumber.toString()} onValueChange={(value) => {
              setSecondNumber(parseInt(value));
              setShowResult(false);
              setGameStarted(false);
              // Reset the result when factor changes
              const newCorrectResult = firstNumber * parseInt(value);
              const digitCount = newCorrectResult.toString().length;
              setEditableResult("?".repeat(digitCount));
              setActiveDigitIndex(0);
            }}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
               <SelectContent>
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                   <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>

          {/* NumLit Keyboard - Flexible Width */}
          <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200 flex-1 min-w-0">
            <p className="text-xs font-medium text-center mb-2">{t.numLitKeyboard}</p>
            
            {/* Tastatura simplificata afisata permanent */}
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex flex-col items-center gap-2">
                {/* Toate cifrele pe un singur rând: 0-9 plus butoane Sterge si Tab */}
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className={`h-7 w-7 text-xs font-bold transition-all duration-200 hover:scale-105 ${
                        num % 2 === 0 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-blue-100 text-blue-700 border-blue-300'
                      }`}
                      onClick={() => handleKeyboardInput(num.toString())}
                    >
                      {num}
                    </Button>
                  ))}
                  
                  {/* Buton Sterge */}
                  <Button
                    variant="outline"
                    className="h-7 w-8 text-xs font-bold transition-all duration-200 hover:scale-105 bg-orange-100 text-orange-700 border-orange-300"
                    onClick={() => handleKeyboardInput('backspace')}
                    title="Sterge"
                  >
                    ⌫
                  </Button>
                  
                  {/* Buton Tab */}
                  <Button
                    variant="outline"
                    className="h-7 w-8 text-xs font-bold transition-all duration-200 hover:scale-105 bg-purple-100 text-purple-700 border-purple-300"
                    onClick={() => {
                      // Move to next digit position
                      const nextIndex = activeDigitIndex + 1;
                      if (nextIndex < editableResult.length) {
                        setActiveDigitIndex(nextIndex);
                      } else {
                        setActiveDigitIndex(0); // Wrap to beginning
                      }
                    }}
                    title="Tab"
                  >
                    ⇥
                  </Button>
                </div>
                
                {/* Butoane de control pe al doilea rând */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="h-6 px-3 text-xs bg-yellow-100 text-yellow-700 border-yellow-300"
                    onClick={() => {
                      const digitCount = correctResult.toString().length;
                      setEditableResult("?".repeat(digitCount));
                      setActiveDigitIndex(0);
                    }}
                  >
                    {t.clearAll}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-6 px-3 text-xs bg-green-100 text-green-700 border-green-300"
                    onClick={() => setShowKeyboard(true)}
                  >
                    ⌨️ {t.openNumLitFull}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tastatura NumLit completa */}
            {showKeyboard && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-medium text-blue-700">{t.numLitKeyboard}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:bg-blue-200 h-5 w-5 p-0"
                    onClick={() => setShowKeyboard(false)}
                  >
                    ✕
                  </Button>
                </div>
                 <NumLitKeyboard
                   onKeyPress={(key: string) => {
                     handleKeyboardInput(key);
                   }}
                   onClose={() => setShowKeyboard(false)}
                   maxNumber={100}
                   includeOperators={false}
                   concentration="0-10"
                   selectedLanguage={selectedLanguage}
                 />
              </div>
            )}
          </div>
          
          {/* Validation Button - Compact */}
          <div className="bg-green-50 rounded-xl p-3 border-2 border-green-200 w-24 flex-shrink-0">
            <p className="text-xs font-medium text-center mb-1">{t.validation}</p>
            <div className="flex items-center justify-center">
              <Button
                onClick={() => {
                  if (isCorrect) {
                    toast.success(t.congratulations);
                    setCurrentExercise(prev => Math.min(prev + 1, totalExercises));
                    
                    // Generate new problem after a brief delay
                    setTimeout(() => {
                      generateNewMultiplication();
                      const digitCount = correctResult.toString().length;
                      setEditableResult("?".repeat(digitCount));
                      setActiveDigitIndex(0);
                    }, 1500);
                  } else {
                    toast.error(t.tryAgain);
                  }
                }}
                disabled={!isResultComplete()}
                className={`w-full h-14 text-xl font-bold transition-colors rounded-lg ${
                  !isResultComplete() 
                    ? 'bg-gray-400 text-gray-600' 
                    : isCorrect 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {!isResultComplete() ? '?' : isCorrect ? '✓' : '✗'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Initial generation when component mounts or table selection changes
  useEffect(() => {
    generateNewMultiplication();
  }, [selectedTable]);

  // Initialize editableResult when factors change
  useEffect(() => {
    const digitCount = correctResult.toString().length;
    setEditableResult("?".repeat(digitCount));
    setActiveDigitIndex(0);
  }, [firstNumber, secondNumber]);

  const handleProgressUpdate = (correct: boolean) => {
    if (correct) {
      setCurrentExercise(prev => Math.min(prev + 1, totalExercises));
      // Don't generate new multiplication automatically - wait for validation button
    }
  };

  const renderMultiplicationVisualization = () => {
    // Level 2: Interactive multiplication table
    if (selectedLevel === "easy") {
      return (
        <InteractiveMultiplicationTable
          firstNumber={firstNumber}
          secondNumber={secondNumber}
          onProgressUpdate={handleProgressUpdate}
          onGenerateNew={generateNewMultiplication}
          language={selectedLanguage}
          translations={{
            units: t.units,
            tens: t.tens,
            hundreds: t.hundreds,
            thousands: t.thousands,
            findResult: t.findResult,
            allMultiplicationsFor: t.allMultiplicationsFor,
            newProblemGenerated: t.newProblemGenerated,
            validateAndContinue: t.validateAndContinue,
            pressButtonFromTable: t.pressButtonFromTable,
            resultsWillAppearHere: t.resultsWillAppearHere,
            concentru: t.concentru,
            pitagora: t.pitagora
          }}
        />
      );
    }
    
    // Level 1 and other levels: Original rigleta visualization
    return (
      <div className="space-y-6 pb-32">
          {/* Main multiplication display - Full Width without container */}
          <div 
            className="w-full bg-white rounded-xl border-2 border-gray-300 p-8 transition-transform duration-300 origin-center"
            style={{ transform: `scale(${scale})` }}
          >
          {/* Single line layout with both equations */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* First equation */}
            <div className="flex flex-col items-center gap-4">
              {/* Factors row with multiplication sign */}
              <div className="flex items-center justify-center gap-6">
                {/* First Factor */}
                <div className="flex flex-col items-center">
                  <div className="text-blue-600 font-semibold text-xl mb-2">{t.factor}</div>
                  <div className="w-20 h-16 border-2 border-blue-400 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-blue-600">{firstNumber}</span>
                  </div>
                </div>

                {/* Multiplication Sign */}
                <div className="flex items-center" style={{ marginTop: '24px' }}>
                  <span className="text-6xl font-bold text-gray-700">×</span>
                </div>

                {/* Second Factor */}
                <div className="flex flex-col items-center">
                  <div className="text-orange-600 font-semibold text-xl mb-2">{t.factor}</div>
                  <div className="w-20 h-16 border-2 border-orange-400 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-orange-600">{secondNumber}</span>
                  </div>
                </div>
              </div>

              {/* Explanation text */}
              <div className="text-xl text-gray-600 text-center max-w-xs">
                {generateMultiplicationPhrase(firstNumber, secondNumber, t)}
              </div>
            </div>

            {/* Equals Sign */}
            <div className="flex items-center">
              <span className="text-7xl font-bold text-gray-700">=</span>
            </div>

            {/* Result */}
            <div className="flex flex-col items-center">
              <div className="text-blue-600 font-semibold text-xl mb-2">{t.product}</div>
              {renderDigitBoxes(correctResult)}
            </div>

            {/* Equals Sign */}
            <div className="flex items-center">
              <span className="text-7xl font-bold text-gray-700">=</span>
            </div>

            {/* Second equation */}
            <div className="flex flex-col items-center gap-4">
              {/* Factors row with multiplication sign */}
              <div className="flex items-center justify-center gap-6">
                {/* Second Factor */}
                <div className="flex flex-col items-center">
                  <div className="text-red-600 font-semibold text-xl mb-2">{t.factor}</div>
                  <div className="w-20 h-16 border-2 border-red-400 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-red-600">{secondNumber}</span>
                  </div>
                </div>

                {/* Multiplication Sign */}
                <div className="flex items-center" style={{ marginTop: '24px' }}>
                  <span className="text-6xl font-bold text-gray-700">×</span>
                </div>

                {/* First Factor */}
                <div className="flex flex-col items-center">
                  <div className="text-blue-600 font-semibold text-xl mb-2">{t.factor}</div>
                  <div className="w-20 h-16 border-2 border-blue-400 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-blue-600">{firstNumber}</span>
                  </div>
                </div>
              </div>

              {/* Explanation text */}
              <div className="text-xl text-gray-600 text-center max-w-xs">
                {generateMultiplicationPhrase(secondNumber, firstNumber, t)}
              </div>
            </div>
          </div>
        </div>

        {/* Visual representation with riglete and addition - Always visible */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${scale})` }}
        >
          {/* First visualization: firstNumber groups of secondNumber with addition */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <h4 className="text-2xl font-semibold mb-6 text-orange-700">
              {firstNumber} {t.multiplicationFormula2} {secondNumber} {t.rods}
            </h4>
            <div className="flex flex-col items-center">
              {/* Horizontal line of riglete with addition */}
              <div className="flex items-end gap-4 mb-6">
                {Array.from({ length: firstNumber }, (_, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <Rigleta 
                      number={secondNumber} 
                      orientation="vertical" 
                      className="shadow-sm"
                    />
                    {index < firstNumber - 1 && (
                      <span className="text-4xl font-bold text-orange-600 mb-4">+</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Cumulative results below - starting from second rigleta position */}
              <div className="flex items-center">
                {/* Empty space for first rigleta */}
                <div className="w-16"></div>
                
                {/* Results aligned with riglete starting from second one */}
                <div className="flex items-center gap-8 ml-4">
                  {Array.from({ length: firstNumber - 1 }, (_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-orange-600">=</span>
                      <div 
                        className={`w-16 h-12 border-2 border-orange-400 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all ${
                          activeAdditionBox?.zone === 'left' && activeAdditionBox?.index === index ? 'ring-4 ring-yellow-400' : ''
                        }`}
                        onClick={() => setActiveAdditionBox({zone: 'left', index})}
                        onKeyDown={(e) => handleDirectKeyInput(e, 'left', index)}
                        tabIndex={0}
                        role="textbox"
                        aria-label={`Left addition result ${index + 1} input`}
                      >
                        <span className="text-xl font-bold text-orange-600">
                          {showResult ? secondNumber * (index + 2) : (leftAdditionResults[index] || '?')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second visualization: secondNumber groups of firstNumber with addition */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <h4 className="text-2xl font-semibold mb-6 text-red-700">
              {secondNumber} {t.multiplicationFormula2} {firstNumber} {t.rods}
            </h4>
            <div className="flex flex-col items-center">
              {/* Horizontal line of riglete with addition */}
              <div className="flex items-end gap-4 mb-6">
                {Array.from({ length: secondNumber }, (_, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <Rigleta 
                      number={firstNumber} 
                      orientation="vertical" 
                      className="shadow-sm"
                    />
                    {index < secondNumber - 1 && (
                      <span className="text-4xl font-bold text-red-600 mb-4">+</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Cumulative results below - starting from second rigleta position */}
              <div className="flex items-center">
                {/* Empty space for first rigleta */}
                <div className="w-16"></div>
                
                {/* Results aligned with riglete starting from second one */}
                <div className="flex items-center gap-8 ml-4">
                  {Array.from({ length: secondNumber - 1 }, (_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-600">=</span>
                      <div 
                        className={`w-16 h-12 border-2 border-red-400 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all ${
                          activeAdditionBox?.zone === 'right' && activeAdditionBox?.index === index ? 'ring-4 ring-yellow-400' : ''
                        }`}
                        onClick={() => setActiveAdditionBox({zone: 'right', index})}
                        onKeyDown={(e) => handleDirectKeyInput(e, 'right', index)}
                        tabIndex={0}
                        role="textbox"
                        aria-label={`Right addition result ${index + 1} input`}
                      >
                        <span className="text-xl font-bold text-red-600">
                          {showResult ? firstNumber * (index + 2) : (rightAdditionResults[index] || '?')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-rigleta-1/20 to-rigleta-8/20">
        {sidebarVisible && renderSidebar()}
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-background/95 backdrop-blur-sm border-b border-border/40 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                  className="hover:bg-muted"
                >
                  {sidebarVisible ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <img 
                      src="/lovable-uploads/349d7dbd-cd79-4202-8cc2-a1994fbba2db.png" 
                      alt="NumLit Logo" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="ml-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-primary">{t.title}</h2>
                    <p className="text-sm text-muted-foreground hidden sm:block">{t.slogan}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ProgressBar 
                  current={currentExercise} 
                  total={totalExercises} 
                  className="hidden sm:flex"
                />
                <Timer 
                  isRunning={isTimerRunning}
                  className="scale-75 sm:scale-100"
                />
                <ProportionSelector
                  currentScale={scale}
                  onScaleChange={setScale}
                  className="hidden sm:flex"
                />
                <GameControls
                  isPlaying={isGamePlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onShuffle={handleShuffle}
                  onRepeat={handleNewGame}
                />
              </div>
            </div>
            
            {/* Mobile Progress Bar and Proportion Selector */}
            <div className="sm:hidden mt-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.progressLabel}</span>
                <span className="text-sm text-muted-foreground">{currentExercise}/{totalExercises}</span>
              </div>
              <ProgressBar current={currentExercise} total={totalExercises} />
              
              <div className="flex justify-center mt-2">
                <ProportionSelector
                  currentScale={scale}
                  onScaleChange={setScale}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="w-full">
              {/* Game Content - Full Width */}
              {renderMultiplicationVisualization()}
            </div>
          </div>
          
          {/* Bottom Control Panel - Hide for Level 2 */}
          {selectedLevel !== "easy" && renderBottomSelector()}
        </div>
      </div>
    </SidebarProvider>
  );
}
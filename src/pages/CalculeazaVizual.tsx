import React, { useState, useRef, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RigletaNumLit from "@/components/educational/RigletaNumLit";
import Rigleta from "@/components/educational/Rigleta";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import ShopPromoBox from "@/components/educational/ShopPromoBox";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";

import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import NumberSelector from "@/components/educational/NumberSelector";
import numLitLogo from "@/assets/numlit-logo.png";
import { CheckCircle, RotateCcw, Volume2, VolumeX, Home, Info, Keyboard } from "lucide-react";
import { toast } from "sonner";

// Number of letters in each language alphabet
const languageLetters = {
  ro: 31, // A-Z + Ă, Â, Î, Ș, Ț
  en: 26, // A-Z
  fr: 32, // A-Z + accented letters
  cz: 42, // Czech alphabet with diacritics
  de: 30, // A-Z + Ä, Ö, Ü, ß
  es: 27, // A-Z + Ñ
  it: 26, // A-Z
  pt: 26, // A-Z
  hu: 44, // Hungarian alphabet with many diacritics
  pl: 32, // Polish alphabet with diacritics
  bg: 30, // Bulgarian Cyrillic alphabet
  ru: 33, // Russian Cyrillic alphabet
  ar: 28, // Arabic alphabet
  tr: 29  // Turkish alphabet
} as const;

// Translations for the visual math game
const gameTranslations = {
  ro: {
    title: "Să Calculăm - Vizual",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    levelNames: {
      adunari: "Adunări",
      scaderi: "Scăderi", 
      adunariTrecere: "Adunări cu trecere",
      scaderiTrecere: "Scăderi cu trecere"
    },
    digitLabel: "Numărul de cifre",
    concentrationLabel: "Concentru",
    instructions: "Instrucțiuni",
    rigletaTitle: "Riglete NumLit",
    rigletaDescription: "Fiecare culoare reprezintă o valoare: Albastru (unități), Roșu (zeci), Portocaliu (sute), Negru (mii)",
    howToPlay: "Cum să joci",
    howToPlayDescription: "Trage rigletele în zonele corespunzătoare pentru a forma rezultatul operației. Folosește descompunerea pentru treceri peste ordine.",
    availableRods: "Riglete disponibile",
    calculationZones: "Zone de calcul",
    controlsValidation: "Control și validare",
    showKeyboard: "Afișează tastatura",
    hideKeyboard: "Ascunde tastatura",
    validateAnswer: "Validează răspunsul",
    result: "Rezultat",
    yourAnswer: "Răspunsul tău",
    dragHere: "Trage rigletele aici",
    units: "UNITĂȚI",
    tens: "ZECI",
    hundreds: "SUTE",
    thousands: "MII",
    unitsClass: "CLASA UNITĂȚILOR",
    thousandsClass: "CLASA MIILOR",
    millionsClass: "CLASA MILIOANELOR",
    orderDecomposition: "Descompunerea pe ordine",
    orderSymbols: "Simboluri Ordine",
    moveRods: "Mutați rigletele pentru a calcula rezultatul pe ordine",
    order: "ORDIN",
    term1: "Termenul 1",
    term2: "Termenul 2",
    unitsShort: "U",
    tensShort: "Z"
  },
  en: {
    title: "Let's Calculate - Visual",
    back: "Back",
    language: "Language",
    level: "Level",
    levelNames: {
      adunari: "Addition",
      scaderi: "Subtraction",
      adunariTrecere: "Addition with carry",
      scaderiTrecere: "Subtraction with borrow"
    },
    digitLabel: "Number of digits",
    concentrationLabel: "Concentration",
    instructions: "Instructions",
    rigletaTitle: "NumLit Rods",
    rigletaDescription: "Each color represents a value: Blue (units), Red (tens), Orange (hundreds), Black (thousands)",
    howToPlay: "How to play",
    howToPlayDescription: "Drag the rods to the corresponding zones to form the operation result. Use decomposition for carry-over operations.",
    availableRods: "Available rods",
    calculationZones: "Calculation zones",
    controlsValidation: "Controls and validation",
    showKeyboard: "Show keyboard",
    hideKeyboard: "Hide keyboard",
    validateAnswer: "Validate answer",
    result: "Result",
    yourAnswer: "Your answer",
    dragHere: "Drag rods here",
    units: "UNITS",
    tens: "TENS",
    hundreds: "HUNDREDS",
    thousands: "THOUSANDS",
    unitsClass: "UNITS CLASS",
    thousandsClass: "THOUSANDS CLASS",
    millionsClass: "MILLIONS CLASS",
    orderDecomposition: "Order decomposition",
    orderSymbols: "Order Symbols",
    moveRods: "Move the rods to calculate the result by orders",
    order: "ORDER",
    term1: "Term 1",
    term2: "Term 2",
    unitsShort: "U",
    tensShort: "T"
  },
  fr: {
    title: "Calculons - Visuel",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    levelNames: {
      adunari: "Addition",
      scaderi: "Soustraction",
      adunariTrecere: "Addition avec retenue",
      scaderiTrecere: "Soustraction avec emprunt"
    },
    digitLabel: "Nombre de chiffres",
    concentrationLabel: "Concentration",
    instructions: "Instructions",
    rigletaTitle: "Baguettes NumLit",
    rigletaDescription: "Chaque couleur représente une valeur: Bleu (unités), Rouge (dizaines), Orange (centaines), Noir (milliers)",
    howToPlay: "Comment jouer",
    howToPlayDescription: "Faites glisser les baguettes dans les zones correspondantes pour former le résultat de l'opération. Utilisez la décomposition pour les reports.",
    availableRods: "Baguettes disponibles",
    calculationZones: "Zones de calcul",
    controlsValidation: "Contrôles et validation",
    showKeyboard: "Afficher le clavier",
    hideKeyboard: "Masquer le clavier",
    validateAnswer: "Valider la réponse",
    result: "Résultat",
    yourAnswer: "Votre réponse",
    dragHere: "Glissez les baguettes ici",
    units: "UNITÉS",
    tens: "DIZAINES",
    hundreds: "CENTAINES",
    thousands: "MILLIERS",
    unitsClass: "CLASSE DES UNITÉS",
    thousandsClass: "CLASSE DES MILLIERS",
    millionsClass: "CLASSE DES MILLIONS",
    orderDecomposition: "Décomposition par ordres",
    orderSymbols: "Symboles d'ordres",
    moveRods: "Déplacez les baguettes pour calculer le résultat par ordres",
    order: "ORDRE",
    term1: "Terme 1",
    term2: "Terme 2",
    unitsShort: "U",
    tensShort: "D"
  },
  de: {
    title: "Lass uns rechnen - Visuell",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    levelNames: {
      adunari: "Addition",
      scaderi: "Subtraktion",
      adunariTrecere: "Addition mit Übertrag",
      scaderiTrecere: "Subtraktion mit Borgen"
    },
    digitLabel: "Anzahl der Ziffern",
    concentrationLabel: "Konzentration",
    instructions: "Anweisungen",
    rigletaTitle: "NumLit Stäbe",
    rigletaDescription: "Jede Farbe repräsentiert einen Wert: Blau (Einer), Rot (Zehner), Orange (Hunderter), Schwarz (Tausender)",
    howToPlay: "Wie man spielt",
    howToPlayDescription: "Ziehe die Stäbe in die entsprechenden Zonen, um das Operationsergebnis zu bilden. Verwende Zerlegung für Überträge.",
    availableRods: "Verfügbare Stäbe",
    calculationZones: "Berechnungszonen",
    controlsValidation: "Steuerung und Validierung",
    showKeyboard: "Tastatur anzeigen",
    hideKeyboard: "Tastatur ausblenden",
    validateAnswer: "Antwort validieren",
    result: "Ergebnis",
    yourAnswer: "Deine Antwort",
    dragHere: "Stäbe hier hinziehen",
    units: "EINER",
    tens: "ZEHNER",
    hundreds: "HUNDERTER",
    thousands: "TAUSENDER",
    unitsClass: "EINER-KLASSE",
    thousandsClass: "TAUSENDER-KLASSE",
    millionsClass: "MILLIONEN-KLASSE",
    orderDecomposition: "Stellenwert-Zerlegung",
    orderSymbols: "Stellenwert-Symbole",
    moveRods: "Bewegen Sie die Stäbe, um das Ergebnis nach Stellenwerten zu berechnen",
    order: "STELLENWERT",
    term1: "Begriff 1",
    term2: "Begriff 2",
    unitsShort: "E",
    tensShort: "Z"
  },
  es: {
    title: "Vamos a Calcular - Visual",
    back: "Atrás",
    language: "Idioma",
    level: "Nivel",
    levelNames: {
      adunari: "Suma",
      scaderi: "Resta",
      adunariTrecere: "Suma con llevar",
      scaderiTrecere: "Resta con prestar"
    },
    digitLabel: "Número de dígitos",
    concentrationLabel: "Concentración",
    instructions: "Instrucciones",
    rigletaTitle: "Varillas NumLit",
    rigletaDescription: "Cada color representa un valor: Azul (unidades), Rojo (decenas), Naranja (centenas), Negro (millares)",
    howToPlay: "Cómo jugar",
    howToPlayDescription: "Arrastra las varillas a las zonas correspondientes para formar el resultado de la operación. Usa descomposición para llevar.",
    availableRods: "Varillas disponibles",
    calculationZones: "Zonas de cálculo",
    controlsValidation: "Controles y validación",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar respuesta",
    result: "Resultado",
    yourAnswer: "Tu respuesta",
    dragHere: "Arrastra las varillas aquí",
    units: "UNIDADES",
    tens: "DECENAS",
    hundreds: "CENTENAS",
    thousands: "MILLARES",
    unitsClass: "CLASE DE UNIDADES",
    thousandsClass: "CLASE DE MILLARES",
    millionsClass: "CLASE DE MILLONES",
    orderDecomposition: "Descomposición por órdenes",
    orderSymbols: "Símbolos de órdenes",
    moveRods: "Mueve las varillas para calcular el resultado por órdenes",
    order: "ORDEN",
    term1: "Término 1",
    term2: "Término 2",
    unitsShort: "U",
    tensShort: "D"
  },
  it: {
    title: "Calcoliamo - Visuale",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    levelNames: {
      adunari: "Addizione",
      scaderi: "Sottrazione",
      adunariTrecere: "Addizione con riporto",
      scaderiTrecere: "Sottrazione con prestito"
    },
    digitLabel: "Numero di cifre",
    concentrationLabel: "Concentrazione",
    instructions: "Istruzioni",
    rigletaTitle: "Aste NumLit",
    rigletaDescription: "Ogni colore rappresenta un valore: Blu (unità), Rosso (decine), Arancione (centinaia), Nero (migliaia)",
    howToPlay: "Come giocare",
    howToPlayDescription: "Trascina le aste nelle zone corrispondenti per formare il risultato dell'operazione. Usa la scomposizione per i riporti.",
    availableRods: "Aste disponibili",
    calculationZones: "Zone di calcolo",
    controlsValidation: "Controlli e validazione",
    showKeyboard: "Mostra tastiera",
    hideKeyboard: "Nascondi tastiera",
    validateAnswer: "Convalida risposta",
    result: "Risultato",
    yourAnswer: "La tua risposta",
    dragHere: "Trascina le aste qui",
    units: "UNITÀ",
    tens: "DECINE",
    hundreds: "CENTINAIA",
    thousands: "MIGLIAIA",
    unitsClass: "CLASSE DELLE UNITÀ",
    thousandsClass: "CLASSE DELLE MIGLIAIA",
    millionsClass: "CLASSE DEI MILIONI",
    orderDecomposition: "Scomposizione per ordini",
    orderSymbols: "Simboli degli ordini",
    moveRods: "Sposta le aste per calcolare il risultato per ordini",
    order: "ORDINE",
    term1: "Termine 1",
    term2: "Termine 2",
    unitsShort: "U",
    tensShort: "D"
  },
  pt: {
    title: "Vamos Calcular - Visual",
    back: "Voltar",
    language: "Idioma",
    level: "Nível",
    levelNames: {
      adunari: "Adição",
      scaderi: "Subtração",
      adunariTrecere: "Adição com transporte",
      scaderiTrecere: "Subtração com empréstimo"
    },
    digitLabel: "Número de dígitos",
    concentrationLabel: "Concentração",
    instructions: "Instruções",
    rigletaTitle: "Varinhas NumLit",
    rigletaDescription: "Cada cor representa um valor: Azul (unidades), Vermelho (dezenas), Laranja (centenas), Preto (milhares)",
    howToPlay: "Como jogar",
    howToPlayDescription: "Arraste as varinhas para as zonas correspondentes para formar o resultado da operação. Use decomposição para transportes.",
    availableRods: "Varinhas disponíveis",
    calculationZones: "Zonas de cálculo",
    controlsValidation: "Controlos e validação",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar resposta",
    result: "Resultado",
    yourAnswer: "A sua resposta",
    dragHere: "Arraste as varinhas aqui",
    units: "UNIDADES",
    tens: "DEZENAS",
    hundreds: "CENTENAS",
    thousands: "MILHARES",
    unitsClass: "CLASSE DAS UNIDADES",
    thousandsClass: "CLASSE DOS MILHARES",
    millionsClass: "CLASSE DOS MILHÕES",
    orderDecomposition: "Decomposição por ordens",
    orderSymbols: "Símbolos das ordens",
    moveRods: "Mova as varinhas para calcular o resultado por ordens",
    order: "ORDEM",
    term1: "Termo 1",
    term2: "Termo 2",
    unitsShort: "U",
    tensShort: "D"
  },
  cz: {
    title: "Počítejme - Vizuálně",
    back: "Zpět",
    language: "Jazyk",
    level: "Úroveň",
    levelNames: {
      adunari: "Sčítání",
      scaderi: "Odčítání",
      adunariTrecere: "Sčítání s přenosem",
      scaderiTrecere: "Odčítání s půjčkou"
    },
    digitLabel: "Počet číslic",
    concentrationLabel: "Koncentrace",
    instructions: "Instrukce",
    rigletaTitle: "NumLit tyčky",
    rigletaDescription: "Každá barva představuje hodnotu: Modrá (jednotky), Červená (desítky), Oranžová (stovky), Černá (tisíce)",
    howToPlay: "Jak hrát",
    howToPlayDescription: "Přetáhněte tyčky do odpovídajících zón pro vytvoření výsledku operace. Použijte dekompozici pro přenosy.",
    availableRods: "Dostupné tyčky",
    calculationZones: "Výpočetní zóny",
    controlsValidation: "Ovládání a validace",
    showKeyboard: "Zobrazit klávesnici",
    hideKeyboard: "Skrýt klávesnici",
    validateAnswer: "Ověřit odpověď",
    result: "Výsledek",
    yourAnswer: "Vaše odpověď",
    dragHere: "Přetáhněte tyčky sem",
    units: "JEDNOTKY",
    tens: "DESÍTKY",
    hundreds: "STOVKY",
    thousands: "TISÍCE",
    unitsClass: "TŘÍDA JEDNOTEK",
    thousandsClass: "TŘÍDA TISÍCŮ",
    millionsClass: "TŘÍDA MILIONŮ",
    orderDecomposition: "Rozklad podle řádů",
    orderSymbols: "Symboly řádů",
    moveRods: "Přesuňte tyčky pro výpočet výsledku podle řádů",
    order: "ŘÁD",
    term1: "Člen 1",
    term2: "Člen 2",
    unitsShort: "J",
    tensShort: "D"
  },
  pl: {
    title: "Liczmy - Wizualnie",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    levelNames: {
      adunari: "Dodawanie",
      scaderi: "Odejmowanie",
      adunariTrecere: "Dodawanie z przeniesieniem",
      scaderiTrecere: "Odejmowanie z pożyczką"
    },
    digitLabel: "Liczba cyfr",
    concentrationLabel: "Koncentracja",
    instructions: "Instrukcje",
    rigletaTitle: "Pałeczki NumLit",
    rigletaDescription: "Każdy kolor reprezentuje wartość: Niebieski (jednostki), Czerwony (dziesiątki), Pomarańczowy (setki), Czarny (tysiące)",
    howToPlay: "Jak grać",
    howToPlayDescription: "Przeciągnij pałeczki do odpowiednich stref, aby utworzyć wynik operacji. Użyj dekompozycji dla przeniesień.",
    availableRods: "Dostępne pałeczki",
    calculationZones: "Strefy obliczeń",
    controlsValidation: "Kontrole i walidacja",
    showKeyboard: "Pokaż klawiaturę",
    hideKeyboard: "Ukryj klawiaturę",
    validateAnswer: "Sprawdź odpowiedź",
    result: "Wynik",
    yourAnswer: "Twoja odpowiedź",
    dragHere: "Przeciągnij pałeczki tutaj",
    units: "JEDNOSTKI",
    tens: "DZIESIĄTKI",
    hundreds: "SETKI",
    thousands: "TYSIĄCE",
    unitsClass: "KLASA JEDNOSTEK",
    thousandsClass: "KLASA TYSIĘCY",
    millionsClass: "KLASA MILIONÓW",
    orderDecomposition: "Rozkład według rzędów",
    orderSymbols: "Symbole rzędów",
    moveRods: "Przenieś pałeczki, aby obliczyć wynik według rzędów",
    order: "RZĄD",
    term1: "Składnik 1",
    term2: "Składnik 2",
    unitsShort: "J",
    tensShort: "D"
  },
  hu: {
    title: "Számoljunk - Vizuálisan",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    levelNames: {
      adunari: "Összeadás",
      scaderi: "Kivonás",
      adunariTrecere: "Összeadás átvitellel",
      scaderiTrecere: "Kivonás kölcsönzéssel"
    },
    digitLabel: "Számjegyek száma",
    concentrationLabel: "Koncentráció",
    instructions: "Utasítások",
    rigletaTitle: "NumLit pálcikák",
    rigletaDescription: "Minden szín egy értéket képvisel: Kék (egyesek), Piros (tízesek), Narancssárga (százasok), Fekete (ezresek)",
    howToPlay: "Hogyan játszd",
    howToPlayDescription: "Húzd a pálcikákat a megfelelő zónákba a művelet eredményének kialakításához. Használj felbontást az átvitelekhez.",
    availableRods: "Elérhető pálcikák",
    calculationZones: "Számítási zónák",
    controlsValidation: "Vezérlők és érvényesítés",
    showKeyboard: "Billentyűzet megjelenítése",
    hideKeyboard: "Billentyűzet elrejtése",
    validateAnswer: "Válasz érvényesítése",
    result: "Eredmény",
    yourAnswer: "Az Ön válasza",
    dragHere: "Húzza a pálcikákat ide",
    units: "EGYESEK",
    tens: "TÍZESEK",
    hundreds: "SZÁZASOK",
    thousands: "EZRESEK",
    unitsClass: "EGYESEK OSZTÁLYA",
    thousandsClass: "EZRESEK OSZTÁLYA",
    millionsClass: "MILLIÓK OSZTÁLYA",
    orderDecomposition: "Helyi érték szerinti felbontás",
    orderSymbols: "Helyi érték szimbólumok",
    moveRods: "Mozgassa a pálcikákat az eredmény helyi értékek szerinti kiszámításához",
    order: "HELYI ÉRTÉK",
    term1: "Tag 1",
    term2: "Tag 2",
    unitsShort: "E",
    tensShort: "T"
  },
  ru: {
    title: "Давайте Считать - Визуально",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    levelNames: {
      adunari: "Сложение",
      scaderi: "Вычитание",
      adunariTrecere: "Сложение с переносом",
      scaderiTrecere: "Вычитание с займом"
    },
    digitLabel: "Количество цифр",
    concentrationLabel: "Концентрация",
    instructions: "Инструкции",
    rigletaTitle: "Палочки NumLit",
    rigletaDescription: "Каждый цвет представляет значение: Синий (единицы), Красный (десятки), Оранжевый (сотни), Черный (тысячи)",
    howToPlay: "Как играть",
    howToPlayDescription: "Перетащите палочки в соответствующие зоны для формирования результата операции. Используйте разложение для переносов.",
    availableRods: "Доступные палочки",
    calculationZones: "Зоны вычислений",
    controlsValidation: "Управление и проверка",
    showKeyboard: "Показать клавиатуру",
    hideKeyboard: "Скрыть клавиатуру",
    validateAnswer: "Проверить ответ",
    result: "Результат",
    yourAnswer: "Ваш ответ",
    dragHere: "Перетащите палочки сюда",
    units: "ЕДИНИЦЫ",
    tens: "ДЕСЯТКИ",
    hundreds: "СОТНИ",
    thousands: "ТЫСЯЧИ",
    unitsClass: "КЛАСС ЕДИНИЦ",
    thousandsClass: "КЛАСС ТЫСЯЧ",
    millionsClass: "КЛАСС МИЛЛИОНОВ",
    orderDecomposition: "Разложение по разрядам",
    orderSymbols: "Символы разрядов",
    moveRods: "Переместите палочки для вычисления результата по разрядам",
    order: "РАЗРЯД",
    term1: "Слагаемое 1",
    term2: "Слагаемое 2",
    unitsShort: "Е",
    tensShort: "Д"
  },
  bg: {
    title: "Нека Смятаме - Визуално",
    back: "Назад",
    language: "Език",
    level: "Ниво",
    levelNames: {
      adunari: "Събиране",
      scaderi: "Изваждане",
      adunariTrecere: "Събиране с пренос",
      scaderiTrecere: "Изваждане със заем"
    },
    digitLabel: "Брой цифри",
    concentrationLabel: "Концентрация",
    instructions: "Инструкции",
    rigletaTitle: "Пръчки NumLit",
    rigletaDescription: "Всеки цвят представлява стойност: Син (единици), Червен (десетки), Оранжев (стотици), Черен (хиляди)",
    howToPlay: "Как да играеш",
    howToPlayDescription: "Плъзнете пръчките в съответните зони за формиране на резултата от операцията. Използвайте разлагане за преноси.",
    availableRods: "Налични пръчки",
    calculationZones: "Зони за изчисления",
    controlsValidation: "Контроли и валидация",
    showKeyboard: "Покажи клавиатура",
    hideKeyboard: "Скрий клавиатура",
    validateAnswer: "Валидирай отговор",
    result: "Резултат",
    yourAnswer: "Твоят отговор",
    dragHere: "Плъзни пръчките тук",
    units: "ЕДИНИЦИ",
    tens: "ДЕСЕТКИ",
    hundreds: "СТОТИЦИ",
    thousands: "ХИЛЯДИ",
    unitsClass: "КЛАС ЕДИНИЦИ",
    thousandsClass: "КЛАС ХИЛЯДИ",
    millionsClass: "КЛАС МИЛИОНИ",
    orderDecomposition: "Разлагане по разреди",
    orderSymbols: "Символи на разредите",
    moveRods: "Преместете пръчките за изчисляване на резултата по разреди",
    order: "РАЗРЕД",
    term1: "Член 1",
    term2: "Член 2",
    unitsShort: "Е",
    tensShort: "Д"
  },
  ar: {
    title: "لنحسب - بصري",
    back: "رجوع",
    language: "اللغة",
    level: "المستوى",
    levelNames: {
      adunari: "الجمع",
      scaderi: "الطرح",
      adunariTrecere: "الجمع مع الحمل",
      scaderiTrecere: "الطرح مع الاستلاف"
    },
    digitLabel: "عدد الأرقام",
    concentrationLabel: "التركيز",
    instructions: "التعليمات",
    rigletaTitle: "عصي NumLit",
    rigletaDescription: "كل لون يمثل قيمة: أزرق (آحاد)، أحمر (عشرات)، برتقالي (مئات)، أسود (آلاف)",
    howToPlay: "كيفية اللعب",
    howToPlayDescription: "اسحب العصي إلى المناطق المناسبة لتكوين نتيجة العملية. استخدم التفكيك للنقل.",
    availableRods: "العصي المتاحة",
    calculationZones: "مناطق الحساب",
    controlsValidation: "التحكم والتحقق",
    showKeyboard: "إظهار لوحة المفاتيح",
    hideKeyboard: "إخفاء لوحة المفاتيح",
    validateAnswer: "التحقق من الإجابة",
    result: "النتيجة",
    yourAnswer: "إجابتك",
    dragHere: "اسحب العصي هنا",
    units: "آحاد",
    tens: "عشرات",
    hundreds: "مئات",
    thousands: "آلاف",
    unitsClass: "فئة الآحاد",
    thousandsClass: "فئة الآلاف",
    millionsClass: "فئة الملايين",
    orderDecomposition: "التفكيك حسب المراتب",
    orderSymbols: "رموز المراتب",
    moveRods: "حرك العصي لحساب النتيجة حسب المراتب",
    order: "مرتبة",
    term1: "الحد الأول",
    term2: "الحد الثاني",
    unitsShort: "آ",
    tensShort: "ع"
  },
  tr: {
    title: "Hadi Hesaplayalım - Görsel",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    levelNames: {
      adunari: "Toplama",
      scaderi: "Çıkarma",
      adunariTrecere: "Eldeli toplama",
      scaderiTrecere: "Borçlu çıkarma"
    },
    digitLabel: "Basamak sayısı",
    concentrationLabel: "Konsantrasyon",
    instructions: "Talimatlar",
    rigletaTitle: "NumLit Çubukları",
    rigletaDescription: "Her renk bir değeri temsil eder: Mavi (birler), Kırmızı (onlar), Turuncu (yüzler), Siyah (binler)",
    howToPlay: "Nasıl oynanır",
    howToPlayDescription: "İşlemin sonucunu oluşturmak için çubukları ilgili alanlara sürükleyin. Basamak geçişleri için ayrıştırma kullanın.",
    availableRods: "Mevcut çubuklar",
    calculationZones: "Hesaplama alanları",
    controlsValidation: "Kontrol ve doğrulama",
    showKeyboard: "Klavyeyi göster",
    hideKeyboard: "Klavyeyi gizle",
    validateAnswer: "Cevabı doğrula",
    result: "Sonuç",
    yourAnswer: "Cevabınız",
    dragHere: "Çubukları buraya sürükleyin",
    units: "BİRLER",
    tens: "ONLAR",
    hundreds: "YÜZLER",
    thousands: "BİNLER",
    unitsClass: "BİRLER SINIFI",
    thousandsClass: "BİNLER SINIFI",
    millionsClass: "MİLYONLAR SINIFI",
    orderDecomposition: "Basamağa göre ayrıştırma",
    orderSymbols: "Basamak sembolleri",
    moveRods: "Sonucu basamaklara göre hesaplamak için çubukları hareket ettirin",
    order: "BASAMAK",
    term1: "Terim 1",
    term2: "Terim 2",
    unitsShort: "B",
    tensShort: "O"
  }
};

interface DraggedRigleta {
  id: string;
  value: number;
  components?: number[];
  position: { x: number; y: number };
  isComponent?: boolean;
  parentId?: string;
  sourceId?: string;
  symbolType?: string;
}

interface DropZone {
  id: string;
  order: number; // 0=unități, 1=zeci, 2=sute, etc.
  acceptedValues: number[];
}

type ConcentrationLevel = '0-10' | '0-letters' | '0-100' | '>';

export default function CalculeazaVizual() {
  const [selectedCifra, setSelectedCifra] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('scaderi');
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof gameTranslations>('ro');
  const [concentration, setConcentration] = useState<ConcentrationLevel>('0-10');
  const [currentProblem, setCurrentProblem] = useState({ first: 7, second: 5, result: 0 });
  const [draggedRiglete, setDraggedRiglete] = useState<DraggedRigleta[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [userInput, setUserInput] = useState('');
  const [answerInputs, setAnswerInputs] = useState<string[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [zoom, setZoom] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  
  // Progress tracking states
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(10);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const draggedElementRef = useRef<HTMLDivElement | null>(null);

  const t = gameTranslations[selectedLanguage];

  // Get max number for keyboard based on concentration level
  const getMaxNumberForKeyboard = () => {
    switch (concentration) {
      case '0-10': return 10;
      case '0-letters': return languageLetters[selectedLanguage];
      case '0-100': return 100;
      case '>': return 9;
      default: return 10;
    }
  };

  // Generate problem based on selected level and cifra
  const generateProblem = useCallback(() => {
    const maxValue = Math.pow(10, selectedCifra) - 1;
    let first, second;
    const isAddition = selectedLevel.includes('adunari');
    const hasCarryOver = selectedLevel.includes('trecere');
    
    if (isAddition) {
      if (hasCarryOver) {
        // For addition with carry-over, ensure the result exceeds the current digit boundary
        first = Math.floor(Math.random() * maxValue) + Math.pow(10, selectedCifra - 1);
        second = Math.floor(Math.random() * maxValue) + Math.pow(10, selectedCifra - 1);
      } else {
        first = Math.floor(Math.random() * maxValue) + 1;
        second = Math.floor(Math.random() * (maxValue - first)) + 1;
      }
    } else {
      // Subtraction logic
      if (selectedCifra === 1) {
        // Special constraints for single digit: max first number is 10, result >= 0
        first = Math.floor(Math.random() * 10) + 1; // 1-10
        second = Math.floor(Math.random() * first) + 0; // 0 to first (to ensure result >= 0)
      } else {
        if (hasCarryOver) {
          // For subtraction with borrowing
          first = Math.floor(Math.random() * maxValue) + Math.pow(10, selectedCifra);
          second = Math.floor(Math.random() * Math.pow(10, selectedCifra - 1)) + Math.pow(10, selectedCifra - 1);
        } else {
          first = Math.floor(Math.random() * maxValue) + selectedCifra * 10;
          second = Math.floor(Math.random() * first) + 1;
        }
      }
    }
    
    setCurrentProblem({ first, second, result: isAddition ? first + second : first - second });
    setUserInput('');
    setDraggedRiglete([]);
    setIsValidating(false);
    
    // Initialize drop zones for the new bar system
    const zones: DropZone[] = [];
    
    // Create zones for first number digits
    const firstDigits = currentProblem.first.toString().length;
    for (let i = 0; i < firstDigits; i++) {
      zones.push({
        id: `first-${i}`,
        order: i,
        acceptedValues: []
      });
    }
    
    // Create zones for second number digits
    const secondDigits = currentProblem.second.toString().length;
    for (let i = 0; i < secondDigits; i++) {
      zones.push({
        id: `second-${i}`,
        order: i,
        acceptedValues: []
      });
    }
    
    // Create zones for result digits
    const maxDigits = Math.max(firstDigits, secondDigits, selectedCifra);
    for (let i = 0; i < maxDigits; i++) {
      zones.push({
        id: `result-${i}`,
        order: i,
        acceptedValues: []
      });
    }
    
    setDropZones(zones);
  }, [selectedCifra, selectedLevel]);

  // Initialize problem on mount and cifra change
  React.useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  // Initialize answer inputs when problem changes
  React.useEffect(() => {
    const expectedResult = selectedLevel.includes('adunari') 
      ? currentProblem.first + currentProblem.second 
      : currentProblem.first - currentProblem.second;
    const expectedLength = Math.abs(expectedResult).toString().length;
    setAnswerInputs(new Array(expectedLength).fill(''));
  }, [currentProblem, selectedLevel]);

  // Handle answer input changes
  const handleAnswerInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newInputs = [...answerInputs];
      newInputs[index] = value;
      setAnswerInputs(newInputs);
      
      // Auto-focus next input
      if (value && index < answerInputs.length - 1) {
        const nextInput = document.getElementById(`answer-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle keyboard key press
  const handleKeyboardKeyPress = (key: string) => {
    const focusedElement = document.activeElement as HTMLInputElement;
    if (focusedElement && focusedElement.id.startsWith('answer-input-')) {
      const index = parseInt(focusedElement.id.split('-')[2]);
      
      if (key === 'Backspace') {
        if (answerInputs[index] === '' && index > 0) {
          // Move to previous input if current is empty
          const prevInput = document.getElementById(`answer-input-${index - 1}`);
          prevInput?.focus();
        } else {
          handleAnswerInputChange(index, '');
        }
      } else if (key === 'Space') {
        // Move to next input
        if (index < answerInputs.length - 1) {
          const nextInput = document.getElementById(`answer-input-${index + 1}`);
          nextInput?.focus();
        }
      } else if (/^\d$/.test(key)) {
        handleAnswerInputChange(index, key);
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, rigletaValue: number, sourceId?: string, isComponent = false, symbolType?: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rigletaId = `rigleta-${Date.now()}-${Math.random()}`;
    
    const newRigleta: DraggedRigleta = {
      id: rigletaId,
      value: rigletaValue,
      position: { x: rect.left, y: rect.top },
      sourceId,
      isComponent,
      symbolType
    };
    
    // For values > 5, add decomposition components (only for regular rigletas, not symbols)
    if (rigletaValue > 5 && !isComponent && !symbolType) {
      newRigleta.components = rigletaValue === 10 ? [5, 5] : 
                             rigletaValue > 5 ? [5, rigletaValue - 5] : [];
    }
    
    e.dataTransfer.setData('rigleta', JSON.stringify(newRigleta));
    
    if (voiceoverEnabled) {
      const itemName = symbolType ? `simbolul pentru ${rigletaValue}` : `rigletă de ${rigletaValue}`;
      speak(`Ai luat ${itemName}`);
    }
  };

  const handleDrop = (e: React.DragEvent, zoneId: string, targetPosition?: number) => {
    e.preventDefault();
    try {
      const rigletaData = JSON.parse(e.dataTransfer.getData('rigleta')) as DraggedRigleta;
      
      // Validate position matching for class/order constraints
      if (targetPosition !== undefined && rigletaData.sourceId) {
        const sourceMatch = rigletaData.sourceId.match(/(first|second|result)-(\d+)/);
        if (sourceMatch) {
          const sourcePosition = parseInt(sourceMatch[2]);
          // Only allow dropping in same position (units to units, tens to tens, etc.)
          if (sourcePosition !== targetPosition) {
            toast.error("Rigletele pot fi mutate doar în aceeași poziție de ordine!");
            return;
          }
        }
      }
      
      // Update rigleta position and parent
      const rect = e.currentTarget.getBoundingClientRect();
      rigletaData.position = { x: rect.left, y: rect.top };
      rigletaData.parentId = zoneId;
      
      // Add to dropped riglete
      setDraggedRiglete(prev => [...prev, rigletaData]);
      
      // Find matching drop zone and update it
      const zone = dropZones.find(z => z.id === zoneId);
      if (zone) {
        setDropZones(prev => prev.map(z => 
          z.id === zoneId 
            ? { ...z, acceptedValues: [...z.acceptedValues, rigletaData.value] }
            : z
        ));
      }
      
      if (voiceoverEnabled) {
        const zoneType = zoneId.includes('first') ? 'primul număr' : 
                        zoneId.includes('second') ? 'al doilea număr' : 'rezultat';
        speak(`Ai mutat rigletă de ${rigletaData.value} în ${zoneType}`);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Enhanced validation logic with progress tracking
  const validateAnswer = () => {
    setIsValidating(true);
    
    // Calculate result ONLY from answer inputs (no visual validation)
    let inputResult = 0;
    if (answerInputs.length > 0) {
      for (let i = 0; i < answerInputs.length; i++) {
        const digit = parseInt(answerInputs[i] || '0');
        const position = selectedCifra - 1 - i; // Left to right: first box is highest position
        inputResult += digit * Math.pow(10, position);
      }
    }
    
    // Check ONLY the input result
    const inputCorrect = inputResult === Math.abs(currentProblem.result);
    
    if (inputCorrect) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      // Congratulatory messages
      const congratsMessages = [
        "🎉 Excelent! Bravo!",
        "⭐ Perfect! Ești pe drumul cel bun!",
        "🌟 Fantastic! Continuă așa!",
        "🎊 Minunat! Ești foarte bun la matematică!"
      ];
      const randomCongrats = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
      toast.success(randomCongrats);
      
      if (voiceoverEnabled) {
        speak(randomCongrats);
      }
      
      // Check if game is completed
      if (newCorrectAnswers >= totalQuestions) {
        setGameCompleted(true);
        setTimeout(() => {
          toast.success("🏆 Felicitări! Ai terminat toate exercițiile! Ești un adevărat campion la matematică!");
          if (voiceoverEnabled) {
            speak("Felicitări! Ai terminat toate exercițiile!");
          }
        }, 1000);
      } else {
        // Auto generate next problem after 2 seconds
        setTimeout(() => {
          generateProblem();
          setIsValidating(false);
        }, 2000);
      }
    } else {
      // Encouraging messages for wrong answers
      const encouragingMessages = [
        "💪 Aproape! Mai încearcă o dată!",
        "🤔 Verifică din nou calculul!",
        "📚 Nu renunța! Poți să reușești!",
        "🎯 Concentrează-te și încearcă din nou!"
      ];
      const randomEncouragement = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      toast.error(randomEncouragement);
      
      if (voiceoverEnabled) {
        speak(randomEncouragement);
      }
      setIsValidating(false);
    }
  };
  
  // Restart game function
  const restartGame = () => {
    setCorrectAnswers(0);
    setGameCompleted(false);
    generateProblem();
    toast.success("🔄 Joc nou început! Mult succes!");
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ro-RO';
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === 'validate') {
      validateAnswer();
    } else if (key === '\n') {
      validateAnswer();
    } else {
      setUserInput(prev => prev + key);
    }
  };

  const getOrderLabel = (order: number) => {
    const t = gameTranslations[selectedLanguage];
    const labels = [t.units, t.tens, t.hundreds, t.thousands];
    return labels[order] || `${t.order} ${order + 1}`;
  };

  const getOrderColor = (order: number) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-red-500 text-white', 
      'bg-orange-500 text-white',
      'bg-black text-white'
    ];
    return colors[order] || 'bg-gray-500 text-white';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
        {/* Progress Bar - Fixed at top */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
          <ProgressBar 
            current={correctAnswers} 
            total={totalQuestions}
            showCelebration={gameCompleted}
          />
        </div>
        {/* Sidebar */}
        <Sidebar className="w-32">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigare</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/">
                        <Home className="mr-2 h-4 w-4" />
                        {t.back}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-green-600 text-center">
                      {t.language}
                    </div>
                  </div>
                  <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof gameTranslations)}>
                    <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                      <SelectItem value="bg">🇧🇬 Български</SelectItem>
                      <SelectItem value="cz">🇨🇿 Čeština</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                      <SelectItem value="pt">🇵🇹 Português</SelectItem>
                      <SelectItem value="ro">🇷🇴 Română</SelectItem>
                      <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                      <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-purple-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-purple-600 text-center">
                      {t.level}
                    </div>
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full h-6 text-xs border-purple-300 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 border shadow-lg">
                      <SelectItem value="scaderi">{t.levelNames.scaderi}</SelectItem>
                      <SelectItem value="adunari">{t.levelNames.adunari}</SelectItem>
                      <SelectItem value="scaderi-cu-trecere">{t.levelNames.scaderiTrecere}</SelectItem>
                      <SelectItem value="adunari-cu-trecere">{t.levelNames.adunariTrecere}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <NumberSelector
                    value={selectedCifra}
                    min={1}
                    max={9}
                    onChange={setSelectedCifra}
                    className="border-2 border-cyan-300"
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-pink-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-pink-600 text-center">
                      {t.concentrationLabel}
                    </div>
                  </div>
                  <Select value={concentration} onValueChange={(value) => setConcentration(value as ConcentrationLevel)}>
                    <SelectTrigger className="w-full h-6 text-xs border-pink-300 focus:border-pink-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 border shadow-lg">
                      <SelectItem value="0-10">0-10</SelectItem>
                      <SelectItem value="0-letters">0-{languageLetters[selectedLanguage]} (litere)</SelectItem>
                      <SelectItem value="0-100">0-100</SelectItem>
                      <SelectItem value=">">Superior (0-9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tastatură</SidebarGroupLabel>
              <SidebarGroupContent>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <ShopPromoBox language={selectedLanguage} />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <img 
                  src={numLitLogo}
                  alt="NumLit Logo" 
                  className="h-10 w-auto object-contain"
                  draggable={false}
                />
              </div>

              <div className="text-center flex items-center justify-center gap-3">
                <h1 className="text-lg font-semibold">{t.title}</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="w-4 h-4" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-white z-[60] fixed top-[20%]">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">{t.instructions}</DialogTitle>
                      <DialogDescription className="text-center text-muted-foreground">
                        Ghid pentru jocul de calcul vizual NumLit
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-3 text-lg">{t.rigletaTitle}</h4>
                        <p className="text-blue-700 text-base leading-relaxed">
                          {t.rigletaDescription}
                        </p>
                      </div>
                      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-800 mb-3 text-lg">{t.howToPlay}</h4>
                        <p className="text-green-700 text-base leading-relaxed">
                          {t.howToPlayDescription}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-2">
                <ZoomControls 
                  zoom={zoom} 
                  onZoomChange={setZoom} 
                  className="mr-2"
                />
                <Timer isRunning={isPlaying} onTimeUpdate={setGameTime} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mr-2"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceoverEnabled(!voiceoverEnabled)}
                  className={cn(voiceoverEnabled && "bg-green-100")}
                >
                  {voiceoverEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateProblem}
                  disabled={isValidating}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="p-6 mb-32">
            {/* Visual Math Operation Display */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              {/* Number Expression */}
              <div className="flex items-start justify-start mb-6 ml-4">{/* Perfect baseline alignment */}
                {/* First Number with aligned digits and bars */}
                <div className="flex flex-col items-center mr-1">
                  {/* Class Headers for numbers > 4 digits */}
                  {currentProblem.first.toString().length > 4 && (
                    <div className="flex gap-0.5 mb-1">
                      {(() => {
                        const digitCount = currentProblem.first.toString().length;
                        const groups = Math.ceil(digitCount / 3);
                        const classHeaders = [];
                        
                        for (let i = groups - 1; i >= 0; i--) {
                          const groupDigits = i === groups - 1 ? digitCount - (i * 3) : 3;
                          let className = '';
                          let bgColor = '';
                          
                          if (i === 0) {
                            className = gameTranslations[selectedLanguage].unitsClass || 'CLASA UNITĂȚILOR';
                            bgColor = 'bg-blue-500';
                          } else if (i === 1) {
                            className = gameTranslations[selectedLanguage].thousandsClass || 'CLASA MIILOR';
                            bgColor = 'bg-red-500';
                          } else if (i === 2) {
                            className = gameTranslations[selectedLanguage].millionsClass || 'CLASA MILIOANELOR';
                            bgColor = 'bg-orange-500';
                          }
                          
                          classHeaders.push(
                            <div key={i} className="flex flex-col gap-0">
                              <div 
                                className={cn(
                                  'flex items-center justify-center text-white text-xs font-bold px-1 py-1 rounded-sm',
                                  bgColor
                                )}
                                style={{ width: `${groupDigits * 43 + (groupDigits - 1) * 2}px`, height: '20px' }}
                              >
                                {className}
                              </div>
                              <div className="flex gap-0.5">
                                {Array.from({ length: groupDigits }, (_, idx) => (
                                  <div 
                                    key={idx}
                                    className={cn(
                                      'flex items-center justify-center text-white text-xs font-bold rounded-sm',
                                      bgColor
                                    )}
                                    style={{ width: '43px', height: '16px' }}
                                  >
                                    {idx === groupDigits - 3 ? 'S' : idx === groupDigits - 2 ? 'Z' : 'U'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        
                        return classHeaders;
                      })()}
                    </div>
                  )}
                  
                  {/* Digit squares row */}
                  <div className="flex gap-0.5 mb-2">
                    {currentProblem.first.toString().split('').map((digit, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          'flex items-center justify-center font-bold border-2 border-gray-400 rounded',
                          parseInt(digit) % 2 === 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        )}
                        style={{ width: '48px', height: '48px', fontSize: '48px' }}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  
                  {/* Container with rigletas for the digit */}
                   <div className="flex gap-0.5 items-start">{/* Perfect baseline alignment */}
                    {currentProblem.first.toString().split('').map((digit, digitIndex) => {
                      const digitPosition = currentProblem.first.toString().length - digitIndex - 1;
                      const digitValue = parseInt(digit);
                      const isRigletaMoved = draggedRiglete.some(r => r.sourceId === `first-${digitPosition}` && r.parentId !== `first-${digitPosition}`);
                      
                      return (
                         <div key={digitIndex} className="flex flex-col items-start">{/* Perfect baseline alignment */}
                          {/* Container showing rigletas for this digit - aligned at top baseline */}
                          <div 
                            className={cn(
                              'border-2 border-solid border-blue-300 rounded-lg flex flex-col justify-start items-center p-1',
                              'bg-blue-50'
                            )}
                            style={{ 
                              width: '43px', 
                              minHeight: '154px',
                              height: 'auto' // Allow container to grow
                            }}
                          >
                            {/* Rigletas for this digit value - draggable, aligned at top baseline */}
                            <div className="flex flex-col gap-0 items-center w-full">
                              {digitValue > 0 && !isRigletaMoved && (
                                <div 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, digitValue, `first-${digitPosition}`)}
                                  className="cursor-move hover:scale-105 transition-transform"
                                >
                                    <Rigleta number={digitValue} orientation="vertical" className="transform scale-75" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                   </div>
                </div>

                <div className="flex items-center justify-center mx-1">
                   <span className="text-3xl font-bold text-gray-700">
                    {selectedLevel.includes('adunari') ? '+' : '-'}
                  </span>
                </div>

                {/* Second Number with aligned digits and bars */}
                <div className="flex flex-col items-center mr-1">
                  {/* Class Headers for numbers > 4 digits */}
                  {currentProblem.second.toString().length > 4 && (
                    <div className="flex gap-0.5 mb-1">
                      {(() => {
                        const digitCount = currentProblem.second.toString().length;
                        const groups = Math.ceil(digitCount / 3);
                        const classHeaders = [];
                        
                        for (let i = groups - 1; i >= 0; i--) {
                          const groupDigits = i === groups - 1 ? digitCount - (i * 3) : 3;
                          let className = '';
                          let bgColor = '';
                          
                          if (i === 0) {
                            className = gameTranslations[selectedLanguage].unitsClass || 'CLASA UNITĂȚILOR';
                            bgColor = 'bg-blue-500';
                          } else if (i === 1) {
                            className = gameTranslations[selectedLanguage].thousandsClass || 'CLASA MIILOR';
                            bgColor = 'bg-red-500';
                          } else if (i === 2) {
                            className = gameTranslations[selectedLanguage].millionsClass || 'CLASA MILIOANELOR';
                            bgColor = 'bg-orange-500';
                          }
                          
                          classHeaders.push(
                            <div key={i} className="flex flex-col gap-0">
                              <div 
                                className={cn(
                                  'flex items-center justify-center text-white text-xs font-bold px-1 py-1 rounded-sm',
                                  bgColor
                                )}
                                style={{ width: `${groupDigits * 43 + (groupDigits - 1) * 2}px`, height: '20px' }}
                              >
                                {className}
                              </div>
                              <div className="flex gap-0.5">
                                {Array.from({ length: groupDigits }, (_, idx) => (
                                  <div 
                                    key={idx}
                                    className={cn(
                                      'flex items-center justify-center text-white text-xs font-bold rounded-sm',
                                      bgColor
                                    )}
                                    style={{ width: '43px', height: '16px' }}
                                  >
                                    {idx === groupDigits - 3 ? 'S' : idx === groupDigits - 2 ? 'Z' : 'U'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        
                        return classHeaders;
                      })()}
                    </div>
                  )}
                  
                  {/* Digit squares row */}
                  <div className="flex gap-0.5 mb-2">
                    {currentProblem.second.toString().split('').map((digit, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          'flex items-center justify-center font-bold border-2 border-gray-400 rounded',
                          parseInt(digit) % 2 === 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        )}
                        style={{ width: '48px', height: '48px', fontSize: '48px' }}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  
                  {/* Container with rigletas for the digit */}
                   <div className="flex gap-0.5 items-start">{/* Perfect baseline alignment */}
                    {currentProblem.second.toString().split('').map((digit, digitIndex) => {
                      const digitPosition = currentProblem.second.toString().length - digitIndex - 1;
                      const digitValue = parseInt(digit);
                      const isRigletaMoved = draggedRiglete.some(r => r.sourceId === `second-${digitPosition}` && r.parentId !== `second-${digitPosition}`);
                      
                      return (
                         <div key={digitIndex} className="flex flex-col items-start">{/* Perfect baseline alignment */}
                          {/* Container showing rigletas for this digit - aligned at top baseline */}
                          <div 
                            className={cn(
                              'border-2 border-solid border-green-300 rounded-lg flex flex-col justify-start items-center p-1',
                              'bg-green-50'
                            )}
                            style={{ 
                              width: '43px', 
                              minHeight: '154px',
                              height: 'auto' // Allow container to grow
                            }}
                          >
                            {/* Rigletas for this digit value - draggable, aligned at top baseline */}
                            <div className="flex flex-col gap-0 items-center w-full">
                              {digitValue > 0 && !isRigletaMoved && (
                                <div 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, digitValue, `second-${digitPosition}`)}
                                  className="cursor-move hover:scale-105 transition-transform"
                                >
                                  <Rigleta number={digitValue} orientation="vertical" className="transform scale-75" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center mx-1">
                  <span className="text-3xl font-bold text-gray-700">=</span>
                </div>

                {/* Result with aligned digits and bars */}
                <div className="flex flex-col items-center">
                  {/* Class Headers for result - based on expected result length */}
                  {(() => {
                    // Calculate expected result length
                    const expectedResult = selectedLevel.includes('adunari') 
                      ? currentProblem.first + currentProblem.second 
                      : currentProblem.first - currentProblem.second;
                    const expectedLength = Math.abs(expectedResult).toString().length;
                    const actualLength = userInput ? userInput.length : expectedLength;
                    const displayLength = Math.max(expectedLength, actualLength);
                    
                    if (displayLength > 4) {
                      return (
                        <div className="flex gap-0.5 mb-1">
                          {(() => {
                            const digitCount = displayLength;
                            const groups = Math.ceil(digitCount / 3);
                            const classHeaders = [];
                            
                            for (let i = groups - 1; i >= 0; i--) {
                              const groupDigits = i === groups - 1 ? digitCount - (i * 3) : 3;
                              let className = '';
                              let bgColor = '';
                              
                              if (i === 0) {
                                className = gameTranslations[selectedLanguage].unitsClass || 'CLASA UNITĂȚILOR';
                                bgColor = 'bg-blue-500';
                              } else if (i === 1) {
                                className = gameTranslations[selectedLanguage].thousandsClass || 'CLASA MIILOR';
                                bgColor = 'bg-red-500';
                              } else if (i === 2) {
                                className = gameTranslations[selectedLanguage].millionsClass || 'CLASA MILIOANELOR';
                                bgColor = 'bg-orange-500';
                              }
                              
                              classHeaders.push(
                                <div key={i} className="flex flex-col gap-0">
                                  <div 
                                    className={cn(
                                      'flex items-center justify-center text-white text-xs font-bold px-1 py-1 rounded-sm',
                                      bgColor
                                    )}
                                    style={{ width: `${groupDigits * 43 + (groupDigits - 1) * 2}px`, height: '20px' }}
                                  >
                                    {className}
                                  </div>
                                  <div className="flex gap-0.5">
                                    {Array.from({ length: groupDigits }, (_, idx) => (
                                      <div 
                                        key={idx}
                                        className={cn(
                                          'flex items-center justify-center text-white text-xs font-bold rounded-sm',
                                          bgColor
                                        )}
                                        style={{ width: '43px', height: '16px' }}
                                      >
                                        {idx === groupDigits - 3 ? 'S' : idx === groupDigits - 2 ? 'Z' : 'U'}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            
                            return classHeaders;
                          })()}
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Result digit squares */}
                  <div className="flex gap-0.5 mb-2">
                    {(() => {
                      const expectedResult = selectedLevel.includes('adunari') 
                        ? currentProblem.first + currentProblem.second 
                        : currentProblem.first - currentProblem.second;
                      const expectedLength = Math.abs(expectedResult).toString().length;
                      const actualLength = userInput ? userInput.length : expectedLength;
                      const maxLength = Math.max(expectedLength, actualLength, Math.max(currentProblem.first.toString().length, currentProblem.second.toString().length));
                      
                      if (userInput) {
                        return userInput.split('').map((digit, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-center font-bold border-2 border-blue-400 bg-blue-50 text-blue-600 rounded"
                             style={{ width: '48px', height: '48px', fontSize: '48px' }}
                           >
                             {digit}
                          </div>
                        ));
                       } else {
                         // Show answer input boxes for expected result length
                         return Array.from({ length: Math.max(maxLength, 1) }, (_, index) => (
                           <input
                             key={index}
                             id={`answer-input-${index}`}
                             type="text"
                             maxLength={1}
                             value={answerInputs[index] || ''}
                             onChange={(e) => handleAnswerInputChange(index, e.target.value)}
                             className="flex items-center justify-center font-bold border-2 border-purple-300 bg-white text-purple-600 rounded text-center focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                              style={{ width: '48px', height: '48px', fontSize: '48px' }}
                              placeholder="?"
                           />
                         ));
                       }
                    })()}
                  </div>
                  
                  {/* Result bars */}
                   <div className="flex gap-0.5 items-start">{/* Perfect baseline alignment */}
                    {(() => {
                      const expectedResult = selectedLevel.includes('adunari') 
                        ? currentProblem.first + currentProblem.second 
                        : currentProblem.first - currentProblem.second;
                      const expectedLength = Math.abs(expectedResult).toString().length;
                      const actualLength = userInput ? userInput.length : expectedLength;
                      const maxLength = Math.max(expectedLength, actualLength, Math.max(currentProblem.first.toString().length, currentProblem.second.toString().length));
                      
                      return Array.from({ length: maxLength }, (_, digitIndex) => {
                        const digitPosition = maxLength - digitIndex - 1;
                        return (
                          <div key={digitIndex} className="flex flex-col items-start">{/* Perfect baseline alignment */}
                           {/* Result container - dynamically expandable, properly separated */}
                           <div 
                             className={cn(
                               'border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center p-1',
                               'hover:border-purple-400 hover:bg-purple-50 transition-colors'
                             )}
                             style={{ 
                               width: '43px', 
                               minHeight: '154px',
                               height: 'auto' // Allow container to grow
                             }}
                             onDrop={(e) => handleDrop(e, `result-${digitPosition}`, digitPosition)}
                             onDragOver={handleDragOver}
                           >
                             {/* First term rigletas - at top, aligned at baseline */}
                             <div className="flex flex-col gap-0 items-center w-full justify-start">
                               {draggedRiglete
                                 .filter(r => r.parentId === `result-${digitPosition}` && r.sourceId.startsWith('first-'))
                                 .map((rigleta, idx) => (
                                    <div key={idx}>
                                      <Rigleta number={rigleta.value} orientation="vertical" />
                                    </div>
                                 ))
                               }
                             </div>
                             
                             {/* Separator line - only show if there are rigletas from both terms */}
                             {draggedRiglete.filter(r => r.parentId === `result-${digitPosition}` && r.sourceId.startsWith('first-')).length > 0 && 
                              draggedRiglete.filter(r => r.parentId === `result-${digitPosition}` && r.sourceId.startsWith('second-')).length > 0 && (
                               <div className="w-full h-0.5 bg-gray-300 my-1 flex-shrink-0"></div>
                             )}
                             
                             {/* Second term rigletas - at bottom, aligned at baseline */}
                             <div className="flex flex-col gap-0 items-center w-full justify-start">
                               {draggedRiglete
                                 .filter(r => r.parentId === `result-${digitPosition}` && r.sourceId.startsWith('second-'))
                                 .map((rigleta, idx) => (
                                     <div key={idx}>
                                       <Rigleta number={rigleta.value} orientation="vertical" />
                                     </div>
                                  ))
                                }
                             </div>
                           </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>


              {/* Order-based Calculation Display */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-xl font-semibold mb-6 text-center hidden">{gameTranslations[selectedLanguage].orderDecomposition}</h4>
                <div className="text-center font-mono text-3xl leading-normal space-y-2">
                  {(() => {
                    const first = currentProblem.first;
                    const second = currentProblem.second;
                    const isAddition = selectedLevel.includes('adunari');
                    const result = isAddition ? first + second : first - second;
                    
                     // Decompose numbers into place values showing positional values
                     const getDecomposition = (num, targetLength) => {
                       const str = num.toString();
                       const parts = [];
                       
                       // Create parts based on selectedCifra from right to left
                       for (let i = 0; i < targetLength; i++) {
                         const digitIndex = str.length - 1 - i; // Right to left
                         const digit = digitIndex >= 0 ? parseInt(str[digitIndex]) : 0;
                         const position = i; // Position from right (0 = units, 1 = tens, etc.)
                         const value = digit * Math.pow(10, position);
                         
                         // Add to beginning to maintain left-to-right display order for higher positions first
                         if (value > 0 || i === 0) { // Always include units, even if 0
                           parts.unshift(value);
                         }
                       }
                       return parts;
                     };
                    
                     // Determine the target length based on selected digits
                     const actualTargetLength = selectedCifra;
                     
                     const firstParts = getDecomposition(first, actualTargetLength);
                     const secondParts = getDecomposition(second, actualTargetLength);
                    
                    // Calculate combined parts by orders with borrowing/carrying method
                    const calculateWithBorrowingCarrying = () => {
                      const maxLength = Math.max(first.toString().length, second.toString().length);
                      const firstDigits = [];
                      const secondDigits = [];
                      const resultDigits = [];
                      const steps = [];
                      
                      // Get initial digits
                      for (let i = 0; i < maxLength; i++) {
                        const firstStr = first.toString();
                        const secondStr = second.toString();
                        firstDigits.push(i < firstStr.length ? parseInt(firstStr[firstStr.length - 1 - i]) : 0);
                        secondDigits.push(i < secondStr.length ? parseInt(secondStr[secondStr.length - 1 - i]) : 0);
                      }
                      
                      // Working copies for borrowing/carrying
                      const workingFirst = [...firstDigits];
                      const workingSecond = [...secondDigits];
                      let carry = 0;
                      
                      if (isAddition) {
                        // Addition with carrying
                        for (let i = 0; i < maxLength; i++) {
                          const sum = workingFirst[i] + workingSecond[i] + carry;
                          if (sum >= 10) {
                            resultDigits[i] = sum - 10;
                            carry = 1;
                            steps.push({
                              position: i,
                              operation: 'carry',
                              from: sum,
                              result: sum - 10,
                              carry: 1
                            });
                          } else {
                            resultDigits[i] = sum;
                            carry = 0;
                            steps.push({
                              position: i,
                              operation: 'add',
                              result: sum,
                              carry: 0
                            });
                          }
                        }
                        // Handle final carry
                        if (carry > 0) {
                          resultDigits.push(carry);
                        }
                      } else {
                        // Subtraction with borrowing
                        for (let i = 0; i < maxLength; i++) {
                          let minuend = workingFirst[i];
                          let subtrahend = workingSecond[i];
                          
                          if (minuend < subtrahend) {
                            // Need to borrow
                            let borrowPos = i + 1;
                            while (borrowPos < maxLength && workingFirst[borrowPos] === 0) {
                              workingFirst[borrowPos] = 9;
                              borrowPos++;
                            }
                            if (borrowPos < maxLength) {
                              workingFirst[borrowPos]--;
                              minuend += 10;
                              workingFirst[i] = minuend;
                              steps.push({
                                position: i,
                                operation: 'borrow',
                                from: borrowPos,
                                newValue: minuend
                              });
                            }
                          }
                          
                          resultDigits[i] = minuend - subtrahend;
                          steps.push({
                            position: i,
                            operation: 'subtract',
                            minuend: minuend,
                            subtrahend: subtrahend,
                            result: resultDigits[i]
                          });
                        }
                      }
                      
                      return { workingFirst, workingSecond, resultDigits, steps };
                    };
                    
                    const calculation = calculateWithBorrowingCarrying();
                    
                    // Create grid structure for perfect alignment
                    const maxLength = Math.max(first.toString().length, second.toString().length);
                    const orders = ['unități', 'zeci', 'sute', 'mii', 'zeci de mii', 'sute de mii', 'milioane', 'zeci de milioane', 'sute de milioane'];
                    
                    // Get digits by position for each number (using working digits after borrowing/carrying)
                    const firstDigits = calculation.workingFirst;
                    const secondDigits = calculation.workingSecond;
                    const resultDigits = calculation.resultDigits;

                     return (
                       <div className="font-mono bg-white p-6 rounded-lg border-2 border-gray-200">
                        
                        {/* NumLit Table with visual representation */}
                        <div className="flex flex-col items-center space-y-1">
                          
                          {/* Display RigletaNumLit components for both numbers */}
                          <div className="flex flex-col items-center gap-1">
                             {/* First number with RigletaNumLit */}
                             <div className="flex items-center gap-2">
                               <div className="flex flex-col items-center gap-2">
                                 <span className="text-blue-600 font-bold text-lg">{t.term1}: {first}</span>
                                 <RigletaNumLit number={first} />
                               </div>
                               {/* Mathematical square aligned with RigletaNumLit */}
                               <div 
                                 className="flex items-center justify-center font-bold border-2 border-gray-400 rounded bg-yellow-50 mt-8"
                                 style={{ width: '43px', height: '43px', fontSize: '24px' }}
                               >
                                 <span className="text-gray-600">{isAddition ? '+' : '-'}</span>
                               </div>
                             </div>
                             
                             
                             {/* Second number with RigletaNumLit - reduced gap */}
                             <div className="flex flex-col items-center">
                               <span className="text-green-600 font-bold text-lg">{t.term2}: {second}</span>
                               <RigletaNumLit number={second} />
                             </div>
                           </div>
                          
                          {/* Aligned decomposition under the NumLit table structure */}
                          <div className="mt-6">
                            
                            
                            {(() => {
                              // Create complete positional decomposition for each number
                              const getCompleteDecomposition = (num) => {
                                const str = num.toString();
                                const decomposition = [];
                                
                                // Generate all positional values from left to right, but only show up to selectedCifra digits from right
                                for (let i = 0; i < Math.min(str.length, selectedCifra); i++) {
                                  const digitIndex = str.length - 1 - i; // From right to left
                                  const digit = parseInt(str[digitIndex]);
                                  const positionalValue = digit * Math.pow(10, i);
                                  
                                  // Add to beginning to show higher order values first (left to right display)
                                  decomposition.unshift(positionalValue);
                                }
                                
                                return decomposition;
                              };
                              
                              const firstDecomposition = getCompleteDecomposition(first);
                              const secondDecomposition = getCompleteDecomposition(second);
                              
                              // Calculate the maximum width needed for proper alignment
                              const maxValues = Math.max(firstDecomposition.length, secondDecomposition.length);
                              
                              // Pad arrays to same length for perfect alignment
                              while (firstDecomposition.length < maxValues) {
                                firstDecomposition.unshift(0);
                              }
                              while (secondDecomposition.length < maxValues) {
                                secondDecomposition.unshift(0);
                              }
                              
                              return (
                                <div className="flex flex-col items-center">
                                  {/* Complete decomposition with perfect alignment */}
                                  <div className="space-y-1 font-mono">
                                    {/* First number decomposition */}
                                    <div className="flex items-center">
                                      <span className="text-blue-600 font-bold text-lg w-32 text-right mr-4">{first} =</span>
                                      <div className="flex items-center">
                                        {firstDecomposition.map((value, index) => (
                                          <div key={index} className="flex items-center">
                                            {index > 0 && (
                                              <span className="text-black font-bold text-lg mx-2">+</span>
                                            )}
                                            <span 
                                              className="text-blue-600 font-bold text-lg"
                                              style={{ minWidth: '100px', textAlign: 'center' }}
                                            >
                                              {value.toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                         {/* Mathematical square positioned to the right of units column */}
                                         <div 
                                           className="flex items-center justify-center font-bold border-2 border-gray-400 rounded bg-yellow-50 ml-4"
                                           style={{ width: '43px', height: '43px', fontSize: '24px' }}
                                         >
                                           <span className="text-gray-600">{isAddition ? '+' : '-'}</span>
                                         </div>
                                      </div>
                                    </div>
                                    
                                    {/* Second number decomposition - closer to first */}
                                    <div className="flex items-center">
                                      <span className="text-green-600 font-bold text-lg w-32 text-right mr-4">{second} =</span>
                                      <div className="flex items-center">
                                        {secondDecomposition.map((value, index) => (
                                          <div key={index} className="flex items-center">
                                            {index > 0 && (
                                              <span className="text-black font-bold text-lg mx-2">+</span>
                                            )}
                                            <span 
                                              className="text-green-600 font-bold text-lg"
                                              style={{ minWidth: '100px', textAlign: 'center' }}
                                            >
                                              {value.toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                     {/* Divider line */}
                                     <div className="border-t-2 border-black ml-36" style={{width: `${maxValues * 120}px`}}></div>
                                     
                                      {/* Result Input Section - Interactive boxes for children */}
                                      <div className="flex items-end bg-yellow-100 p-2 rounded-lg border-2 border-yellow-400 gap-2">
                                        <span className="text-black font-bold text-lg mb-6">{t.result}:</span>
                                        
                                        {/* Invisible minus sign */}
                                        <span style={{ fontSize: '0px', width: '0px', height: '0px', opacity: 0 }}>-</span>
                                        
                                        {/* Result input boxes - Simple left to right display matching visual result */}
                                        <div className="flex gap-1 justify-center" style={{ width: `${maxValues * 120}px` }}>
                                          {Array.from({ length: selectedCifra }, (_, index) => {
                                            const getPlaceLabel = (pos: number) => {
                                              const placeValue = selectedCifra - 1 - pos;
                                              switch(placeValue) {
                                                case 0: return t.unitsShort;
                                                case 1: return t.tensShort;
                                                case 2: return 'S'; // Sute/Hundreds
                                                case 3: return 'M'; // Mii/Thousands
                                                case 4: return 'DM'; // Zeci de mii
                                                case 5: return 'SM'; // Sute de mii
                                                default: return placeValue.toString();
                                              }
                                            };
                                            return (
                                              <div key={index} className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-gray-600 h-4 flex items-center">
                                                  {getPlaceLabel(index)}
                                                </span>
                                                <input
                                                  type="text"
                                                  maxLength={1}
                                                  className="w-12 h-12 font-bold text-center border-2 border-blue-400 rounded focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                                                  style={{ fontSize: '43px' }}
                                                  placeholder="0"
                                                  value={answerInputs[index] || ''}
                                                  onChange={(e) => handleAnswerInputChange(index, e.target.value)}
                                                />
                                              </div>
                                             );
                                           })}
                                         </div>
                                         
                                         {/* Validation Button */}
                                         <Button
                                           onClick={validateAnswer}
                                           disabled={isValidating || answerInputs.every(input => !input) || gameCompleted}
                                           className={cn(
                                             "ml-4 px-6 py-3 font-bold text-lg transition-all duration-200 hover:scale-105",
                                             gameCompleted 
                                               ? "bg-green-500 hover:bg-green-600 text-white" 
                                               : "bg-blue-600 hover:bg-blue-700 text-white"
                                           )}
                                         >
                                           {isValidating ? (
                                             <div className="flex items-center gap-2">
                                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                               Validez...
                                             </div>
                                           ) : gameCompleted ? (
                                             "🎉 Joc Terminat!"
                                           ) : (
                                             <div className="flex items-center gap-2">
                                               <CheckCircle className="w-5 h-5" />
                                               {t.validateAnswer}
                                             </div>
                                           )}
                                         </Button>
                                      </div>
                                      
                                      {/* Game Controls */}
                                      <div className="flex justify-center mt-4">
                                        <GameControls
                                          onRepeat={restartGame}
                                          className="bg-white/80 rounded-full p-2 shadow-lg"
                                        />
                                      </div>
                                    </div>
                                  
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                    );
                  })()}
                </div>


          </div>
          </div>
        </div>
      </div>
      
      {/* Fixed NumLit Keyboard Toggle Button - Bottom Right Corner */}
      <Button
        onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-20 h-20 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-4",
          isKeyboardVisible 
            ? "bg-blue-600 hover:bg-blue-700 border-yellow-400 text-white" 
            : "bg-white hover:bg-blue-50 border-red-500 text-blue-600"
        )}
        title={isKeyboardVisible ? "Ascunde tastatura NumLit" : "Arată tastatura NumLit"}
      >
        <div className="flex flex-col items-center justify-center">
          <Keyboard className="w-8 h-8 mb-1" />
          <span className="text-2xl font-bold">⌨️</span>
        </div>
      </Button>
      
      {/* NumLit Keyboard */}
      {isKeyboardVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <NumLitKeyboard
            onKeyPress={handleKeyboardKeyPress}
            onClose={() => setIsKeyboardVisible(false)}
            maxNumber={getMaxNumberForKeyboard()}
            includeOperators={false}
            className="shadow-2xl"
            concentration={concentration}
            selectedLanguage={selectedLanguage}
            onConcentrationChange={setConcentration}
            onLanguageChange={(lang) => setSelectedLanguage(lang as keyof typeof gameTranslations)}
          />
        </div>
      )}
      
      </div>
    </SidebarProvider>
  );
}
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import GameControls from "@/components/educational/GameControls";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import ProgressBar from "@/components/educational/ProgressBar";
import { GeometricShapesLevel2 } from "@/components/educational/GeometricShapes";
import { CheckCircle, Home, Info, Keyboard, Globe, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ShopPromoBox from "@/components/educational/ShopPromoBox";

// Translations for the fractions game
const fractionsTranslations = {
  ro: {
    title: "MAJoc Cu Fracții",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    levelNames: {
      1: "Nivel 1",
      2: "Nivel 2", 
      3: "Nivel 3",
      4: "Nivel 4"
    },
    fractionTypeLabel: "Tipul de fracții",
    digitLabel: "Numărul de cifre",
    instructions: "Instrucțiuni",
    instructionsText: "Selectează un numărător și un numitor pentru a crea fracții.",
    showKeyboard: "Afișează tastatura",
    hideKeyboard: "Ascunde tastatura",
    validateAnswer: "Validează răspunsul",
    chooseNumerator: "Alege Numărător",
    chooseDenominator: "Alege Numitor",
    numerator: "Numărător",
    denominator: "Numitor",
    fractionType: "Tipul de fracții",
    digitCount: "Numărul de cifre",
    numLitKeyboard: "Tastatura NumLit",
    selectNumerator: "Alege Numărător",
    selectDenominator: "Alege Numitor",
    buildFraction: "Construiește Fracția",
    clickRectangles: "Apasă pe dreptunghiurile de sus pentru a colora",
    moveRigletas: "Mută rigletele pentru a forma fracția",
    parts: "părți",
    congratulations: "Felicitări",
    correctAnswer: "Răspuns corect",
    perfectAnswer: "Răspuns perfect",
    tryAgain: "Mai încearcă",
    almostCorrect: "Ești aproape de răspunsul corect",
    onRightTrack: "Ești pe drumul cel bun",
    nextProblem: "Următoarea problemă!",
    numeratorLabel: "NUMĂRĂTOR",
    denominatorLabel: "NUMITOR",
    clickPartsInstruction: "Apasă pe părțile fiecărei figuri pentru a le colora",
    fractionTypes: {
      subunitare: "Subunitare",
      echiunitare: "Echiunitare", 
      supraunitare: "Supraunitare",
      zecimale: "Zecimale",
      procente: "Procente"
    },
    digitLabels: {
      single: "cifră",
      plural: "cifre"
    },
    chooseNumber: "Alege numărul",
    colorRectanglesInstruction: "Apasă pe dreptunghiurile de sus pentru a colora {numerator} din {denominator} părți",
    fractionPresets: {
      aleator: "Aleator",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Tipul de fracții"
  },
  en: {
    title: "MAGame With Fractions",
    back: "Back",
    language: "Language",
    level: "Level",
    levelNames: {
      1: "Level 1",
      2: "Level 2",
      3: "Level 3", 
      4: "Level 4"
    },
    fractionTypeLabel: "Fraction type",
    digitLabel: "Number of digits",
    instructions: "Instructions",
    instructionsText: "Select a numerator and a denominator to create fractions.",
    showKeyboard: "Show keyboard",
    hideKeyboard: "Hide keyboard",
    validateAnswer: "Validate answer",
    chooseNumerator: "Choose Numerator",
    chooseDenominator: "Choose Denominator",
    numerator: "Numerator",
    denominator: "Denominator",
    fractionType: "Fraction type",
    digitCount: "Number of digits",
    numLitKeyboard: "NumLit Keyboard",
    selectNumerator: "Select Numerator",
    selectDenominator: "Select Denominator",
    buildFraction: "Build Fraction",
    clickRectangles: "Click on the rectangles above to color",
    moveRigletas: "Move rigletas to form the fraction",
    parts: "parts",
    congratulations: "Congratulations",
    correctAnswer: "Correct answer",
    perfectAnswer: "Perfect answer",
    tryAgain: "Try again",
    almostCorrect: "You are close to the correct answer",
    onRightTrack: "You are on the right track",
    nextProblem: "Next problem!",
    numeratorLabel: "NUMERATOR",
    denominatorLabel: "DENOMINATOR",
    clickPartsInstruction: "Click on the parts of each figure to color them",
    fractionTypes: {
      subunitare: "Proper fractions",
      echiunitare: "Unit fractions",
      supraunitare: "Improper fractions", 
      zecimale: "Decimal fractions",
      procente: "Percentages"
    },
    digitLabels: {
      single: "digit",
      plural: "digits"
    },
    chooseNumber: "Choose number",
    colorRectanglesInstruction: "Click on the rectangles above to color {numerator} out of {denominator} parts",
    fractionPresets: {
      aleator: "Random",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Fraction Type"
  },
  fr: {
    title: "MAJeu Avec Fractions",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    levelNames: {
      1: "Niveau 1",
      2: "Niveau 2",
      3: "Niveau 3",
      4: "Niveau 4"
    },
    fractionTypeLabel: "Type de fractions",
    digitLabel: "Nombre de chiffres",
    instructions: "Instructions",
    instructionsText: "Sélectionnez un numérateur et un dénominateur pour créer des fractions.",
    showKeyboard: "Afficher le clavier",
    hideKeyboard: "Masquer le clavier",
    validateAnswer: "Valider la réponse",
    chooseNumerator: "Choisir Numérateur",
    chooseDenominator: "Choisir Dénominateur",
    numerator: "Numérateur",
    denominator: "Dénominateur",
    fractionType: "Type de fractions",
    digitCount: "Nombre de chiffres",
    numLitKeyboard: "Clavier NumLit",
    selectNumerator: "Sélectionner Numérateur",
    selectDenominator: "Sélectionner Dénominateur",
    buildFraction: "Construire Fraction",
    clickRectangles: "Cliquez sur les rectangles ci-dessus pour colorier",
    moveRigletas: "Déplacer les rigletas pour former la fraction",
    parts: "parties",
    congratulations: "Félicitations",
    correctAnswer: "Réponse correcte",
    perfectAnswer: "Réponse parfaite",
    tryAgain: "Essayez encore",
    almostCorrect: "Vous êtes proche de la bonne réponse",
    onRightTrack: "Vous êtes sur la bonne voie",
    nextProblem: "Problème suivant!",
    numeratorLabel: "NUMÉRATEUR",
    denominatorLabel: "DÉNOMINATEUR",
    clickPartsInstruction: "Cliquez sur les parties de chaque figure pour les colorier",
    fractionTypes: {
      subunitare: "Fractions propres",
      echiunitare: "Fractions unitaires",
      supraunitare: "Fractions impropres",
      zecimale: "Fractions décimales",
      procente: "Pourcentages"
    },
    digitLabels: {
      single: "chiffre",
      plural: "chiffres"
    },
    chooseNumber: "Choisir le nombre",
    colorRectanglesInstruction: "Cliquez sur les rectangles ci-dessus pour colorier {numerator} sur {denominator} parties",
    fractionPresets: {
      aleator: "Aléatoire",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Type de fractions"
  },
  de: {
    title: "MASpiel Mit Brüchen",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    levelNames: {
      1: "Stufe 1",
      2: "Stufe 2",
      3: "Stufe 3",
      4: "Stufe 4"
    },
    fractionTypeLabel: "Bruchtyp",
    digitLabel: "Anzahl der Ziffern",
    instructions: "Anweisungen",
    instructionsText: "Wählen Sie einen Zähler und einen Nenner, um Brüche zu erstellen.",
    showKeyboard: "Tastatur anzeigen",
    hideKeyboard: "Tastatur ausblenden",
    validateAnswer: "Antwort validieren",
    chooseNumerator: "Zähler Wählen",
    chooseDenominator: "Nenner Wählen",
    numerator: "Zähler",
    denominator: "Nenner",
    fractionType: "Bruchtyp",
    digitCount: "Anzahl der Ziffern",
    numLitKeyboard: "NumLit Tastatur",
    selectNumerator: "Zähler Auswählen",
    selectDenominator: "Nenner Auswählen",
    buildFraction: "Bruch Erstellen",
    clickRectangles: "Klicken Sie auf die Rechtecke oben zum Färben",
    moveRigletas: "Bewegen Sie die Rigletas, um den Bruch zu bilden",
    parts: "Teile",
    congratulations: "Glückwunsch",
    correctAnswer: "Richtige Antwort",
    perfectAnswer: "Perfekte Antwort",
    tryAgain: "Versuchen Sie es nochmal",
    almostCorrect: "Sie sind nah an der richtigen Antwort",
    onRightTrack: "Sie sind auf dem richtigen Weg",
    nextProblem: "Nächste Aufgabe!",
    numeratorLabel: "ZÄHLER",
    denominatorLabel: "NENNER",
    clickPartsInstruction: "Klicken Sie auf die Teile jeder Figur, um sie zu färben",
    fractionTypes: {
      subunitare: "Echte Brüche",
      echiunitare: "Stammbrüche",
      supraunitare: "Unechte Brüche",
      zecimale: "Dezimalbrüche",
      procente: "Prozentsätze"
    },
    digitLabels: {
      single: "Ziffer",
      plural: "Ziffern"
    },
    chooseNumber: "Zahl wählen",
    colorRectanglesInstruction: "Klicken Sie auf die Rechtecke oben, um {numerator} von {denominator} Teilen zu färben",
    fractionPresets: {
      aleator: "Zufällig",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Bruchtyp"
  },
  es: {
    title: "MAJuego Con Fracciones",
    back: "Atrás",
    language: "Idioma",
    level: "Nivel",
    levelNames: {
      1: "Nivel 1",
      2: "Nivel 2",
      3: "Nivel 3",
      4: "Nivel 4"
    },
    fractionTypeLabel: "Tipo de fracciones",
    digitLabel: "Número de dígitos",
    instructions: "Instrucciones",
    instructionsText: "Selecciona un numerador y un denominador para crear fracciones.",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar respuesta",
    chooseNumerator: "Elegir Numerador",
    chooseDenominator: "Elegir Denominador",
    numerator: "Numerador",
    denominator: "Denominador",
    fractionType: "Tipo de fracciones",
    digitCount: "Número de dígitos",
    numLitKeyboard: "Teclado NumLit",
    selectNumerator: "Seleccionar Numerador",
    selectDenominator: "Seleccionar Denominador",
    buildFraction: "Construir Fracción",
    clickRectangles: "Haz clic en los rectángulos de arriba para colorear",
    moveRigletas: "Mueve las rigletas para formar la fracción",
    parts: "partes",
    congratulations: "Felicitaciones",
    correctAnswer: "Respuesta correcta",
    perfectAnswer: "Respuesta perfecta",
    tryAgain: "Inténtalo de nuevo",
    almostCorrect: "Estás cerca de la respuesta correcta",
    onRightTrack: "Vas por buen camino",
    nextProblem: "¡Siguiente problema!",
    numeratorLabel: "NUMERADOR",
    denominatorLabel: "DENOMINADOR",
    clickPartsInstruction: "Haz clic en las partes de cada figura para colorearlas",
    fractionTypes: {
      subunitare: "Fracciones propias",
      echiunitare: "Fracciones unitarias",
      supraunitare: "Fracciones impropias",
      zecimale: "Fracciones decimales",
      procente: "Porcentajes"
    },
    digitLabels: {
      single: "dígito",
      plural: "dígitos"
    },
    chooseNumber: "Elegir número",
    colorRectanglesInstruction: "Haz clic en los rectángulos de arriba para colorear {numerator} de {denominator} partes",
    fractionPresets: {
      aleator: "Aleatorio",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Tipo de fracciones"
  },
  it: {
    title: "MAGioco Con Frazioni",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    levelNames: {
      1: "Livello 1",
      2: "Livello 2",
      3: "Livello 3",
      4: "Livello 4"
    },
    fractionTypeLabel: "Tipo di frazioni",
    digitLabel: "Numero di cifre",
    instructions: "Istruzioni",
    instructionsText: "Seleziona un numeratore e un denominatore per creare frazioni.",
    showKeyboard: "Mostra tastiera",
    hideKeyboard: "Nascondi tastiera",
    validateAnswer: "Convalida risposta",
    chooseNumerator: "Scegli Numeratore",
    chooseDenominator: "Scegli Denominatore",
    numerator: "Numeratore",
    denominator: "Denominatore",
    fractionType: "Tipo di frazioni",
    digitCount: "Numero di cifre",
    numLitKeyboard: "Tastiera NumLit",
    selectNumerator: "Seleziona Numeratore",
    selectDenominator: "Seleziona Denominatore",
    buildFraction: "Costruisci Frazione",
    clickRectangles: "Clicca sui rettangoli sopra per colorare",
    moveRigletas: "Sposta le rigletas per formare la frazione",
    parts: "parti",
    congratulations: "Congratulazioni",
    correctAnswer: "Risposta corretta",
    perfectAnswer: "Risposta perfetta",
    tryAgain: "Riprova",
    almostCorrect: "Sei vicino alla risposta corretta",
    onRightTrack: "Sei sulla strada giusta",
    nextProblem: "Prossimo problema!",
    numeratorLabel: "NUMERATORE",
    denominatorLabel: "DENOMINATORE",
    clickPartsInstruction: "Clicca sulle parti di ogni figura per colorarle",
    fractionTypes: {
      subunitare: "Frazioni proprie",
      echiunitare: "Frazioni unitarie",
      supraunitare: "Frazioni improprie",
      zecimale: "Frazioni decimali",
      procente: "Percentuali"
    },
    digitLabels: {
      single: "cifra",
      plural: "cifre"
    },
    chooseNumber: "Scegli numero",
    colorRectanglesInstruction: "Clicca sui rettangoli sopra per colorare {numerator} su {denominator} parti",
    fractionPresets: {
      aleator: "Casuale",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Tipo di frazioni"
  },
  pt: {
    title: "MAJogo Com Frações",
    back: "Voltar",
    language: "Idioma",
    level: "Nível",
    levelNames: {
      1: "Nível 1",
      2: "Nível 2",
      3: "Nível 3",
      4: "Nível 4"
    },
    fractionTypeLabel: "Tipo de frações",
    digitLabel: "Número de dígitos",
    instructions: "Instruções",
    instructionsText: "Selecione um numerador e um denominador para criar frações.",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    validateAnswer: "Validar resposta",
    chooseNumerator: "Escolher Numerador",
    chooseDenominator: "Escolher Denominador",
    numerator: "Numerador",
    denominator: "Denominador",
    fractionType: "Tipo de frações",
    digitCount: "Número de dígitos",
    numLitKeyboard: "Teclado NumLit",
    selectNumerator: "Selecionar Numerador",
    selectDenominator: "Selecionar Denominador",
    buildFraction: "Construir Fração",
    clickRectangles: "Clique nos retângulos acima para colorir",
    moveRigletas: "Mover rigletas para formar a fração",
    parts: "partes",
    congratulations: "Parabéns",
    correctAnswer: "Resposta correta",
    perfectAnswer: "Resposta perfeita",
    tryAgain: "Tente novamente",
    almostCorrect: "Você está próximo da resposta correta",
    onRightTrack: "Você está no caminho certo",
    nextProblem: "Próximo problema!",
    numeratorLabel: "NUMERADOR",
    denominatorLabel: "DENOMINADOR",
    clickPartsInstruction: "Clique nas partes de cada figura para colori-las",
    fractionTypes: {
      subunitare: "Frações próprias",
      echiunitare: "Frações unitárias", 
      supraunitare: "Frações impróprias",
      zecimale: "Frações decimais",
      procente: "Percentuais"
    },
    digitLabels: {
      single: "dígito",
      plural: "dígitos"
    },
    chooseNumber: "Escolher número",
    colorRectanglesInstruction: "Clique nos retângulos acima para colorir {numerator} de {denominator} partes",
    fractionPresets: {
      aleator: "Aleatório",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Tipo de frações"
  },
  pl: {
    title: "MAGra Z Ułamkami",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    levelNames: {
      1: "Poziom 1",
      2: "Poziom 2",
      3: "Poziom 3",
      4: "Poziom 4"
    },
    fractionTypeLabel: "Typ ułamków",
    digitLabel: "Liczba cyfr",
    instructions: "Instrukcje",
    instructionsText: "Wybierz licznik i mianownik, aby utworzyć ułamki.",
    showKeyboard: "Pokaż klawiaturę",
    hideKeyboard: "Ukryj klawiaturę",
    validateAnswer: "Sprawdź odpowiedź",
    chooseNumerator: "Wybierz Licznik",
    chooseDenominator: "Wybierz Mianownik",
    numerator: "Licznik",
    denominator: "Mianownik",
    fractionType: "Typ ułamków",
    digitCount: "Liczba cyfr",
    numLitKeyboard: "Klawiatura NumLit",
    selectNumerator: "Wybierz Licznik",
    selectDenominator: "Wybierz Mianownik",
    buildFraction: "Zbuduj Ułamek",
    clickRectangles: "Kliknij na prostokąty powyżej, aby pokolorować",
    moveRigletas: "Przesuń rigletas, aby utworzyć ułamek",
    parts: "części",
    congratulations: "Gratulacje",
    correctAnswer: "Poprawna odpowiedź",
    perfectAnswer: "Doskonała odpowiedź",
    tryAgain: "Spróbuj ponownie",
    almostCorrect: "Jesteś blisko poprawnej odpowiedzi",
    onRightTrack: "Jesteś na dobrej drodze",
    nextProblem: "Następny problem!",
    numeratorLabel: "LICZNIK",
    denominatorLabel: "MIANOWNIK",
    clickPartsInstruction: "Kliknij na części każdej figury, aby je pokolorować",
    fractionTypes: {
      subunitare: "Ułamki właściwe",
      echiunitare: "Ułamki jednostkowe",
      supraunitare: "Ułamki niewłaściwe",
      zecimale: "Ułamki dziesiętne",
      procente: "Procenty"
    },
    digitLabels: {
      single: "cyfra",
      plural: "cyfry"
    },
    chooseNumber: "Wybierz liczbę",
    colorRectanglesInstruction: "Kliknij na prostokąty powyżej, aby pokolorować {numerator} z {denominator} części",
    fractionPresets: {
      aleator: "Losowy",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Typ ułamków"
  },
  hu: {
    title: "MAJáték Törtekkel",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    levelNames: {
      1: "Szint 1",
      2: "Szint 2",
      3: "Szint 3",
      4: "Szint 4"
    },
    fractionTypeLabel: "Tört típus",
    digitLabel: "Számjegyek száma",
    instructions: "Utasítások",
    instructionsText: "Válassz egy számlálót és egy nevezőt a törtek létrehozásához.",
    showKeyboard: "Billentyűzet megjelenítése",
    hideKeyboard: "Billentyűzet elrejtése",
    validateAnswer: "Válasz érvényesítése",
    chooseNumerator: "Számláló Választása",
    chooseDenominator: "Nevező Választása",
    numerator: "Számláló",
    denominator: "Nevező",
    fractionType: "Tört típus",
    digitCount: "Számjegyek száma",
    numLitKeyboard: "NumLit Billentyűzet",
    selectNumerator: "Számláló Kiválasztása",
    selectDenominator: "Nevező Kiválasztása",
    buildFraction: "Tört Építése",
    clickRectangles: "Kattintson a fenti téglalapokra a színezéshez",
    moveRigletas: "Mozgassa a rigletákat a tört kialakításához",
    parts: "rész",
    congratulations: "Gratulálok",
    correctAnswer: "Helyes válasz",
    perfectAnswer: "Tökéletes válasz",
    tryAgain: "Próbáld újra",
    almostCorrect: "Közel vagy a helyes válaszhoz",
    onRightTrack: "Jó úton jársz",
    nextProblem: "Következő feladat!",
    numeratorLabel: "SZÁMLÁLÓ",
    denominatorLabel: "NEVEZŐ",
    clickPartsInstruction: "Kattintson az egyes ábrák részeire a színezéshez",
    fractionTypes: {
      subunitare: "Valódi törtek",
      echiunitare: "Egységtörtek",
      supraunitare: "Hamis törtek",
      zecimale: "Tizedes törtek",
      procente: "Százalékok"
    },
    digitLabels: {
      single: "számjegy",
      plural: "számjegyek"
    },
    chooseNumber: "Szám választása",
    colorRectanglesInstruction: "Kattintson a fenti téglalapokra, hogy kiszínezzen {numerator} részt a {denominator} részből",
    fractionPresets: {
      aleator: "Véletlenszerű",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Tört típus"
  },
  bg: {
    title: "MAИгра С Дроби",
    back: "Назад",
    language: "Език",
    level: "Ниво",
    levelNames: {
      1: "Ниво 1",
      2: "Ниво 2",
      3: "Ниво 3",
      4: "Ниво 4"
    },
    fractionTypeLabel: "Тип дроби",
    digitLabel: "Брой цифри",
    instructions: "Инструкции",
    instructionsText: "Изберете числител и знаменател, за да създадете дроби.",
    showKeyboard: "Покажи клавиатура",
    hideKeyboard: "Скрий клавиатура",
    validateAnswer: "Валидирай отговор",
    chooseNumerator: "Избери Числител",
    chooseDenominator: "Избери Знаменател",
    numerator: "Числител",
    denominator: "Знаменател",
    fractionType: "Тип дроби",
    digitCount: "Брой цифри",
    numLitKeyboard: "NumLit Клавиатура",
    selectNumerator: "Избери Числител",
    selectDenominator: "Избери Знаменател",
    buildFraction: "Изгради Дроб",
    clickRectangles: "Кликнете на правоъгълниците отгоре за оцветяване",
    moveRigletas: "Преместете rigletas за да формирате дробта",
    parts: "части",
    congratulations: "Поздравления",
    correctAnswer: "Правилен отговор",
    perfectAnswer: "Перфектен отговор",
    tryAgain: "Опитайте отново",
    almostCorrect: "Близо сте до правилния отговор",
    onRightTrack: "На правилния път сте",
    nextProblem: "Следваща задача!",
    numeratorLabel: "ЧИСЛИТЕЛ",
    denominatorLabel: "ЗНАМЕНАТЕЛ",
    clickPartsInstruction: "Кликнете върху частите от всяка фигура, за да ги оцветите",
    fractionTypes: {
      subunitare: "Обикновени дроби",
      echiunitare: "Единични дроби",
      supraunitare: "Неправилни дроби",
      zecimale: "Десетични дроби",
      procente: "Проценти"
    },
    digitLabels: {
      single: "цифра",
      plural: "цифри"
    },
    chooseNumber: "Изберете число",
    colorRectanglesInstruction: "Кликнете на правоъгълниците отгоре, за да оцветите {numerator} от {denominator} части",
    fractionPresets: {
      aleator: "Случаен",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Тип дроби"
  },
  ru: {
    title: "МАИгра С Дробями",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    levelNames: {
      1: "Уровень 1",
      2: "Уровень 2",
      3: "Уровень 3",
      4: "Уровень 4"
    },
    fractionTypeLabel: "Тип дробей",
    digitLabel: "Количество цифр",
    instructions: "Инструкции",
    instructionsText: "Выберите числитель и знаменатель для создания дробей.",
    showKeyboard: "Показать клавиатуру",
    hideKeyboard: "Скрыть клавиатуру",
    validateAnswer: "Проверить ответ",
    chooseNumerator: "Выбрать Числитель",
    chooseDenominator: "Выбрать Знаменатель",
    numerator: "Числитель",
    denominator: "Знаменатель",
    fractionType: "Тип дробей",
    digitCount: "Количество цифр",
    numLitKeyboard: "NumLit Клавиатура",
    selectNumerator: "Выбрать Числитель",
    selectDenominator: "Выбрать Знаменатель",
    buildFraction: "Построить Дробь",
    clickRectangles: "Нажмите на прямоугольники выше для раскрашивания",
    moveRigletas: "Переместите rigletas для формирования дроби",
    parts: "частей",
    congratulations: "Поздравляем",
    correctAnswer: "Правильный ответ",
    perfectAnswer: "Идеальный ответ",
    tryAgain: "Попробуйте снова",
    almostCorrect: "Вы близки к правильному ответу",
    onRightTrack: "Вы на правильном пути",
    nextProblem: "Следующая задача!",
    numeratorLabel: "ЧИСЛИТЕЛЬ",
    denominatorLabel: "ЗНАМЕНАТЕЛЬ",
    clickPartsInstruction: "Нажмите на части каждой фигуры, чтобы их раскрасить",
    fractionTypes: {
      subunitare: "Правильные дроби",
      echiunitare: "Единичные дроби",
      supraunitare: "Неправильные дроби",
      zecimale: "Десятичные дроби",
      procente: "Проценты"
    },
    digitLabels: {
      single: "цифра",
      plural: "цифры"
    },
    chooseNumber: "Выберите число",
    colorRectanglesInstruction: "Нажмите на прямоугольники выше, чтобы раскрасить {numerator} из {denominator} частей",
    fractionPresets: {
      aleator: "Случайный",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Тип дробей"
  },
  ar: {
    title: "لعبة الكسور",
    back: "رجوع",
    language: "اللغة",
    level: "المستوى",
    levelNames: {
      1: "المستوى 1",
      2: "المستوى 2",
      3: "المستوى 3",
      4: "المستوى 4"
    },
    fractionTypeLabel: "نوع الكسور",
    digitLabel: "عدد الأرقام",
    instructions: "التعليمات",
    instructionsText: "اختر بسطًا ومقامًا لإنشاء الكسور.",
    showKeyboard: "إظهار لوحة المفاتيح",
    hideKeyboard: "إخفاء لوحة المفاتيح",
    validateAnswer: "التحقق من الإجابة",
    chooseNumerator: "اختر البسط",
    chooseDenominator: "اختر المقام",
    numerator: "البسط",
    denominator: "المقام",
    fractionType: "نوع الكسور",
    digitCount: "عدد الأرقام",
    numLitKeyboard: "لوحة مفاتيح NumLit",
    selectNumerator: "اختر البسط",
    selectDenominator: "اختر المقام",
    buildFraction: "اصنع الكسر",
    clickRectangles: "اضغط على المستطيلات أعلاه للتلوين",
    moveRigletas: "حرك الريجليتاس لتكوين الكسر",
    parts: "أجزاء",
    congratulations: "تهانينا",
    correctAnswer: "إجابة صحيحة",
    perfectAnswer: "إجابة مثالية",
    tryAgain: "حاول مرة أخرى",
    almostCorrect: "أنت قريب من الإجابة الصحيحة",
    onRightTrack: "أنت على الطريق الصحيح",
    nextProblem: "المسألة التالية!",
    numeratorLabel: "البسط",
    denominatorLabel: "المقام",
    clickPartsInstruction: "اضغط على أجزاء كل شكل لتلوينها",
    fractionTypes: {
      subunitare: "كسور صحيحة",
      echiunitare: "كسور وحدوية",
      supraunitare: "كسور غير صحيحة",
      zecimale: "كسور عشرية",
      procente: "نسب مئوية"
    },
    digitLabels: {
      single: "رقم",
      plural: "أرقام"
    },
    chooseNumber: "اختر الرقم",
    colorRectanglesInstruction: "اضغط على المستطيلات أعلاه لتلوين {numerator} من {denominator} أجزاء",
    fractionPresets: {
      aleator: "عشوائي",
      oneHalf: "1/2",
      oneThird: "1/3", 
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "نوع الكسور"
  },
  tr: {
    title: "Kesirlerle MAOyun",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    levelNames: {
      1: "Seviye 1",
      2: "Seviye 2",
      3: "Seviye 3",
      4: "Seviye 4"
    },
    fractionTypeLabel: "Kesir türü",
    digitLabel: "Basamak sayısı",
    instructions: "Talimatlar",
    instructionsText: "Kesirler oluşturmak için bir pay ve payda seçin.",
    showKeyboard: "Klavyeyi göster",
    hideKeyboard: "Klavyeyi gizle",
    validateAnswer: "Cevabı doğrula",
    chooseNumerator: "Pay Seç",
    chooseDenominator: "Payda Seç",
    numerator: "Pay",
    denominator: "Payda",
    fractionType: "Kesir türü",
    digitCount: "Basamak sayısı",
    numLitKeyboard: "NumLit Klavyesi",
    selectNumerator: "Pay Seç",
    selectDenominator: "Payda Seç",
    buildFraction: "Kesir Oluştur",
    clickRectangles: "Boyamak için yukarıdaki dikdörtgenlere tıklayın",
    moveRigletas: "Kesiri oluşturmak için rigleta'ları hareket ettirin",
    parts: "parça",
    congratulations: "Tebrikler",
    correctAnswer: "Doğru cevap",
    perfectAnswer: "Mükemmel cevap",
    tryAgain: "Tekrar deneyin",
    almostCorrect: "Doğru cevaba yaklaştınız",
    onRightTrack: "Doğru yoldasınız",
    nextProblem: "Sonraki problem!",
    numeratorLabel: "PAY",
    denominatorLabel: "PAYDA",
    clickPartsInstruction: "Her şeklin parçalarına tıklayarak onları boyayın",
    fractionTypes: {
      subunitare: "Basit kesirler",
      echiunitare: "Birim kesirler",
      supraunitare: "Bileşik kesirler",
      zecimale: "Ondalık kesirler",
      procente: "Yüzdeler"
    },
    digitLabels: {
      single: "basamak",
      plural: "basamak"
    },
    chooseNumber: "Sayı seç",
    colorRectanglesInstruction: "Yukarıdaki dikdörtgenlere tıklayarak {denominator} parçadan {numerator} tanesini boyayın",
    fractionPresets: {
      aleator: "Rastgele",
      oneHalf: "1/2",
      oneThird: "1/3",
      oneFourth: "1/4",
      oneFifth: "1/5",
      oneSixth: "1/6",
      oneSeventh: "1/7",
      oneEighth: "1/8",
      oneNinth: "1/9",
      oneTenth: "1/10"
    },
    fractionPresetLabel: "Kesir türü"
  }
} as const;

// Language options in alphabetical order
const languageOptions = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

type Language = keyof typeof fractionsTranslations;

export default function MaJocCuFractii() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ro');
  const [selectedLevel, setSelectedLevel] = useState<'1' | '2' | '3' | '4'>('1');
  const [selectedFractionType, setSelectedFractionType] = useState('subunitare');
  const [selectedDigitCount, setSelectedDigitCount] = useState('1');
  const [selectedFractionPreset, setSelectedFractionPreset] = useState('aleator');
  const [zoom, setZoom] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedNumerator, setSelectedNumerator] = useState<string>('');
  const [selectedDenominator, setSelectedDenominator] = useState<string>('');
  const [selectionMode, setSelectionMode] = useState<'numerator' | 'denominator' | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coloredRectangles, setColoredRectangles] = useState<boolean[]>([]);
  const [draggedRigleta, setDraggedRigleta] = useState<{operation: number, type: 'first' | 'second' | 'result', operationIndex: number} | null>(null);
  const [droppedRigletas, setDroppedRigletas] = useState<{[key: string]: {operation: number, type: 'first' | 'second' | 'result', operationIndex: number}}>({});
  const [movedRigletas, setMovedRigletas] = useState<{[key: string]: boolean}>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Level 2 geometric shapes state
  const [level2ShapeStates, setLevel2ShapeStates] = useState<{[key: string]: boolean[]}>({});
  const [level2ShapeConfigs, setLevel2ShapeConfigs] = useState<{[key: string]: { parts: number; colored: number }}>({});

  // Initialize Level 2 shape configurations
  React.useEffect(() => {
    if (selectedLevel === '2' && selectedNumerator && selectedDenominator) {
      const shapes = ['square', 'rectangle', 'circle'];
      const configs: { [key: string]: { parts: number; colored: number } } = {};
      const states: { [key: string]: boolean[] } = {};
      const denominator = parseInt(selectedDenominator);
      const correctIndex = Math.floor(Math.random() * shapes.length);
      
      shapes.forEach((shape, index) => {
        if (index === correctIndex) {
          // Correct answer - use the exact denominator
          configs[shape] = { parts: denominator, colored: 0 };
        } else {
          // Incorrect answers with different number of parts
          let wrongParts;
          do {
            wrongParts = Math.floor(Math.random() * 8) + 2; // 2-9 parts
          } while (wrongParts === denominator); // Make sure it's different from correct answer
          
          configs[shape] = { parts: wrongParts, colored: 0 };
        }
        // Initialize all parts as uncolored
        states[shape] = new Array(configs[shape].parts).fill(false);
      });
      
      setLevel2ShapeConfigs(configs);
      setLevel2ShapeStates(states);
    }
  }, [selectedLevel, selectedNumerator, selectedDenominator]);
  const [dynamicOperations, setDynamicOperations] = useState<any[]>([]);

  const t = fractionsTranslations[selectedLanguage];

  // Initialize rectangles when denominator changes
  React.useEffect(() => {
    if (selectedDenominator) {
      const count = parseInt(selectedDenominator);
      setColoredRectangles(new Array(count).fill(false));
    }
  }, [selectedDenominator]);

  // Initialize dynamic operations when numerator and denominator are selected
  React.useEffect(() => {
    // For Level 1 and 2 with presets, automatically set numerator/denominator and generate operations
    if ((selectedLevel === '1' || selectedLevel === '2') && selectedFractionPreset) {
      let numerator: string, denominator: string;
      
      if (selectedFractionPreset === 'aleator') {
        // Random generation based on fraction type
        const getRandomFraction = () => {
          let num: number, den: number;
          
          switch (selectedFractionType) {
            case 'subunitare': // Proper fractions (n < d)
              den = Math.floor(Math.random() * 9) + 2; // 2-10
              num = Math.floor(Math.random() * (den - 1)) + 1; // 1 to den-1
              break;
            case 'echiunitare': // Unit fractions (n = d, equals 1)
              den = Math.floor(Math.random() * 9) + 2; // 2-10
              num = den; // numerator equals denominator
              break;
            case 'supraunitare': // Improper fractions (n >= d)
              den = Math.floor(Math.random() * 8) + 2; // 2-9
              num = den + Math.floor(Math.random() * 5) + 1; // den+1 to den+5
              break;
            default:
              den = Math.floor(Math.random() * 9) + 2; // 2-10
              num = Math.floor(Math.random() * (den - 1)) + 1; // 1 to den-1
          }
          
          return { numerator: num.toString(), denominator: den.toString() };
        };
        
        const randomFraction = getRandomFraction();
        numerator = randomFraction.numerator;
        denominator = randomFraction.denominator;
      } else {
        // Fixed denominator presets
        const presetMap: { [key: string]: { num: number, den: number } } = {
          oneHalf: { num: 1, den: 2 },
          oneThird: { num: 1, den: 3 },
          oneFourth: { num: 1, den: 4 },
          oneFifth: { num: 1, den: 5 },
          oneSixth: { num: 1, den: 6 },
          oneSeventh: { num: 1, den: 7 },
          oneEighth: { num: 1, den: 8 },
          oneNinth: { num: 1, den: 9 },
          oneTenth: { num: 1, den: 10 }
        };
        
        const preset = presetMap[selectedFractionPreset];
        if (preset) {
          denominator = preset.den.toString();
          // For fixed denominator presets, numerator changes based on fraction type
          let num: number;
          
          switch (selectedFractionType) {
            case 'subunitare': // Proper fractions (n < d)
              num = Math.floor(Math.random() * (preset.den - 1)) + 1; // 1 to den-1
              break;
            case 'echiunitare': // Unit fractions (n = d, equals 1)
              num = preset.den; // numerator equals denominator
              break;
            case 'supraunitare': // Improper fractions (n >= d)
              num = preset.den + Math.floor(Math.random() * 3) + 1; // den+1 to den+3
              break;
            default:
              num = Math.floor(Math.random() * (preset.den - 1)) + 1; // 1 to den-1
          }
          
          numerator = num.toString();
        } else {
          numerator = "1";
          denominator = "2";
        }
      }
      
      // Set the values and generate operations
      setSelectedNumerator(numerator);
      setSelectedDenominator(denominator);
      
      // Generate operations after setting numerator and denominator
      setTimeout(() => {
        const initialOperations = generateDynamicOperations();
        setDynamicOperations(initialOperations);
      }, 100);
    }
    // Don't automatically generate operations for manual selection
    // Let the user complete their selection first
  }, [selectedLevel, selectedFractionPreset, selectedFractionType]); // Remove selectedNumerator, selectedDenominator from dependencies

  // Separate effect to handle manual fraction selection
  useEffect(() => {
    if (selectedLevel !== '1' && selectedLevel !== '2') return; // Only for levels 1 & 2
    if (!selectedNumerator || !selectedDenominator) return;
    if (selectedFractionPreset && selectedFractionPreset !== 'aleator') return; // Skip if using presets
    
    // Generate operations when both manual selections are made
    console.log('Manual selection complete:', selectedNumerator, selectedDenominator);
    setTimeout(() => {
      const initialOperations = generateDynamicOperations();
      setDynamicOperations(initialOperations);
    }, 300);
  }, [selectedNumerator, selectedDenominator]);

  const toggleRectangle = (index: number) => {
    const newColored = [...coloredRectangles];
    const currentlyColored = newColored.filter(Boolean).length;
    const maxColored = parseInt(selectedNumerator) || 0;
    
    if (newColored[index]) {
      newColored[index] = false;
    } else if (currentlyColored < maxColored) {
      newColored[index] = true;
    }
    
    setColoredRectangles(newColored);
  };

  // Initialize moved rigletas tracking
  React.useEffect(() => {
    const initialMovedRigletas: {[key: string]: boolean} = {};
    dynamicOperations.forEach((operation, opIndex) => {
      initialMovedRigletas[`${opIndex}-first`] = false;
      initialMovedRigletas[`${opIndex}-second`] = false;
      initialMovedRigletas[`${opIndex}-result`] = false;
    });
    setMovedRigletas(initialMovedRigletas);
  }, [selectedNumerator, selectedDenominator]);

  // Drag and Drop functions
  const handleDragStart = (operation: number, type: 'first' | 'second' | 'result', operationIndex: number) => {
    const rigletaKey = `${operationIndex}-${type}`;
    // Check if this group has already been moved
    if (movedRigletas[rigletaKey]) {
      return; // Don't allow dragging already moved groups
    }
    setDraggedRigleta({operation, type, operationIndex});
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropZone: string, operationIndex: number) => {
    e.preventDefault();
    if (draggedRigleta) {
      // Terms (first/second) go above the fraction line (numerator zone)
      // Sum (result) goes below the fraction line (denominator zone)
      const isNumeratorZone = dropZone.includes('numerator');
      const isDenominatorZone = dropZone.includes('denominator');
      
      // Only allow terms in numerator zone and results in denominator zone
      if ((isNumeratorZone && draggedRigleta.type === 'result') ||
          (isDenominatorZone && (draggedRigleta.type === 'first' || draggedRigleta.type === 'second'))) {
        setDraggedRigleta(null);
        return;
      }

      const dropKey = `${operationIndex}-${dropZone}`;
      const sourceKey = `${draggedRigleta.operationIndex}-${draggedRigleta.type}`;
      
      setDroppedRigletas(prev => ({
        ...prev,
        [dropKey]: draggedRigleta
      }));

      // Mark this group as moved
      setMovedRigletas(prev => ({
        ...prev,
        [sourceKey]: true
      }));

      setDraggedRigleta(null);
    }
  };

  // Validation function
  const validateAnswer = () => {
    if (!selectedNumerator || !selectedDenominator) return;
    
    const numerator = parseInt(selectedNumerator);
    const denominator = parseInt(selectedDenominator);
    
    if (selectedLevel === '2') {
      // Level 2: Geometric shapes validation
      const shapes = ['square', 'rectangle', 'circle'];
      let foundCorrect = false;
      
      shapes.forEach((shape) => {
        const config = level2ShapeConfigs[shape];
        const coloredCount = level2ShapeStates[shape]?.filter(Boolean).length || 0;
        
        if (config && config.parts === denominator && coloredCount === numerator) {
          foundCorrect = true;
        }
      });
      
      if (foundCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        toast.success("Felicitări! Răspuns corect!");
        setProgress(prev => Math.min(prev + 1, 10));
        setTimeout(() => generateNextProblem(), 2000);
      } else {
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 3000);
        toast.error("Mai încearcă! Găsește figura cu numărul corect de părți și colorează numărul corect.");
      }
      return;
    }
    
    // Level 1: Original validation logic
    if (numerator >= denominator) {
      toast.error("Numărătorul trebuie să fie mai mic decât numitorul pentru fracții proprii!");
      return;
    }
    
    const coloredCount = coloredRectangles.filter(Boolean).length;
    const expectedColored = numerator;
    
    // Check if rigletas from any correct operation are placed correctly
    const correctOperations = dynamicOperations.filter(op => op.isCorrect);
    
    const numeratorZoneHasCorrectTerms = Object.values(droppedRigletas).some(r => 
      correctOperations.some(op => 
        (r.operation === op.a || r.operation === op.b) && (r.type === 'first' || r.type === 'second')
      )
    );
    const denominatorZoneHasCorrectSum = Object.values(droppedRigletas).some(r => 
      correctOperations.some(op => r.operation === op.result && r.type === 'result')
    );
    
    const rigletasCorrect = numeratorZoneHasCorrectTerms && denominatorZoneHasCorrectSum;
    const coloringCorrect = coloredCount === expectedColored;
    
    if (rigletasCorrect && coloringCorrect) {
      // Success - show celebration and advance to next problem
      setShowCelebration(true);
      setProgress(Math.min(10, progress + 1));
      toast.success(`🎉 ${t.congratulations}! ${t.correctAnswer}!`);
      
      // Generate next problem after celebration
      setTimeout(() => {
        setShowCelebration(false);
        generateNextProblem();
      }, 3000);
    } else {
      // Wrong answer - show encouragement
      setShowEncouragement(true);
      toast.error(`🤗 ${t.tryAgain}! ${t.almostCorrect}!`);
      setTimeout(() => setShowEncouragement(false), 2000);
    }
  };

  // Helper function to find GCD for fraction simplification
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Helper function to simplify fractions
  const simplifyFraction = (num: number, den: number) => {
    const divisor = gcd(num, den);
    return { numerator: num / divisor, denominator: den / divisor };
  };

  // Generate dynamic operations based on selected numerator and denominator
  const generateDynamicOperations = () => {
    console.log('Generating operations for:', selectedNumerator, selectedDenominator);
    if (!selectedNumerator || !selectedDenominator) {
      console.log('Missing numerator or denominator, returning empty array');
      return [];
    }
    
    const numerator = parseInt(selectedNumerator);
    const denominator = parseInt(selectedDenominator);
    
    // Allow both proper fractions (numerator < denominator) and improper fractions (numerator >= denominator)
    
    const targetFirstTerm = numerator;
    const targetSum = denominator;
    const targetSecondTerm = targetSum - targetFirstTerm;
    
    // Define colors for each number 1-10 according to game specifications
    const getColorForNumber = (num: number) => {
      const colorMap = {
        1: 'bg-red-800',     // roșu închis
        2: 'bg-red-400',     // roșu deschis  
        3: 'bg-orange-700',  // portocaliu închis
        4: 'bg-orange-400',  // portocaliu mai deschis
        5: 'bg-yellow-600',  // galben închis
        6: 'bg-yellow-400',  // galben
        7: 'bg-green-500',   // verde
        8: 'bg-blue-500',    // albastru
        9: 'bg-blue-800',    // bleumarin
        10: 'bg-purple-500'  // violet
      };
      return colorMap[num as keyof typeof colorMap] || 'bg-gray-400';
    };

    const colors = [
      'bg-red-800',     // 1 - roșu închis
      'bg-red-400',     // 2 - roșu deschis  
      'bg-orange-700',  // 3 - portocaliu închis
      'bg-orange-400',  // 4 - portocaliu mai deschis
      'bg-yellow-600',  // 5 - galben închis
      'bg-yellow-400',  // 6 - galben
      'bg-green-500',   // 7 - verde
      'bg-blue-500',    // 8 - albastru
      'bg-blue-800',    // 9 - bleumarin
      'bg-purple-500'   // 10 - violet
    ];
    
    // Helper function to create operation key for duplicate checking
    const getOperationKey = (a: number, b: number, result: number) => {
      // Normalize by sorting a and b to catch operations like 2+3 and 3+2
      const [first, second] = [a, b].sort((x, y) => x - y);
      return `${first}+${second}=${result}`;
    };
    
    // Generate mix of correct and incorrect operations (all mathematically valid)
    const allPossibleOperations = [];
    const usedOperations = new Set<string>();
    
    // ALWAYS ensure we have the main correct operation first
    const mainCorrectOperation = { a: targetFirstTerm, b: targetSecondTerm, result: targetSum, isCorrect: true };
    allPossibleOperations.push(mainCorrectOperation);
    usedOperations.add(getOperationKey(mainCorrectOperation.a, mainCorrectOperation.b, mainCorrectOperation.result));
    
    // Additional correct operations for the target fraction (maximum 2 more)
    const additionalCorrectOperations = [
      // Other valid operations that could work for the fraction
      { a: Math.max(0, targetFirstTerm - 1), b: targetSum - Math.max(0, targetFirstTerm - 1), result: targetSum, isCorrect: true },
      { a: Math.min(targetSum, targetFirstTerm + 1), b: Math.max(0, targetSum - Math.min(targetSum, targetFirstTerm + 1)), result: targetSum, isCorrect: true }
    ].filter(op => op.a >= 0 && op.b >= 0 && op.a + op.b === op.result && op.a !== mainCorrectOperation.a); // Allow 0, ensure mathematically correct and different operations

    // Similar but different operations (mathematically correct but wrong for our target fraction)
    const distractorOperations = [
      // Operations with different sums
      { a: targetFirstTerm, b: targetFirstTerm, result: targetFirstTerm * 2, isCorrect: false },
      { a: targetSecondTerm, b: targetSecondTerm, result: targetSecondTerm * 2, isCorrect: false },
      { a: targetFirstTerm + 1, b: targetFirstTerm + 1, result: (targetFirstTerm + 1) * 2, isCorrect: false },
      { a: Math.max(1, targetFirstTerm - 1), b: Math.max(1, targetFirstTerm - 1), result: Math.max(1, targetFirstTerm - 1) * 2, isCorrect: false },
      // Operations with target sum ± 1
      { a: Math.max(1, targetFirstTerm - 1), b: (targetSum + 1) - Math.max(1, targetFirstTerm - 1), result: targetSum + 1, isCorrect: false },
      { a: Math.max(1, targetFirstTerm + 1), b: Math.max(1, (targetSum - 1) - Math.max(1, targetFirstTerm + 1)), result: targetSum - 1, isCorrect: false },
      // Some standard small operations
      { a: 1, b: 2, result: 3, isCorrect: false },
      { a: 2, b: 3, result: 5, isCorrect: false },
      { a: 3, b: 2, result: 5, isCorrect: false },
      { a: 1, b: 3, result: 4, isCorrect: false },
      { a: 2, b: 2, result: 4, isCorrect: false },
      { a: 1, b: 4, result: 5, isCorrect: false },
      { a: 3, b: 3, result: 6, isCorrect: false },
      { a: 1, b: 1, result: 2, isCorrect: false },
      { a: 2, b: 1, result: 3, isCorrect: false },
      { a: 4, b: 1, result: 5, isCorrect: false },
      { a: 3, b: 1, result: 4, isCorrect: false },
      { a: 5, b: 1, result: 6, isCorrect: false },
      { a: 2, b: 4, result: 6, isCorrect: false }
    ].filter(op => op.a > 0 && op.b > 0 && op.result > 0 && op.a + op.b === op.result); // Ensure mathematically correct

    // Add additional correct operations (avoiding duplicates)
    const shuffledAdditionalCorrect = additionalCorrectOperations.sort(() => Math.random() - 0.5);
    for (const op of shuffledAdditionalCorrect) {
      const key = getOperationKey(op.a, op.b, op.result);
      if (!usedOperations.has(key) && allPossibleOperations.length < 3) {
        allPossibleOperations.push(op);
        usedOperations.add(key);
      }
    }
    
    // Fill remaining slots with distractor operations (avoiding duplicates)
    const shuffledDistractors = distractorOperations.sort(() => Math.random() - 0.5);
    for (const op of shuffledDistractors) {
      const key = getOperationKey(op.a, op.b, op.result);
      if (!usedOperations.has(key) && allPossibleOperations.length < 5) {
        allPossibleOperations.push(op);
        usedOperations.add(key);
      }
    }
    
    // Shuffle final operations
    const shuffledOperations = allPossibleOperations.sort(() => Math.random() - 0.5);
    
    // Log for debugging - ensure we always have correct operations
    const hasCorrectOperation = shuffledOperations.some(op => op.isCorrect);
    console.log(`Generated operations for ${numerator}/${denominator}:`, shuffledOperations);
    console.log(`Has correct operation: ${hasCorrectOperation}`);
    
    // Apply colors and create final operations array
    const dynamicOperations = shuffledOperations.map((op, index) => ({
      a: op.a,
      b: op.b, 
      result: op.result,
      colorA: getColorForNumber(op.a),
      colorB: getColorForNumber(op.b),
      colorResult: getColorForNumber(op.result),
      color: colors[index % colors.length], // Keep for backwards compatibility
      isCorrect: op.isCorrect
    }));
    
    return dynamicOperations;
  };

  // Generate next problem
  const generateNextProblem = () => {
    // Generate a completely new fraction, different from the current one
    let newNumerator: string, newDenominator: string;
    
    if ((selectedLevel === '1' || selectedLevel === '2') && selectedFractionPreset && selectedFractionPreset !== 'aleator') {
      // For preset selections, change the numerator while keeping denominator logic
      const presetMap: { [key: string]: { den: number } } = {
        oneHalf: { den: 2 },
        oneThird: { den: 3 },
        oneFourth: { den: 4 },
        oneFifth: { den: 5 },
        oneSixth: { den: 6 },
        oneSeventh: { den: 7 },
        oneEighth: { den: 8 },
        oneNinth: { den: 9 },
        oneTenth: { den: 10 }
      };
      
      const preset = presetMap[selectedFractionPreset];
      if (preset) {
        newDenominator = preset.den.toString();
        
        // Generate different numerator based on fraction type
        let possibleNumerators: number[] = [];
        
        switch (selectedFractionType) {
          case 'subunitare': // Proper fractions (n < d)
            possibleNumerators = Array.from({length: preset.den - 1}, (_, i) => i + 1);
            break;
          case 'echiunitare': // Unit fractions (n = d)
            possibleNumerators = [preset.den];
            break;
          default:
            possibleNumerators = Array.from({length: preset.den - 1}, (_, i) => i + 1);
        }
        
        // Remove current numerator from possibilities
        const currentNum = parseInt(selectedNumerator);
        possibleNumerators = possibleNumerators.filter(num => num !== currentNum);
        
        if (possibleNumerators.length > 0) {
          newNumerator = possibleNumerators[Math.floor(Math.random() * possibleNumerators.length)].toString();
        } else {
          // If no other options, generate a random one
          newNumerator = (Math.floor(Math.random() * (preset.den - 1)) + 1).toString();
        }
      } else {
        // Fallback
        newNumerator = "1";
        newDenominator = "2";
      }
    } else {
      // For random generation or other levels, generate completely new fraction
      do {
        const availableNumerators = Array.from({length: 10}, (_, i) => i + 1);
        const availableDenominators = Array.from({length: 10}, (_, i) => i + 2);
        
        newNumerator = availableNumerators[Math.floor(Math.random() * availableNumerators.length)].toString();
        newDenominator = availableDenominators[Math.floor(Math.random() * availableDenominators.length)].toString();
        
        // Adjust based on fraction type for Level 1 and 2
        if (selectedLevel === '1' || selectedLevel === '2') {
          const num = parseInt(newNumerator);
          const den = parseInt(newDenominator);
          
          if (selectedFractionType === 'subunitare' && num >= den) {
            newNumerator = Math.max(1, den - 1).toString();
          } else if (selectedFractionType === 'echiunitare') {
            newNumerator = den.toString();
          }
        }
        
      } while (newNumerator === selectedNumerator && newDenominator === selectedDenominator);
    }
    
    // Set the new fraction
    setSelectedNumerator(newNumerator);
    setSelectedDenominator(newDenominator);
    
    // The useEffect will automatically generate new operations when numerator/denominator change
    
    // Clear current state
    setColoredRectangles([]);
    setDroppedRigletas({});
    setMovedRigletas({});
    
    toast.success(t.nextProblem);
  };

  const operations = [
    { a: 1, b: 1, result: 2, color: 'bg-red-400' },
    { a: 2, b: 2, result: 4, color: 'bg-orange-400' },
    { a: 3, b: 3, result: 6, color: 'bg-yellow-400' },
    { a: 4, b: 4, result: 8, color: 'bg-blue-400' },
    { a: 5, b: 5, result: 10, color: 'bg-purple-400' }
  ];


  const handleGamePlay = () => {
    setIsTimerRunning(true);
    setIsPlaying(true);
    toast.success("Jocul a început!");
  };

  const handleGamePause = () => {
    setIsTimerRunning(false);
    setIsPlaying(false);
    toast.info("Jocul este oprit");
  };

  const handleGameReset = () => {
    setIsTimerRunning(false);
    setIsPlaying(false);
    setSelectedNumerator('');
    setSelectedDenominator('');
    setSelectionMode(null);
    setProgress(0);
    toast.info("Jocul a fost resetat");
  };

  const handleGameShuffle = () => {
    toast.info("Amestecarea problemelor...");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Sidebar - Width reduced by 40% (from w-80 to w-48) */}
        <Sidebar className="w-48">
          <SidebarContent className="p-1">
            {/* Language Selection */}
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-green-600 text-center">
                      {t.language}
                    </div>
                  </div>
                  <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                    <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
                      {languageOptions.sort((a, b) => a.name.localeCompare(b.name)).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-1">
                            <span>{lang.flag}</span>
                            <span className="text-sm">{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Level Selection */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-purple-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-purple-600 text-center">
                      {t.level}
                    </div>
                  </div>
                  <Select value={selectedLevel} onValueChange={(value: '1' | '2' | '3' | '4') => setSelectedLevel(value)}>
                    <SelectTrigger className="w-full h-6 text-xs border-purple-300 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="1" className="text-sm">Nivel 1</SelectItem>
                      <SelectItem value="2" className="text-sm">Nivel 2</SelectItem>
                      <SelectItem value="3" className="text-sm">Nivel 3</SelectItem>
                      <SelectItem value="4" className="text-sm">Nivel 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Fraction Type Selection */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-pink-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-pink-600 text-center">
                      {t.fractionTypeLabel}
                    </div>
                  </div>
                  <Select value={selectedFractionType} onValueChange={setSelectedFractionType}>
                    <SelectTrigger className="w-full h-6 text-xs border-pink-300 focus:border-pink-500">
                      <SelectValue />
                    </SelectTrigger>
                     <SelectContent className="bg-white z-50">
                       {selectedLevel === '1' || selectedLevel === '2' ? (
                         <>
                           <SelectItem value="subunitare" className="text-sm">{t.fractionTypes.subunitare}</SelectItem>
                           <SelectItem value="echiunitare" className="text-sm">{t.fractionTypes.echiunitare}</SelectItem>
                         </>
                       ) : (
                         <>
                           <SelectItem value="subunitare" className="text-sm">{t.fractionTypes.subunitare}</SelectItem>
                           <SelectItem value="echiunitare" className="text-sm">{t.fractionTypes.echiunitare}</SelectItem>
                           <SelectItem value="supraunitare" className="text-sm">{t.fractionTypes.supraunitare}</SelectItem>
                           <SelectItem value="zecimale" className="text-sm">{t.fractionTypes.zecimale}</SelectItem>
                           <SelectItem value="procente" className="text-sm">{t.fractionTypes.procente}</SelectItem>
                         </>
                       )}
                     </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Digit Count Selection */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-cyan-50 border-2 border-fuchsia-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-fuchsia-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-fuchsia-600 text-center">
                      {t.digitCount}
                    </div>
                  </div>
                  <Select value={selectedDigitCount} onValueChange={setSelectedDigitCount}>
                    <SelectTrigger className="w-full h-6 text-xs border-fuchsia-300 focus:border-fuchsia-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="1" className="text-sm">1 {t.digitLabels.single}</SelectItem>
                      <SelectItem value="2" className="text-sm">2 {t.digitLabels.plural}</SelectItem>
                      <SelectItem value="3" className="text-sm">3 {t.digitLabels.plural}</SelectItem>
                      <SelectItem value="4" className="text-sm">4 {t.digitLabels.plural}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Shop Promo Stamp */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent className="p-0">
                <div className="transform scale-75 origin-center -my-3">
                  <ShopPromoBox language={selectedLanguage} />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Level 1 and 2: Fraction Preset Selection */}
            {(selectedLevel === '1' || selectedLevel === '2') && (
              <SidebarGroup className="mt-1">
                <SidebarGroupContent>
                  <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-indigo-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-indigo-600 text-center">
                        {t.fractionPresetLabel}
                      </div>
                    </div>
                    <Select value={selectedFractionPreset} onValueChange={setSelectedFractionPreset}>
                      <SelectTrigger className="w-full h-6 text-xs border-indigo-300 focus:border-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                        <SelectItem value="aleator" className="text-sm">{t.fractionPresets.aleator}</SelectItem>
                        <SelectItem value="oneHalf" className="text-sm">{t.fractionPresets.oneHalf}</SelectItem>
                        <SelectItem value="oneThird" className="text-sm">{t.fractionPresets.oneThird}</SelectItem>
                        <SelectItem value="oneFourth" className="text-sm">{t.fractionPresets.oneFourth}</SelectItem>
                        <SelectItem value="oneFifth" className="text-sm">{t.fractionPresets.oneFifth}</SelectItem>
                        <SelectItem value="oneSixth" className="text-sm">{t.fractionPresets.oneSixth}</SelectItem>
                        <SelectItem value="oneSeventh" className="text-sm">{t.fractionPresets.oneSeventh}</SelectItem>
                        <SelectItem value="oneEighth" className="text-sm">{t.fractionPresets.oneEighth}</SelectItem>
                        <SelectItem value="oneNinth" className="text-sm">{t.fractionPresets.oneNinth}</SelectItem>
                        <SelectItem value="oneTenth" className="text-sm">{t.fractionPresets.oneTenth}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Manual Selectors for Numerator and Denominator - Available for all levels */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent className="space-y-1">
                {/* Selector Numărător - Portocaliu */}
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-orange-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-orange-600 text-center">
                      {t.chooseNumerator}
                    </div>
                  </div>
                  <Select value={selectedNumerator} onValueChange={setSelectedNumerator}>
                    <SelectTrigger className="w-full h-6 text-xs border-orange-300 focus:border-orange-500">
                      <SelectValue placeholder={t.chooseNumber} />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <span className={cn(
                            "font-semibold text-sm",
                            num % 2 === 0 ? "text-red-500" : "text-blue-500"
                          )}>
                            {num}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Selector Numitor - Albastru */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-blue-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-blue-600 text-center">
                      {t.chooseDenominator}
                    </div>
                  </div>
                  <Select value={selectedDenominator} onValueChange={setSelectedDenominator}>
                    <SelectTrigger className="w-full h-6 text-xs border-blue-300 focus:border-blue-500">
                      <SelectValue placeholder={t.chooseNumber} />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <span className={cn(
                            "font-semibold text-sm",
                            num % 2 === 0 ? "text-red-500" : "text-blue-500"
                          )}>
                            {num}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header identic 1:1 cu "Sa calculam" */}
          <header className="bg-white border-b shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  title="Acasă"
                >
                  <Home className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/349d7dbd-cd79-4202-8cc2-a1994fbba2db.png" 
                    alt="NumLit Logo" 
                    className="w-12 h-12 object-contain"
                  />
                  <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="h-4 w-4" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.instructions}</DialogTitle>
                      <DialogDescription>
                        {t.instructionsText}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {/* Progress Bar */}
                <ProgressBar 
                  current={progress} 
                  total={10} 
                  className="mx-4"
                  showCelebration={progress === 10}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <ZoomControls 
                  zoom={zoom} 
                  onZoomChange={setZoom}
                />

                {/* Timer */}
                <Timer 
                  isRunning={isTimerRunning}
                  className="bg-gray-100"
                />

                {/* Game Controls */}
                <GameControls
                  isPlaying={isPlaying}
                  onPlay={handleGamePlay}
                  onPause={handleGamePause}
                  onRepeat={handleGameReset}
                  onShuffle={handleGameShuffle}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-gray-100 transition-colors"
                  title="Sunet"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Game Area */}
          <main className="flex-1 p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            <div className="w-full max-w-[1540px] mx-auto"> {/* Increased width by additional 10% (total 25% increase from original) */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Fraction Display - exact replica of image 2 */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {t.buildFraction}: {selectedNumerator || "N"}/{selectedDenominator || "D"}
                      </h3>
                      {selectedNumerator && selectedDenominator && (
                        <p className="text-sm text-gray-600 ml-4">
                          {t.colorRectanglesInstruction.replace('{numerator}', selectedNumerator).replace('{denominator}', selectedDenominator)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-4">
                      {/* Labels */}
                      <div className="flex flex-col gap-2">
                        <div className="bg-orange-200 px-3 py-1 rounded text-sm font-bold text-orange-800">{t.numeratorLabel}</div>
                        <div className="bg-blue-200 px-3 py-1 rounded text-sm font-bold text-blue-800">{t.denominatorLabel}</div>
                      </div>
                      
                      {/* Fraction boxes */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-12 w-16 border-2 border-gray-400 flex items-center justify-center text-2xl font-bold",
                          selectedNumerator ? "bg-white text-red-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {selectedNumerator || "N"}
                        </div>
                        <div className={cn(
                          "h-12 w-16 border-2 border-gray-400 border-t-0 flex items-center justify-center text-2xl font-bold",
                          selectedDenominator ? "bg-white text-blue-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {selectedDenominator || "D"}
                        </div>
                      </div>
                      
                      {/* Equals sign */}
                      <div className="text-3xl font-bold text-gray-800">=</div>
                      
                      {/* Interactive rectangles */}
                      {selectedNumerator && selectedDenominator && (
                        <div className="flex flex-col gap-1">
                          {/* Numerator rectangles - clickable */}
                          <div className="flex">
                            {coloredRectangles.map((isColored, index) => (
                              <div
                                key={`num-${index}`}
                                className={cn(
                                  "w-12 h-6 border-2 border-red-400 cursor-pointer transition-all duration-200 hover:scale-105",
                                  isColored 
                                    ? "bg-red-400 relative overflow-hidden" 
                                    : "bg-white hover:bg-red-100"
                                )}
                                onClick={() => toggleRectangle(index)}
                              >
                                {isColored && (
                                  <div className="absolute inset-0 bg-red-400" style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)'
                                  }}></div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Denominator rectangles - all colored */}
                          <div className="flex">
                            {Array.from({ length: parseInt(selectedDenominator) }, (_, index) => (
                              <div
                                key={`den-${index}`}
                                className="w-12 h-6 border-2 border-blue-400 bg-blue-400 relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-blue-400" style={{
                                  backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, white 2px, white 4px)'
                                }}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Level-specific content */}
                {selectedLevel === '2' ? (
                  /* Level 2: Geometric Shapes */
                  selectedNumerator && selectedDenominator && (
                    <GeometricShapesLevel2
                      numerator={parseInt(selectedNumerator)}
                      denominator={parseInt(selectedDenominator)}
                      className="mt-6"
                      shapeStates={level2ShapeStates}
                      shapeConfigs={level2ShapeConfigs}
                      onShapeStatesChange={setLevel2ShapeStates}
                      translations={{
                        numeratorLabel: t.numeratorLabel,
                        denominatorLabel: t.denominatorLabel,
                        clickPartsInstruction: t.clickPartsInstruction
                      }}
                    />
                  )
                ) : (
                  <>
                    {/* Instructions for drag and drop */}
                    <div className="text-center text-sm font-medium text-gray-700 mb-4">
                      🎯 {t.moveRigletas}: <span className="font-bold text-blue-600">{t.denominator}</span> / <span className="font-bold text-red-600">{t.numerator}</span>
                    </div>

                    {/* Game Board with Drag & Drop */}
                    <div className="flex items-start gap-6">
                  
                  <div className="flex-1 space-y-2">
                    {/* Addition operations with drag & drop rigletas */}
                    {dynamicOperations.map((operation, index) => (
                      <div key={index} className="bg-gray-50 px-6 py-2 rounded-lg border min-h-[72px] relative">
                        <div className="flex items-center justify-between">
                          {/* Left side - Mathematical operation with rigletas */}
                          <div className="flex items-center gap-6">
                            {/* First term */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-2xl font-bold text-red-600">
                                {operation.a}
                              </div>
                              <div 
                                className={cn(
                                  "flex transition-all duration-200",
                                  movedRigletas[`${index}-first`] 
                                    ? "opacity-30 cursor-not-allowed" 
                                    : "cursor-move hover:scale-105"
                                )}
                                draggable={!movedRigletas[`${index}-first`]}
                                onDragStart={() => !movedRigletas[`${index}-first`] && handleDragStart(operation.a, 'first', index)}
                              >
                                {Array.from({ length: operation.a }, (_, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-6 h-6 border border-gray-400 flex items-center justify-center",
                                       movedRigletas[`${index}-first`] 
                                         ? "bg-gray-200 border-gray-300" 
                                         : `${operation.colorA}`
                                    )}
                                  >
                                    {!movedRigletas[`${index}-first`] && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Plus sign */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-2xl font-bold text-gray-800">+</div>
                              <div className="h-6"></div>
                            </div>
                            
                            {/* Second term */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-2xl font-bold text-red-600">
                                {operation.b}
                              </div>
                              <div 
                                className={cn(
                                  "flex transition-all duration-200",
                                  movedRigletas[`${index}-second`] 
                                    ? "opacity-30 cursor-not-allowed" 
                                    : "cursor-move hover:scale-105"
                                )}
                                draggable={!movedRigletas[`${index}-second`]}
                                onDragStart={() => !movedRigletas[`${index}-second`] && handleDragStart(operation.b, 'second', index)}
                              >
                                {Array.from({ length: operation.b }, (_, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-6 h-6 border border-gray-400 flex items-center justify-center",
                                       movedRigletas[`${index}-second`] 
                                         ? "bg-gray-200 border-gray-300" 
                                         : `${operation.colorB}`
                                    )}
                                  >
                                    {!movedRigletas[`${index}-second`] && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Equals sign */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-2xl font-bold text-gray-800">=</div>
                              <div className="h-6"></div>
                            </div>
                            
                            {/* Result */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-2xl font-bold text-red-600">
                                {operation.result}
                              </div>
                              <div 
                                className={cn(
                                  "flex transition-all duration-200",
                                  movedRigletas[`${index}-result`] 
                                    ? "opacity-30 cursor-not-allowed" 
                                    : "cursor-move hover:scale-105"
                                )}
                                draggable={!movedRigletas[`${index}-result`]}
                                onDragStart={() => !movedRigletas[`${index}-result`] && handleDragStart(operation.result, 'result', index)}
                              >
                                {Array.from({ length: operation.result }, (_, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-6 h-6 border border-gray-400 flex items-center justify-center",
                                       movedRigletas[`${index}-result`] 
                                         ? "bg-gray-200 border-gray-300" 
                                         : `${operation.colorResult}`
                                    )}
                                  >
                                    {!movedRigletas[`${index}-result`] && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Center Drop Zone - Fraction Rectangle */}
                          <div className="flex-1 mx-8">
                            <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-3 min-h-[90px] flex items-center justify-center">
                              {/* Fraction Drop Rectangle */}
                              <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm" style={{width: '400px', height: '76px', position: 'relative'}}>
                                {/* Numerator Drop Zone (Above fraction line) */}
                                <div 
                                  className="absolute top-0 left-0 right-0 flex items-center justify-center" 
                                  style={{height: '33px'}}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, `numerator-zone`, index)}
                                >
                                  <div className="flex gap-1">
                                    {Object.entries(droppedRigletas)
                                      .filter(([key, rigleta]) => key.includes(`${index}-numerator-zone`))
                                      .map(([key, rigleta]) => (
                                        <div key={key} className="flex">
                                          {Array.from({ length: rigleta.operation }, (_, i) => (
                                            <div key={i} className="w-6 h-6 border border-gray-300 bg-red-400 flex items-center justify-center">
                                              <div className="w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                          ))}
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                                
                                {/* Fraction Line */}
                                <div 
                                  className="absolute bg-black" 
                                  style={{
                                    top: '35px',
                                    left: '15%', // 15% margin from left
                                    right: '15%', // 15% margin from right  
                                    height: '2px',
                                    width: '70%' // 85% - 15% = 70% of container width
                                  }}
                                ></div>
                                
                                {/* Denominator Drop Zone (Below fraction line) */}
                                <div 
                                  className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
                                  style={{height: '33px'}}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, `denominator-zone`, index)}
                                >
                                  <div className="flex gap-1">
                                    {Object.entries(droppedRigletas)
                                      .filter(([key, rigleta]) => key.includes(`${index}-denominator-zone`))
                                      .map(([key, rigleta]) => (
                                        <div key={key} className="flex">
                                          {Array.from({ length: rigleta.operation }, (_, i) => (
                                            <div key={i} className="w-6 h-6 border border-gray-300 bg-blue-400 flex items-center justify-center">
                                              <div className="w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                          ))}
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right side - Fraction display */}
                          <div className="flex items-center gap-3">
                            <div className="bg-white border-2 border-gray-300 p-2 rounded-lg shadow-sm min-w-[80px] text-center">
                              {/* Show numerator only if rigletas are dropped in numerator zone */}
                              <div className="text-3xl font-bold text-red-600 min-h-[34px] flex items-center justify-center">
                                {Object.entries(droppedRigletas)
                                  .filter(([key, rigleta]) => key.includes(`${index}-numerator-zone`))
                                  .reduce((sum, [key, rigleta]) => sum + rigleta.operation, 0) || ''}
                              </div>
                              <div className="border-t-2 border-gray-400 my-1"></div>
                              {/* Show denominator only if rigletas are dropped in denominator zone */}
                              <div className="text-3xl font-bold text-blue-600 min-h-[34px] flex items-center justify-center">
                                {Object.entries(droppedRigletas)
                                  .filter(([key, rigleta]) => key.includes(`${index}-denominator-zone`))
                                  .reduce((sum, [key, rigleta]) => sum + rigleta.operation, 0) || ''}
                              </div>
                            </div>
                            <div className="bg-orange-100 px-2 py-1 rounded text-xs">
                              <div className="text-orange-600 font-bold">{t.numeratorLabel}</div>
                              <div className="text-blue-600 font-bold">{t.denominatorLabel}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>

                  {/* Validate Button */}
                  <div className="mt-8 text-center">
                    {/* Button moved to right side of game board */}
                  </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Floating NumLit Keyboard - removed since we use dropdowns now */}
        
        {/* Fixed Keyboard and Validation Button - Bottom Right Corner */}
        {selectedNumerator && selectedDenominator && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
            {/* Horizontal NumLit Keyboard */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <div className="flex items-center gap-1">
                {/* Digits 0-9 in a single row */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <Button
                    key={digit}
                    size="sm"
                    variant="outline"
                    className="w-10 h-10 text-lg font-semibold hover:bg-blue-50"
                    onClick={() => {
                      // Handle digit input - you can add logic here if needed for future functionality
                      console.log(`Digit ${digit} pressed`);
                    }}
                  >
                    {digit}
                  </Button>
                ))}
                
                {/* Delete button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-12 h-10 text-lg hover:bg-red-50"
                  onClick={() => {
                    // Handle delete/backspace
                    console.log("Delete pressed");
                  }}
                >
                  ⌫
                </Button>
                
                {/* Tab button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-12 h-10 text-sm hover:bg-gray-50"
                  onClick={() => {
                    // Handle tab
                    console.log("Tab pressed");
                  }}
                >
                  ⇥
                </Button>
              </div>
            </div>
            
            {/* Validation Button */}
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={validateAnswer}
            >
              <span className="text-3xl">✓</span>
            </Button>
          </div>
        )}
        
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-scale-in text-center">
              <div className="text-6xl mb-4">🎉🎊✨</div>
              <div className="text-4xl font-bold text-green-600 animate-fade-in">
                {t.congratulations}!
              </div>
              <div className="text-xl text-green-500 animate-fade-in">
                {t.perfectAnswer}!
              </div>
            </div>
          </div>
        )}
        
        {/* Encouragement Animation */}
        {showEncouragement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-scale-in text-center">
              <div className="text-6xl mb-4">🤗💪🌟</div>
              <div className="text-4xl font-bold text-yellow-600 animate-fade-in">
                {t.tryAgain}!
              </div>
              <div className="text-xl text-yellow-500 animate-fade-in">
                {t.onRightTrack}!
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
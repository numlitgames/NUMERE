import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Smartphone, Tablet, Monitor, Play } from "lucide-react";
import { useState } from "react";

const languages = {
  ro: {
    flag: "🇷🇴",
    name: "Română",
    title: "Platforma Educațională 🎓",
    subtitle: "Învață prin joc și distrează-te cu rigletele magice!",
    modulesTitle: "Module Educaționale",
    featuredGamesTitle: "Jocuri\nDidactice\nMatematică",
    footer: "🌟 Dezvoltat pentru copii curioși de știință și învățare! 🌟",
    startPlaying: "Începe să Joci! 🎮",
    playNow: "Joacă Acum! ▶️",
    age: "Vârsta",
    level: "Nivel",
    games: "jocuri",
    modules: {
      math: {
        title: "NumLit Board",
        description: "poți preda pe tabla interactivă cu ajutorul liniaturilor NumLit și al elementelor grafice pentru comunicare, matematică, muzică"
      },
      literacy: {
        title: "Materiale fizice pentru elevi și profesori",
        description: "Materiale educaționale și resurse pentru învățare"
      },
      communication: {
        title: "Jocuri Didactice Comunicare",
        description: "Dezvoltă abilități de comunicare și limbaj prin jocuri interactive"
      },
      science: {
        title: "Descoperă NumLit",
        description: "Bibliotecă virtuală cu informații despre NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Să Calculăm",
        description: "Descoperă numerele și învață să calculezi."
      },
        calculate_visual: {
          title: "Să Calculăm - Vizual",
          description: "Calcule vizuale prin mutarea rigletelor și a componentelor."
        },
        magic_balance: {
          title: "Balanța Magică",
          description: "Echilibrează balanța cu riglete și numere."
        },
      letters: {
        title: "MAJoc Cu Fractii",
        description: "Învață fracții și operații cu fracții prin joc interactiv."
      },
      numlit_adventure: {
        title: "Numeratie",
        description: "Aventurile numerelor în lumea magică a rigletelor."
      },
      number_representation: {
        title: "Reprezentarea Numerelor",
        description: "Învață să reprezinți numerele vizual cu buline și rigleți."
      },
      visual_counting: {
        title: "Numărare Vizuală",
        description: "Exersează numărarea prin interacțiune vizuală."
      },
      neighbors_numbers: {
        title: "Vecinii Numerelor",
        description: "Găsește numerele vecine (înainte și după) pentru un număr dat."
      },
      magic_multiplication: {
        title: "Magia Înmulțirii",
        description: "Descoperă puterea înmulțirii cu riglete magice și vizualizări interactive."
      },
      mathematical_basics: {
        title: "Bazele Calcului Matematic",
        description: "Învață bazele calculului matematic prin riglete NumLit interactive și vizualizări."
      },
      literatie: {
        title: "Literație Metoda Cubului",
        description: "Dezvoltă abilități de citire și scriere prin exerciții interactive și jocuri educative."
      },
      litera_silaba: {
        title: "Litera - Silaba",
        description: "Dezvoltă abilitățile de recunoaștere a literelor mari și mici prin jocuri interactive de drag & drop."
      },
      time_measurement: {
        title: "Măsurarea Timpului",
        description: "Învață anotimpuri, luni, săptămâni, zile și ore prin activități interactive."
      },
      unit_measurement: {
        title: "Unități de Măsură",
        description: "Învață să transformi unitățile de măsură pentru lungime, volum și greutate."
      }
    }
  },
  en: {
    flag: "🇬🇧",
    name: "English",
    title: "Educational Platform 🎓",
    subtitle: "Learn through play and have fun with magic rods!",
    modulesTitle: "Educational Modules",
    featuredGamesTitle: "Educational\nMath\nGames",
    footer: "🌟 Developed for children curious about science and learning! 🌟",
    startPlaying: "Start Playing! 🎮",
    playNow: "Play Now! ▶️",
    age: "Age",
    level: "Level",
    games: "games",
    modules: {
      math: {
        title: "NumLit Board",
        description: "you can teach on the interactive board with the help of NumLit rulers and graphic elements for communication, mathematics, music"
      },
      literacy: {
        title: "Physical materials for students and teachers",
        description: "Educational materials and learning resources"
      },
      communication: {
        title: "Educational Communication Games",
        description: "Develop communication and language skills through interactive games"
      },
      science: {
        title: "Discover NumLit",
        description: "Virtual library with information about NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Let's Calculate",
        description: "Discover numbers and learn to calculate."
      },
      calculate_visual: {
        title: "Let's Calculate - Visual",
        description: "Visual calculations by moving rods and their components."
      },
      magic_balance: {
        title: "Magic Balance",
        description: "Balance the scale with rods and numbers."
      },
      letters: {
        title: "MAGame With Fractions",
        description: "Learn fractions and operations with fractions through interactive gameplay."
      },
      numlit_adventure: {
        title: "NumLit Adventures",
        description: "Number adventures in the magical world of rods."
      },
      number_representation: {
        title: "Number Representation",
        description: "Learn to represent numbers visually with dots and rods."
      },
      visual_counting: {
        title: "Visual Counting",
        description: "Practice counting through visual interaction."
      },
      neighbors_numbers: {
        title: "Number Neighbors",
        description: "Find the neighboring numbers (before and after) for a given number."
      },
      magic_multiplication: {
        title: "Magic of Multiplication",
        description: "Discover the power of multiplication with magic rods and interactive visualizations."
      },
      mathematical_basics: {
        title: "Mathematical Calculation Basics",
        description: "Learn mathematical calculation basics through interactive NumLit rods and visualizations."
      },
      literatie: {
        title: "Literacy",
        description: "Develop reading and writing skills through interactive exercises and educational games."
      },
      litera_silaba: {
        title: "Letter - Syllable",
        description: "Develop uppercase and lowercase letter recognition skills through interactive drag & drop games."
      },
      time_measurement: {
        title: "Time Measurement",
        description: "Learn seasons, months, weeks, days and hours through interactive activities."
      },
      unit_measurement: {
        title: "Units of Measurement",
        description: "Learn to convert measurement units for length, volume and weight."
      }
    }
  },
  hu: {
    flag: "🇭🇺",
    name: "Magyar",
    title: "Oktatási Platform 🎓",
    subtitle: "Tanulj játék közben és szórakozz a varázspálcikákkal!",
    modulesTitle: "Oktatási Modulok",
    featuredGamesTitle: "Oktatási\nMatematika\nJátékok",
    footer: "🌟 A tudományra és tanulásra kíváncsi gyerekek számára fejlesztve! 🌟",
    startPlaying: "Kezdj el játszani! 🎮",
    playNow: "Játszd most! ▶️",
    age: "Kor",
    level: "Szint",
    games: "játékok",
    modules: {
      math: {
        title: "NumLit Board",
        description: "taníthat az interaktív táblán a NumLit vonalzók és a kommunikáció, matematika, zene grafikus elemeinek segítségével"
      },
      literacy: {
        title: "Fizikai anyagok diákoknak és tanároknak",
        description: "Oktatási anyagok és tanulási források"
      },
      science: {
        title: "NumLit felfedezése",
        description: "Virtuális könyvtár NumLit információkkal"
      }
    },
    gamesList: {
      calculate: {
        title: "Számoljunk",
        description: "Fedezd fel a számokat és tanulj meg számolni."
      },
      calculate_visual: {
        title: "Számoljunk - Vizuális",
        description: "Vizuális számítások pálcikák és komponenseik mozgatásával."
      },
      magic_balance: {
        title: "Mágikus Mérleg",
        description: "Egyensúlyozd ki a mérleget pálcikákkal és számokkal."
      },
      letters: {
        title: "MAJáték Törtekkel",
        description: "Tanulj törteket és törtekkel való műveleteket interaktív játékokon keresztül."
      },
      numlit_adventure: {
        title: "NumLit Kalandok",
        description: "Szám kalandok a varázspálcikák világában."
      },
      number_representation: {
        title: "Számok Megjelenítése",
        description: "Tanulj meg számokat pontokkal és pálcikákkal ábrázolni."
      },
      visual_counting: {
        title: "Vizuális Számolás",
        description: "Gyakorold a számolást vizuális interakcióval."
      },
      neighbors_numbers: {
        title: "Számok szomszédai",
        description: "Találd meg az adott szám szomszédait (előtte és utána)."
      },
      magic_multiplication: {
        title: "Szorzás Mágiája",
        description: "Fedezd fel a szorzás erejét varázspálcikákkal és interaktív vizualizációkkal."
      },
      mathematical_basics: {
        title: "Matematikai Alapok",
        description: "Tanulj matematikai alapokat NumLit pálcikákkal és vizualizációkkal."
      },
      literatie: {
        title: "Írás-olvasás",
        description: "Fejlessze olvasási és írási készségeit interaktív gyakorlatokkal."
      },
      litera_silaba: {
        title: "Betű - Szótag",
        description: "Fejlessze nagy- és kisbetű felismerési képességeit húzás-ejtés játékokon keresztül."
      },
      time_measurement: {
        title: "Időmérés",
        description: "Tanulj évszakokat, hónapokat, heteket, napokat és órákat interaktív tevékenységeken keresztül."
      },
      unit_measurement: {
        title: "Mértékegységek",
        description: "Tanulj meg átváltani hosszúsági, térfogat és tömeg mértékegységeket."
      }
    }
  },
  de: {
    flag: "🇩🇪",
    name: "Deutsch",
    title: "Bildungsplattform 🎓",
    subtitle: "Lerne durch Spielen und hab Spaß mit magischen Stäben!",
    modulesTitle: "Bildungsmodule",
    featuredGamesTitle: "Pädagogische\nMathe\nSpiele",
    footer: "🌟 Entwickelt für Kinder, die neugierig auf Wissenschaft und Lernen sind! 🌟",
    startPlaying: "Spiel beginnen! 🎮",
    playNow: "Jetzt spielen! ▶️",
    age: "Alter",
    level: "Level",
    games: "Spiele",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Sie können auf der interaktiven Tafel mit Hilfe von NumLit-Linealen und grafischen Elementen für Kommunikation, Mathematik, Musik unterrichten"
      },
      literacy: {
        title: "Physische Materialien für Schüler und Lehrer",
        description: "Bildungsmaterialien und Lernressourcen"
      },
      science: {
        title: "NumLit entdecken",
        description: "Virtuelle Bibliothek mit Informationen über NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Lass uns rechnen",
        description: "Entdecke Zahlen und lerne zu rechnen."
      },
      calculate_visual: {
        title: "Lass uns rechnen - Visuell",
        description: "Visuelle Berechnungen durch Bewegen von Stäben und ihren Komponenten."
      },
      magic_balance: {
        title: "Magische Waage",
        description: "Bringe die Waage mit Stäben und Zahlen ins Gleichgewicht."
      },
      letters: {
        title: "MASpiel mit Brüchen",
        description: "Lerne Brüche und Operationen mit Brüchen durch interaktive Spiele."
      },
      numlit_adventure: {
        title: "NumLit Abenteuer",
        description: "Zahlen-Abenteuer in der magischen Welt der Stäbe."
      },
      number_representation: {
        title: "Zahlen-Darstellung",
        description: "Lerne Zahlen visuell mit Punkten und Stäben darzustellen."
      },
      visual_counting: {
        title: "Visuelles Zählen",
        description: "Übe das Zählen durch visuelle Interaktion."
      },
      neighbors_numbers: {
        title: "Nachbarn der Zahlen",
        description: "Finde die Nachbarzahlen (davor und danach) zu einer gegebenen Zahl."
      },
      magic_multiplication: {
        title: "Magie der Multiplikation",
        description: "Entdecke die Kraft der Multiplikation mit magischen Stäben und interaktiven Visualisierungen."
      },
      mathematical_basics: {
        title: "Mathematische Grundlagen",
        description: "Lerne mathematische Grundlagen mit NumLit Stäben und Visualisierungen."
      },
      literatie: {
        title: "Lesen und Schreiben",
        description: "Entwickle Lese- und Schreibfähigkeiten durch interaktive Übungen."
      },
      litera_silaba: {
        title: "Buchstabe - Silbe",
        description: "Entwickle Groß- und Kleinbuchstaben-Erkennungsfähigkeiten durch Drag & Drop Spiele."
      },
      time_measurement: {
        title: "Zeitmessung",
        description: "Lerne Jahreszeiten, Monate, Wochen, Tage und Stunden durch interaktive Aktivitäten."
      },
      unit_measurement: {
        title: "Maßeinheiten",
        description: "Lerne Maßeinheiten für Länge, Volumen und Gewicht umzurechnen."
      }
    }
  },
  es: {
    flag: "🇪🇸",
    name: "Español",
    title: "Plataforma Educativa 🎓",
    subtitle: "¡Aprende jugando y diviértete con las varitas mágicas!",
    modulesTitle: "Módulos Educativos",
    featuredGamesTitle: "Juegos\nEducativos\nMatemáticas",
    footer: "🌟 ¡Desarrollado para niños curiosos sobre ciencia y aprendizaje! 🌟",
    startPlaying: "¡Empezar a Jugar! 🎮",
    playNow: "¡Jugar Ahora! ▶️",
    age: "Edad",
    level: "Nivel",
    games: "juegos",
    modules: {
      math: {
        title: "NumLit Board",
        description: "puedes enseñar en la pizarra interactiva con la ayuda de reglas NumLit y elementos gráficos para comunicación, matemáticas, música"
      },
      literacy: {
        title: "Materiales físicos para estudiantes y profesores",
        description: "Materiales educativos y recursos de aprendizaje"
      },
      science: {
        title: "Descubrir NumLit",
        description: "Biblioteca virtual con información sobre NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Vamos a Calcular",
        description: "Descubre los números y aprende a calcular."
      },
      calculate_visual: {
        title: "Vamos a Calcular - Visual",
        description: "Cálculos visuales moviendo varillas y sus componentes."
      },
      magic_balance: {
        title: "Balanza Mágica",
        description: "Equilibra la balanza con varillas y números."
      },
      letters: {
        title: "MAJuego con Fracciones",
        description: "Aprende fracciones y operaciones con fracciones a través de juegos interactivos."
      },
      numlit_adventure: {
        title: "NumLit Aventuras",
        description: "Aventuras de números en el mundo mágico de las varillas."
      },
      number_representation: {
        title: "Representación de Números",
        description: "Aprende a representar números visualmente con puntos y varillas."
      },
      visual_counting: {
        title: "Conteo Visual",
        description: "Practica contar a través de la interacción visual."
      },
      neighbors_numbers: {
        title: "Vecinos de los Números",
        description: "Encuentra los números vecinos (anterior y siguiente) de un número dado."
      },
      magic_multiplication: {
        title: "Magia de la Multiplicación",
        description: "Descubre el poder de la multiplicación con varitas mágicas y visualizaciones interactivas."
      },
      mathematical_basics: {
        title: "Fundamentos Matemáticos",
        description: "Aprende fundamentos matemáticos con varillas NumLit y visualizaciones."
      },
      literatie: {
        title: "Lectoescritura",
        description: "Desarrolla habilidades de lectura y escritura a través de ejercicios interactivos."
      },
      litera_silaba: {
        title: "Letra - Sílaba",
        description: "Desarrolla habilidades de reconocimiento de letras mayúsculas y minúsculas mediante juegos de arrastrar y soltar."
      },
      time_measurement: {
        title: "Medición del Tiempo",
        description: "Aprende estaciones, meses, semanas, días y horas a través de actividades interactivas."
      },
      unit_measurement: {
        title: "Unidades de Medida",
        description: "Aprende a convertir unidades de medida para longitud, volumen y peso."
      }
    }
  },
  it: {
    flag: "🇮🇹",
    name: "Italiano",
    title: "Piattaforma Educativa 🎓",
    subtitle: "Impara giocando e divertiti con le bacchette magiche!",
    modulesTitle: "Moduli Educativi",
    featuredGamesTitle: "Giochi\nEducativi\nMatematica",
    footer: "🌟 Sviluppato per bambini curiosi di scienza e apprendimento! 🌟",
    startPlaying: "Inizia a Giocare! 🎮",
    playNow: "Gioca Ora! ▶️",
    age: "Età",
    level: "Livello",
    games: "giochi",
    modules: {
      math: {
        title: "NumLit Board",
        description: "puoi insegnare sulla lavagna interattiva con l'aiuto di righelli NumLit e elementi grafici per comunicazione, matematica, musica"
      },
      literacy: {
        title: "Materiali fisici per studenti e insegnanti",
        description: "Materiali educativi e risorse per l'apprendimento"
      },
      science: {
        title: "Scopri NumLit",
        description: "Biblioteca virtuale con informazioni su NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Calcoliamo",
        description: "Scopri i numeri e impara a calcolare."
      },
      calculate_visual: {
        title: "Calcoliamo - Visuale",
        description: "Calcoli visuali spostando le aste e i loro componenti."
      },
      magic_balance: {
        title: "Bilancia Magica",
        description: "Equilibra la bilancia con aste e numeri."
      },
      letters: {
        title: "MAGioco con Frazioni",
        description: "Impara le frazioni e le operazioni con le frazioni attraverso giochi interattivi."
      },
      numlit_adventure: {
        title: "NumLit Avventure",
        description: "Avventure numeriche nel mondo magico delle bacchette."
      },
      number_representation: {
        title: "Rappresentazione Numeri",
        description: "Impara a rappresentare i numeri visualmente con punti e bacchette."
      },
      visual_counting: {
        title: "Conteggio Visivo",
        description: "Pratica il conteggio attraverso l'interazione visiva."
      },
      neighbors_numbers: {
        title: "Vicini dei Numeri",
        description: "Trova i numeri vicini (prima e dopo) di un numero dato."
      },
      magic_multiplication: {
        title: "Magia della Moltiplicazione",
        description: "Scopri il potere della moltiplicazione con bacchette magiche e visualizzazioni interattive."
      },
      mathematical_basics: {
        title: "Basi Matematiche",
        description: "Impara le basi matematiche con bacchette NumLit e visualizzazioni."
      },
      literatie: {
        title: "Alfabetizzazione",
        description: "Sviluppa abilità di lettura e scrittura attraverso esercizi interattivi."
      },
      litera_silaba: {
        title: "Lettera - Sillaba",
        description: "Sviluppa le abilità di riconoscimento delle lettere maiuscole e minuscole attraverso giochi di trascinamento."
      },
      time_measurement: {
        title: "Misurazione del Tempo",
        description: "Impara le stagioni, i mesi, le settimane, i giorni e le ore attraverso attività interattive."
      },
      unit_measurement: {
        title: "Unità di Misura",
        description: "Impara a convertire le unità di misura per lunghezza, volume e peso."
      }
    }
  },
  fr: {
    flag: "🇫🇷",
    name: "Français",
    title: "Plateforme Éducative 🎓",
    subtitle: "Apprends en jouant et amuse-toi avec les baguettes magiques!",
    modulesTitle: "Modules Éducatifs",
    featuredGamesTitle: "Jeux\nÉducatifs\nMathématiques",
    footer: "🌟 Développé pour les enfants curieux de science et d'apprentissage! 🌟",
    startPlaying: "Commencer à Jouer! 🎮",
    playNow: "Jouer Maintenant! ▶️",
    age: "Âge",
    level: "Niveau",
    games: "jeux",
    modules: {
      math: {
        title: "NumLit Board",
        description: "vous pouvez enseigner sur le tableau interactif avec l'aide de règles NumLit et d'éléments graphiques pour la communication, les mathématiques, la musique"
      },
      literacy: {
        title: "Matériaux physiques pour étudiants et enseignants",
        description: "Matériaux éducatifs et ressources d'apprentissage"
      },
      science: {
        title: "Découvrir NumLit",
        description: "Bibliothèque virtuelle avec des informations sur NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Calculons",
        description: "Découvre les nombres et apprends à calculer."
      },
      calculate_visual: {
        title: "Calculons - Visuel",
        description: "Calculs visuels en déplaçant les baguettes et leurs composants."
      },
      magic_balance: {
        title: "Balance Magique",
        description: "Équilibre la balance avec des baguettes et des nombres."
      },
      letters: {
        title: "MAJeu avec Fractions",
        description: "Apprends les fractions et les opérations avec les fractions par des jeux interactifs."
      },
      numlit_adventure: {
        title: "NumLit Aventures",
        description: "Aventures numériques dans le monde magique des baguettes."
      },
      number_representation: {
        title: "Représentation des Nombres",
        description: "Apprends à représenter les nombres visuellement avec des points et des baguettes."
      },
      visual_counting: {
        title: "Comptage Visuel",
        description: "Pratique le comptage par interaction visuelle."
      },
      neighbors_numbers: {
        title: "Voisins des Nombres",
        description: "Trouve les nombres voisins (avant et après) d’un nombre donné."
      }
    }
  },
  ru: {
    flag: "🇷🇺",
    name: "Русский",
    title: "Образовательная Платформа 🎓",
    subtitle: "Учись играя и развлекайся с волшебными палочками!",
    modulesTitle: "Образовательные Модули",
    featuredGamesTitle: "Образователь\nные Матем\nатические Игры",
    footer: "🌟 Создано для детей, любознательных в науке и обучении! 🌟",
    startPlaying: "Начать Играть! 🎮",
    playNow: "Играть Сейчас! ▶️",
    age: "Возраст",
    level: "Уровень",
    games: "игры",
    modules: {
      math: {
        title: "NumLit Board",
        description: "вы можете преподавать на интерактивной доске с помощью линеек NumLit и графических элементов для общения, математики, музыки"
      },
      literacy: {
        title: "Физические материалы для учеников и учителей",
        description: "Образовательные материалы и ресурсы для обучения"
      },
      science: {
        title: "Открыть NumLit",
        description: "Виртуальная библиотека с информацией о NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Давайте Считать",
        description: "Открой числа и научись считать."
      },
      calculate_visual: {
        title: "Давайте Считать - Визуально",
        description: "Визуальные вычисления путем перемещения палочек и их компонентов."
      },
      magic_balance: {
        title: "Волшебные Весы",
        description: "Уравновесь весы палочками и числами."
      },
      letters: {
        title: "МАИгра с Дробями",
        description: "Изучай дроби и операции с дробями через интерактивные игры."
      },
      numlit_adventure: {
        title: "NumLit Приключения",
        description: "Числовые приключения в волшебном мире палочек."
      },
      number_representation: {
        title: "Представление Чисел",
        description: "Научись представлять числа визуально с точками и палочками."
      },
      visual_counting: {
        title: "Визуальный Счет",
        description: "Практикуй счет через визуальное взаимодействие."
      },
      neighbors_numbers: {
        title: "Соседи чисел",
        description: "Найди соседние числа (до и после) для заданного числа."
      },
      magic_multiplication: {
        title: "Магия Умножения",
        description: "Открой силу умножения с волшебными палочками и интерактивными визуализациями."
      }
    }
  },
  el: {
    flag: "🇬🇷",
    name: "Ελληνικά",
    title: "Εκπαιδευτική Πλατφόρμα 🎓",
    subtitle: "Μάθε παίζοντας και διασκέδασε με τα μαγικά ραβδιά!",
    modulesTitle: "Εκπαιδευτικές Ενότητες",
    featuredGamesTitle: "Εκπαιδευτικά\nΜαθηματικά\nΠαιχνίδια",
    footer: "🌟 Αναπτύχθηκε για παιδιά περίεργα για επιστήμη και μάθηση! 🌟",
    startPlaying: "Ξεκίνα να Παίζεις! 🎮",
    playNow: "Παίξε Τώρα! ▶️",
    age: "Ηλικία",
    level: "Επίπεδο",
    games: "παιχνίδια",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Διαδραστική εκμάθηση αριθμών και υπολογισμών"
      },
      literacy: {
        title: "Φυσικά υλικά για μαθητές και δασκάλους",
        description: "Εκπαιδευτικά υλικά και πόροι μάθησης"
      },
      science: {
        title: "Ανακάλυψε NumLit",
        description: "Εικονική βιβλιοθήκη με πληροφορίες για NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Ας Υπολογίσουμε",
        description: "Ανακάλυψε τους αριθμούς και μάθε να υπολογίζεις."
      },
      calculate_visual: {
        title: "Ας Υπολογίσουμε - Οπτικό",
        description: "Οπτικοί υπολογισμοί μετακινώντας ραβδιά και τα στοιχεία τους."
      },
      magic_balance: {
        title: "Μαγικό Ζυγό",
        description: "Ισορρόπησε το ζυγό με ραβδιά και αριθμούς."
      },
      letters: {
        title: "ΜΑΠαιχνίδι με Κλάσματα",
        description: "Μάθε κλάσματα και πράξεις με κλάσματα μέσω διαδραστικών παιχνιδιών."
      },
      numlit_adventure: {
        title: "NumLit Περιπέτειες",
        description: "Αριθμητικές περιπέτειες στον μαγικό κόσμο των ραβδιών."
      },
      number_representation: {
        title: "Αναπαράσταση Αριθμών",
        description: "Μάθε να παριστάνεις αριθμούς οπτικά με τελείες και ραβδιά."
      },
      visual_counting: {
        title: "Οπτική Μέτρηση",
        description: "Εξάσκησε τη μέτρηση μέσω οπτικής αλληλεπίδρασης."
      },
      neighbors_numbers: {
        title: "Γείτονες των Αριθμών",
        description: "Βρες τους γειτονικούς αριθμούς (πριν και μετά) για έναν δοσμένο αριθμό."
      },
      magic_multiplication: {
        title: "Μαγεία του Πολλαπλασιασμού",
        description: "Ανακάλυψε τη δύναμη του πολλαπλασιασμού με μαγικές ράβδους και διαδραστικές απεικονίσεις."
      },
      mathematical_basics: {
        title: "Μαθηματικές Βάσεις",
        description: "Μάθε μαθηματικές βάσεις με ράβδους NumLit και απεικονίσεις."
      },
      literatie: {
        title: "Γραμματισμός",
        description: "Αναπτύξτε δεξιότητες ανάγνωσης και γραφής μέσω διαδραστικών ασκήσεων."
      },
      litera_silaba: {
        title: "Γράμμα - Συλλαβή",
        description: "Αναπτύξτε δεξιότητες αναγνώρισης κεφαλαίων και πεζών γραμμάτων μέσω παιχνιδιών σύρσης."
      },
      time_measurement: {
        title: "Μέτρηση Χρόνου",
        description: "Μάθε εποχές, μήνες, εβδομάδες, ημέρες και ώρες μέσω διαδραστικών δραστηριοτήτων."
      },
      unit_measurement: {
        title: "Μονάδες Μέτρησης",
        description: "Μάθε να μετατρέπεις μονάδες μέτρησης για μήκος, όγκο και βάρος."
      }
    }
  },
  bg: {
    flag: "🇧🇬",
    name: "Български",
    title: "Образователна Платформа 🎓",
    subtitle: "Учи си играйки и се забавлявай с магическите пръчки!",
    modulesTitle: "Образователни Модули",
    featuredGamesTitle: "Образователни\nМатематически\nИгри",
    footer: "🌟 Разработено за деца, любопитни към науката и ученето! 🌟",
    startPlaying: "Започни да Играеш! 🎮",
    playNow: "Играй Сега! ▶️",
    age: "Възраст",
    level: "Ниво",
    games: "игри",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Интерактивно учене на числа и изчисления"
      },
      literacy: {
        title: "Физически материали за ученици и учители",
        description: "Образователни материали и ресурси за учене"
      },
      science: {
        title: "Открий NumLit",
        description: "Виртуална библиотека с информация за NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Нека Смятаме",
        description: "Открий числата и научи се да смяташ."
      },
      calculate_visual: {
        title: "Нека Смятаме - Визуално",
        description: "Визуални изчисления чрез придвижване на пръчки и техните компоненти."
      },
      letters: {
        title: "МАИгра с Дроби",
        description: "Учи дроби и операции с дроби чрез интерактивни игри."
      },
      numlit_adventure: {
        title: "NumLit Приключения",
        description: "Числови приключения в магическия свят на пръчките."
      },
      number_representation: {
        title: "Представяне на Числа",
        description: "Научи се да представяш числа визуално с точки и пръчки."
      },
      visual_counting: {
        title: "Визуално Броене",
        description: "Практикувай броенето чрез визуално взаимодействие."
      },
      neighbors_numbers: {
        title: "Съседи на числата",
        description: "Намери съседните числа (преди и след) на дадено число."
      },
      magic_multiplication: {
        title: "Магията на Умножението",
        description: "Открий силата на умножението с магически пръчки и интерактивни визуализации."
      },
      mathematical_basics: {
        title: "Математически Основи",
        description: "Научи математически основи с пръчки NumLit и визуализации."
      },
      literatie: {
        title: "Грамотност",
        description: "Развий умения за четене и писане чрез интерактивни упражнения."
      },
      litera_silaba: {
        title: "Буква - Срички",
        description: "Развий умения за разпознаване на главни и малки букви чрез игри с плъзгане."
      },
      time_measurement: {
        title: "Измерване на Време",
        description: "Научи се за сезоните, месеците, седмиците, дните и часовете чрез интерактивни дейности."
      },
      unit_measurement: {
        title: "Мерни Единици",
        description: "Научи се да преобразуваш мерни единици за дължина, обем и тегло."
      }
    }
  },
  pl: {
    flag: "🇵🇱",
    name: "Polski",
    title: "Platforma Edukacyjna 🎓",
    subtitle: "Ucz się bawiąc i baw się magicznymi pałeczkami!",
    modulesTitle: "Moduły Edukacyjne",
    featuredGamesTitle: "Popularne Gry",
    footer: "🌟 Stworzone dla dzieci ciekawych nauki i uczenia się! 🌟",
    startPlaying: "Zacznij Grać! 🎮",
    playNow: "Graj Teraz! ▶️",
    age: "Wiek",
    level: "Poziom",
    games: "gry",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Interaktywna nauka liczb i obliczeń"
      },
      literacy: {
        title: "Materiały fizyczne dla uczniów i nauczycieli",
        description: "Materiały edukacyjne i zasoby do nauki"
      },
      science: {
        title: "Odkryj NumLit",
        description: "Wirtualna biblioteka z informacjami o NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Liczmy",
        description: "Odkryj liczby i naucz się liczyć."
      },
      calculate_visual: {
        title: "Liczmy - Wizualnie",
        description: "Wizualne obliczenia poprzez przesuwanie pałeczek i ich komponentów."
      },
      letters: {
        title: "MAGra z Ułamkami",
        description: "Ucz się ułamków i operacji na ułamkach poprzez interaktywne gry."
      },
      numlit_adventure: {
        title: "NumLit Przygody",
        description: "Przygody liczbowe w magicznym świecie pałeczek."
      },
      number_representation: {
        title: "Reprezentacja Liczb",
        description: "Naucz się reprezentować liczby wizualnie z punktami i pałeczkami."
      },
      visual_counting: {
        title: "Wizualne Liczenie",
        description: "Ćwicz liczenie poprzez wizualną interakcję."
      },
      neighbors_numbers: {
        title: "Sąsiedzi liczb",
        description: "Znajdź liczby sąsiednie (poprzednią i następną) dla danej liczby."
      },
      magic_multiplication: {
        title: "Magia Mnożenia",
        description: "Odkryj siłę mnożenia z magicznymi pałeczkami i interaktywnymi wizualizacjami."
      },
      mathematical_basics: {
        title: "Podstawy Matematyczne",
        description: "Naucz się podstaw matematyki z pałeczkami NumLit i wizualizacjami."
      },
      literatie: {
        title: "Umiejętności Czytania i Pisania",
        description: "Rozwijaj umiejętności czytania i pisania poprzez interaktywne ćwiczenia."
      },
      litera_silaba: {
        title: "Litera - Sylaba",
        description: "Rozwijaj umiejętności rozpoznawania dużych i małych liter poprzez gry przeciągania."
      },
      time_measurement: {
        title: "Pomiar Czasu",
        description: "Naucz się pór roku, miesięcy, tygodni, dni i godzin poprzez interaktywne zajęcia."
      },
      unit_measurement: {
        title: "Jednostki Miary",
        description: "Naucz się przeliczać jednostki miary dla długości, objętości i masy."
      }
    }
  },
  ar: {
    flag: "🇸🇦",
    name: "العربية",
    title: "المنصة التعليمية 🎓",
    subtitle: "تعلم باللعب واستمتع بالعصي السحرية!",
    modulesTitle: "الوحدات التعليمية",
    featuredGamesTitle: "ألعاب\nرياضية\nتعليمية",
    footer: "🌟 تم تطويره للأطفال الفضوليين في العلوم والتعلم! 🌟",
    startPlaying: "ابدأ اللعب! 🎮",
    playNow: "العب الآن! ▶️",
    age: "العمر",
    level: "المستوى",
    games: "ألعاب",
    modules: {
      math: {
        title: "NumLit Board",
        description: "تعلم تفاعلي للأرقام والحسابات"
      },
      literacy: {
        title: "مواد فيزيائية للطلاب والمعلمين",
        description: "مواد تعليمية وموارد للتعلم"
      },
      science: {
        title: "اكتشف NumLit",
        description: "مكتبة افتراضية بمعلومات حول NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "لنحسب",
        description: "اكتشف الأرقام وتعلم الحساب."
      },
      calculate_visual: {
        title: "لنحسب - بصري",
        description: "حسابات بصرية عن طريق تحريك العصي ومكوناتها."
      },
      letters: {
        title: "لعبة الكسور التعليمية",
        description: "تعلم الكسور والعمليات الحسابية مع الكسور من خلال الألعاب التفاعلية."
      },
      numlit_adventure: {
        title: "NumLit مغامرات",
        description: "مغامرات الأرقام في عالم العصي السحري."
      },
      number_representation: {
        title: "تمثيل الأرقام",
        description: "تعلم تمثيل الأرقام بصرياً بالنقاط والعصي."
      },
      visual_counting: {
        title: "العد البصري",
        description: "مارس العد من خلال التفاعل البصري."
      },
      neighbors_numbers: {
        title: "جيران الأعداد",
        description: "اعثر على الأعداد المجاورة (السابق واللاحق) للعدد المعطى."
      },
      magic_multiplication: {
        title: "سحر الضرب",
        description: "اكتشف قوة الضرب بالعصي السحرية والتصورات التفاعلية."
      },
      mathematical_basics: {
        title: "أساسيات الرياضيات",
        description: "تعلم أساسيات الرياضيات بعصي NumLit والتصورات."
      },
      literatie: {
        title: "محو الأمية",
        description: "طور مهارات القراءة والكتابة من خلال التمارين التفاعلية."
      },
      litera_silaba: {
        title: "الحرف - المقطع",
        description: "طور مهارات التعرف على الأحرف الكبيرة والصغيرة من خلال ألعاب السحب والإفلات."
      },
      time_measurement: {
        title: "قياس الوقت",
        description: "تعلم الفصول والشهور والأسابيع والأيام والساعات من خلال أنشطة تفاعلية."
      },
      unit_measurement: {
        title: "وحدات القياس",
        description: "تعلم تحويل وحدات القياس للطول والحجم والوزن."
      }
    }
  },
  cs: {
    flag: "🇨🇿",
    name: "Čeština",
    title: "Vzdělávací Platforma 🎓",
    subtitle: "Učte se hraním a bavte se s kouzelnými tyčinkami!",
    modulesTitle: "Vzdělávací Moduly",
    featuredGamesTitle: "Vzdělávací\nMatematické\nHry",
    footer: "🌟 Vyvinuto pro děti zvědavé na vědu a učení! 🌟",
    startPlaying: "Začít Hrát! 🎮",
    playNow: "Hrát Nyní! ▶️",
    age: "Věk",
    level: "Úroveň",
    games: "hry",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Interaktivní učení čísel a výpočtů"
      },
      literacy: {
        title: "Fyzické materiály pro studenty a učitele",
        description: "Vzdělávací materiály a zdroje pro učení"
      },
      science: {
        title: "Objevte NumLit",
        description: "Virtuální knihovna s informacemi o NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Počítejme",
        description: "Objevte čísla a naučte se počítat."
      },
      calculate_visual: {
        title: "Počítejme - Vizuálně",
        description: "Vizuální výpočty přesouváním tyčinek a jejich komponentů."
      },
      letters: {
        title: "MAHra se Zlomky",
        description: "Učte se zlomky a operace se zlomky prostřednictvím interaktivních her."
      },
      numlit_adventure: {
        title: "NumLit Dobrodružství",
        description: "Číselná dobrodružství v kouzelném světě tyčinek."
      },
      number_representation: {
        title: "Reprezentace Čísel",
        description: "Naučte se představovat čísla vizuálně s tečkami a tyčinkami."
      },
      visual_counting: {
        title: "Vizuální Počítání",
        description: "Procvičte počítání prostřednictvím vizuální interakce."
      },
      neighbors_numbers: {
        title: "Sousedé čísel",
        description: "Najděte sousední čísla (před a po) pro dané číslo."
      },
      magic_multiplication: {
        title: "Kouzlo Násobení",
        description: "Objevte sílu násobení s magickými tyčkami a interaktivními vizualizacemi."
      },
      mathematical_basics: {
        title: "Matematické Základy",
        description: "Naučte se matematické základy s tyčinkami NumLit a vizualizacemi."
      },
      literatie: {
        title: "Gramotnost",
        description: "Rozvíjejte dovednosti čtení a psaní prostřednictvím interaktivních cvičení."
      },
      litera_silaba: {
        title: "Písmeno - Slabika",
        description: "Rozvíjejte dovednosti rozpoznávání velkých a malých písmen prostřednictvím přetahovacích her."
      },
      time_measurement: {
        title: "Měření Času",
        description: "Naučte se roční období, měsíce, týdny, dny a hodiny prostřednictvím interaktivních aktivit."
      },
      unit_measurement: {
        title: "Měrné Jednotky",
        description: "Naučte se převádět měrné jednotky pro délku, objem a hmotnost."
      }
    }
  },
  pt: {
    flag: "🇵🇹",
    name: "Português",
    title: "Plataforma Educativa 🎓",
    subtitle: "Aprende brincando e diverte-te com as varinhas mágicas!",
    modulesTitle: "Módulos Educativos",
    featuredGamesTitle: "Jogos\nEducativos\nMatemática",
    footer: "🌟 Desenvolvido para crianças curiosas sobre ciência e aprendizagem! 🌟",
    startPlaying: "Começar a Jogar! 🎮",
    playNow: "Jogar Agora! ▶️",
    age: "Idade",
    level: "Nível",
    games: "jogos",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Aprendizagem interativa de números e cálculos"
      },
      literacy: {
        title: "Materiais físicos para estudantes e professores",
        description: "Materiais educacionais e recursos de aprendizagem"
      },
      science: {
        title: "Descobrir NumLit",
        description: "Biblioteca virtual com informações sobre NumLit"
      }
    },
    gamesList: {
      calculate: {
        title: "Vamos Calcular",
        description: "Descobre os números e aprende a calcular."
      },
      calculate_visual: {
        title: "Vamos Calcular - Visual",
        description: "Cálculos visuais movendo varinhas e os seus componentes."
      },
      letters: {
        title: "MAJogo com Frações",
        description: "Aprende frações e operações com frações através de jogos interativos."
      },
      numlit_adventure: {
        title: "NumLit Aventuras",
        description: "Aventuras numéricas no mundo mágico das varinhas."
      },
      number_representation: {
        title: "Representação de Números",
        description: "Aprende a representar números visualmente com pontos e varinhas."
      },
      visual_counting: {
        title: "Contagem Visual",
        description: "Pratica a contagem através da interação visual."
      },
      neighbors_numbers: {
        title: "Vizinhos dos Números",
        description: "Encontra os números vizinhos (antes e depois) para um dado número."
      },
      magic_multiplication: {
        title: "Magia da Multiplicação",
        description: "Descobre o poder da multiplicação com varinhas mágicas e visualizações interativas."
      },
      mathematical_basics: {
        title: "Fundamentos Matemáticos",
        description: "Aprende fundamentos matemáticos com varinhas NumLit e visualizações."
      },
      literatie: {
        title: "Literacia",
        description: "Desenvolve competências de leitura e escrita através de exercícios interativos."
      },
      litera_silaba: {
        title: "Letra - Sílaba",
        description: "Desenvolve competências de reconhecimento de letras maiúsculas e minúsculas através de jogos de arrastar."
      },
      time_measurement: {
        title: "Medição do Tempo",
        description: "Aprende estações, meses, semanas, dias e horas através de atividades interativas."
      },
      unit_measurement: {
        title: "Unidades de Medida",
        description: "Aprende a converter unidades de medida para comprimento, volume e peso."
      }
    }
  },
  tr: {
    flag: "🇹🇷",
    name: "Türkçe",
    title: "Eğitim Platformu 🎓",
    subtitle: "Sihirli çubuklar ile oyna ve öğren!",
    modulesTitle: "Eğitim Modülleri",
    featuredGamesTitle: "Eğitici\nMatematik\nOyunları",
    footer: "🌟 Bilim ve öğrenmeye meraklı çocuklar için geliştirildi! 🌟",
    startPlaying: "Oynamaya Başla! 🎮",
    playNow: "Şimdi Oyna! ▶️",
    age: "Yaş",
    level: "Seviye",
    games: "oyunlar",
    modules: {
      math: {
        title: "NumLit Board",
        description: "Sayılar ve hesaplamaların etkileşimli öğrenimi"
      },
      literacy: {
        title: "Öğrenciler ve öğretmenler için fiziksel materyaller",
        description: "Eğitim materyalleri ve öğrenme kaynakları"
      },
      science: {
        title: "NumLit'i Keşfet",
        description: "NumLit hakkında bilgi içeren sanal kütüphane"
      }
    },
    gamesList: {
      calculate: {
        title: "Hadi Hesaplayalım",
        description: "Sayıları keşfet ve hesaplamayı öğren."
      },
      calculate_visual: {
        title: "Hadi Hesaplayalım - Görsel",
        description: "Çubukları ve bileşenlerini hareket ettirerek görsel hesaplamalar."
      },
      magic_balance: {
        title: "Sihirli Terazi",
        description: "Çubuklar ve sayılarla teraziyi dengele."
      },
      letters: {
        title: "Kesirlerle MAOyun",
        description: "Etkileşimli oyunlar aracılığıyla kesirleri ve kesir işlemlerini öğren."
      },
      numlit_adventure: {
        title: "NumLit Maceraları",
        description: "Sihirli çubuklar dünyasında sayı maceraları."
      },
      number_representation: {
        title: "Sayı Gösterimi",
        description: "Sayıları noktalar ve çubuklar ile görsel olarak göstermeyi öğren."
      },
      visual_counting: {
        title: "Görsel Sayma",
        description: "Görsel etkileşim ile saymayı pratik yap."
      },
      neighbors_numbers: {
        title: "Sayıların Komşuları",
        description: "Verilen bir sayının komşu sayılarını (öncesi ve sonrası) bul."
      },
      magic_multiplication: {
        title: "Çarpmanın Büyüsü",
        description: "Sihirli çubuklar ve etkileşimli görselleştirmelerle çarpmanın gücünü keşfet."
      },
      mathematical_basics: {
        title: "Matematiksel Temel Bilgiler",
        description: "NumLit çubukları ve görselleştirmelerle matematiksel temelleri öğren."
      },
      literatie: {
        title: "Okuryazarlık",
        description: "Etkileşimli alıştırmalarla okuma ve yazma becerilerini geliştir."
      },
      litera_silaba: {
        title: "Harf - Hece",
        description: "Sürükle bırak oyunlarıyla büyük ve küçük harf tanıma becerilerini geliştir."
      },
      time_measurement: {
        title: "Zaman Ölçümü",
        description: "Etkileşimli aktivitelerle mevsimleri, ayları, haftaları, günleri ve saatleri öğren."
      },
      unit_measurement: {
        title: "Ölçü Birimleri",
        description: "Uzunluk, hacim ve ağırlık için ölçü birimlerini dönüştürmeyi öğren."
      }
    }
  }
};

const modules = [
  {
    key: "math",
    icon: "🔢",
    age_group: "6-8",
    total_games: 4,
    color: "bg-rigleta-8",
    external: true,
    url: "https://numlit.netlify.app/Home"
  },
  {
    key: "literacy",
    icon: "🔤",
    age_group: "6-8", 
    total_games: 2,
    color: "bg-rigleta-7",
    external: true,
    url: "https://www.numlit.eu"
  },
  {
    key: "communication",
    icon: "💬",
    age_group: "6-10",
    total_games: 1,
    color: "bg-rigleta-6"
  },
  {
    key: "science",
    icon: "🔬",
    age_group: "8-10",
    total_games: 1,
    color: "bg-rigleta-10",
    external: true,
    url: "https://fliphtml5.com/bookcase/blale/"
  }
];

const games = [
  {
    key: "numlit_adventure",
    module: "math",
    slug: "numlit-adventure",
    level: 1,
    language: "ro",
    functional: true,
    external: true,
    url: "https://grow-up-numlit-adventures.lovable.app/"
  },
  {
    key: "neighbors_numbers",
    module: "math",
    slug: "vecinii-numerelor",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "magic_balance",
    module: "math",
    slug: "balanta-magica",
    level: 2,
    language: "ro",
    functional: true
  },
  {
    key: "mathematical_basics",
    module: "math",
    slug: "bazele-calculului-matematic",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "calculate_visual",
    module: "math", 
    slug: "calculeaza-vizual",
    level: 2,
    language: "ro",
    functional: true
  },
  {
    key: "calculate",
    module: "math",
    slug: "calculeaza",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "magic_multiplication",
    module: "math",
    slug: "magia-inmultirii",
    level: 2,
    language: "ro",
    functional: true
  },
  {
    key: "letters",
    module: "literacy",
    slug: "litere-acomodare",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "literatie",
    module: "communication",
    slug: "literatie",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "litera_silaba",
    module: "communication", 
    slug: "litera-silaba",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "time_measurement",
    module: "math",
    slug: "masurarea-timpului",
    level: 1,
    language: "ro",
    functional: true
  },
  {
    key: "unit_measurement",
    module: "math",
    slug: "unitati-de-masura",
    level: 1,
    language: "ro",
    functional: true
  }
];

export default function Index() {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof languages>("ro");
  const [scale, setScale] = useState([100]);
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const t = languages[selectedLanguage] || languages.ro;

  const getDeviceStyles = () => {
    const scaleValue = scale[0] / 100;
    switch(deviceMode) {
      case 'phone':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '375px',
          margin: '0 auto'
        };
      case 'tablet':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '768px',
          margin: '0 auto'
        };
      default:
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '1200px',
          margin: '0 auto'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4">
      {/* Header with Logo and Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 p-3 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm">
        {/* Logo and Platform Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <img 
            src="/lovable-uploads/b3fba488-faeb-4081-a5a6-bf161bfa2928.png" 
            alt="NumLit Logo" 
            className="h-6 sm:h-8 lg:h-10 w-auto object-contain mx-auto sm:mx-0"
            draggable={false}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-center sm:text-left">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <div className="w-full max-w-[200px]">
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof languages)}>
              <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue>
                  <span className="truncate">
                    {languages[selectedLanguage].flag} {languages[selectedLanguage].name}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px] w-full z-50 bg-background border shadow-lg">
                {Object.entries(languages)
                  .sort(([,a], [,b]) => a.name.localeCompare(b.name))
                  .map(([code, lang]) => (
                    <SelectItem key={code} value={code} className="text-xs sm:text-sm">
                      <span className="truncate">
                        {lang.flag} {lang.name}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Device Mode Selector */}
        <div className="flex justify-center items-center gap-1 sm:gap-2">
          <Button
            variant={deviceMode === 'phone' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('phone')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Tablet className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Scale Selector */}
        <div className="flex items-center gap-2 px-2">
          <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <Slider
            value={scale}
            onValueChange={setScale}
            max={150}
            min={50}
            step={5}
            className="flex-1 min-w-[100px] sm:min-w-[150px]"
          />
          <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium min-w-[2.5rem] text-center flex-shrink-0">
            {scale[0]}%
          </span>
        </div>
      </div>

      <div className="transition-all duration-300 origin-top" style={getDeviceStyles()}>
        <div className="max-w-6xl mx-auto">
          {/* Modules Grid */}
          <div className="px-2 sm:px-4 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center px-4">{t.modulesTitle}</h2>
            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between gap-0">
              {modules.map((module, index) => (
                <div 
                  key={index}
                  className="flex-1 mx-1 sm:mx-2 mb-4 sm:mb-0 min-w-[280px] sm:min-w-0 max-w-[350px] sm:max-w-none"
                >
                  <Card 
                    className={`hover:shadow-lg transition-all duration-300 cursor-pointer group hover-scale touch-manipulation select-none h-full flex flex-col border-2 ${
                      index === 0 ? 'border-success' : 
                      index === 1 ? 'border-odd-number' : 
                      'border-rigleta-10'
                    }`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', `module-${module.key}`);
                    }}
                  >
                    <CardHeader className="text-center p-3 sm:p-4 lg:p-6 flex-shrink-0">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${module.color} rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform select-none flex-shrink-0`}>
                        {module.icon}
                      </div>
                      <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold leading-tight px-1 h-[2.5rem] flex items-center justify-center text-foreground">
                        {t.modules[module.key].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center p-3 sm:p-4 lg:p-6 pt-0 flex-1 flex flex-col">
                      <CardDescription className="text-xs sm:text-sm leading-relaxed px-1 mb-4 sm:mb-6 text-muted-foreground">
                        <span className="line-clamp-2 block">
                          {t.modules[module.key].description}
                        </span>
                      </CardDescription>
                      <div className="mt-auto space-y-3">
                        <Button 
                          className="w-full text-xs sm:text-sm font-medium py-2.5 sm:py-3 h-[44px] sm:h-[48px] flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => {
                            if (module.external && module.url) {
                              window.open(module.url, '_blank');
                            }
                          }}
                        >
                          <span className="leading-tight px-1 text-center">
                            {t.startPlaying}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Math Games */}
          <div className="mb-8 sm:mb-12 pl-0 pr-2 sm:pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-start">
              {/* Title in first position */}
              <div className="flex items-center justify-center lg:col-span-1 h-full">
                <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold leading-tight whitespace-pre-line text-center">
                    {t.featuredGamesTitle}
                  </h2>
                </div>
              </div>
              {games.filter(game => game.module !== 'communication').map((game, index) => {
                const gameColors = [
                  { bg: 'bg-red-500', border: 'border-red-300', text: 'text-red-600' },
                  { bg: 'bg-blue-500', border: 'border-blue-300', text: 'text-blue-600' },
                  { bg: 'bg-green-500', border: 'border-green-300', text: 'text-green-600' },
                  { bg: 'bg-yellow-500', border: 'border-yellow-300', text: 'text-yellow-600' },
                  { bg: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-600' },
                  { bg: 'bg-pink-500', border: 'border-pink-300', text: 'text-pink-600' },
                  { bg: 'bg-indigo-500', border: 'border-indigo-300', text: 'text-indigo-600' },
                  { bg: 'bg-orange-500', border: 'border-orange-300', text: 'text-orange-600' },
                ];
                const colors = gameColors[index % gameColors.length];
                return (
                <Card 
                  key={index}
                  className={`hover:shadow-lg transition-all duration-300 hover-scale touch-manipulation select-none h-full flex flex-col border-2 ${colors.border} hover:shadow-xl`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `game-${game.key}`);
                  }}
                >
                   <CardHeader className="p-2 sm:p-3 flex-shrink-0">
                     <CardTitle className={`text-sm sm:text-lg font-semibold leading-tight ${colors.text}`}>
                       <span className="line-clamp-3">
                         {t.gamesList[game.key]?.title || game.key}
                       </span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="p-2 sm:p-3 pt-0 flex-1 flex flex-col">
                      <CardDescription className="text-sm leading-relaxed mb-2 sm:mb-3 text-muted-foreground text-left">
                        <span className="line-clamp-3 block">
                          {t.gamesList[game.key]?.description || ''}
                        </span>
                      </CardDescription>
                    <div className="mt-auto">
                      <Button 
                        className={`w-full text-white font-medium py-2 h-8 sm:h-10 flex items-center justify-center ${colors.bg} hover:opacity-90 hover:scale-110 hover:brightness-110 transition-all duration-300`}
                        size="sm"
                        onClick={() => {
                          if (game.external && game.url) {
                            window.open(game.url, '_blank');
                          } else if (game.key === 'calculate') {
                            window.open('/calculeaza', '_self');
                          } else if (game.key === 'calculate_visual') {
                            window.open('/calculeaza-vizual', '_self');
                          } else if (game.key === 'magic_balance') {
                            window.open('/balanta-magica', '_self');
                          } else if (game.key === 'neighbors_numbers') {
                            window.open('/vecinii-numerelor', '_self');
                          } else if (game.key === 'magic_multiplication') {
                            window.open('/magia-inmultirii', '_self');
                          } else if (game.key === 'mathematical_basics') {
                            window.open('/bazele-calculului-matematic', '_self');
                          } else if (game.key === 'letters') {
                            window.open('/majoc-cu-fractii', '_self');
                          } else if (game.key === 'literatie') {
                            window.open('/literatie', '_self');
                          } else if (game.key === 'time_measurement') {
                            window.open('/masurarea-timpului', '_self');
                          } else if (game.key === 'unit_measurement') {
                            window.open('/unitati-de-masura', '_self');
                          }
                        }}
                      >
                        <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>

          {/* Featured Communication Games */}
          <div className="mb-8 sm:mb-12 pl-0 pr-2 sm:pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-start">
              {/* Title in first position */}
              <div className="flex items-center justify-center lg:col-span-1 h-full">
                <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold leading-tight whitespace-pre-line text-center">
                    Jocuri{'\n'}Didactice{'\n'}Comunicare
                  </h2>
                </div>
              </div>
              {games.filter(game => game.module === 'communication').map((game, index) => {
                const gameColors = [
                  { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-600' },
                  { bg: 'bg-teal-500', border: 'border-teal-300', text: 'text-teal-600' },
                  { bg: 'bg-cyan-500', border: 'border-cyan-300', text: 'text-cyan-600' },
                  { bg: 'bg-sky-500', border: 'border-sky-300', text: 'text-sky-600' },
                ];
                const colors = gameColors[index % gameColors.length];
                return (
                <Card 
                  key={`comm-${index}`}
                  className={`hover:shadow-lg transition-all duration-300 hover-scale touch-manipulation select-none h-full flex flex-col border-2 ${colors.border} hover:shadow-xl`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `game-${game.key}`);
                  }}
                >
                   <CardHeader className="p-2 sm:p-3 flex-shrink-0">
                     <CardTitle className={`text-sm sm:text-lg font-semibold leading-tight ${colors.text}`}>
                       <span className="line-clamp-3">
                         {t.gamesList[game.key]?.title || game.key}
                       </span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="p-2 sm:p-3 pt-0 flex-1 flex flex-col">
                      <CardDescription className="text-sm leading-relaxed mb-2 sm:mb-3 text-muted-foreground text-left">
                        <span className="line-clamp-3 block">
                          {t.gamesList[game.key]?.description || ''}
                        </span>
                      </CardDescription>
                    <div className="mt-auto">
                      <Button 
                        className={`w-full text-white font-medium py-2 h-8 sm:h-10 flex items-center justify-center ${colors.bg} hover:opacity-90 hover:scale-110 hover:brightness-110 transition-all duration-300`}
                        size="sm"
                        onClick={() => {
                          if (game.external && game.url) {
                            window.open(game.url, '_blank');
                           } else if (game.key === 'literatie') {
                             window.open('/literatie', '_self');
                           } else if (game.key === 'litera_silaba') {
                             window.open('/litera-silaba', '_self');
                           } else if (game.key === 'time_measurement') {
                             window.open('/masurarea-timpului', '_self');
                           }
                        }}
                      >
                        <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>


          {/* Footer */}
          <div className="text-center mt-8 sm:mt-12 p-4 sm:p-6 bg-background rounded-lg shadow-sm">
            <p className="text-sm sm:text-base text-muted-foreground">
              {t.footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
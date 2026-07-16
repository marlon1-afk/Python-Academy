document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".sidebar a");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");
    const searchInput = document.getElementById("search-input");

    // === NAVIGATION ===
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute("data-target");
            const targetColor = link.getAttribute("data-color");

            // Alle Sektionen ausblenden
            sections.forEach(section => {
                section.classList.remove("active");
            });

            // Alle Nav-Links inaktiv machen
            navLinks.forEach(l => {
                l.classList.remove(
                    "active-yellow",
                    "active-blue",
                    "active-purple",
                    "active-pink"

                );
            });

            // Ziel-Sektion anzeigen
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
                
                // Titel im Header anpassen
                pageTitle.textContent = link.textContent.trim();
            }

            // Aktiven Link farblich markieren
            if (targetColor === "yellow") {
                link.classList.add("active-yellow");
            } 
            else if (targetColor === "blue") {
                link.classList.add("active-blue");
            }
            else if (targetColor === "purple") {
                link.classList.add("active-purple");
            }
            else if (targetColor === "pink") {
                link.classList.add("active-pink")
            }
        });
    });

    // === SUCHFUNKTION ===
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            navLinks.forEach(link => {
                const text = link.textContent.toLowerCase();
                // Verstecke Nav-Punkte, die nicht zur Suche passen
                if (text.includes(query) || link.getAttribute("data-target").includes(query)) {
                    link.style.display = "flex";
                } else {
                    link.style.display = "none";
                }
            });
        });
    }

    // === KOPIER-BUTTONS ===
    document.querySelectorAll(".copy").forEach(button => {
        button.addEventListener("click", () => {
            const codeBlock = button.parentElement.nextElementSibling;
            if (codeBlock) {
                const textToCopy = codeBlock.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    button.textContent = "Kopiert! ✓";
                    button.style.backgroundColor = "#10b981";
                    setTimeout(() => {
                        button.textContent = "Kopieren";
                        button.style.backgroundColor = "transparent";
                    }, 2000);
                });
            }
        });
    });
});

// === QUIZ PROGRAMMLOGIK ===
let currentQuestionIndex = 0;
let quizScore = 0;
const quizQuestions = [
    {
        q: "Was ist eine Variable in Python?",
        code: "x = 5",
        options: ["Eine Box zum Speichern von Daten", "Ein Drucker-Befehl", "Ein schwerer Systemfehler"],
        correct: 0,
        tip: "Variablen speichern Werte wie Zahlen oder Text für später ab."
    },
    {
        q: "Welchen Index hat das ERSTE Element einer Python-Liste?",
        code: "daten = ['A', 'B', 'C']",
        options: ["1", "0", "-1"],
        correct: 1,
        tip: "Computer fangen immer bei Null (0) an zu zählen!"
    },
    {
        q: "Welche Zeile ist fehlerfrei?",
        code: "",
        options: ["print('Hallo Welt')", "print Hallo Welt", "print(Hallo Welt)"],
        correct: 0,
        tip: "Texte (Strings) müssen immer in Anführungszeichen gesetzt werden."
    }
];

function startQuiz() {
    document.getElementById("quiz-welcome").style.display = "none";
    document.getElementById("quiz-game").style.display = "block";
    currentQuestionIndex = 0;
    quizScore = 0;
    showQuestion();
}

function showQuestion() {
    const qData = quizQuestions[currentQuestionIndex];
    document.getElementById("quiz-prog-text").textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
    document.getElementById("quiz-question-text").textContent = qData.q;
    
    const codeBlock = document.getElementById("quiz-code-block");
    if (qData.code) {
        codeBlock.innerHTML = `<div class="code-wrapper"><div class="code">${qData.code}</div></div>`;
        codeBlock.style.display = "block";
    } else {
        codeBlock.style.display = "none";
    }

    const optionsBox = document.getElementById("quiz-options-box");
    optionsBox.innerHTML = "";
    
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = opt;
        btn.onclick = () => checkQuizAnswer(idx);
        optionsBox.appendChild(btn);
    });

    document.getElementById("quiz-feedback-box").style.display = "none";
    document.getElementById("quiz-next-btn").style.display = "none";
}

function checkQuizAnswer(selectedIdx) {
    const qData = quizQuestions[currentQuestionIndex];
    const feedback = document.getElementById("quiz-feedback-box");
    const nextBtn = document.getElementById("quiz-next-btn");
    
    feedback.style.display = "block";
    
    if (selectedIdx === qData.correct) {
        feedback.className = "feedback-box correct";
        feedback.textContent = "Korrekt! Super gemacht!";
        quizScore++;
    } else {
        feedback.className = "feedback-box wrong";
        feedback.textContent = `Leider falsch. Tipp: ${qData.tip}`;
    }
    
    // Deaktiviert alle Antwort-Buttons nach dem Klick
    document.querySelectorAll(".quiz-option").forEach(btn => btn.disabled = true);
    nextBtn.style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        // Quiz fertig!
        const quizBox = document.getElementById("quiz-options-box");
        document.getElementById("quiz-question-text").textContent = "Quiz beendet!";
        document.getElementById("quiz-code-block").style.display = "none";
        document.getElementById("quiz-feedback-box").style.display = "none";
        document.getElementById("quiz-next-btn").style.display = "none";
        
        quizBox.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: var(--yellow-primary); font-size: 28px;">Ergebnis: ${quizScore} von ${quizQuestions.length} Punkten</h2>
                <p style="margin-top: 15px;">Klasse! Du hast das Quiz durchgespielt.</p>
                <button class="start-btn" onclick="startQuiz()" style="margin-top: 15px;">Nochmal spielen</button>
            </div>
        `;
    }
}

// === MINI-GAME: BUG-JÄGER ===
let gameLevel = 0;
let gameScore = 0;
const gameLevels = [
    {
        task: "Finde die Zeile mit dem Syntax-Fehler (Tipp: Klammern):",
        lines: [
            "name = 'Peter'",
            "print('Hallo' + name",  // Der Bug (Klammer fehlt)
            "alter = 25"
        ],
        bugIdx: 1,
        explain: "In Zeile 2 fehlt am Ende die schließende Klammer ) für die print-Funktion!"
    },
    {
        task: "Wo ist hier der Einrückungs-Fehler (Indentation Error)?",
        lines: [
            "if alter >= 18:",
            "print('Rein in die Bar!')", // Der Bug (Einrückung fehlt)
            "else:",
            "    print('Draußen warten.')"
        ],
        bugIdx: 1,
        explain: "Nach einem Doppelpunkt (if alter >= 18:) MUSS die darauffolgende Zeile eingerückt sein!"
    },
    {
        task: "Finde den Tippfehler in der while-Schleife:",
        lines: [
            "zaehler = 1",
            "whlie zaehler <= 3:",  // Der Bug ("whlie" statt "while")
            "    print(zaehler)",
            "    zaehler = zaehler + 1"
        ],
        bugIdx: 1,
        explain: "In Zeile 2 wurde das Schlüsselwort 'while' als 'whlie' falsch geschrieben!"
    }
];

function startGame() {
    document.getElementById("game-welcome").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    gameLevel = 0;
    gameScore = 0;
    showGameLevel();
}

function showGameLevel() {
    const levelData = gameLevels[gameLevel];
    document.getElementById("game-level-text").textContent = `Bug ${gameLevel + 1} von ${gameLevels.length}`;
    document.getElementById("game-score-text").textContent = `Punkte: ${gameScore}`;
    document.getElementById("game-task-text").textContent = levelData.task;
    
    const codeBox = document.getElementById("game-code-box");
    codeBox.innerHTML = "";
    
    levelData.lines.forEach((line, idx) => {
        const lineEl = document.createElement("span");
        lineEl.className = "code-line";
        // Zeilennummerierung hinzufügen
        lineEl.innerHTML = `<span style="color: #4b5563; margin-right: 15px; user-select: none;">${idx + 1}</span>${line}`;
        lineEl.onclick = () => checkGameAnswer(idx);
        codeBox.appendChild(lineEl);
    });

    document.getElementById("game-feedback-box").style.display = "none";
    document.getElementById("game-next-btn").style.display = "none";
}

function checkGameAnswer(clickedIdx) {
    const levelData = gameLevels[gameLevel];
    const feedback = document.getElementById("game-feedback-box");
    const nextBtn = document.getElementById("game-next-btn");
    
    feedback.style.display = "block";
    
    if (clickedIdx === levelData.bugIdx) {
        feedback.className = "feedback-box correct";
        feedback.textContent = `Volltreffer! Du hast den Bug gefunden. ${levelData.explain}`;
        gameScore += 10;
    } else {
        feedback.className = "feedback-box wrong";
        feedback.textContent = `Knapp daneben! Diese Zeile ist okay. ${levelData.explain}`;
    }
    
    // Klickbarkeit sperren
    document.querySelectorAll(".code-line").forEach(line => line.style.pointerEvents = "none");
    nextBtn.style.display = "block";
}

function nextGameLevel() {
    gameLevel++;
    if (gameLevel < gameLevels.length) {
        showGameLevel();
    } else {
        const codeBox = document.getElementById("game-code-box");
        document.getElementById("game-task-text").textContent = "Jagd beendet!";
        document.getElementById("game-feedback-box").style.display = "none";
        document.getElementById("game-next-btn").style.display = "none";
        
        codeBox.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #10b981; font-size: 28px;">Jagderfolg: ${gameScore} Punkte!</h2>
                <p style="margin-top: 15px; color: var(--text-muted);">Alle Bugs wurden erfolgreich unschädlich gemacht.</p>
                <button class="start-btn" onclick="startGame()" style="margin-top: 20px; background-color: #10b981;">Nochmal jagen</button>
            </div>
        `;
    }
}
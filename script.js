document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const resultsContainer = document.getElementById('results');
    const scoreDisplay = document.getElementById('score');
    const answersReview = document.getElementById('answers-review');
    const rankingDisplay = document.getElementById('ranking');
    const submitButton = quizForm.querySelector('button[type="submit"]');

    // --- NOVO GABARITO (baseado no arquivo "Gabarito Teste Fisiologia 1.pdf") ---
    const correctAnswers = {
        q1: 'c', // Somente as afirmativas I, III, IV e V estão corretas
        q2: 'd', // Todas as afirmativas estão corretas
        q3: 'd', // Todas as afirmativas estão corretas
        q4: 'c', // Somente as afirmativas I, II e IV estão corretas
        q5: 'd', // Todas as afirmativas estão corretas
        q6: 'd', // Todas as afirmativas estão corretas
        q7: 'c', // Apenas as afirmativas I, II, III e IV estão corretas
        q8: 'd', // Todas as afirmativas estão corretas
        q9: 'c', // Apenas as afirmativas I, II, III e V estão corretas
        q10: 'c',// Apenas as afirmativas I, II, III e IV estão corretas
        q11: 'c', // Apenas as afirmativas I, II, III e IV estão corretas
        q12: 'c', // Todas as afirmativas estão corretas
        q13: 'c', // Apenas as afirmativas I, II, III e IV estão corretas
        q14: 'c', // Todas as afirmativas estão corretas
        q15: 'c', // Apenas as afirmativas I, III, IV e V estão corretas
        q16: 'd', // Apenas as afirmativas I, II, III e IV estão corretas
        q17: 'd', // Apenas as afirmativas I, II e III estão corretas
        q18: 'd', // Todas as afirmativas estão corretas
        q19: 'c', // Apenas as afirmativas I, II, III e IV estão corretas
        q20: 'c'  // Apenas as afirmativas I, II, III e IV estão corretas
    };

    // --- NOVAS EXPLICAÇÕES/COMENTÁRIOS (baseadas no "Gabarito Teste Fisiologia 1.pdf") ---
    const answerExplanations = {
        q1: 'c) Somente as afirmativas I, III, IV e V estão corretas',
        q2: 'Todas as afirmativas estão corretas.',
        q3: 'Todas as afirmativas estão corretas',
        q4: 'Somente as afirmativas I, II e IV estão corretas',
        q5: 'Todas as afirmativas estão corretas',
        q6: 'Somente as afirmativas I, II e III estão corretas',
        q7: 'Somente as afirmativas I, II, III e IV estão corretas',
        q8: 'Todas as afirmativas estão corretas',
        q9: 'Somente as afirmativas I, III, IV e V estão corretas',
        q10: 'Somente as afirmativas I, II, III e V estão corretas',
        q11: 'Somente as afirmativas I, III e IV estão corretas',
        q12: 'Somente as afirmativas I, III, IV e V estão corretas',
        q13: 'Somente as afirmativas I, II e III estão corretas',
        q14: 'Todas as afirmativas estão corretas',
        q15: 'Somente as afirmativas I, III, IV e V estão corretas',
        q16: 'Todas as afirmativas estão corretas',
        q17: 'Todas as afirmativas estão corretas',
        q18: 'Todas as afirmativas estão corretas',
        q19: 'Somente as afirmativas I, II, III e IV estão corretas',
        q20: 'Somente as afirmativas I, II, III e IV estão corretas'
    };

    // A função disableQuiz agora é usada apenas para desabilitar após a submissão.
    function disableQuiz() {
        quizForm.querySelectorAll('input[type="radio"], button[type="submit"]').forEach(el => el.disabled = true);
    }

    // O formulário estará habilitado por padrão, já que não há timer para iniciar.
    function enableQuiz() {
        quizForm.querySelectorAll('input[type="radio"], button[type="submit"]').forEach(el => el.disabled = false);
    }

    // --- Event Listener para submissão do formulário ---
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitQuiz(); // Chama a função para submeter e exibir resultados
    });

    // --- Função de Submissão do Quiz ---
    function submitQuiz() {
        let score = 0;
        answersReview.innerHTML = '';

        for (let i = 1; i <= 20; i++) {
            const questionName = `q${i}`;
            const selectedOptionElement = document.querySelector(`input[name="${questionName}"]:checked`);
            const userAnswer = selectedOptionElement ? selectedOptionElement.value : 'Nenhuma resposta';
            const correctAnswer = correctAnswers[questionName];

            const questionBlock = document.querySelector(`.question-block:nth-of-type(${i})`);
            const questionText = questionBlock.querySelector('p strong').textContent;

            const isCorrect = (userAnswer === correctAnswer);

            const resultDiv = document.createElement('div');
            resultDiv.classList.add('question-result');

            if (isCorrect) {
                score++;
                resultDiv.classList.add('correct');
                resultDiv.innerHTML = `<p>${questionText} - <span class="correct-answer">Correta!</span></p>`;
            } else {
                resultDiv.classList.add('incorrect');
                let explanationText = answerExplanations[questionName] || 'Nenhuma explicação disponível para esta questão.';

                const correctLabel = document.querySelector(`label input[name="${questionName}"][value="${correctAnswer}"]`);
                const fullCorrectAnswerText = correctLabel ? correctLabel.textContent.trim() : `Alternativa ${correctAnswer}`;

                resultDiv.innerHTML = `
                    <p>${questionText} - <span class="your-answer">Incorreta.</span></p>
                    <p>Sua resposta: <span class="your-answer">${userAnswer.toUpperCase()}</span></p>
                    <p>Resposta correta: <span class="correct-answer">${fullCorrectAnswerText}</span></p>
                    <p>Comentário: ${explanationText}</p>
                `;
            }
            answersReview.appendChild(resultDiv);
        }

        scoreDisplay.textContent = `Você acertou: ${score}/20 questões.`;
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        disableQuiz(); // Desabilita o formulário após a submissão

        updateAndDisplayRanking(score);
    }

    // --- Funções para o Ranking Local ---
    const MAX_RANKING_ENTRIES = 5;

    function getRanking() {
        // Usar uma chave diferente para o quiz de Digestório
        const ranking = localStorage.getItem('quizRankingDigestorio');
        return ranking ? JSON.parse(ranking) : [];
    }

    function saveRanking(ranking) {
        // Usar uma chave diferente para o quiz de Digestório
        localStorage.setItem('quizRankingDigestorio', JSON.stringify(ranking));
    }

    function updateAndDisplayRanking(currentScore) {
        let ranking = getRanking();
        ranking.push({ score: currentScore, date: new Date().toLocaleString() });
        ranking.sort((a, b) => b.score - a.score);
        ranking = ranking.slice(0, MAX_RANKING_ENTRIES);
        saveRanking(ranking);
        renderRanking(ranking);
    }

    function renderRanking(ranking) {
        rankingDisplay.innerHTML = '<h3>Melhores Pontuações (Este Navegador)</h3>';
        if (ranking.length === 0) {
            rankingDisplay.innerHTML += '<p>Nenhuma pontuação registrada ainda.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ranking.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}º - ${entry.score}/20 (${entry.date})`;
            ul.appendChild(li);
        });
        rankingDisplay.appendChild(ul);
    }

    // --- Inicialização ---
    enableQuiz(); // Habilita o formulário por padrão
    renderRanking(getRanking());
});
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Quiz, QuizState } from "../pages/types"

interface QuizContainerProps {
  quiz: Quiz,
  state: QuizState
  CompleteCallback: () => void
  updateQuizState: (state: QuizState) => void
}

const QuizContainer: React.FC<QuizContainerProps> =  (props) => {

    const { quiz,state,updateQuizState, CompleteCallback } = props

    const answerMap = ["A","B","C","D"]

    const [quizState,setQuizState] = useState< QuizState >(state)
    const [currAnswer,setCurrAnswer] = useState< number | null >(null)
    const [board,setBoard] = useState< boolean >(() => {
        return quizState.prevQuestion.length == quiz.questions.length
    })
    
    useEffect(() => {
      updateQuizState(quizState);
    }, [quizState]);

    const nextQuestion = () => {
      if (currAnswer == null) return;
  
      setQuizState((prev) => {
          const indexQ = prev.currQuestion;
          const isCorrect = currAnswer === quiz.questions[indexQ].correct;
          const newPoints = isCorrect ? quiz.questions[indexQ].point : 0;
  
          return {
              ...prev,
              currPoints: isCorrect ? prev.currPoints + newPoints : prev.currPoints,
              prevQuestion: [...prev.prevQuestion, newPoints],
              prevAnswers: [...prev.prevAnswers, currAnswer],
              currQuestion: indexQ + 1 < quiz.questions.length ? indexQ + 1 : prev.currQuestion,
          };
      });
  
      if (quizState.currQuestion + 1 >= quiz.questions.length) {
          setBoard(true);
      }
  
      setCurrAnswer(null);
  };

    return <>
    {!board && (  
      <div className="quiz-container">
      <header>
        <span id="question-number">{quizState.currQuestion +1}/{quiz.questions.length}</span>
        <span id="score">Score: {quizState.currPoints}</span>
      </header>
      <div className="progress-container">
        <div className="progress-bar" id="progress-bar"></div>
      </div>
      <main>
        <h2 id="question-text">{quiz.questions[quizState.currQuestion].questionText}</h2>
        {quiz.questions[quizState.currQuestion].answers?.map((el,index) => {
            return ( <div className="options" key={index}>
              <label>
                <input checked={currAnswer === index} type="radio" name="answer" value={index} onChange={e => setCurrAnswer(Number(e.target.value))}  />
                <span>{el}</span>
              </label>
            </div>)
        })}
      </main>
      <footer>
        <button id="next-button" onClick={nextQuestion}>Continue</button>
      </footer>
    </div>
    )}
    {board && (    
      <div className="scoreboard-container" id="scoreboard-container">
      <h2>Scoreboard</h2>
      <table id="scoreboard">
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
            {quizState.prevAnswers.map((el,index) => { return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{answerMap[el]}</td>
                    <td>{answerMap[quiz.questions[index].correct]}</td>
                </tr>
            )})}
        </tbody>
      </table>
      <button id="restart-button" className="my-6" onClick={CompleteCallback}>Finish Quiz</button>
    </div>
    )}
  </>

}

export default QuizContainer
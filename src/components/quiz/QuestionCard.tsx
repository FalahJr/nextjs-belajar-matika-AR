import { ANSWER_KEYS, type AnswerKey, type Question } from '../../types/quiz'
import { AnswerOption, type AnswerOptionState } from './AnswerOption'

type Props = {
  question: Question
  /** Jawaban yang dipilih murid; `undefined` bila belum menjawab. */
  selected: AnswerKey | undefined
  onSelect: (key: AnswerKey) => void
}

function optionState(key: AnswerKey, q: Question, selected: AnswerKey | undefined): AnswerOptionState {
  if (selected === undefined) return 'idle'
  if (key === selected) return key === q.correctAnswer ? 'correct' : 'wrong'
  // Kunci jawaban baru ditampilkan setelah murid menjawab.
  if (key === q.correctAnswer) return 'reveal'
  return 'dimmed'
}

export function QuestionCard({ question, selected, onSelect }: Props) {
  const answered = selected !== undefined
  return (
    <div>
      <h3 className="mb-4 text-lg font-extrabold leading-snug text-indigo-950 sm:text-xl">
        {question.question}
      </h3>
      {question.image && (
        <img
          src={question.image.src}
          alt={question.image.alt}
          loading="lazy"
          className="mx-auto mb-4 max-h-48 w-auto max-w-full rounded-2xl bg-white object-contain"
        />
      )}
      <div role="group" aria-label="Pilihan jawaban" className="grid gap-2.5">
        {ANSWER_KEYS.filter((key) => question.options[key] !== undefined).map((key) => (
          <AnswerOption
            key={key}
            answerKey={key}
            text={question.options[key] ?? ''}
            state={optionState(key, question, selected)}
            disabled={answered}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

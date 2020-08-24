import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface IQuestionProps {
  label: string;
  value: string;
  questionIndex: number;

  stateKey: string;
  onChange: Function;
  onSubmit: Function;
}
const Question = (props: IQuestionProps) => {
  return (
    <Box>
      <Box marginRight={1}>
        <Text>{props.label}</Text>
      </Box>

      <TextInput
        value={props.value}
        onChange={(value: string) => props.onChange(value, props.stateKey)}
        onSubmit={(value: string) => props.onSubmit(value, props.questionIndex, props.stateKey)}
      />
    </Box>
  );
};

export const Init = (props: any) => {
  const questions = [
    {
      label: 'Name of this connection (i.e. mydb):',
      key: 'connectionName',
    },
    {
      label: "Your database's connection string:",
      key: 'connectionString',
    },
  ];

  const [question, setQuestion] = useState<any>({
    connectionName: '',
    connectionString: '',
  });
  const [answers, setAnswers] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleOnChange = (value: string, k: string) => {
    setQuestion({ ...question, [k]: value });
  };

  const handleSubmit = (value: string, qIdx: number, key: string) => {
    const ans = {
      question: questions[qIdx].label,
      value,
    };

    setAnswers(answers.concat(ans));
    setQuestionIndex(questionIndex + 1);
  };

  const hasAnswers = answers.length > 0;
  const questionsUnanswered = questionIndex < questions.length;

  return questionsUnanswered ? (
    <Box marginTop={1} flexDirection="column">
      {hasAnswers &&
        answers.map((ans, i) => {
          return (
            <Box marginTop={1} key={i}>
              <Box>
                <Text>{ans.question}</Text>
              </Box>

              <Box>
                <Text>{ans.value}</Text>
              </Box>
            </Box>
          );
        })}

      <Box marginTop={1}>
        {questions[questionIndex] && (
          <Question
            label={questions[questionIndex].label}
            value={question[questions[questionIndex].key]}
            stateKey={questions[questionIndex].key}
            questionIndex={questionIndex}
            onChange={(value: string) => handleOnChange(value, questions[questionIndex].key)}
            onSubmit={(value: string) => handleSubmit(value, questionIndex, questions[questionIndex].key)}
          />
        )}
      </Box>
    </Box>
  ) : (
    <Text>Writing file ...</Text>
  );
};

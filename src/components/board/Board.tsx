import React from 'react';
import './Board.css';
import {Row, Col} from 'react-bootstrap';
import wordsList from '../../data/words_list';

type letterProperties = {
  letter: string;
  filled: boolean;
};

type BoardSizeProperties = {
  columns: number;
  lines: number;
};

type BoardProperties = {
  difficulty?: number;
};

const BoardComponent: React.FC<BoardProperties> = () => {
  let board = [];

  //todo - based on the difficulty set different columns and lines for the board
  const exampleSize: BoardSizeProperties = {
    columns: 19,
    lines: 8,
  };

  //todo - replace the gameWordsNumber with the x words number based on the difficulty
  const myCustomList = wordsList.sort(() => 0.5 - Math.random());
  const remakedList = myCustomList.slice(0, 5);
  const words = remakedList;
  console.log('words list: ', words);

  function initializeBoardMatrix() {
    let cl, ln;
    board = []; //clean the main board before do any action
    const allowedLetters = 'ABCEDFGHIJKLMNOPQRSTUVXZ';

    for (ln = 0; ln < exampleSize.lines; ln++) {
      const newLine = [];
      for (cl = 0; cl < exampleSize.columns; cl++) {
        //generate random letter
        newLine.push({
          letter: allowedLetters.charAt(
            Math.floor(Math.random() * allowedLetters.length)
          ),
          filled: false,
        } as letterProperties);
      }
      board.push(newLine);
    }

    setBoardWords();
  }

  function displayBoard() {
    let cl, ln;

    const elements = [];

    for (ln = 0; ln < exampleSize.lines; ln++) {
      for (cl = 0; cl < exampleSize.columns; cl++) {
        elements.push(
          board[ln][cl].filled ? (
            <div
              className="game-letter-box filled"
              key={`${ln}-${cl}-${board[ln][cl].letter}-filled`}
            >
              <div className="game-letter">{board[ln][cl].letter}</div>
            </div>
          ) : (
            <div
              className="game-letter-box"
              key={`${ln}-${cl}-${board[ln][cl].letter}`}
            >
              <div className="game-letter">{board[ln][cl].letter}</div>
            </div>
          )
        );
        if (cl === exampleSize.columns - 1)
          elements.push(<br key={`br-${ln}`} />);
      }
    }

    return elements;
  }

  function displayWordsList() {
    return (
      <div className="game-wordlist">
        {words.map(word => (
          <div className="gameWord" key={'word-' + word}>
            {word}
          </div>
        ))}
      </div>
    );
  }

  function renderWord(currentWord: string, failures?: number) {
    let currentFailures = failures || 0;
    if (failures) {
      console.log(
        `trying to render the word: ${currentWord}, time: ${failures}`
      );
    }
    let renderWordSuccessfully = false;
    const failuresLimit = 20;
    const displayType = Math.floor(Math.random() * 3);
    console.log(`display type : ${displayType}, word: ${currentWord}`);
    //todo - add the inverted methods based on this ones, render columns inverted, lines inverted and diags inverted
    switch (displayType) {
      case 0:
        renderWordSuccessfully = displayWordByColumn(currentWord);
        break;
      case 1:
        renderWordSuccessfully = displayWordByLine(currentWord);
        break;
      case 2:
        renderWordSuccessfully = displayByDiag(currentWord);
        break;
    }
    if (!renderWordSuccessfully) currentFailures++;
    if (currentFailures > failuresLimit && renderWordSuccessfully === false) {
      //todo - add the logic based on the word was not rendered successfully
      console.log(`- failed to render the word ${currentWord} !!!!!!!`);
    } else if (!renderWordSuccessfully) {
      renderWord(currentWord, currentFailures);
    }
  }

  //add the words to the board by line, by column, by diag, and by diag inverted
  function setBoardWords() {
    let i;
    console.log('preparing to set the words on the board: ', words);
    for (i = 0; i < words.length; i++) {
      const currentWord = words[i];
      console.log(`current word: ${words[i]}`);
      renderWord(currentWord);
    }
  }

  function displayWordByColumn(word: string): boolean {
    try {
      let allowed = true;
      const randomColumn = Math.floor(Math.random() * exampleSize.columns);
      let x = 0;

      //verify if the word itself is bigger than the lines / columns
      if (word.length > exampleSize.lines) return false;

      if (exampleSize.columns > word.length) {
        for (x = 0; x < word.length; x++) {
          if (board[x][randomColumn].filled) {
            if (board[x][randomColumn].letter !== word[x]) allowed = false;
          }
        }
      } else {
        allowed = false;
      }

      if (!allowed) return allowed;

      for (x = 0; x < word.length; x++) {
        board[x][randomColumn] = {
          letter: word[x],
          filled: true,
        };
      }

      return true;
    } catch {
      return false;
    }
  }

  function displayWordByLine(word: string): boolean {
    try {
      let allowed = true;
      const randomLine = Math.floor(Math.random() * exampleSize.lines);
      let x = 0;

      if (word.length > exampleSize.columns) return false;

      //in this case we are only verifying the word length compared to how much columns we have
      //todo - we can use random indexs to display the word in different line index's too
      if (board[randomLine].length > word.length) {
        for (x = 0; x < word.length; x++) {
          if (board[randomLine][x].filled) {
            if (board[randomLine][x].letter !== word[x]) allowed = false;
          }
        }
      }

      if (!allowed) return allowed;

      if (board[randomLine].length > word.length) {
        for (x = 0; x < word.length; x++) {
          board[randomLine][x] = {
            letter: word[x],
            filled: true,
          };
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  function displayByDiag(word: string): boolean {
    try {
      let allowed = true;
      const randomIndex = Math.floor(
        Math.random() * (exampleSize.columns - word.length)
      );
      let cl, ln;
      cl = randomIndex;

      //verify if the word itself is bigger than the lines / columns
      if (word.length > exampleSize.lines) return false;
      if (word.length > exampleSize.columns) return false;

      for (ln = 0; ln < exampleSize.lines; ln++) {
        if (word.length > ln) {
          if (board[ln][cl].filled) {
            if (board[ln][cl].letter !== word[ln]) allowed = false;
          }
        }
        cl++;
      }

      cl = randomIndex;

      if (!allowed) return allowed;

      for (ln = 0; ln < exampleSize.lines; ln++) {
        if (word.length > ln) {
          board[ln][cl] = {
            letter: word[ln],
            filled: true,
          };
        } else {
          break;
        }
        cl++;
      }

      return true;
    } catch {
      return false;
    }
  }

  //initialize matrix by default
  initializeBoardMatrix();

  return (
    <div className="gameboard">
      <Row>
        <Col lg={10}>{displayBoard()}</Col>
        <Col>{displayWordsList()}</Col>
      </Row>
    </div>
  );
};

export default BoardComponent;

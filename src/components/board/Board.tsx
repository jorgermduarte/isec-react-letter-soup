import React, {useEffect, useState} from 'react';
import './Board.css';
import {Row, Col} from 'react-bootstrap';
import {useAppSelector} from '../../store/hooks';
import {updateMatrix, updateMatrixPosition} from '../../store/board-actions';
import {useDispatch} from 'react-redux';
import {letterProperties, updateMatrixType} from '../../store/board-slice';
import WordList from '../wordList/WordList';

const BoardComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  useEffect(() => {
    startWordRenderization();
  }, [gameboard.words, gameboard.settings.wordsRendered, gameboard.matrix]);

  function invertWord(word: string) {
    let newWord = '';
    let i = word.length - 1;
    for (i; i > -1; i--) {
      newWord += word[i];
    }
    return newWord;
  }

  function displayBoard() {
    let cl, ln;

    const elements = [];

    for (ln = 0; ln < gameboard.specifications.lines; ln++) {
      for (cl = 0; cl < gameboard.specifications.columns; cl++) {
        elements.push(
          gameboard.matrix[ln][cl].filled ? (
            <div
              className="game-letter-box filled"
              key={`${ln}-${cl}-${gameboard.matrix[ln][cl].letter}-filled`}
            >
              <div className="game-letter">
                {gameboard.matrix[ln][cl].letter}
              </div>
            </div>
          ) : (
            <div
              className="game-letter-box"
              key={`${ln}-${cl}-${gameboard.matrix[ln][cl].letter}`}
            >
              <div className="game-letter">
                {gameboard.matrix[ln][cl].letter}
              </div>
            </div>
          )
        );
        if (cl === gameboard.specifications.columns - 1)
          elements.push(<br key={`br-${ln}`} />);
      }
    }

    return elements;
  }

  function startWordRenderization() {
    if (
      gameboard.words.length > 0 &&
      gameboard.settings.wordsRendered < gameboard.words.length
    ) {
      let currentBoard = gameboard.matrix.map(obj => ({...obj}));
      currentBoard = renderWord(
        gameboard.words[gameboard.settings.wordsRendered],
        currentBoard
      );
      dispatch(updateMatrix(currentBoard));
    }
  }

  function renderWord(
    currentWord: string,
    editedBoard: letterProperties[][],
    failures?: number
  ) {
    let currentFailures = failures || 0;
    if (failures) {
      console.log(
        `trying to render the word: ${currentWord}, time: ${failures}`
      );
    }
    let renderWordSuccessfully = false;
    const failuresLimit = 60;
    const displayType = Math.floor(Math.random() * 3);
    console.log(`display type : ${displayType}, word: ${currentWord}`);
    const invertedValue = Math.floor(Math.random() * 2);
    const inverted = invertedValue > 0;
    if (inverted) currentWord = invertWord(currentWord);

    console.log(invertedValue);
    //todo - add the inverted methods based on this ones, render columns inverted, lines inverted and diags inverted
    switch (displayType) {
      case 0:
        renderWordSuccessfully = displayWordByLine(currentWord, editedBoard);
        break;
      case 1:
        renderWordSuccessfully = displayWordByColumn(currentWord, editedBoard);
        break;
      case 2:
        renderWordSuccessfully = displayWordByDiag(currentWord, editedBoard);
        break;
      default:
        renderWordSuccessfully = displayWordByDiag(currentWord, editedBoard);
    }
    if (!renderWordSuccessfully) currentFailures++;
    if (currentFailures > failuresLimit && renderWordSuccessfully === false) {
      //todo - add the logic based on the word was not rendered successfully
      console.log(`- failed to render the word ${currentWord} !!!!!!!`);
    } else if (!renderWordSuccessfully) {
      renderWord(currentWord, editedBoard, currentFailures);
    }
    return editedBoard;
  }

  function displayWordByColumn(
    payload: string,
    editedBoard: letterProperties[][]
  ) {
    try {
      let allowed = true;
      const randomColumn = Math.floor(
        Math.random() * gameboard.specifications.columns
      );
      let x = 0;

      //verify if the word itself is bigger than the lines / columns
      if (payload.length > gameboard.specifications.lines) {
        return false;
      }

      if (gameboard.specifications.columns > payload.length) {
        for (x = 0; x < payload.length; x++) {
          if (gameboard.matrix[x][randomColumn].filled) {
            if (gameboard.matrix[x][randomColumn].letter !== payload[x])
              allowed = false;
          }
        }
      } else {
        allowed = false;
      }

      if (!allowed) return allowed;

      for (x = 0; x < payload.length; x++) {
        editedBoard[x][randomColumn] = {
          ...editedBoard[x][randomColumn],
          ...{
            letter: payload[x],
            filled: true,
          },
        };
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function displayWordByLine(
    word: string,
    editedBoard: letterProperties[][]
  ): boolean {
    try {
      let allowed = true;
      const randomLine = Math.floor(
        Math.random() * gameboard.specifications.lines
      );
      let x = 0;

      const lineLength = Object.keys(gameboard.matrix[randomLine]).length;
      if (word.length > gameboard.specifications.columns) return false;

      //in this case we are only verifying the word length compared to how much columns we have
      if (lineLength > word.length) {
        for (x = 0; x < word.length; x++) {
          if (gameboard.matrix[randomLine][x].filled) {
            if (gameboard.matrix[randomLine][x].letter !== word[x]) {
              allowed = false;
            }
          }
        }
      } else {
        allowed = false;
      }

      if (!allowed) return allowed;

      for (x = 0; x < word.length; x++) {
        editedBoard[randomLine][x] = {
          ...editedBoard[randomLine][x],
          ...{
            letter: word[x],
            filled: true,
          },
        };
      }
      return true;
    } catch {
      return false;
    }
  }

  function displayWordByDiag(
    word: string,
    editedBoard: letterProperties[][]
  ): boolean {
    try {
      let allowed = true;
      const randomIndex = Math.floor(
        Math.random() * (gameboard.specifications.columns - word.length)
      );
      let cl, ln;
      cl = randomIndex;

      //verify if the word itself is bigger than the lines / columns
      if (word.length > gameboard.specifications.lines) return false;
      if (word.length > gameboard.specifications.columns) return false;

      for (ln = 0; ln < gameboard.specifications.lines; ln++) {
        if (word.length > ln) {
          if (gameboard.matrix[ln][cl].filled) {
            if (gameboard.matrix[ln][cl].letter !== word[ln]) allowed = false;
          }
        }
        cl++;
      }

      cl = randomIndex;

      if (!allowed) return allowed;

      for (ln = 0; ln < gameboard.specifications.lines; ln++) {
        if (word.length > ln) {
          editedBoard[ln][cl] = {
            ...editedBoard[ln][cl],
            ...{
              letter: word[ln],
              filled: true,
            },
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

  return (
    <div className="gameboard">
      <Row>
        <Col lg={10}>
          {gameboard.settings.wordsRendered ===
            gameboard.specifications.totalWords && displayBoard()}
        </Col>
        <Col>
          <WordList></WordList>
        </Col>
      </Row>
    </div>
  );
};

export default BoardComponent;

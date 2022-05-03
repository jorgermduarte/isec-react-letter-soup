import React, {useEffect, useState} from 'react';
import './Board.css';
import {Row, Col} from 'react-bootstrap';
import {useAppSelector} from '../../store/hooks';
import {updateMatrixPosition} from '../../store/board-actions';
import {useDispatch} from 'react-redux';
import {updateMatrixType} from '../../store/board-slice';

const BoardComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  useEffect(() => {
    setMatrixWords();
  }, [gameboard.words]);

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

  function displayWordsList() {
    return (
      <div className="game-wordlist">
        {gameboard.words.map(word => (
          <div className="gameWord" key={'word-' + word}>
            {word}
          </div>
        ))}
      </div>
    );
  }

  function setMatrixWords() {
    if (gameboard.words.length > 0) {
      let i;
      for (i = 0; i < gameboard.words.length; i++) {
        renderWord(gameboard.words[i]);
      }
    }
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
        renderWordSuccessfully = displayWordByDiag(currentWord);
        break;
    }
    if (!renderWordSuccessfully) currentFailures++;
    if (currentFailures > failuresLimit && renderWordSuccessfully === false) {
      //todo - add the logic based on the word was not rendered successfully
      console.log(`- failed to render the word ${currentWord} !!!!!!!`);
      return false;
    } else if (!renderWordSuccessfully) {
      renderWord(currentWord, currentFailures);
    } else {
      return true;
    }
  }

  function displayWordByColumn(payload: string) {
    try {
      let allowed = true;
      const randomColumn = Math.floor(
        Math.random() * gameboard.specifications.columns
      );
      let x = 0;

      //verify if the word itself is bigger than the lines / columns
      if (payload.length > gameboard.specifications.lines) return false;

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
        dispatch(
          updateMatrixPosition({
            line: x,
            column: randomColumn,
            letter: {
              letter: payload[x],
              filled: true,
            },
          })
        );
      }

      return true;
    } catch {
      return false;
    }
  }

  function displayWordByLine(word: string): boolean {
    try {
      let allowed = true;
      const randomLine = Math.floor(
        Math.random() * gameboard.specifications.lines
      );
      let x = 0;

      if (word.length > gameboard.specifications.columns) return false;

      //in this case we are only verifying the word length compared to how much columns we have
      //todo - we can use random indexs to display the word in different line index's too
      if (gameboard.matrix[randomLine].length > word.length) {
        for (x = 0; x < word.length; x++) {
          if (gameboard.matrix[randomLine][x].filled) {
            if (gameboard.matrix[randomLine][x].letter !== word[x])
              allowed = false;
          }
        }
      }

      if (!allowed) return allowed;

      if (gameboard.matrix[randomLine].length > word.length) {
        for (x = 0; x < word.length; x++) {
          dispatch(
            updateMatrixPosition({
              line: randomLine,
              column: x,
              letter: {
                letter: word[x],
                filled: true,
              },
            })
          );
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  function displayWordByDiag(word: string): boolean {
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
          dispatch(
            updateMatrixPosition({
              line: ln,
              column: cl,
              letter: {
                letter: word[ln],
                filled: true,
              },
            } as updateMatrixType)
          );
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
        <Col lg={10}>{displayBoard()}</Col>
        <Col>{displayWordsList()}</Col>
      </Row>
    </div>
  );
};

export default BoardComponent;

import React from 'react';
import './Board.css';
import {Row, Col} from 'react-bootstrap';

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
    columns: 20,
    lines: 8,
  };

  //todo - move this list to a json file for example and grab some random x words based on the difficulty
  const words = [
    'REACT',
    'JAVASCRIPT',
    'HTML',
    'CSS',
    'BACKBONE',
    'ANGULAR',
    'SVELTE',
    'EMBER',
  ];

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
  }

  function displayBoard() {
    let cl, ln;

    const elements = [];

    for (ln = 0; ln < exampleSize.lines; ln++) {
      for (cl = 0; cl < exampleSize.columns; cl++) {
        elements.push(
          <div className="game-letter-box">
            <div className="game-letter">{board[ln][cl].letter}</div>
          </div>
        );
        if (cl === exampleSize.columns - 1) elements.push(<br />);
      }
    }

    return elements;
  }

  function displayWordsList() {
    return (
      <div className="game-wordlist">
        {words.map(word => (
          <div className="gameWord">{word}</div>
        ))}
      </div>
    );
  }

  //todo - based on the words list, we need to generate them on the board
  //by line, by column, by diag, and by diag inverted
  function setBoardWords() {}

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

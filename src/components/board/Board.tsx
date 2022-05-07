import React, {useEffect, useState} from 'react';
import './Board.css';
import {Row, Col} from 'react-bootstrap';
import {useAppSelector} from '../../store/hooks';
import {
  addFoundWord,
  cleanMatrixSelections,
  updateMatrix,
  updateMatrixPosition,
} from '../../store/board-actions';
import {useDispatch} from 'react-redux';
import {letterProperties} from '../../store/board-slice';
import WordList from '../wordList/WordList';

const BoardComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  const [wordSelection, setWordSelection] = useState({
    startLetterIndex: {
      index: -1,
      column: -1,
      line: -1,
    },
    endLetterIndex: {
      index: -1,
      column: -1,
      line: -1,
    },
    indexList: [],
    word: [],
  });

  useEffect(() => {
    startWordRenderization();
  }, [gameboard.words, gameboard.settings.wordsRendered, gameboard.matrix]);

  useEffect(() => {
    if (
      wordSelection.startLetterIndex.index > -1 &&
      wordSelection.endLetterIndex.index > -1
    ) {
      verifyFoundWord();
    }
  }, [wordSelection]);

  function invertWord(word: string) {
    let newWord = '';
    let i = word.length - 1;
    for (i; i > -1; i--) {
      newWord += word[i];
    }
    return newWord;
  }

  //todo - verify if there is a word in the user selection based on the current board game words
  function verifyFoundWord() {
    let word = '';
    console.log(wordSelection.word);
    for (let i = 0; i < wordSelection.word.length; i++) {
      word += wordSelection.word[i];
    }
    const invertedWord = invertWord(word);
    console.log('current word: ', word);
    console.log('inverted word: ', invertedWord);

    gameboard.words.forEach(gameWord => {
      let correctWord = '';
      let found = false;
      if (gameWord === word) {
        found = true;
        correctWord = word;
      }
      if (gameWord === invertedWord) {
        found = true;
        correctWord = invertedWord;
      }
      if (found) {
        // verify if this word was already found
        if (!gameboard.foundWords.includes(correctWord)) {
          //add to the list
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          dispatch(addFoundWord(correctWord));
        }
        //todo - set the word index with filled
      }
    });
  }

  function setLetterSelection(ln: number, cl: number, index: number) {
    const letterCurrentSettings = gameboard.matrix[ln][cl];
    const wordLetters: string[] = [];

    if (wordSelection.startLetterIndex.index === -1) {
      setWordSelection({
        startLetterIndex: {
          index: index,
          column: cl,
          line: ln,
        },
        endLetterIndex: {
          index: -1,
          column: -1,
          line: -1,
        },
        indexList: [index],
        word: [],
      });
      console.log('set selected word index start: ', index);
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        updateMatrixPosition({
          column: cl,
          line: ln,
          letter: {
            busy: false,
            selected: true,
            letter: letterCurrentSettings.letter,
            index: letterCurrentSettings.index,
            filled: letterCurrentSettings.filled,
          },
        })
      );
    } else if (wordSelection.endLetterIndex.index === -1) {
      console.log('set selected word index end: ', index);

      //we need to set every letter that we need as selected
      let calculationStart = wordSelection.startLetterIndex.index;
      let calculationEnd = index;

      if (calculationEnd < calculationStart) {
        calculationEnd = wordSelection.startLetterIndex.index;
        calculationStart = index;
      }
      let difference = calculationEnd - calculationStart;
      //array with all letter index's that has the selection
      const finalIndexList = [calculationStart, calculationEnd];
      console.log('indexs difference length: ', difference);
      console.log(
        `start index: ${calculationStart}, end index: ${calculationEnd}`
      );
      console.log(`last selection col:${cl} and ln:${ln}`);

      //verify by line
      if (difference < gameboard.specifications.lines) {
        let iterationStartClLine = wordSelection.startLetterIndex.column;
        if (cl < wordSelection.startLetterIndex.column) {
          iterationStartClLine = cl;
        }

        for (let i = 0; i < difference + 1; i++) {
          const iterationLetter =
            gameboard.matrix[ln][iterationStartClLine + i];
          finalIndexList.push(iterationLetter.index);
          wordLetters.push(iterationLetter.letter);
          dispatch(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            updateMatrixPosition({
              column: iterationStartClLine + i,
              line: ln,
              letter: {
                busy: false,
                selected: true,
                index: iterationLetter.index,
                letter: iterationLetter.letter,
                filled: iterationLetter.filled,
              },
            })
          );
        }
      }

      //verify by column
      else if (wordSelection.startLetterIndex.column === cl) {
        let startLineColIteration = wordSelection.startLetterIndex.line;

        if (wordSelection.startLetterIndex.line > ln) {
          difference = wordSelection.startLetterIndex.line - ln;
          startLineColIteration = ln;
        } else {
          difference = ln - wordSelection.startLetterIndex.line;
        }
        for (let i = 0; i < difference + 1; i++) {
          const iterationLetter =
            gameboard.matrix[startLineColIteration + i][cl];
          finalIndexList.push(iterationLetter.index);
          wordLetters.push(iterationLetter.letter);
          dispatch(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            updateMatrixPosition({
              column: cl,
              line: startLineColIteration + i,
              letter: {
                busy: false,
                selected: true,
                index: iterationLetter.index,
                letter: iterationLetter.letter,
                filled: iterationLetter.filled,
              },
            })
          );
        }
      }

      //verify by diag and inverted!
      else if (
        wordSelection.startLetterIndex.line !== ln &&
        wordSelection.startLetterIndex.column !== cl
      ) {
        let startLineDiag = wordSelection.startLetterIndex.line;
        let startColDiag = wordSelection.startLetterIndex.column;

        if (startLineDiag > ln) {
          startColDiag = cl;
          startLineDiag = ln;
          cl = wordSelection.startLetterIndex.column;
          ln = wordSelection.startLetterIndex.line;
        }

        if (startColDiag < cl) {
          const diagDif = cl - startColDiag;
          for (let i = 0; i < diagDif + 1; i++) {
            const iterationLetterX =
              gameboard.matrix[startLineDiag + i][startColDiag + i];
            finalIndexList.push(iterationLetterX.index);
            wordLetters.push(iterationLetterX.letter);
            dispatch(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              updateMatrixPosition({
                column: startColDiag + i,
                line: startLineDiag + i,
                letter: {
                  busy: false,
                  selected: true,
                  index: iterationLetterX.index,
                  letter: iterationLetterX.letter,
                  filled: iterationLetterX.filled,
                },
              })
            );
          }
        } else {
          //do the inverse
          const diagDif = startColDiag - cl;
          for (let i = diagDif; i > 0; i--) {
            const iterationLetterX =
              gameboard.matrix[startLineDiag + i][startColDiag - i];
            finalIndexList.push(iterationLetterX.index);
            wordLetters.push(iterationLetterX.letter);
            console.log('pusheddddddddddddddddddddddd');
            dispatch(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              updateMatrixPosition({
                column: startColDiag - i,
                line: startLineDiag + i,
                letter: {
                  busy: false,
                  selected: true,
                  index: iterationLetterX.index,
                  letter: iterationLetterX.letter,
                  filled: iterationLetterX.filled,
                },
              })
            );
          }
        }
      }
      setWordSelection({
        startLetterIndex: wordSelection.startLetterIndex,
        endLetterIndex: {
          index: index,
          column: cl,
          line: ln,
        },
        indexList: finalIndexList,
        word: wordLetters,
      });
    } else {
      setWordSelection({
        startLetterIndex: {
          index: -1,
          column: -1,
          line: -1,
        },
        endLetterIndex: {
          index: -1,
          column: -1,
          line: -1,
        },
        indexList: [],
        word: [],
      });
      //todo - clean every word letter with the selected property true to false
      console.log("cleaning word index's ");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      dispatch(cleanMatrixSelections(gameboard.matrix));
    }
  }

  function displayBoard() {
    let cl, ln;

    const elements = [];

    for (ln = 0; ln < gameboard.specifications.lines; ln++) {
      for (cl = 0; cl < gameboard.specifications.columns; cl++) {
        const currentLetter = gameboard.matrix[ln][cl];
        const currentLine = ln;
        const currentCol = cl;
        let elementClasses = 'game-letter-box';

        //filled means that its a position that one word exists;
        if (currentLetter.filled) elementClasses += ' filled';
        //selected is based on the letter is selected or not by the user checking if the user found the word itself
        if (currentLetter.selected) elementClasses += ' selected';

        elements.push(
          <div
            className={elementClasses}
            onClick={() =>
              setLetterSelection(currentLine, currentCol, currentLetter.index)
            }
            key={`${ln}-${cl}-${gameboard.matrix[ln][cl].letter}`}
          >
            <div className="game-letter">{gameboard.matrix[ln][cl].letter}</div>
          </div>
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
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

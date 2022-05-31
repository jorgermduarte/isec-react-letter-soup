import React, {useState} from 'react';
import {Col, Row, Form, Button, ButtonGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Start.css';
import {BoardDifficulty} from '../../store/board-slice';
import {useDispatch} from 'react-redux';
import BoardStore from '../../store/board-slice';
import Game from '../game/Game';
import {useAppSelector} from '../../store/hooks';
import Congratulations from '../congratulations/congratulations';
import {changeInitialized, setUsername} from '../../store/board-actions';

const AppInterface: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  const [appState, setAppState] = useState({
    username: '',
    errors: [],
  });

  function StartGame() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const currentErrors = [];
    if (appState.username.length < 4) {
      currentErrors.push(
        'Por favor forneça um nome de utilizador com pelo menos 4 caracteres.'
      );
    }
    if (gameboard.specifications.difficulty === 0) {
      currentErrors.push(
        'Por favor escolha uma dificuldade antes de iniciar o jogo.'
      );
    }

    if (currentErrors.length === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      dispatch(setUsername(appState.username));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      dispatch(changeInitialized(true));
    } else {
      setAppState({
        username: appState.username,
        errors: currentErrors,
      });
    }
  }

  function handleSetUsername(event: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    setAppState({username: event.target.value, errors: []});
  }

  function SetGameDificulty(dificulty: BoardDifficulty) {
    switch (dificulty) {
      case BoardDifficulty.EASY:
        dispatch(
          BoardStore.actions.setDifficulty({
            secondsLimit: 180,
            difficulty: BoardDifficulty.EASY,
            columns: 8,
            lines: 10,
            totalWords: 3,
          })
        );
        break;
      case BoardDifficulty.MEDIUM:
        dispatch(
          BoardStore.actions.setDifficulty({
            secondsLimit: 240,
            difficulty: BoardDifficulty.MEDIUM,
            columns: 15,
            lines: 10,
            totalWords: 5,
          })
        );
        break;
      case BoardDifficulty.HARD:
        dispatch(
          BoardStore.actions.setDifficulty({
            secondsLimit: 300,
            difficulty: BoardDifficulty.HARD,
            columns: 20,
            lines: 10,
            totalWords: 6,
          })
        );
        break;
      case BoardDifficulty.EXTREME:
        dispatch(
          BoardStore.actions.setDifficulty({
            secondsLimit: 450,
            difficulty: BoardDifficulty.EXTREME,
            columns: 25,
            lines: 15,
            totalWords: 10,
          })
        );
        break;
    }
  }
  return (
    <div style={{padding: '20px'}} className="formStart">
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <Row>
            <Col>
              <div className="h2 gameTitle">
                {/* Linguagens Script - Sopa de Letras */}
              </div>
              <img src="./logo.jpg" className="logo"></img>
            </Col>
          </Row>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome Utilizador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome de utilizador..."
                value={appState.username}
                onChange={handleSetUsername}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dificuldade</Form.Label>
              <Row>
                <ButtonGroup>
                  <Col>
                    <Button
                      className={
                        gameboard.specifications.difficulty ===
                          BoardDifficulty.EASY && 'selected-difficulty'
                      }
                      variant="secondary"
                      onClick={() => SetGameDificulty(BoardDifficulty.EASY)}
                    >
                      Fácil
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className={
                        gameboard.specifications.difficulty ===
                          BoardDifficulty.MEDIUM && 'selected-difficulty'
                      }
                      variant="primary"
                      onClick={() => SetGameDificulty(BoardDifficulty.MEDIUM)}
                    >
                      Médio
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className={
                        gameboard.specifications.difficulty ===
                          BoardDifficulty.HARD && 'selected-difficulty'
                      }
                      variant="warning"
                      onClick={() => SetGameDificulty(BoardDifficulty.HARD)}
                    >
                      Dificil
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className={
                        gameboard.specifications.difficulty ===
                          BoardDifficulty.EXTREME && 'selected-difficulty'
                      }
                      variant="danger"
                      onClick={() => SetGameDificulty(BoardDifficulty.EXTREME)}
                    >
                      Extremo
                    </Button>
                  </Col>
                </ButtonGroup>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Button
                variant="outline-dark"
                className="startButton"
                onClick={() => StartGame()}
              >
                Iniciar
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              {appState.errors.map((err, index) => {
                return (
                  <div className="game-error" key={'intro-game-error-' + index}>
                    {err}
                  </div>
                );
              })}
            </Form.Group>
          </Form>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3 intro-game-elements">
            <p>Linguagens Script 2022 - Sopa de Letras</p>
            <p>
              <b>Elementos do grupo:</b>
            </p>
            <ul>
              <li>a2021110042 - Jorge Duarte</li>
              <li>a2021146383 - João Marques</li>
              <li>a2019122799 - Rodrigo Cruz</li>
            </ul>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

const StartComponent: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);

  const IsGameEnded = gameboard.gameEnd === true;
  const IsGameInitialized = gameboard.initialized;

  console.log('ended, initialized', IsGameEnded, IsGameInitialized);
  //if the game is ended show the congratulations
  return IsGameEnded ? (
    <Congratulations></Congratulations>
  ) : IsGameInitialized ? ( // else if the game is intialized
    <Game></Game> //shw the game itself
  ) : (
    <AppInterface></AppInterface> //not initialized? show the interface
  );
};

export default StartComponent;

import React, {useState} from 'react';
import {Col, Row, Form, Button, ButtonGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Start.css';
import {BoardDifficulty} from '../../store/board-slice';
import {useDispatch} from 'react-redux';
import BoardStore from '../../store/board-slice';
import App from '../game/App';
import {useAppSelector} from '../../store/hooks';
import Congratulations from '../congratulations/congratulations';
import {changeInitialized} from '../../store/board-actions';

const StartComponent: React.FC<{}> = () => {
  const dispatch = useDispatch();
  // const [startGame, setStartGame] = useState({
  //   initialized: false,
  // });

  const gameboard = useAppSelector(state => state.gameboard);

  function StartGame() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    dispatch(changeInitialized(true));
  }

  function SetGameDificulty(dificulty: BoardDifficulty) {
    switch (dificulty) {
      case BoardDifficulty.EASY:
        dispatch(
          BoardStore.actions.setDifficulty({
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
            difficulty: BoardDifficulty.EXTREME,
            columns: 25,
            lines: 15,
            totalWords: 10,
          })
        );
        break;
    }
  }

  return gameboard.gameEnd === true ? (
    <Congratulations></Congratulations>
  ) : gameboard.initialized ? (
    <App></App>
  ) : (
    <div style={{padding: '20px'}} className="formStart">
      <Row>
        <Col md={{span: 4, offset: 4}}>
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
              <Form.Control type="text" placeholder="Nome de utilizador..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dificuldade</Form.Label>
              <Row>
                <ButtonGroup>
                  <Col>
                    <Button
                      variant="outline-success"
                      onClick={() => SetGameDificulty(BoardDifficulty.EASY)}
                    >
                      Fácil
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-warning"
                      onClick={() => SetGameDificulty(BoardDifficulty.MEDIUM)}
                    >
                      Médio
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-danger"
                      onClick={() => SetGameDificulty(BoardDifficulty.HARD)}
                    >
                      Dificil
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-dark"
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
              <p>a2021110042 - Jorge Duarte</p>
              <p>a2021000000 - João Marques</p>
              <p>a2021000000 - Rodrigo Cruz</p>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default StartComponent;

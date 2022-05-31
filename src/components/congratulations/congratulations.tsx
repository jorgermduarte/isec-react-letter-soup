import React from 'react';
import {Button, Row, Col, Table} from 'react-bootstrap';
import './congratulations.css';
import {useAppSelector} from '../../store/hooks';
import {useDispatch} from 'react-redux';
import {changeEndGame} from '../../store/board-actions';
import {getDifficulty} from '../../utils/utils';

type Classification = {
  username: string;
  difficulty: number;
  points: number;
};

const Statistics: React.FC<{}> = () => {
  const classificationsNameStorage = 'game-classifications';
  const classificationBoard = localStorage.getItem(classificationsNameStorage);
  const classificationBoardList = JSON.parse(
    classificationBoard
  ) as Classification[];
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Dificuldade</th>
          <th>Pontos</th>
        </tr>
      </thead>
      <tbody>
        {classificationBoardList &&
          classificationBoardList
            .sort((a, b) => {
              return b.points - a.points;
            })
            .map((cl, index) => (
              <tr key={'classification-' + index}>
                <td>{index + 1}</td>
                <td>{cl.username}</td>
                <td>{getDifficulty(cl.difficulty)}</td>
                <td>{cl.points}</td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

const Congratulations: React.FC<{}> = () => {
  const classificationsNameStorage = 'game-classifications';
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);
  const classificationBoard = localStorage.getItem(classificationsNameStorage);
  const classificationBoardList = JSON.parse(
    classificationBoard
  ) as Classification[];

  const _second = 1000;
  const _minute = _second * 60;
  const _hour = _minute * 60;

  function getTimeTotal() {
    const distance =
      new Date(gameboard.gameEndTimmer).getTime() -
      new Date(gameboard.timmer!).getTime();
    const minutes = Math.floor((distance % _hour) / _minute);
    const seconds = Math.floor((distance % _minute) / _second);

    return `${minutes} minutos e ${seconds} segundos`;
  }

  function playAgain() {
    const result = {
      username: gameboard.username,
      points: calculatePoints(),
      difficulty: gameboard.specifications.difficulty,
    } as Classification;

    if (gameboard.gameLost === false) {
      if (classificationBoardList) {
        const arrayResult = [...classificationBoardList, result];
        localStorage.setItem(
          classificationsNameStorage,
          JSON.stringify(arrayResult)
        );
      } else {
        localStorage.setItem(
          classificationsNameStorage,
          JSON.stringify([result])
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    dispatch(changeEndGame(false));
    // window.location.reload();
  }

  function calculatePoints() {
    const distance =
      new Date(gameboard.gameEndTimmer).getTime() -
      new Date(gameboard.timmer!).getTime();
    const minutes = Math.floor((distance % _hour) / _minute);
    const seconds = Math.floor((distance % _minute) / _second);

    const pontos = Math.floor(
      (gameboard.specifications.difficulty *
        10000 *
        gameboard.specifications.totalWords) /
        (distance / 1000)
    );
    return pontos;
  }

  return (
    <Row className="congratulations-page">
      {gameboard.gameLost === false ? (
        <Col lg={{offset: 2, span: 8}}>
          <h3>Parabéns {gameboard.username}! 🎉 acabou o jogo! 😀</h3>
          <p>
            Finalizou o jogo em {getTimeTotal()} na dificuldade{' '}
            {getDifficulty(gameboard.specifications.difficulty)}
          </p>
          <p>A sua pontuação foi {calculatePoints()} pontos</p>
          <hr />
          <Statistics></Statistics>
          <Button className="playAgain" onClick={() => playAgain()}>
            Jogar Novamente
          </Button>
        </Col>
      ) : (
        <Col lg={{offset: 2, span: 8}}>
          <h3>{gameboard.username}, perdes-te o jogo ...</h3>
          <p>Não conseguiste finalizar o nível a tempo, tenta outra vez !</p>
          <img
            src="https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1571606037"
            width={'300px'}
          ></img>
          <hr />
          <Button className="playAgain" onClick={() => playAgain()}>
            Jogar Novamente
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default Congratulations;

import React from 'react';
import {Button, Row, Col, Table} from 'react-bootstrap';
import './congratulations.css';
import {useAppSelector} from '../../store/hooks';
import {useDispatch} from 'react-redux';
import {changeEndGame} from '../../store/board-actions';
import {getDifficulty} from '../../utils/utils';

const Statistics: React.FC<{}> = () => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Tempo</th>
          <th>Dificuldade</th>
        </tr>
      </thead>
      <tbody></tbody>
    </Table>
  );
};

const Congratulations: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  const _second = 1000;
  const _minute = _second * 60;
  const _hour = _minute * 60;

  function showClassifications() {}

  function getTimeTotal() {
    const distance =
      new Date(gameboard.gameEndTimmer).getTime() -
      new Date(gameboard.timmer!).getTime();
    const minutes = Math.floor((distance % _hour) / _minute);
    const seconds = Math.floor((distance % _minute) / _second);

    return `${minutes} minutos e ${seconds} segundos`;
  }

  function playAgain() {
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
    </Row>
  );
};

export default Congratulations;

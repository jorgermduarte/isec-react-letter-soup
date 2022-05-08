import React from 'react';
import {Button, Row, Col, Table} from 'react-bootstrap';
import './congratulations.css';
import {useAppSelector} from '../../store/hooks';
import {useDispatch} from 'react-redux';
import {changeEndGame} from '../../store/board-actions';

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

  function showClassifications() {}

  function getTimeTotal() {}

  function playAgain() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    dispatch(changeEndGame(false));
    // window.location.reload();
  }

  return (
    <Row className="congratulations-page">
      <Col lg={{offset: 2, span: 8}}>
        <h3>Parabéns #nome, acabou o jogo</h3>
        <p>
          Finalizou o jogo em #tempo na dificuldade
          {gameboard.specifications.difficulty}
        </p>
        <p>A sua pontuação foi #pontuacao pontos</p>
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

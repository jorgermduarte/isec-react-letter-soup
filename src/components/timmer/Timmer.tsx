import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../store/hooks';
import BoardStore from '../../store/board-slice';
import {useDispatch} from 'react-redux';

const Timmer: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);
  const dispatch = useDispatch();
  const [timmerTime, setTimerTime] = useState({
    gameTimmer: {
      minutes: 0,
      seconds: 0,
    },
  });

  const _second = 1000;
  const _minute = _second * 60;
  const _hour = _minute * 60;

  const startTime = new Date(gameboard.timmer!);
  const limitDate = new Date(gameboard.timmer!);
  limitDate.setSeconds(
    limitDate.getSeconds() + gameboard.specifications.secondsLimit
  );
  const distanceTimeLimit = limitDate.getTime() - startTime.getTime();
  const totalMaxMinutes = Math.floor((distanceTimeLimit % _hour) / _minute);
  const totalMaxSeconds = Math.floor((distanceTimeLimit % _minute) / _second);

  function getTimer() {
    if (!gameboard.gameEnd) {
      setTimeout(() => {
        const now = new Date();
        const distance = now.getTime() - new Date(gameboard.timmer!).getTime();
        const minutes = Math.floor((distance % _hour) / _minute);
        const seconds = Math.floor((distance % _minute) / _second);
        setTimerTime({
          gameTimmer: {
            minutes: minutes,
            seconds: seconds,
          },
        });
      }, 1000);
    }
  }

  function verifyEndGame() {
    if (!gameboard.gameEnd) {
      setTimeout(() => {
        dispatch(BoardStore.actions.verifyEndGame(true));
      }, 1000);
    }
  }

  useEffect(() => {
    getTimer();
    verifyEndGame();
  }, [timmerTime.gameTimmer.seconds]);

  return (
    <React.Fragment>
      <div className="game-timmer">
        Tempo Atual: {timmerTime.gameTimmer.minutes} minutos,{' '}
        {timmerTime.gameTimmer.seconds} segundos
      </div>
      <div className="game-timmer-limit">
        Tempo Limite: {totalMaxMinutes} minutos e {totalMaxSeconds} segundos
      </div>
      <hr />
    </React.Fragment>
  );
};

export default Timmer;

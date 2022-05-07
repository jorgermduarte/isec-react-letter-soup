import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../store/hooks';

const Timmer: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);

  const [timmerTime, setTimer] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    getTimer();
  }, [gameboard.timmer, setTimer]);

  function getTimer() {
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    //   const _day = _hour * 24;

    if (gameboard.timmer !== undefined) {
      const now = new Date();
      //   console.log(gameboard.timmer);

      const distance = now.getTime() - new Date(gameboard.timmer!).getTime();
      console.log(distance);
      //   const days = Math.floor(distance / _day);
      //   const hours = Math.floor((distance % _day) / _hour);
      const minutes = Math.floor((distance % _hour) / _minute);
      const seconds = Math.floor((distance % _minute) / _second);
      setTimer({
        minutes: minutes,
        seconds: seconds,
      });
      //   console.log(`---> minutes: ${minutes}, seconds : ${seconds}`);
      setTimeout(getTimer, 1000);
    }
  }

  return (
    <React.Fragment>
      <div className="game-timmer">
        Tempo Atual: {timmerTime.minutes} minutos, {timmerTime.seconds} segundos
      </div>
      <hr />
    </React.Fragment>
  );
};

export default Timmer;

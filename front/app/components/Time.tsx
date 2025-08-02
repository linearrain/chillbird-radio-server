import { useState } from 'react';

export default function Time(props : { url : string; city : string }) {
    let [hour, setHour] = useState('00');
    let [minute, setMinute] = useState('00');
    let [second, setSecond] = useState('00');

    const transformTwoDigits = (value : number) => {
        return value < 10 ? '0' + value : value.toString();
    };

    setInterval(() => {
        fetch(props.url)
        .then(response => response.json())
        .then(data => {
            setHour(transformTwoDigits(data.hour));
            setMinute(transformTwoDigits(data.minute));
            setSecond(transformTwoDigits(data.seconds));
        });
    }, 1000);
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '169px',
        }}>
           <h1 style={{ lineHeight: '0.5' }}>{hour}:{minute}:{second}</h1>
           <p style={{
            lineHeight: '0.4',
           }}>{ props.city }</p>
        </div>
    );
}
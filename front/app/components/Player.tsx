import PlayButton from './player/PlayButton';
import ProgressBar from './player/ProgressBar';

export default function Player(props: { songname: string; }) {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
        }}>
            <PlayButton />
            <div>
                <ProgressBar current="50%" />
                
                <div>
                    <b>Current Song: </b>
                    <span>{props.songname}</span>
                </div>
            </div>
        </div>
    );
}
import PlayButton from './player/PlayButton';
import ProgressBar from './player/ProgressBar';

export default function Player(props: { songname: string; setPlay : (play: boolean) => void;
    isPlaying: boolean; loudness: number; }) {    
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
        }}>
            <audio style={{ display: 'none' }} />
            
            <PlayButton setPlay={props.setPlay} isPlaying={props.isPlaying} />
            <div>
                <ProgressBar current={`${props.loudness * 100.0}%`} />
                
                <div>
                    <b>Current Song: </b>
                    <span>{props.songname}</span>
                </div>
            </div>
        </div>
    );
}
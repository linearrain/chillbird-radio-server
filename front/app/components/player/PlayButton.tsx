
export default function PlayButton(props: { setPlay: (play: boolean) => void; 
                                            isPlaying: boolean; }) {

    let size = '64px';
    
    return (
        <>
            <button onClick={() => {
                props.setPlay(!props.isPlaying);
            }}
             style={{
                width: size,
                height: size,
                background: '#FF2BB1',
                border: 'none',
                borderRadius: '50%',
            }}>
                <i className="fa-solid fa-play" style={{
                    fontSize: '20px',
                    color: '#FFFFFF',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} />
            </button>
        </>
    )
}
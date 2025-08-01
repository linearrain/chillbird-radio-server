export default function Square(props: { icon: string; link: string }) {
    let size = '128px';

    return (
        <div style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <a style={{
                textDecoration: 'none'
            }} 
            href={props.link} target="_blank">
                <i className={props.icon} style={{
                    fontSize: '32px',
                    color: '#FF2BB1',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} />
            </a>
        </div>
    );
}
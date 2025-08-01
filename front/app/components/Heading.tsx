export default function Heading(props : { redtext: string; text: string; }) {
    let fontSize = '96px';

    return <h1 style={{ fontSize: fontSize, textTransform: 'uppercase', 
                        letterSpacing: '1.25rem' }}>
                            <span style={{ color: '#FF2BB1' }}>{props.redtext}</span>{props.text}
            </h1>;
}
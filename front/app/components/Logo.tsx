import Heading from "./Heading";

export default function Logo() {
    return (
        <div style={{
            width: 'fit-content',
            display: 'grid',
            gridTemplateAreas: `
            "slogan year" 
            "heading heading"`,  
            gridTemplateColumns: '2fr 1fr',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.2rem',
        }}>
            <span style={{
                gridArea: 'slogan'
            }}>free without any limitations</span>
            
            <span style={{
                gridArea: 'year',
                textAlign: 'right',
                paddingRight: '1.4rem',
            }}>est. 2024</span>

            <div style={{
                gridArea: 'heading',
                lineHeight: '0.6',
                marginTop: '-36px'
            }}>
                <Heading redtext="Chill" text="bird Radio" />
            </div>
        </div>
    );
}
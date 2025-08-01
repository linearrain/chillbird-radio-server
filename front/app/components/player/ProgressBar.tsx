export default function ProgressBar(props: { current: string }) {
    return (
        <div style={{
            background: '#EFEFEF',
            height: '5px', 
            width: '100%',
        }}>
            <div style={{
                background: '#FF2BB1',
                width: props.current,
                height: '100%',
            }}>
            </div>
        </div>
    )
}
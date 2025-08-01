import Square from "./socials/Square";

export default function Socials() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Square icon="fa-brands fa-github" 
                    link="https://github.com/linearrain/" />

            <Square icon="fa-brands fa-linkedin" 
                    link="https://www.linkedin.com/in/vitaliy-petushynskyi" />

            <Square icon="fa-brands fa-spotify"
                    link="https://open.spotify.com/playlist/0a1gAQtr4cMLEliTWdEUPw?si=5dd5fb179ae84ab5" />

            <Square icon="fa-brands fa-soundcloud"
                    link="https://soundcloud.com/windflowlights/sets/altered-ambiance" />
        </div>
    );
}
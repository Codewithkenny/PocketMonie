import { useEffect, useState } from "react";

const ProgressBar = ({ progress }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 200);
        return () => clearTimeout(timeout);
    }, [progress]);

    return (
        <div style={{
            width: '100%',
            backgroundColor: '#e0e0df',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '20px',
            marginBottom: '10px',
        }}>
            <div style={{
                width: `${Math.min(animatedProgress, 100)}%`,
                backgroundColor: '#ec4899', // Tailwind pink-400
                height: '100%',
                borderRadius: '10px',
                transition: 'width 1s ease-in-out',
                color: 'white',
                textAlign: 'right',
                lineHeight: '20px',
                fontWeight: 'bold',
                paddingRight: '5px',
                userSelect: 'none',
            }}
                role="progressbar"
                aria-valuenow={animatedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {Math.round(animatedProgress)}%
            </div>
        </div>
    );
};

export default ProgressBar;

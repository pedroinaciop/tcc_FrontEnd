import { useEffect, useState } from 'react';

const useCapsLock = () => {
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.getModifierState) {
                setIsCapsLockOn(e.getModifierState('CapsLock') || e.getModifierState('Shift'));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyDown);
        };
    }, []);

    return isCapsLockOn;
};

export default useCapsLock;
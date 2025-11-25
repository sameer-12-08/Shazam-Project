import { useState, useEffect } from "react";

const TypedTextarea = ({
                           texts = [],
                           typingSpeed = 75,
                           pauseDuration = 1500,
                           value,
                           onChange,
                           ...props
                       }) => {
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [char, setChar] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [paused, setPaused] = useState(false);

    // Stop animation if user types
    useEffect(() => {
        if (value && value.length > 0) {
            setPaused(true);
            setPlaceholder("");
        } else {
            setPaused(false);
        }
    }, [value]);

    useEffect(() => {
        if (paused) return;

        const currentText = texts[index];
        let timeout;

        if (!deleting) {
            if (char <= currentText.length) {
                timeout = setTimeout(() => {
                    setPlaceholder(currentText.slice(0, char));
                    setChar((c) => c + 1);
                }, typingSpeed);
            } else {
                timeout = setTimeout(() => {
                    setDeleting(true);
                }, pauseDuration);
            }
        } else {
            if (char > 0) {
                timeout = setTimeout(() => {
                    setPlaceholder(currentText.slice(0, char));
                    setChar((c) => c - 1);
                }, typingSpeed / 2);
            } else {
                setDeleting(false);
                setIndex((i) => (i + 1) % texts.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [char, deleting, index, paused, texts, typingSpeed, pauseDuration]);

    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};

export default TypedTextarea;

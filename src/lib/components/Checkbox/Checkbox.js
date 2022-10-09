import sc from "./Checkbox.module.scss";
import { useState, useEffect } from "react";

import {
    animated,
    useSpring,
    config,
    useSpringRef,
    useChain
} from "react-spring";

const Checkbox = ({ checkboxValue, option, height = 1, handleCheckboxClick }) => {
    const [isChecked, setIsChecked] = useState(checkboxValue);
    useEffect(() => setIsChecked(checkboxValue), [checkboxValue]);
    const checkboxAnimationRef = useSpringRef();
    const checkboxAnimationStyle = useSpring({
        backgroundColor: isChecked ? '#61667a' : '#fff',
        borderColor: isChecked ? '#232e3c' : "#ddd",
        config: config.stiff,
        ref: checkboxAnimationRef
    });

    const [checkmarkLength, setCheckmarkLength] = useState(null);

    const checkmarkAnimationRef = useSpringRef();
    const checkmarkAnimationStyle = useSpring({
        x: isChecked ? 0 : checkmarkLength,
        config: config.gentle,
        ref: checkmarkAnimationRef
    });

    useChain(
        isChecked
            ? [checkboxAnimationRef, checkmarkAnimationRef]
            : [checkmarkAnimationRef, checkboxAnimationRef],
        [0, 0.1]
    );

    const toggleCheckbox = () => {
        handleCheckboxClick(option);
        setIsChecked(!isChecked);
    }

    return (
        <label className={sc.wrap}>
            <input
                className={sc.inputCheckbox}
                type="checkbox"
                onChange={toggleCheckbox}
            />
            <div className={sc.icon}>
                <animated.svg
                    style={checkboxAnimationStyle}
                    className={`${sc.checkbox} ${isChecked ? `${sc.checkbox}--active` : ''}`}
                    aria-hidden="true"
                    viewBox="0 0 15 11"
                    fill="none"
                    height={`${height}rem`}
                    width={`${height}rem`}
                >
                    <animated.path
                        d="M1 4.5L5 9L14 1"
                        strokeWidth="2"
                        stroke='#fff'
                        ref={ref => ref && setCheckmarkLength(ref.getTotalLength())}
                        strokeDasharray={checkmarkLength}
                        strokeDashoffset={checkmarkAnimationStyle.x}
                    />
                </animated.svg>
            </div>

            <div className={sc.checkboxLabel}
                style={{
                    fontSize: `${0.8 * height}rem`,
                    color: 'gray'
                }}>
                {option}
            </div>

        </label>
    );
}

export default Checkbox;

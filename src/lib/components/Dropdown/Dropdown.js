/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { useClickOutside, useIsMount } from '../../hooks';
import Checkbox from '../Checkbox/Checkbox';
import { CSSTransition } from 'react-transition-group';
import sc from './Dropdown.module.scss';
import './dropdownAnimation.scss';

function Dropdown({ label, allOption, multiSelect,
    selectedOptions = [],
    initialOptions = [],
    style = {},
}) {

    //control dropdown open and close
    const [open, setOpen] = useState(false);
    const toggle = (f = !open) => setOpen(f);
    let domNode = useClickOutside(() => toggle(false));
    const isMount = useIsMount();
    const ALL = 'All';

    //set options and selected options
    const [options, setOptions] = useState(initialOptions);
    const [selection, setSelection] = useState(selectedOptions);
    var allOptions = useRef(initialOptions);


    // Handling Dropdown open and close
    useEffect(() => {
        if (!open) {
            if (isMount) return;
            setSearch('');
        }
    }, [open]);

    // Configure the All Option in the Dropdown
    const [isAll, setIsAll] = useState(selection.length === allOptions.current.length);
    const toggleAll = () => { setSelection(!isAll ? allOptions.current : []); setIsAll(!isAll); }

    useEffect(() => {
        !isMount && setIsAll(selection.length === allOptions.current.length ? true : false);
    }, [selection]);

    function handleCheckboxClick(opt) {
        if (multiSelect) {
            setSelection(isOptInSelection(opt) ? [...selection.filter(current => current !== opt)] : [...selection, opt])
        } else {
            setSelection([opt]); toggle(false);
        }
    }

    function isOptInSelection(opt) { return selection.some(current => current === opt) ? true : false; }

    //Implementing Search 
    const [search, setSearch] = useState('');
    const onSearchInput = (event) => setSearch(event.target.value);

    useEffect(() => {
        if (search === '') {
            if (!open) {
                // to setOptions back only when the dropdown is closing
                if (isMount) return;
                setTimeout(() => { setOptions(allOptions.current); }, 750)
            } else {
                setOptions(allOptions.current);
            }
            return;
        }
        if (search && search.length > 1) {
            //update display options
            setOptions(allOptions.current.filter(
                (opt) => opt.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search])

    return (
        <div style={style} ref={domNode} className={sc.dropdownContainer}>
            <div
                className={sc.dropdownBtn}
                onClick={() => toggle()}>
                <div className={sc.dropdownBtnLbl}>
                    {!multiSelect && `${label}${selection.length === 1 ? ` -  ${selection[0]}` : ''}`}
                    {multiSelect && label}
                </div>

                <div className={sc.dropdownBtnQty}>
                    {multiSelect && `(${selection.length})`}
                </div>

                <div className={sc.dropdownBtnIcn}>
                    <CSSTransition in={!open} timeout={{ enter: 200, exit: 0 }} classNames='roll'>
                        <FaIcons.FaChevronDown />
                    </CSSTransition>
                </div>
            </div>
            <CSSTransition in={open} unmountOnExit timeout={{ appear: 0, enter: 0, exit: 300 }} classNames='dlist' appear>
                <div className={`${sc.dropdownList} ${open ? sc.dropdownListActive : ''}`}>
                    <div className={sc.dropdownListSearchContainer}>
                        <input value={search} onChange={onSearchInput} type="search" placeholder={`Search ${label.toLowerCase()}`} className={sc.dropdownListSearch} />
                    </div>

                    <ul>
                        {/* All Option */}
                        {allOption && <li key={ALL}>
                            {multiSelect && allOptions.current.length === options.length &&
                                <Checkbox
                                    handleCheckboxClick={toggleAll}
                                    checkboxValue={isAll}
                                    labelColor='var(--color-ebony-clay)'
                                    option={ALL} />
                            }

                            {!multiSelect &&
                                <div className={sc.dropdownListOpt} style={{ color: 'var(--color-ebony-clay)' }} onClick={() => handleCheckboxClick(ALL)} >
                                    {ALL}
                                </div>
                            }
                        </li>}
                        {options.map(opt => (
                            <li key={opt}>
                                {multiSelect &&
                                    <Checkbox handleCheckboxClick={handleCheckboxClick} checkboxValue={isOptInSelection(opt)} option={opt} />
                                }
                                {!multiSelect &&
                                    <div className={sc.dropdownListOpt} onClick={() => handleCheckboxClick(opt)} >
                                        {opt}
                                    </div>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </CSSTransition>
        </div >

    );
}

export default Dropdown;
